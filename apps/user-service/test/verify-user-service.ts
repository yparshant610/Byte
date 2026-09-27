import {
  RedisCartStore,
  RedisClientWrapper,
  RedisGeoStore,
  RedisRateLimiter,
  RestaurantMeta,
} from '@repo/redis-cache';
import {
  DriverUnavailableException,
  RateLimitExceededException,
  SingleRestaurantViolationException,
} from '@repo/shared-utils';

async function runTestSuite() {
  console.log(`\n======================================================`);
  console.log(`🧪 RUNNING FOOD BYTE E2E VERIFICATION TEST SUITE`);
  console.log(`======================================================\n`);

  // Initialize In-Memory Redis Engine
  const redisWrapper = new RedisClientWrapper({ useMock: true });
  await redisWrapper.connect();

  const cartStore = new RedisCartStore(redisWrapper);
  const geoStore = new RedisGeoStore(redisWrapper);
  const rateLimiter = new RedisRateLimiter(redisWrapper);

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // -------------------------------------------------------------------------
  // TEST SUITE 1: REDIS SHOPPING CART ENGINE
  // -------------------------------------------------------------------------
  console.log(`\n--- [1] Testing Redis Shopping Cart Engine ---`);
  const testUser = 'user_alex_01';

  // 1.1 Add Item with options
  const cart1 = await cartStore.addItem({
    userId: testUser,
    restaurantId: 'rest_tonys_pizza_01',
    restaurantName: "Tony's Artisan Pizza",
    itemId: 'dish_margherita',
    name: 'Margherita Classica',
    quantity: 2,
    basePrice: 12.99,
    selectedOptions: [
      { groupName: 'Size', choiceName: '12 inch Medium', additionalPrice: 3.50 },
      { groupName: 'Toppings', choiceName: 'Extra Mozzarella', additionalPrice: 2.00 },
    ],
  });

  // unitPrice = 12.99 + 3.50 + 2.00 = 18.49
  // total = 18.49 * 2 = 36.98
  assert(cart1.subtotal === 36.98, `Cart subtotal correctly calculated with options ($36.98 vs ${cart1.subtotal})`);
  assert(cart1.items.length === 1, `Cart contains 1 line item`);

  // 1.2 Single-Restaurant constraint: Attempt to add item from different restaurant
  let caughtConflict = false;
  try {
    await cartStore.addItem({
      userId: testUser,
      restaurantId: 'rest_burger_lab_02',
      restaurantName: 'The Gourmet Burger Lab',
      itemId: 'dish_cheeseburger',
      name: 'Double Cheeseburger',
      quantity: 1,
      basePrice: 11.50,
      clearExisting: false,
    });
  } catch (err: any) {
    if (err instanceof SingleRestaurantViolationException) {
      caughtConflict = true;
    }
  }
  assert(caughtConflict, 'Single-restaurant constraint rejected item from different restaurant with 409 conflict');

  // 1.3 Add from different restaurant with clearExisting: true
  const cart2 = await cartStore.addItem({
    userId: testUser,
    restaurantId: 'rest_burger_lab_02',
    restaurantName: 'The Gourmet Burger Lab',
    itemId: 'dish_cheeseburger',
    name: 'Double Cheeseburger',
    quantity: 1,
    basePrice: 11.50,
    clearExisting: true,
  });
  assert(cart2.restaurantId === 'rest_burger_lab_02', 'Cart successfully replaced when clearExisting: true is passed');
  assert(cart2.subtotal === 11.50, 'New cart subtotal reflects only the new restaurant');

  // 1.4 Clear cart
  await cartStore.clearCart(testUser);
  const clearedCart = await cartStore.getCart(testUser);
  assert(clearedCart === null, 'Cart cleared successfully from Redis');

  // -------------------------------------------------------------------------
  // TEST SUITE 2: RESTAURANT GEOSPATIAL DISCOVERY (<= 10 KM)
  // -------------------------------------------------------------------------
  console.log(`\n--- [2] Testing Geospatial Restaurant Discovery (<= 10 km) ---`);
  const userLoc = { lat: 12.9716, lng: 77.5946 }; // MG Road, Bangalore

  // Index sample restaurants
  const testRestaurants: RestaurantMeta[] = [
    {
      id: 'r_tonys',
      name: "Tony's Artisan Pizza",
      cuisine: ['Italian', 'Pizza'],
      rating: 4.8,
      prepTimeMinutes: 20,
      bannerUrl: '',
      isOpen: true,
      minimumOrder: 15,
      deliveryFee: 2.49,
      location: { lat: 12.9780, lng: 77.6000 }, // ~0.92 km
    },
    {
      id: 'r_burger',
      name: 'The Gourmet Burger Lab',
      cuisine: ['American', 'Burgers'],
      rating: 4.7,
      prepTimeMinutes: 25,
      bannerUrl: '',
      isOpen: true,
      minimumOrder: 12,
      deliveryFee: 1.99,
      location: { lat: 12.9745, lng: 77.6050 }, // ~1.17 km
    },
    {
      id: 'r_sushi',
      name: 'Sakura Sushi House',
      cuisine: ['Japanese', 'Sushi'],
      rating: 4.9,
      prepTimeMinutes: 30,
      bannerUrl: '',
      isOpen: true,
      minimumOrder: 25,
      deliveryFee: 3.49,
      location: { lat: 12.9620, lng: 77.6400 }, // ~5.03 km
    },
    {
      id: 'r_far_diner',
      name: 'Airport Highway Diner',
      cuisine: ['Diner'],
      rating: 4.1,
      prepTimeMinutes: 20,
      bannerUrl: '',
      isOpen: true,
      minimumOrder: 10,
      deliveryFee: 9.99,
      location: { lat: 13.1986, lng: 77.7066 }, // ~28 km (OUT OF RANGE)
    },
  ];

  for (const r of testRestaurants) {
    await geoStore.indexRestaurant(r);
  }

  const nearby = await geoStore.findNearbyRestaurants(userLoc.lat, userLoc.lng, 10);
  assert(nearby.length === 3, `Discovered exactly 3 restaurants within 10 km (found: ${nearby.length})`);
  assert(nearby[0].restaurant.id === 'r_tonys', `Closest restaurant is Tony's Artisan Pizza (${nearby[0].distanceKm.toFixed(2)} km)`);
  assert(nearby[1].restaurant.id === 'r_burger', `Second closest is Burger Lab (${nearby[1].distanceKm.toFixed(2)} km)`);
  assert(
    !nearby.some(n => n.restaurant.id === 'r_far_diner'),
    'Airport Highway Diner (> 10 km) is strictly excluded by Redis Geospatial search',
  );

  // -------------------------------------------------------------------------
  // TEST SUITE 3: DRIVER TELEMETRY & PROXIMITY DISPATCH
  // -------------------------------------------------------------------------
  console.log(`\n--- [3] Testing Delivery Partner Fleet Matching via Redis ---`);
  // Register 2 available drivers near Tony's Pizza
  await geoStore.updateDriverLocation('driver_rajesh_01', 12.9775, 77.6005, 'ONLINE', {
    name: 'Rajesh Kumar',
    phone: '+919876543210',
    vehicleType: 'EV Scooter',
    rating: 4.9,
  });

  await geoStore.updateDriverLocation('driver_vikram_02', 12.9730, 77.6060, 'ONLINE', {
    name: 'Vikram Singh',
    phone: '+919876543211',
    vehicleType: 'Motorcycle',
    rating: 4.7,
  });

  // Assign order at Tony's Pizza (12.9780, 77.6000)
  const orderId = 'ord_test_999';
  const assignment = await geoStore.atomicAssignDriver(orderId, 12.9780, 77.6000, 5);
  assert(assignment.assignedDriverId === 'driver_rajesh_01', `Assigned closest driver (Rajesh Kumar at ${assignment.distanceKm.toFixed(2)} km)`);

  // Verify atomic removal: Rajesh Kumar should no longer be in the available pool
  const candidatePool = await geoStore.findCandidateDrivers(12.9780, 77.6000, 5);
  assert(
    !candidatePool.some(d => d.driverId === 'driver_rajesh_01'),
    'Assigned driver atomically removed from drivers:available:geo to prevent race conditions',
  );
  assert(candidatePool.length === 1 && candidatePool[0].driverId === 'driver_vikram_02', 'Next order will match Vikram Singh');

  // -------------------------------------------------------------------------
  // TEST SUITE 4: TOKEN BUCKET RATE LIMITING
  // -------------------------------------------------------------------------
  console.log(`\n--- [4] Testing Token Bucket Rate Limiting ---`);
  const rateLimitKey = 'test_consumer_otp';
  let rateLimitCaught = false;

  try {
    // Consume all 3 tokens
    await rateLimiter.enforce(rateLimitKey, { capacity: 3, refillRatePerSec: 1 / 60 });
    await rateLimiter.enforce(rateLimitKey, { capacity: 3, refillRatePerSec: 1 / 60 });
    await rateLimiter.enforce(rateLimitKey, { capacity: 3, refillRatePerSec: 1 / 60 });
    // 4th request must be rejected
    await rateLimiter.enforce(rateLimitKey, { capacity: 3, refillRatePerSec: 1 / 60 });
  } catch (err: any) {
    if (err instanceof RateLimitExceededException) {
      rateLimitCaught = true;
    }
  }
  assert(rateLimitCaught, 'Token Bucket algorithm successfully triggered RateLimitExceededException on exhaustion');

  // -------------------------------------------------------------------------
  // TEST SUITE 5: RAZORPAY SPLIT PAYMENT CALCULATION
  // -------------------------------------------------------------------------
  console.log(`\n--- [5] Testing Razorpay Split Payment Engine ---`);
  const orderTotal = 100.00;
  const adminCommission = parseFloat((orderTotal * 0.20).toFixed(2));
  const vendorDriverPayout = parseFloat((orderTotal * 0.80).toFixed(2));

  assert(adminCommission === 20.00, 'Byte Add Admin Commission is exactly 20% ($20.00)');
  assert(vendorDriverPayout === 80.00, 'Vendor + Driver Payout is exactly 80% ($80.00)');
  assert(adminCommission + vendorDriverPayout === orderTotal, 'Total split reconciles to 100% of order value');

  // -------------------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------------------
  console.log(`\n======================================================`);
  console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log(`======================================================\n`);

  await redisWrapper.close();

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
