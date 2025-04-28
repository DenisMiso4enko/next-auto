/*
  # Initial Auto Parts Store Schema

  1. New Tables
    - `users` - Store user accounts
    - `products` - Main products table
    - `categories` - Product categories
    - `brands` - Product brands
    - `product_categories` - Junction table for products and categories
    - `vehicle_compatibility` - Stores which vehicles are compatible with which products
    - `orders` - Customer orders
    - `order_items` - Line items within orders
    - `addresses` - Customer addresses for shipping
    - `product_reviews` - Customer product reviews
    - `cart_items` - Shopping cart items

  2. Security
    - Enable RLS on all tables
    - Set up policies for read and write access
*/

-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brands Table
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  parent_id UUID REFERENCES categories(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  sku TEXT UNIQUE NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  sale_price DECIMAL(10, 2),
  stock INT NOT NULL DEFAULT 0,
  brand_id UUID REFERENCES brands(id) NOT NULL,
  images JSONB DEFAULT '[]'::JSONB,
  specifications JSONB DEFAULT '[]'::JSONB,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Categories Junction Table
CREATE TABLE IF NOT EXISTS product_categories (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

-- Vehicle Makes Table
CREATE TABLE IF NOT EXISTS vehicle_makes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

-- Vehicle Models Table
CREATE TABLE IF NOT EXISTS vehicle_models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  make_id UUID REFERENCES vehicle_makes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  UNIQUE (make_id, slug)
);

-- Vehicle Years Table
CREATE TABLE IF NOT EXISTS vehicle_years (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_id UUID REFERENCES vehicle_models(id) ON DELETE CASCADE,
  year INT NOT NULL,
  UNIQUE (model_id, year)
);

-- Product Vehicle Compatibility Table
CREATE TABLE IF NOT EXISTS vehicle_compatibility (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  year_id UUID REFERENCES vehicle_years(id) ON DELETE CASCADE,
  trim TEXT,
  engine TEXT,
  notes TEXT,
  UNIQUE (product_id, year_id, trim, engine)
);

-- Addresses Table
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('billing', 'shipping')),
  is_default BOOLEAN DEFAULT FALSE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company TEXT,
  address1 TEXT NOT NULL,
  address2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  country TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  order_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'successful', 'failed', 'refunded')),
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) NOT NULL,
  shipping DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  shipping_address_id UUID REFERENCES addresses(id),
  billing_address_id UUID REFERENCES addresses(id),
  tracking_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cart Items Table
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

-- Product Reviews Table
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  content TEXT,
  helpful INT DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create view for product rating summary
CREATE OR REPLACE VIEW product_rating_summary AS
SELECT 
  product_id,
  COUNT(*) as review_count,
  ROUND(AVG(rating), 1) as average_rating
FROM product_reviews
GROUP BY product_id;

-- Security: Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_makes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_compatibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Security: Create RLS Policies

-- Users Policy - users can only read and update their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- Brands, Categories, Products Policy - Anyone can read
CREATE POLICY "Anyone can read brands" ON brands
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Anyone can read categories" ON categories
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Anyone can read products" ON products
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Anyone can read product categories" ON product_categories
  FOR SELECT
  TO PUBLIC
  USING (true);

-- Vehicle compatibility - Anyone can read
CREATE POLICY "Anyone can read vehicle makes" ON vehicle_makes
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Anyone can read vehicle models" ON vehicle_models
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Anyone can read vehicle years" ON vehicle_years
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Anyone can read vehicle compatibility" ON vehicle_compatibility
  FOR SELECT
  TO PUBLIC
  USING (true);

-- Addresses Policy - Users can only read and modify their own addresses
CREATE POLICY "Users can read own addresses" ON addresses
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own addresses" ON addresses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses" ON addresses
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses" ON addresses
  FOR DELETE
  USING (auth.uid() = user_id);

-- Orders Policy - Users can only read and create their own orders
CREATE POLICY "Users can read own orders" ON orders
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Order Items Policy - Users can only read their own order items
CREATE POLICY "Users can read own order items" ON order_items
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  ));

-- Cart Items Policy - Users can only read and modify their own cart items
CREATE POLICY "Users can read own cart items" ON cart_items
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items" ON cart_items
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items" ON cart_items
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items" ON cart_items
  FOR DELETE
  USING (auth.uid() = user_id);

-- Product Reviews - Anyone can read, users can only create and modify their own reviews
CREATE POLICY "Anyone can read product reviews" ON product_reviews
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Users can create own reviews" ON product_reviews
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON product_reviews
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" ON product_reviews
  FOR DELETE
  USING (auth.uid() = user_id);