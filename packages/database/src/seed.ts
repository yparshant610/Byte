import { haversineDistanceKm } from '@repo/shared-utils';
import {
  MenuCategoryEntity,
  MenuItemEntity,
  RestaurantEntity,
  UserEntity,
} from './index';

export const SEED_USERS: UserEntity[] = [
  {
    id: 'u0000001-0000-0000-0000-000000000001',
    email: 'consumer@foodbytes.app',
    fullName: 'Alex Johnson',
    phone: '+919876543210',
    role: 'CONSUMER',
    isActive: true,
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'u0000002-0000-0000-0000-000000000002',
    email: 'tony@tonyspizza.com',
    fullName: 'Tony Moretti',
    phone: '+919876543211',
    role: 'RESTAURANT_OWNER',
    isActive: true,
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'u0000003-0000-0000-0000-000000000003',
    email: 'driver.rajesh@foodbytes.app',
    fullName: 'Rajesh Kumar',
    phone: '+919876543212',
    role: 'DRIVER',
    isActive: true,
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Base User Location: MG Road, Bangalore (12.9716, 77.5946)
export const TEST_USER_LOCATION = { lat: 12.9716, lng: 77.5946 };

export const SEED_RESTAURANTS: RestaurantEntity[] = [
  {
    id: 'r0000001-0000-0000-0000-000000000001',
    ownerId: 'u0000002-0000-0000-0000-000000000002',
    name: "Tony's Artisan Pizza",
    description: 'Authentic woodfired Neapolitan pizzas with slow-fermented sourdough crust.',
    cuisineTypes: ['Italian', 'Pizza', 'Pasta'],
    bannerUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
    logoUrl: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d',
    streetAddress: '42 Wood Street, Ashok Nagar',
    city: 'Bangalore',
    latitude: 12.9780,
    longitude: 77.6000, // ~0.93 km from user
    operationalStatus: 'ACTIVE',
    rating: 4.8,
    reviewCount: 342,
    averagePrepTimeMinutes: 20,
    minimumOrderAmount: 15.00,
    deliveryFeeBase: 2.49,
    commissionRate: 0.20,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'r0000002-0000-0000-0000-000000000002',
    ownerId: 'u0000002-0000-0000-0000-000000000002',
    name: 'The Gourmet Burger Lab',
    description: 'Handcrafted smashed wagyu & brioche burgers with triple-cooked chips.',
    cuisineTypes: ['American', 'Burgers', 'Fast Food'],
    bannerUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349',
    streetAddress: '15 Church Street',
    city: 'Bangalore',
    latitude: 12.9745,
    longitude: 77.6050, // ~1.17 km from user
    operationalStatus: 'ACTIVE',
    rating: 4.7,
    reviewCount: 512,
    averagePrepTimeMinutes: 25,
    minimumOrderAmount: 12.00,
    deliveryFeeBase: 1.99,
    commissionRate: 0.20,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'r0000003-0000-0000-0000-000000000003',
    ownerId: 'u0000002-0000-0000-0000-000000000002',
    name: 'Sakura Sushi House',
    description: 'Fresh sashimi, traditional maki rolls, and piping hot tonkotsu ramen.',
    cuisineTypes: ['Japanese', 'Sushi', 'Asian'],
    bannerUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
    streetAddress: '100 Feet Road, Indiranagar',
    city: 'Bangalore',
    latitude: 12.9620,
    longitude: 77.6400, // ~5.04 km from user
    operationalStatus: 'ACTIVE',
    rating: 4.9,
    reviewCount: 220,
    averagePrepTimeMinutes: 30,
    minimumOrderAmount: 25.00,
    deliveryFeeBase: 3.49,
    commissionRate: 0.20,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'r0000004-0000-0000-0000-000000000004',
    ownerId: 'u0000002-0000-0000-0000-000000000002',
    name: 'Spice Symphony Biryani House',
    description: 'Dum-cooked Hyderabadi biryani and clay-oven tandoori specialties.',
    cuisineTypes: ['Indian', 'Biryani', 'Mughlai'],
    bannerUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8',
    streetAddress: 'Koramangala 4th Block',
    city: 'Bangalore',
    latitude: 12.9350,
    longitude: 77.6250, // ~5.26 km from user
    operationalStatus: 'ACTIVE',
    rating: 4.6,
    reviewCount: 890,
    averagePrepTimeMinutes: 35,
    minimumOrderAmount: 18.00,
    deliveryFeeBase: 3.99,
    commissionRate: 0.20,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // OUT OF RANGE RESTAURANT (> 10 km) - used to verify the 10km filter boundary
  {
    id: 'r0000005-0000-0000-0000-000000000005',
    ownerId: 'u0000002-0000-0000-0000-000000000002',
    name: 'Airport Highway Diner',
    description: 'Late night highway diner located far outside delivery radius.',
    cuisineTypes: ['Diner', 'Coffee'],
    bannerUrl: 'https://images.unsplash.com/photo-1554679665-f5537f187268',
    streetAddress: 'NH 44, Devanahalli',
    city: 'Bangalore',
    latitude: 13.1986,
    longitude: 77.7066, // ~28.0 km from user
    operationalStatus: 'ACTIVE',
    rating: 4.1,
    reviewCount: 45,
    averagePrepTimeMinutes: 20,
    minimumOrderAmount: 10.00,
    deliveryFeeBase: 9.99,
    commissionRate: 0.20,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const SEED_MENU_CATEGORIES: MenuCategoryEntity[] = [
  {
    id: 'c0000001-0000-0000-0000-000000000001',
    restaurantId: 'r0000001-0000-0000-0000-000000000001',
    name: 'Artisan Woodfired Pizzas',
    description: 'Stone-baked at 450°C with organic Italian flour.',
    displayOrder: 1,
    isActive: true,
    items: [],
  },
  {
    id: 'c0000002-0000-0000-0000-000000000002',
    restaurantId: 'r0000001-0000-0000-0000-000000000001',
    name: 'Sides & Appetizers',
    description: 'Crispy sides and garlic breads.',
    displayOrder: 2,
    isActive: true,
    items: [],
  },
];

export const SEED_MENU_ITEMS: MenuItemEntity[] = [
  {
    id: 'm0000001-0000-0000-0000-000000000001',
    restaurantId: 'r0000001-0000-0000-0000-000000000001',
    categoryId: 'c0000001-0000-0000-0000-000000000001',
    name: 'Margherita Classica',
    description: 'San Marzano tomatoes, fresh buffalo mozzarella, fragrant basil leaves, and extra virgin olive oil.',
    basePrice: 12.99,
    imageUrl: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143',
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    isAvailable: true,
    calories: 850,
    optionGroups: [
      {
        id: 'og000001-0000-0000-0000-000000000001',
        menuItemId: 'm0000001-0000-0000-0000-000000000001',
        name: 'Size',
        minSelections: 1,
        maxSelections: 1,
        isRequired: true,
        options: [
          { id: 'opt001', optionGroupId: 'og000001', name: '10 inch Regular', additionalPrice: 0.00, isDefault: true },
          { id: 'opt002', optionGroupId: 'og000001', name: '12 inch Medium', additionalPrice: 3.50, isDefault: false },
          { id: 'opt003', optionGroupId: 'og000001', name: '14 inch Large', additionalPrice: 6.00, isDefault: false },
        ],
      },
      {
        id: 'og000002-0000-0000-0000-000000000002',
        menuItemId: 'm0000001-0000-0000-0000-000000000001',
        name: 'Crust',
        minSelections: 1,
        maxSelections: 1,
        isRequired: true,
        options: [
          { id: 'opt004', optionGroupId: 'og000002', name: 'Traditional Neapolitan Thin', additionalPrice: 0.00, isDefault: true },
          { id: 'opt005', optionGroupId: 'og000002', name: 'Cheese Burst Stuffed Crust', additionalPrice: 2.50, isDefault: false },
        ],
      },
      {
        id: 'og000003-0000-0000-0000-000000000003',
        menuItemId: 'm0000001-0000-0000-0000-000000000001',
        name: 'Extra Toppings',
        minSelections: 0,
        maxSelections: 4,
        isRequired: false,
        options: [
          { id: 'opt006', optionGroupId: 'og000003', name: 'Truffle Mushroom Glaze', additionalPrice: 1.75, isDefault: false },
          { id: 'opt007', optionGroupId: 'og000003', name: 'Spicy Jalapenos & Olives', additionalPrice: 1.25, isDefault: false },
          { id: 'opt008', optionGroupId: 'og000003', name: 'Extra Mozzarella Melt', additionalPrice: 2.00, isDefault: false },
        ],
      },
    ],
  },
  {
    id: 'm0000002-0000-0000-0000-000000000002',
    restaurantId: 'r0000001-0000-0000-0000-000000000001',
    categoryId: 'c0000001-0000-0000-0000-000000000001',
    name: 'Diavola Pepperoni Inferno',
    description: 'Spicy artisanal pepperoni, crushed Calabrian chilies, melted mozzarella, hot honey drizzle.',
    basePrice: 15.49,
    imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e',
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    isAvailable: true,
    calories: 1050,
  },
];

export function verifySpatialRadius(userLoc = TEST_USER_LOCATION, maxRadiusKm = 10) {
  console.log(`\n======================================================`);
  console.log(`VERIFYING RESTAURANT SPATIAL DISCOVERY (<= ${maxRadiusKm} KM RADIUS)`);
  console.log(`User Coordinates: (${userLoc.lat}, ${userLoc.lng})`);
  console.log(`======================================================`);

  const nearby: Array<{ name: string; distanceKm: number; included: boolean }> = [];

  for (const r of SEED_RESTAURANTS) {
    const dist = haversineDistanceKm(userLoc, { lat: r.latitude, lng: r.longitude });
    const included = dist <= maxRadiusKm;
    nearby.push({ name: r.name, distanceKm: parseFloat(dist.toFixed(2)), included });
    console.log(`- ${r.name.padEnd(32)}: ${dist.toFixed(2)} km -> ${included ? '✅ INCLUDED' : '❌ EXCLUDED (>10km)'}`);
  }

  const includedCount = nearby.filter(n => n.included).length;
  console.log(`\nResult: ${includedCount} out of ${SEED_RESTAURANTS.length} restaurants qualified within ${maxRadiusKm} km.`);
  return nearby;
}

if (require.main === module) {
  verifySpatialRadius();
}
