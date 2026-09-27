import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://yrifetqxupbzrqpbivlg.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyaWZldHF4dXBienJxcGJpdmxnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDUwMzUzMSwiZXhwIjoyMTA2MDc5NTMxfQ.SOglgAim_ormENyCSmUAydM3qRApzLAw6WPM8xfdpR8';

async function postTable(table: string, records: any[]) {
  const url = `${SUPABASE_URL}/rest/v1/${table}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates,return=representation'
    },
    body: JSON.stringify(records)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to seed table ${table} (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  console.log(`✅ Table [${table.padEnd(24)}] Inserted / Updated ${result.length} rows`);
  return result;
}

async function verifyCounts() {
  const tables = [
    'users',
    'user_addresses',
    'restaurants',
    'menu_categories',
    'menu_items',
    'menu_item_option_groups',
    'menu_item_options',
    'drivers'
  ];

  console.log('\n📊 LIVE SUPABASE ROW COUNT AUDIT:');
  console.log('----------------------------------------------------');
  for (const table of tables) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, {
      method: 'GET',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Range': '0-0',
        'Prefer': 'count=exact'
      }
    });

    const rangeHeader = res.headers.get('content-range');
    const totalCount = rangeHeader ? rangeHeader.split('/')[1] : 'unknown';
    console.log(`• ${table.padEnd(26)} : ${totalCount} records`);
  }
}

async function main() {
  console.log('====================================================');
  console.log('🚀 SEEDING LIVE SUPABASE DATABASE (Food Bytes Ecosystem)');
  console.log(`Target: ${SUPABASE_URL}`);
  console.log('====================================================\n');

  // 1. Users
  const users = [
    {
      id: '10000000-0000-0000-0000-000000000001',
      email: 'consumer@foodbytes.app',
      password_hash: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW',
      full_name: 'Alex Johnson',
      phone: '+919876543210',
      role: 'CONSUMER',
      is_active: true,
      is_verified: true
    },
    {
      id: '10000000-0000-0000-0000-000000000002',
      email: 'tony@tonyspizza.com',
      password_hash: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW',
      full_name: 'Tony Moretti',
      phone: '+919876543211',
      role: 'RESTAURANT_OWNER',
      is_active: true,
      is_verified: true
    },
    {
      id: '10000000-0000-0000-0000-000000000003',
      email: 'driver.rajesh@foodbytes.app',
      password_hash: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW',
      full_name: 'Rajesh Kumar',
      phone: '+919876543212',
      role: 'DRIVER',
      is_active: true,
      is_verified: true
    },
    {
      id: '10000000-0000-0000-0000-000000000004',
      email: 'driver.vikram@foodbytes.app',
      password_hash: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW',
      full_name: 'Vikram Singh',
      phone: '+919876543213',
      role: 'DRIVER',
      is_active: true,
      is_verified: true
    },
    {
      id: '10000000-0000-0000-0000-000000000005',
      email: 'admin@foodbytes.app',
      password_hash: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW',
      full_name: 'Operations Admin',
      phone: '+919876543214',
      role: 'ADMIN',
      is_active: true,
      is_verified: true
    }
  ];
  await postTable('users', users);

  // 2. User Addresses
  const userAddresses = [
    {
      id: '20000000-0000-0000-0000-000000000001',
      user_id: '10000000-0000-0000-0000-000000000001',
      label: 'Home',
      street_address: 'MG Road Boulevard',
      apartment_unit: 'Penthouse 4B',
      city: 'Bangalore',
      location: 'POINT(77.5946 12.9716)',
      is_default: true
    }
  ];
  await postTable('user_addresses', userAddresses);

  // 3. Restaurants
  const restaurants = [
    {
      id: '30000000-0000-0000-0000-000000000001',
      owner_id: '10000000-0000-0000-0000-000000000002',
      name: "Tony's Artisan Pizza",
      description: 'Authentic woodfired Neapolitan pizzas with slow-fermented sourdough crust.',
      cuisine_types: ['Italian', 'Pizza', 'Pasta'],
      banner_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
      logo_url: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d',
      phone: '+919876543211',
      email: 'orders@tonyspizza.com',
      street_address: '42 Wood Street, Ashok Nagar',
      city: 'Bangalore',
      location: 'POINT(77.6000 12.9780)',
      operational_status: 'ACTIVE',
      rating: 4.8,
      review_count: 342,
      average_prep_time_minutes: 20,
      minimum_order_amount: 15.00,
      delivery_fee_base: 2.49
    },
    {
      id: '30000000-0000-0000-0000-000000000002',
      owner_id: '10000000-0000-0000-0000-000000000002',
      name: 'The Gourmet Burger Lab',
      description: 'Handcrafted smashed wagyu & brioche burgers with triple-cooked chips.',
      cuisine_types: ['American', 'Burgers', 'Fast Food'],
      banner_url: 'https://images.unsplash.com/photo-1550547660-d9450f859349',
      logo_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
      phone: '+919876543220',
      email: 'contact@burgerlab.com',
      street_address: '15 Church Street',
      city: 'Bangalore',
      location: 'POINT(77.6050 12.9745)',
      operational_status: 'ACTIVE',
      rating: 4.7,
      review_count: 512,
      average_prep_time_minutes: 25,
      minimum_order_amount: 12.00,
      delivery_fee_base: 1.99
    },
    {
      id: '30000000-0000-0000-0000-000000000003',
      owner_id: '10000000-0000-0000-0000-000000000002',
      name: 'Sakura Sushi House',
      description: 'Fresh sashimi, traditional maki rolls, and piping hot tonkotsu ramen.',
      cuisine_types: ['Japanese', 'Sushi', 'Asian'],
      banner_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
      logo_url: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252',
      phone: '+919876543230',
      email: 'hello@sakurasushi.com',
      street_address: '100 Feet Road, Indiranagar',
      city: 'Bangalore',
      location: 'POINT(77.6400 12.9620)',
      operational_status: 'ACTIVE',
      rating: 4.9,
      review_count: 220,
      average_prep_time_minutes: 30,
      minimum_order_amount: 25.00,
      delivery_fee_base: 3.49
    },
    {
      id: '30000000-0000-0000-0000-000000000004',
      owner_id: '10000000-0000-0000-0000-000000000002',
      name: 'Spice Symphony Biryani House',
      description: 'Dum-cooked Hyderabadi biryani and clay-oven tandoori specialties.',
      cuisine_types: ['Indian', 'Biryani', 'Mughlai'],
      banner_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8',
      logo_url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0',
      phone: '+919876543240',
      email: 'taste@spicesymphony.com',
      street_address: 'Koramangala 4th Block',
      city: 'Bangalore',
      location: 'POINT(77.6250 12.9350)',
      operational_status: 'ACTIVE',
      rating: 4.6,
      review_count: 890,
      average_prep_time_minutes: 35,
      minimum_order_amount: 18.00,
      delivery_fee_base: 3.99
    }
  ];
  await postTable('restaurants', restaurants);

  // 4. Menu Categories
  const categories = [
    {
      id: '40000000-0000-0000-0000-000000000001',
      restaurant_id: '30000000-0000-0000-0000-000000000001',
      name: 'Artisan Woodfired Pizzas',
      description: 'Stone-baked at 450°C with organic Italian flour.',
      display_order: 1,
      is_active: true
    },
    {
      id: '40000000-0000-0000-0000-000000000002',
      restaurant_id: '30000000-0000-0000-0000-000000000001',
      name: 'Sides & Appetizers',
      description: 'Crispy sides, dips, and garlic breads.',
      display_order: 2,
      is_active: true
    }
  ];
  await postTable('menu_categories', categories);

  // 5. Menu Items
  const menuItems = [
    {
      id: '50000000-0000-0000-0000-000000000001',
      restaurant_id: '30000000-0000-0000-0000-000000000001',
      category_id: '40000000-0000-0000-0000-000000000001',
      name: 'Margherita Classica',
      description: 'San Marzano tomatoes, fresh buffalo mozzarella, aromatic fresh basil leaves, and EVOO drizzle.',
      base_price: 12.99,
      image_url: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143',
      is_vegetarian: true,
      is_vegan: false,
      is_gluten_free: false,
      is_available: true,
      calories: 850
    },
    {
      id: '50000000-0000-0000-0000-000000000002',
      restaurant_id: '30000000-0000-0000-0000-000000000001',
      category_id: '40000000-0000-0000-0000-000000000001',
      name: 'Diavola Pepperoni Inferno',
      description: 'Spicy artisan pepperoni, crushed Calabrian chilies, bubbling mozzarella, and hot honey drizzle.',
      base_price: 15.49,
      image_url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e',
      is_vegetarian: false,
      is_vegan: false,
      is_gluten_free: false,
      is_available: true,
      calories: 1050
    },
    {
      id: '50000000-0000-0000-0000-000000000003',
      restaurant_id: '30000000-0000-0000-0000-000000000001',
      category_id: '40000000-0000-0000-0000-000000000001',
      name: 'Truffle Wild Mushroom & Burrata',
      description: 'Roasted cremini mushrooms, white truffle oil, melted provolone, and creamy burrata crown.',
      base_price: 16.99,
      image_url: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e',
      is_vegetarian: true,
      is_vegan: false,
      is_gluten_free: false,
      is_available: true,
      calories: 920
    },
    {
      id: '50000000-0000-0000-0000-000000000004',
      restaurant_id: '30000000-0000-0000-0000-000000000001',
      category_id: '40000000-0000-0000-0000-000000000002',
      name: 'Woodfired Garlic & Herb Cheesy Bread',
      description: 'Served with warm house San Marzano marinara dipping sauce.',
      base_price: 6.49,
      image_url: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536',
      is_vegetarian: true,
      is_vegan: false,
      is_gluten_free: false,
      is_available: true,
      calories: 480
    }
  ];
  await postTable('menu_items', menuItems);

  // 6. Option Groups
  const optionGroups = [
    {
      id: '60000000-0000-0000-0000-000000000001',
      menu_item_id: '50000000-0000-0000-0000-000000000001',
      name: 'Size',
      min_selections: 1,
      max_selections: 1,
      is_required: true
    },
    {
      id: '60000000-0000-0000-0000-000000000002',
      menu_item_id: '50000000-0000-0000-0000-000000000001',
      name: 'Crust',
      min_selections: 1,
      max_selections: 1,
      is_required: true
    },
    {
      id: '60000000-0000-0000-0000-000000000003',
      menu_item_id: '50000000-0000-0000-0000-000000000001',
      name: 'Extra Toppings',
      min_selections: 0,
      max_selections: 4,
      is_required: false
    }
  ];
  await postTable('menu_item_option_groups', optionGroups);

  // 7. Options
  const options = [
    {
      id: '70000000-0000-0000-0000-000000000001',
      option_group_id: '60000000-0000-0000-0000-000000000001',
      name: '10 inch Regular',
      additional_price: 0.00,
      is_default: true
    },
    {
      id: '70000000-0000-0000-0000-000000000002',
      option_group_id: '60000000-0000-0000-0000-000000000001',
      name: '12 inch Medium',
      additional_price: 3.50,
      is_default: false
    },
    {
      id: '70000000-0000-0000-0000-000000000003',
      option_group_id: '60000000-0000-0000-0000-000000000001',
      name: '14 inch Large',
      additional_price: 6.00,
      is_default: false
    },
    {
      id: '70000000-0000-0000-0000-000000000004',
      option_group_id: '60000000-0000-0000-0000-000000000002',
      name: 'Traditional Neapolitan Thin',
      additional_price: 0.00,
      is_default: true
    },
    {
      id: '70000000-0000-0000-0000-000000000005',
      option_group_id: '60000000-0000-0000-0000-000000000002',
      name: 'Cheese Burst Stuffed Crust',
      additional_price: 2.50,
      is_default: false
    },
    {
      id: '70000000-0000-0000-0000-000000000006',
      option_group_id: '60000000-0000-0000-0000-000000000003',
      name: 'Truffle Mushroom Glaze',
      additional_price: 1.75,
      is_default: false
    },
    {
      id: '70000000-0000-0000-0000-000000000007',
      option_group_id: '60000000-0000-0000-0000-000000000003',
      name: 'Spicy Jalapenos & Olives',
      additional_price: 1.25,
      is_default: false
    },
    {
      id: '70000000-0000-0000-0000-000000000008',
      option_group_id: '60000000-0000-0000-0000-000000000003',
      name: 'Extra Mozzarella Melt',
      additional_price: 2.00,
      is_default: false
    }
  ];
  await postTable('menu_item_options', options);

  // 8. Drivers
  const drivers = [
    {
      id: '80000000-0000-0000-0000-000000000001',
      user_id: '10000000-0000-0000-0000-000000000003',
      vehicle_type: 'EV Scooter',
      vehicle_plate: 'KA-01-EQ-1001',
      current_status: 'ONLINE',
      current_location: 'POINT(77.6010 12.9770)',
      rating: 4.9,
      trips_completed: 142
    },
    {
      id: '80000000-0000-0000-0000-000000000002',
      user_id: '10000000-0000-0000-0000-000000000004',
      vehicle_type: 'Motorcycle',
      vehicle_plate: 'KA-04-MB-2024',
      current_status: 'ONLINE',
      current_location: 'POINT(77.6030 12.9755)',
      rating: 4.7,
      trips_completed: 98
    }
  ];
  await postTable('drivers', drivers);

  console.log('\n====================================================');
  console.log('🎉 ALL SEED DATA SUCCESSFULLY INSERTED INTO SUPABASE!');
  console.log('====================================================');

  await verifyCounts();
}

main().catch(err => {
  console.error('\n❌ Seeding Failed:', err);
  process.exit(1);
});
