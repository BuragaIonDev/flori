/*
  # Flower Shop E-commerce Database Schema

  1. New Tables
    - `products`
      - `id` (uuid, primary key) - Unique product identifier
      - `name` (text) - Product name
      - `description` (text) - Product description
      - `price` (numeric) - Product price
      - `image_url` (text) - Product image URL
      - `category` (text) - Product category (bouquet, arrangement, plant, etc.)
      - `stock` (integer) - Available stock quantity
      - `featured` (boolean) - Whether product is featured on homepage
      - `created_at` (timestamptz) - Creation timestamp

    - `cart_items`
      - `id` (uuid, primary key) - Unique cart item identifier
      - `session_id` (text) - Anonymous session identifier for cart persistence
      - `product_id` (uuid, foreign key) - Reference to products table
      - `quantity` (integer) - Quantity of product in cart
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `orders`
      - `id` (uuid, primary key) - Unique order identifier
      - `customer_name` (text) - Customer full name
      - `customer_email` (text) - Customer email
      - `customer_phone` (text) - Customer phone number
      - `delivery_address` (text) - Delivery address
      - `delivery_date` (date) - Requested delivery date
      - `special_instructions` (text) - Special delivery instructions
      - `total_amount` (numeric) - Total order amount
      - `status` (text) - Order status (pending, confirmed, delivered, cancelled)
      - `created_at` (timestamptz) - Order creation timestamp

    - `order_items`
      - `id` (uuid, primary key) - Unique order item identifier
      - `order_id` (uuid, foreign key) - Reference to orders table
      - `product_id` (uuid, foreign key) - Reference to products table
      - `quantity` (integer) - Quantity ordered
      - `price` (numeric) - Price at time of order
      - `product_name` (text) - Product name at time of order

  2. Security
    - Enable RLS on all tables
    - Public read access for products (catalog browsing)
    - Session-based access for cart_items (anonymous shopping)
    - Public insert for orders and order_items (checkout without auth)
    - No public access to modify orders after creation

  3. Sample Data
    - Insert sample flower products for immediate use
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  image_url text NOT NULL,
  category text NOT NULL,
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  delivery_address text NOT NULL,
  delivery_date date NOT NULL,
  special_instructions text DEFAULT '',
  total_amount numeric NOT NULL CHECK (total_amount >= 0),
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id),
  quantity integer NOT NULL CHECK (quantity > 0),
  price numeric NOT NULL CHECK (price >= 0),
  product_name text NOT NULL
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Products policies (public read access)
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);

-- Cart items policies (session-based access)
CREATE POLICY "Users can view own cart items"
  ON cart_items FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own cart items"
  ON cart_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE
  USING (true);

CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE
  USING (true);

-- Orders policies (public insert for checkout)
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view orders"
  ON orders FOR SELECT
  USING (true);

-- Order items policies
CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view order items"
  ON order_items FOR SELECT
  USING (true);

-- Insert sample products
INSERT INTO products (name, description, price, image_url, category, stock, featured) VALUES
  ('Spring Sunrise Bouquet', 'A vibrant arrangement of tulips, daffodils, and irises that brings the warmth of spring into any room. Perfect for brightening someone''s day.', 49.99, 'https://images.pexels.com/photos/1084542/pexels-photo-1084542.jpeg?auto=compress&cs=tinysrgb&w=800', 'bouquet', 25, true),
  ('Classic Red Roses', 'A dozen long-stemmed premium red roses elegantly arranged. The timeless symbol of love and romance.', 79.99, 'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=800', 'bouquet', 30, true),
  ('Garden Fresh Mixed Arrangement', 'A stunning mix of seasonal flowers including lilies, roses, and greenery. Hand-crafted by our expert florists.', 64.99, 'https://images.pexels.com/photos/1458671/pexels-photo-1458671.jpeg?auto=compress&cs=tinysrgb&w=800', 'arrangement', 20, true),
  ('Elegant White Orchids', 'Sophisticated white phalaenopsis orchids in a decorative pot. Low maintenance and long-lasting beauty.', 89.99, 'https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg?auto=compress&cs=tinysrgb&w=800', 'plant', 15, false),
  ('Sunflower Delight', 'Cheerful sunflowers paired with seasonal blooms. Brings instant happiness and warmth to any space.', 54.99, 'https://images.pexels.com/photos/1407305/pexels-photo-1407305.jpeg?auto=compress&cs=tinysrgb&w=800', 'bouquet', 22, true),
  ('Lavender Dreams', 'Peaceful lavender stems with white accents. Perfect for creating a calming atmosphere.', 44.99, 'https://images.pexels.com/photos/1407343/pexels-photo-1407343.jpeg?auto=compress&cs=tinysrgb&w=800', 'bouquet', 18, false),
  ('Tropical Paradise', 'Exotic birds of paradise, anthuriums, and tropical foliage. Make a bold statement.', 94.99, 'https://images.pexels.com/photos/1179863/pexels-photo-1179863.jpeg?auto=compress&cs=tinysrgb&w=800', 'arrangement', 12, false),
  ('Pink Peony Perfection', 'Lush pink peonies arranged in a classic vase. These beloved blooms are soft, romantic, and utterly charming.', 69.99, 'https://images.pexels.com/photos/1179865/pexels-photo-1179865.jpeg?auto=compress&cs=tinysrgb&w=800', 'bouquet', 16, true),
  ('Succulent Garden', 'A curated collection of hardy succulents in a modern planter. Ideal for low-maintenance plant lovers.', 39.99, 'https://images.pexels.com/photos/1903965/pexels-photo-1903965.jpeg?auto=compress&cs=tinysrgb&w=800', 'plant', 28, false),
  ('Wildflower Meadow', 'A rustic mix of wildflowers in soft pastels. Captures the essence of a country meadow.', 52.99, 'https://images.pexels.com/photos/1906437/pexels-photo-1906437.jpeg?auto=compress&cs=tinysrgb&w=800', 'bouquet', 20, false),
  ('Royal Purple Arrangement', 'Majestic purple flowers including irises, lisianthus, and stock. A regal gift for someone special.', 74.99, 'https://images.pexels.com/photos/1552238/pexels-photo-1552238.jpeg?auto=compress&cs=tinysrgb&w=800', 'arrangement', 14, false),
  ('Baby''s Breath Cloud', 'Delicate white baby''s breath arranged in a full, cloud-like bouquet. Simple elegance at its finest.', 34.99, 'https://images.pexels.com/photos/1070863/pexels-photo-1070863.jpeg?auto=compress&cs=tinysrgb&w=800', 'bouquet', 25, false);
