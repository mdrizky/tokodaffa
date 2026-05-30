-- ============================================
-- SUPABASE DATABASE SETUP FOR TOKO MAS DAFFA
-- ============================================
-- Jalankan SQL ini di Supabase SQL Editor
-- ============================================

-- Drop tabel jika sudah ada (untuk fresh setup)
DROP TABLE IF EXISTS wa_inquiries CASCADE;
DROP TABLE IF EXISTS gold_prices CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS store_info CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS why_choose_us CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- 1. Buat tabel products
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  sku VARCHAR(50) UNIQUE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  category VARCHAR(50) NOT NULL,
  kadar VARCHAR(10) NOT NULL,
  material VARCHAR(50) DEFAULT 'emas',
  weight DECIMAL(10, 2) NOT NULL,
  price INTEGER NOT NULL,
  stock INTEGER DEFAULT 0,
  photo TEXT,
  images TEXT[],
  short_description TEXT,
  description TEXT,
  warranty_info TEXT,
  tags TEXT[],
  featured BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  is_bestseller BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Buat tabel testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  text TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  product_purchased VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Buat tabel why_choose_us
CREATE TABLE IF NOT EXISTS why_choose_us (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(100),
  statistic VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Buat tabel contact_messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Buat tabel reservations
CREATE TABLE IF NOT EXISTS reservations (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  product_id BIGINT,
  product_name VARCHAR(255),
  reservation_amount INTEGER,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  is_confirmed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Buat tabel blog_posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  author VARCHAR(255),
  category VARCHAR(100),
  tags TEXT[],
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Buat tabel gold_prices
CREATE TABLE IF NOT EXISTS gold_prices (
  id BIGSERIAL PRIMARY KEY,
  kadar VARCHAR(10) NOT NULL,
  buy_price INTEGER NOT NULL,
  sell_price INTEGER NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Buat tabel wa_inquiries
CREATE TABLE IF NOT EXISTS wa_inquiries (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  message TEXT,
  product_id BIGINT,
  product_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Buat tabel store_info
CREATE TABLE IF NOT EXISTS store_info (
  id BIGSERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Insert default store info
INSERT INTO store_info (key, value) VALUES
  ('store_name', 'Toko Mas Daffa'),
  ('store_address', 'Jalan Contoh No. 123, Jakarta'),
  ('store_phone', '+62 812-3456-7890'),
  ('store_email', 'info@tokodaffa.com'),
  ('store_hours', 'Senin - Sabtu: 09:00 - 21:00')
ON CONFLICT (key) DO NOTHING;

-- 11. Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE why_choose_us ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE gold_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE wa_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_info ENABLE ROW LEVEL SECURITY;

-- 12. Create policies untuk public read access
CREATE POLICY "Public read access for products" ON products
  FOR SELECT TO public USING (true);

CREATE POLICY "Public read access for testimonials" ON testimonials
  FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Public read access for why_choose_us" ON why_choose_us
  FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Public read access for gold_prices" ON gold_prices
  FOR SELECT TO public USING (true);

CREATE POLICY "Public read access for blog_posts" ON blog_posts
  FOR SELECT TO public USING (is_published = true);

CREATE POLICY "Public read access for store_info" ON store_info
  FOR SELECT TO public USING (true);

-- 13. Create policies untuk admin write access
CREATE POLICY "Admin write access for products" ON products
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Admin write access for testimonials" ON testimonials
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Admin write access for why_choose_us" ON why_choose_us
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Admin write access for contact_messages" ON contact_messages
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Admin write access for reservations" ON reservations
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Admin write access for blog_posts" ON blog_posts
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Admin write access for gold_prices" ON gold_prices
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Admin write access for wa_inquiries" ON wa_inquiries
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Admin write access for store_info" ON store_info
  FOR ALL TO anon USING (true) WITH CHECK (true);

-- 14. Create indexes untuk performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_kadar ON products(kadar);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_testimonials_is_active ON testimonials(is_active);
CREATE INDEX IF NOT EXISTS idx_why_choose_us_is_active ON why_choose_us(is_active);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_published ON blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_gold_prices_date ON gold_prices(date);

-- 15. Create function untuk updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 16. Create triggers untuk updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SETUP SELESAI
-- ============================================
