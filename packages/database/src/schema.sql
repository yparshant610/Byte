-- =========================================================================
-- Food Bytes Ecosystem Database Schema
-- Supabase / PostgreSQL + PostGIS Geospatial Engine
-- =========================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('CONSUMER', 'DRIVER', 'RESTAURANT_OWNER', 'ADMIN');
CREATE TYPE restaurant_status AS ENUM ('PENDING_APPROVAL', 'ACTIVE', 'INACTIVE', 'SUSPENDED');
CREATE TYPE order_status AS ENUM ('PENDING', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED');
CREATE TYPE payment_status AS ENUM ('PENDING', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED');
CREATE TYPE driver_status AS ENUM ('OFFLINE', 'ONLINE', 'BUSY', 'SUSPENDED');

-- 3. USERS & IDENTITY
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150),
    phone VARCHAR(30),
    role user_role DEFAULT 'CONSUMER' NOT NULL,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    current_location GEOGRAPHY(Point, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_location ON users USING GIST(current_location);

-- 4. USER ADDRESSES
CREATE TABLE IF NOT EXISTS user_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(50) DEFAULT 'Home', -- Home, Work, Other
    street_address TEXT NOT NULL,
    apartment_unit VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20),
    location GEOGRAPHY(Point, 4326) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON user_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_addresses_location ON user_addresses USING GIST(location);

-- 5. RESTAURANTS
CREATE TABLE IF NOT EXISTS restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cuisine_types TEXT[] DEFAULT '{}' NOT NULL,
    banner_url TEXT,
    logo_url TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    street_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    location GEOGRAPHY(Point, 4326) NOT NULL,
    operational_status restaurant_status DEFAULT 'PENDING_APPROVAL' NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    review_count INTEGER DEFAULT 0,
    average_prep_time_minutes INTEGER DEFAULT 25,
    minimum_order_amount NUMERIC(10, 2) DEFAULT 0.00,
    delivery_fee_base NUMERIC(10, 2) DEFAULT 2.99,
    commission_rate NUMERIC(4, 2) DEFAULT 0.20, -- Default 20% platform commission
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_restaurants_status ON restaurants(operational_status);
CREATE INDEX IF NOT EXISTS idx_restaurants_location ON restaurants USING GIST(location);

-- 6. MENU HIERARCHY
CREATE TABLE IF NOT EXISTS menu_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_menu_categories_rest ON menu_categories(restaurant_id);

CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_price NUMERIC(10, 2) NOT NULL,
    image_url TEXT,
    is_vegetarian BOOLEAN DEFAULT FALSE,
    is_vegan BOOLEAN DEFAULT FALSE,
    is_gluten_free BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    calories INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_menu_items_rest ON menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);

CREATE TABLE IF NOT EXISTS menu_item_option_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- e.g. "Size", "Crust", "Toppings"
    min_selections INTEGER DEFAULT 0,
    max_selections INTEGER DEFAULT 1,
    is_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS menu_item_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    option_group_id UUID NOT NULL REFERENCES menu_item_option_groups(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- e.g. "12 inch Medium", "Gluten-Free Crust", "Extra Cheese"
    additional_price NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 7. WISHLIST
CREATE TABLE IF NOT EXISTS wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_wishlists_user ON wishlists(user_id);

-- 8. DRIVERS
CREATE TABLE IF NOT EXISTS drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vehicle_type VARCHAR(50) DEFAULT 'MOTORCYCLE',
    vehicle_plate VARCHAR(50),
    current_status driver_status DEFAULT 'OFFLINE' NOT NULL,
    current_location GEOGRAPHY(Point, 4326),
    rating NUMERIC(3, 2) DEFAULT 5.00,
    trips_completed INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers(current_status);
CREATE INDEX IF NOT EXISTS idx_drivers_location ON drivers USING GIST(current_location);

-- 9. ORDERS & PAYMENTS
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE RESTRICT,
    driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
    status order_status DEFAULT 'PENDING' NOT NULL,
    delivery_address_id UUID REFERENCES user_addresses(id),
    destination_location GEOGRAPHY(Point, 4326) NOT NULL,
    delivery_notes TEXT,
    subtotal NUMERIC(10, 2) NOT NULL,
    tax_amount NUMERIC(10, 2) DEFAULT 0.00,
    delivery_fee NUMERIC(10, 2) DEFAULT 0.00,
    driver_tip NUMERIC(10, 2) DEFAULT 0.00,
    platform_commission_amount NUMERIC(10, 2) DEFAULT 0.00,
    restaurant_payout_amount NUMERIC(10, 2) DEFAULT 0.00,
    driver_payout_amount NUMERIC(10, 2) DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_orders_driver ON orders(driver_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES menu_items(id),
    item_name VARCHAR(255) NOT NULL,
    quantity INTEGER DEFAULT 1 NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS order_item_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
    group_name VARCHAR(100) NOT NULL,
    choice_name VARCHAR(100) NOT NULL,
    additional_price NUMERIC(10, 2) DEFAULT 0.00
);

CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    razorpay_order_id VARCHAR(100) NOT NULL,
    razorpay_payment_id VARCHAR(100),
    razorpay_signature VARCHAR(255),
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    vendor_split_ratio NUMERIC(3, 2) DEFAULT 0.80, -- 80% to vendor + driver
    admin_commission_ratio NUMERIC(3, 2) DEFAULT 0.20, -- 20% to Byte Add
    status payment_status DEFAULT 'PENDING' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 10. REVIEWS & RATINGS
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id),
    driver_id UUID REFERENCES drivers(id),
    food_rating INTEGER CHECK (food_rating >= 1 AND food_rating <= 5),
    driver_rating INTEGER CHECK (driver_rating >= 1 AND driver_rating <= 5),
    food_review TEXT,
    driver_review TEXT,
    compliment_tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 11. SPATIAL DISCOVERY STORED PROCEDURE (UNDER 10 KM)
CREATE OR REPLACE FUNCTION find_restaurants_within_radius(
    user_lat DOUBLE PRECISION,
    user_lng DOUBLE PRECISION,
    radius_km DOUBLE PRECISION DEFAULT 10.0
)
RETURNS TABLE (
    id UUID,
    name VARCHAR,
    cuisine_types TEXT[],
    rating NUMERIC,
    prep_time INTEGER,
    banner_url TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    distance_km DOUBLE PRECISION
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        r.id,
        r.name,
        r.cuisine_types,
        r.rating,
        r.average_prep_time_minutes AS prep_time,
        r.banner_url,
        ST_Y(r.location::geometry) AS lat,
        ST_X(r.location::geometry) AS lng,
        (ST_Distance(r.location, ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)) / 1000.0) AS distance_km
    FROM restaurants r
    WHERE
        r.operational_status = 'ACTIVE'
        AND ST_DWithin(r.location, ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326), radius_km * 1000.0)
    ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql STABLE;
