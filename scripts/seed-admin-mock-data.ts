const SUPABASE_URL = process.env.SUPABASE_URL || 'https://yrifetqxupbzrqpbivlg.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyaWZldHF4dXBienJxcGJpdmxnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDUwMzUzMSwiZXhwIjoyMTA2MDc5NTMxfQ.SOglgAim_ormENyCSmUAydM3qRApzLAw6WPM8xfdpR8';

async function postTable(table: string, records: any[]) {
  const url = `${SUPABASE_URL}/rest/v1/${table}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify(records),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to post to ${table}:`, errorText);
    return [];
  }

  const result = await response.json();
  console.log(`✅ [${table.padEnd(20)}] Synced ${result.length} rows.`);
  return result;
}

async function runSeed() {
  console.log('--- Seeding Admin Mock Data into Supabase ---');

  // 1. Users
  const users = [
    {
      id: '10000000-0000-0000-0000-000000000001',
      email: 'alex.customer@foodbytes.app',
      password_hash: 'hash_test_123',
      full_name: 'Alex Johnson',
      role: 'CONSUMER',
      phone: '+1 555-010-1001',
    },
    {
      id: '10000000-0000-0000-0000-000000000002',
      email: 'tony@tonyspizza.com',
      password_hash: 'hash_test_123',
      full_name: 'Tony Romano',
      role: 'RESTAURANT_OWNER',
      phone: '+1 555-010-1002',
    },
    {
      id: '10000000-0000-0000-0000-000000000010',
      email: 'kenji@kyotosushi.com',
      password_hash: 'hash_test_123',
      full_name: 'Kenji Sato',
      role: 'RESTAURANT_OWNER',
      phone: '+1 555-010-1010',
    },
    {
      id: '10000000-0000-0000-0000-000000000011',
      email: 'marcus@burgersmoke.com',
      password_hash: 'hash_test_123',
      full_name: 'Marcus Bell',
      role: 'RESTAURANT_OWNER',
      phone: '+1 555-010-1011',
    },
    {
      id: '10000000-0000-0000-0000-000000000012',
      email: 'elena@lataqueria.com',
      password_hash: 'hash_test_123',
      full_name: 'Elena Gomez',
      role: 'RESTAURANT_OWNER',
      phone: '+1 555-010-1012',
    },
    {
      id: '10000000-0000-0000-0000-000000000013',
      email: 'chloe@greengoddess.com',
      password_hash: 'hash_test_123',
      full_name: 'Chloe Bennett',
      role: 'RESTAURANT_OWNER',
      phone: '+1 555-010-1013',
    },
    {
      id: '10000000-0000-0000-0000-000000000003',
      email: 'driver.rajesh@foodbytes.app',
      password_hash: 'hash_test_123',
      full_name: 'Rajesh Kumar',
      role: 'DRIVER',
      phone: '+91 98765 43210',
    },
    {
      id: '10000000-0000-0000-0000-000000000004',
      email: 'driver.carlos@foodbytes.app',
      password_hash: 'hash_test_123',
      full_name: 'Carlos Mendez',
      role: 'DRIVER',
      phone: '+1 (555) 742-1100',
    },
    {
      id: '10000000-0000-0000-0000-000000000020',
      email: 'driver.vikram@foodbytes.app',
      password_hash: 'hash_test_123',
      full_name: 'Vikram Singh',
      role: 'DRIVER',
      phone: '+91 98221 88301',
    },
    {
      id: '10000000-0000-0000-0000-000000000021',
      email: 'driver.elena@foodbytes.app',
      password_hash: 'hash_test_123',
      full_name: 'Elena Rostova',
      role: 'DRIVER',
      phone: '+1 (555) 302-9988',
    },
    {
      id: '10000000-0000-0000-0000-000000000022',
      email: 'driver.marcus@foodbytes.app',
      password_hash: 'hash_test_123',
      full_name: 'Marcus Vance',
      role: 'DRIVER',
      phone: '+1 (555) 888-2345',
    },
    {
      id: '10000000-0000-0000-0000-000000000005',
      email: 'admin@foodbytes.app',
      password_hash: 'hash_test_123',
      full_name: 'Operations Admin',
      role: 'ADMIN',
      phone: '+1 555-999-0000',
    },
  ];
  await postTable('users', users);

  // 2. Restaurants
  const restaurants = [
    {
      id: '10000000-0000-0000-0000-000000000001',
      owner_id: '10000000-0000-0000-0000-000000000002',
      name: "Tony's Artisan Pizza #104",
      description: 'Artisanal Italian & Slow-Fermented Pizza',
      cuisine_types: ['Italian', 'Pizza', 'Artisanal'],
      street_address: 'Downtown Main Flagship, 42 Wood St',
      city: 'Bangalore',
      location: 'POINT(77.6000 12.9780)',
      operational_status: 'ACTIVE',
      rating: 4.88,
      review_count: 342,
      average_prep_time_minutes: 20,
      minimum_order_amount: 15.00,
      delivery_fee_base: 2.49,
      commission_rate: 0.20,
    },
    {
      id: '10000000-0000-0000-0000-000000000002',
      owner_id: '10000000-0000-0000-0000-000000000010',
      name: 'Kyoto Sushi & Robata',
      description: 'Japanese Raw Bar & Traditional Robata Grill',
      cuisine_types: ['Japanese', 'Sushi', 'Raw Bar'],
      street_address: 'Westside Marina Blvd, Suite 10',
      city: 'Bangalore',
      location: 'POINT(77.6050 12.9745)',
      operational_status: 'ACTIVE',
      rating: 4.95,
      review_count: 512,
      average_prep_time_minutes: 25,
      minimum_order_amount: 20.00,
      delivery_fee_base: 2.99,
      commission_rate: 0.18,
    },
    {
      id: '10000000-0000-0000-0000-000000000003',
      owner_id: '10000000-0000-0000-0000-000000000011',
      name: 'Burger & Smoke Co.',
      description: 'American Smokehouse & Smash Burgers',
      cuisine_types: ['American', 'Burgers', 'Smokehouse'],
      street_address: 'Metro Eastside Arcade, Shop 4',
      city: 'Bangalore',
      location: 'POINT(77.5900 12.9650)',
      operational_status: 'PENDING_APPROVAL',
      rating: 4.62,
      review_count: 180,
      average_prep_time_minutes: 22,
      minimum_order_amount: 12.00,
      delivery_fee_base: 1.99,
      commission_rate: 0.15,
    },
    {
      id: '10000000-0000-0000-0000-000000000004',
      owner_id: '10000000-0000-0000-0000-000000000012',
      name: 'La Taqueria 1988',
      description: 'Authentic Street Tacos & Birria Consome',
      cuisine_types: ['Mexican', 'Tacos', 'Street Food'],
      street_address: 'Mission Strip, Block B',
      city: 'Bangalore',
      location: 'POINT(77.6150 12.9820)',
      operational_status: 'ACTIVE',
      rating: 4.79,
      review_count: 240,
      average_prep_time_minutes: 18,
      minimum_order_amount: 10.00,
      delivery_fee_base: 1.99,
      commission_rate: 0.20,
    },
    {
      id: '10000000-0000-0000-0000-000000000005',
      owner_id: '10000000-0000-0000-0000-000000000013',
      name: 'Green Goddess Bowls',
      description: 'Organic Cold-Pressed Juices & Superfood Bowls',
      cuisine_types: ['Organic', 'Vegan', 'Healthy'],
      street_address: 'North Bay Waterfront, Deck 2',
      city: 'Bangalore',
      location: 'POINT(77.5850 12.9700)',
      operational_status: 'SUSPENDED',
      rating: 4.31,
      review_count: 95,
      average_prep_time_minutes: 15,
      minimum_order_amount: 12.00,
      delivery_fee_base: 2.49,
      commission_rate: 0.20,
    },
  ];
  await postTable('restaurants', restaurants);

  // 3. Drivers
  const drivers = [
    {
      id: '80000000-0000-0000-0000-000000000001',
      user_id: '10000000-0000-0000-0000-000000000003',
      vehicle_type: 'EV Scooter',
      vehicle_plate: 'KA 01 EQ 4402',
      current_status: 'ONLINE',
      rating: 4.92,
      trips_completed: 342,
    },
    {
      id: '80000000-0000-0000-0000-000000000002',
      user_id: '10000000-0000-0000-0000-000000000004',
      vehicle_type: 'Motorcycle',
      vehicle_plate: 'CA 89 XFD',
      current_status: 'BUSY',
      rating: 4.88,
      trips_completed: 512,
    },
    {
      id: '80000000-0000-0000-0000-000000000003',
      user_id: '10000000-0000-0000-0000-000000000020',
      vehicle_type: 'Car',
      vehicle_plate: 'KA 03 MZ 9912',
      current_status: 'OFFLINE',
      rating: 4.75,
      trips_completed: 184,
    },
    {
      id: '80000000-0000-0000-0000-000000000004',
      user_id: '10000000-0000-0000-0000-000000000021',
      vehicle_type: 'EV Scooter',
      vehicle_plate: 'EB-2026-9',
      current_status: 'ONLINE',
      rating: 4.96,
      trips_completed: 620,
    },
    {
      id: '80000000-0000-0000-0000-000000000005',
      user_id: '10000000-0000-0000-0000-000000000022',
      vehicle_type: 'Motorcycle',
      vehicle_plate: 'NY 44 KLP',
      current_status: 'SUSPENDED',
      rating: 4.41,
      trips_completed: 88,
    },
  ];
  await postTable('drivers', drivers);

  // 4. Orders
  const orders = [
    {
      id: '90000000-0000-0000-0000-000000009104',
      user_id: '10000000-0000-0000-0000-000000000001',
      restaurant_id: '10000000-0000-0000-0000-000000000001',
      driver_id: '80000000-0000-0000-0000-000000000001',
      status: 'DELIVERED',
      destination_location: 'POINT(77.5946 12.9716)',
      delivery_notes: 'Missing Truffle Fries claim. #FB-9104',
      subtotal: 38.00,
      tax_amount: 1.90,
      delivery_fee: 2.60,
      driver_tip: 5.00,
      platform_commission_amount: 7.60,
      restaurant_payout_amount: 30.40,
      driver_payout_amount: 7.60,
      total_amount: 47.50,
    },
    {
      id: '90000000-0000-0000-0000-000000008821',
      user_id: '10000000-0000-0000-0000-000000000001',
      restaurant_id: '10000000-0000-0000-0000-000000000002',
      driver_id: '80000000-0000-0000-0000-000000000002',
      status: 'DELIVERED',
      destination_location: 'POINT(77.5946 12.9716)',
      delivery_notes: 'Wrong building gate claim. #FB-8821',
      subtotal: 52.00,
      tax_amount: 2.60,
      delivery_fee: 2.40,
      driver_tip: 5.00,
      platform_commission_amount: 10.40,
      restaurant_payout_amount: 41.60,
      driver_payout_amount: 7.40,
      total_amount: 62.00,
    },
    {
      id: '90000000-0000-0000-0000-000000007712',
      user_id: '10000000-0000-0000-0000-000000000001',
      restaurant_id: '10000000-0000-0000-0000-000000000003',
      driver_id: '80000000-0000-0000-0000-000000000003',
      status: 'CANCELLED',
      destination_location: 'POINT(77.5946 12.9716)',
      delivery_notes: 'Refunded due to allergen breach. #FB-7712',
      subtotal: 24.00,
      tax_amount: 1.20,
      delivery_fee: 2.80,
      driver_tip: 0.00,
      platform_commission_amount: 4.80,
      restaurant_payout_amount: 19.20,
      driver_payout_amount: 2.80,
      total_amount: 28.00,
    },
  ];
  await postTable('orders', orders);

  // 5. Payment transactions (showing 80/20 splits)
  const payments = [
    {
      id: '50000000-0000-0000-0000-000000009104',
      order_id: '90000000-0000-0000-0000-000000009104',
      razorpay_order_id: 'order_test_9104',
      razorpay_payment_id: 'pay_test_9104',
      amount: 47.50,
      currency: 'USD',
      vendor_split_ratio: 0.80,
      admin_commission_ratio: 0.20,
      status: 'CAPTURED',
    },
    {
      id: '50000000-0000-0000-0000-000000008821',
      order_id: '90000000-0000-0000-0000-000000008821',
      razorpay_order_id: 'order_test_8821',
      razorpay_payment_id: 'pay_test_8821',
      amount: 62.00,
      currency: 'USD',
      vendor_split_ratio: 0.80,
      admin_commission_ratio: 0.20,
      status: 'CAPTURED',
    },
    {
      id: '50000000-0000-0000-0000-000000007712',
      order_id: '90000000-0000-0000-0000-000000007712',
      razorpay_order_id: 'order_test_7712',
      razorpay_payment_id: 'pay_test_7712',
      amount: 28.00,
      currency: 'USD',
      vendor_split_ratio: 0.80,
      admin_commission_ratio: 0.20,
      status: 'REFUNDED',
    },
  ];
  await postTable('payment_transactions', payments);

  console.log('\n--- Finished Seeding Admin Mock Data Successfully! ---');
}

runSeed().catch(console.error);
