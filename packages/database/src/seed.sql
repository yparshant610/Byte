-- =========================================================================
-- Food Bytes Ecosystem Seed Data for Supabase
-- Populates Users, Restaurants (PostGIS coordinates), Menus, Addons, Drivers
-- =========================================================================

-- 1. SEED USERS
INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active, is_verified)
VALUES 
  ('10000000-0000-0000-0000-000000000001', 'consumer@foodbytes.app', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Alex Johnson', '+919876543210', 'CONSUMER', true, true),
  ('10000000-0000-0000-0000-000000000002', 'tony@tonyspizza.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Tony Moretti', '+919876543211', 'RESTAURANT_OWNER', true, true),
  ('10000000-0000-0000-0000-000000000003', 'driver.rajesh@foodbytes.app', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Rajesh Kumar', '+919876543212', 'DRIVER', true, true),
  ('10000000-0000-0000-0000-000000000004', 'driver.vikram@foodbytes.app', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Vikram Singh', '+919876543213', 'DRIVER', true, true),
  ('10000000-0000-0000-0000-000000000005', 'admin@foodbytes.app', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Operations Admin', '+919876543214', 'ADMIN', true, true)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name;

-- 2. SEED USER ADDRESSES
INSERT INTO user_addresses (id, user_id, label, street_address, apartment_unit, city, location, is_default)
VALUES
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Home', 'MG Road Boulevard', 'Penthouse 4B', 'Bangalore', ST_SetSRID(ST_MakePoint(77.5946, 12.9716), 4326), true)
ON CONFLICT (id) DO NOTHING;

-- 3. SEED RESTAURANTS (WITH POSTGIS GEOMETRY)
INSERT INTO restaurants (id, owner_id, name, description, cuisine_types, banner_url, logo_url, phone, email, street_address, city, location, operational_status, rating, review_count, average_prep_time_minutes, minimum_order_amount, delivery_fee_base)
VALUES
  ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Tony''s Artisan Pizza', 'Authentic woodfired Neapolitan pizzas with slow-fermented sourdough crust.', ARRAY['Italian', 'Pizza', 'Pasta'], 'https://images.unsplash.com/photo-1513104890138-7c749659a591', 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d', '+919876543211', 'orders@tonyspizza.com', '42 Wood Street, Ashok Nagar', 'Bangalore', ST_SetSRID(ST_MakePoint(77.6000, 12.9780), 4326), 'ACTIVE', 4.8, 342, 20, 15.00, 2.49),
  ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'The Gourmet Burger Lab', 'Handcrafted smashed wagyu & brioche burgers with triple-cooked chips.', ARRAY['American', 'Burgers', 'Fast Food'], 'https://images.unsplash.com/photo-1550547660-d9450f859349', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', '+919876543220', 'contact@burgerlab.com', '15 Church Street', 'Bangalore', ST_SetSRID(ST_MakePoint(77.6050, 12.9745), 4326), 'ACTIVE', 4.7, 512, 25, 12.00, 1.99),
  ('30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', 'Sakura Sushi House', 'Fresh sashimi, traditional maki rolls, and piping hot tonkotsu ramen.', ARRAY['Japanese', 'Sushi', 'Asian'], 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c', 'https://images.unsplash.com/photo-1611143669185-af224c5e3252', '+919876543230', 'hello@sakurasushi.com', '100 Feet Road, Indiranagar', 'Bangalore', ST_SetSRID(ST_MakePoint(77.6400, 12.9620), 4326), 'ACTIVE', 4.9, 220, 30, 25.00, 3.49),
  ('30000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', 'Spice Symphony Biryani House', 'Dum-cooked Hyderabadi biryani and clay-oven tandoori specialties.', ARRAY['Indian', 'Biryani', 'Mughlai'], 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8', 'https://images.unsplash.com/photo-1589302168068-964664d93dc0', '+919876543240', 'taste@spicesymphony.com', 'Koramangala 4th Block', 'Bangalore', ST_SetSRID(ST_MakePoint(77.6250, 12.9350), 4326), 'ACTIVE', 4.6, 890, 35, 18.00, 3.99)
ON CONFLICT (id) DO NOTHING;

-- 4. SEED MENU CATEGORIES FOR TONY'S ARTISAN PIZZA
INSERT INTO menu_categories (id, restaurant_id, name, description, display_order, is_active)
VALUES
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'Artisan Woodfired Pizzas', 'Stone-baked at 450°C with organic Italian flour.', 1, true),
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 'Sides & Appetizers', 'Crispy sides, dips, and garlic breads.', 2, true)
ON CONFLICT (id) DO NOTHING;

-- 5. SEED MENU ITEMS
INSERT INTO menu_items (id, restaurant_id, category_id, name, description, base_price, image_url, is_vegetarian, is_vegan, is_gluten_free, is_available, calories)
VALUES
  ('50000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'Margherita Classica', 'San Marzano tomatoes, fresh buffalo mozzarella, aromatic fresh basil leaves, and EVOO drizzle.', 12.99, 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143', true, false, false, true, 850),
  ('50000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'Diavola Pepperoni Inferno', 'Spicy artisan pepperoni, crushed Calabrian chilies, bubbling mozzarella, and hot honey drizzle.', 15.49, 'https://images.unsplash.com/photo-1628840042765-356cda07504e', false, false, false, true, 1050),
  ('50000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'Truffle Wild Mushroom & Burrata', 'Roasted cremini mushrooms, white truffle oil, melted provolone, and creamy burrata crown.', 16.99, 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e', true, false, false, true, 920),
  ('50000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000002', 'Woodfired Garlic & Herb Cheesy Bread', 'Served with warm house San Marzano marinara dipping sauce.', 6.49, 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536', true, false, false, true, 480)
ON CONFLICT (id) DO NOTHING;

-- 6. SEED OPTION GROUPS (FOR MARGHERITA CLASSICA)
INSERT INTO menu_item_option_groups (id, menu_item_id, name, min_selections, max_selections, is_required)
VALUES
  ('60000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 'Size', 1, 1, true),
  ('60000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000001', 'Crust', 1, 1, true),
  ('60000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000001', 'Extra Toppings', 0, 4, false)
ON CONFLICT (id) DO NOTHING;

-- 7. SEED OPTION CHOICES
INSERT INTO menu_item_options (id, option_group_id, name, additional_price, is_default)
VALUES
  ('70000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000001', '10 inch Regular', 0.00, true),
  ('70000000-0000-0000-0000-000000000002', '60000000-0000-0000-0000-000000000001', '12 inch Medium', 3.50, false),
  ('70000000-0000-0000-0000-000000000003', '60000000-0000-0000-0000-000000000001', '14 inch Large', 6.00, false),
  ('70000000-0000-0000-0000-000000000004', '60000000-0000-0000-0000-000000000002', 'Traditional Neapolitan Thin', 0.00, true),
  ('70000000-0000-0000-0000-000000000005', '60000000-0000-0000-0000-000000000002', 'Cheese Burst Stuffed Crust', 2.50, false),
  ('70000000-0000-0000-0000-000000000006', '60000000-0000-0000-0000-000000000003', 'Truffle Mushroom Glaze', 1.75, false),
  ('70000000-0000-0000-0000-000000000007', '60000000-0000-0000-0000-000000000003', 'Spicy Jalapenos & Olives', 1.25, false),
  ('70000000-0000-0000-0000-000000000008', '60000000-0000-0000-0000-000000000003', 'Extra Mozzarella Melt', 2.00, false)
ON CONFLICT (id) DO NOTHING;

-- 8. SEED DELIVERY FLEET
INSERT INTO drivers (id, user_id, vehicle_type, vehicle_plate, current_status, current_location, rating, trips_completed)
VALUES
  ('80000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'EV Scooter', 'KA-01-EQ-1001', 'ONLINE', ST_SetSRID(ST_MakePoint(77.6010, 12.9770), 4326), 4.9, 142),
  ('80000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000004', 'Motorcycle', 'KA-04-MB-2024', 'ONLINE', ST_SetSRID(ST_MakePoint(77.6030, 12.9755), 4326), 4.7, 98)
ON CONFLICT (id) DO NOTHING;
