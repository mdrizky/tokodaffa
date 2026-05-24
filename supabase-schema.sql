-- ================================================================
-- TOKODAFFA GOLD — FULL DATABASE SCHEMA (v2.0)
-- ================================================================
-- INSTRUKSI:
-- 1. Buka Supabase Dashboard → SQL Editor
-- 2. Copy semua isi file ini → paste → Run
-- 3. Pastikan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY
--    sudah di-set di environment Vercel
-- ================================================================

-- Drop existing (HATI-HATI! Comment kalau sudah ada data production)
-- ===== CLEAN SLATE (Opsional, uncomment kalau perlu reset total) =====
-- DROP TABLE IF EXISTS customers CASCADE;
-- DROP TABLE IF EXISTS addresses CASCADE;
-- DROP TABLE IF EXISTS activity_logs CASCADE;
-- DROP TABLE IF EXISTS contact_messages CASCADE;
-- DROP TABLE IF EXISTS reservations CASCADE;
-- DROP TABLE IF EXISTS reviews CASCADE;
-- DROP TABLE IF EXISTS wishlist CASCADE;
-- DROP TABLE IF EXISTS newsletters CASCADE;
-- DROP TABLE IF EXISTS partners CASCADE;
-- DROP TABLE IF EXISTS services CASCADE;
-- DROP TABLE IF EXISTS testimonials CASCADE;
-- DROP TABLE IF EXISTS faqs CASCADE;
-- DROP TABLE IF EXISTS blog_posts CASCADE;
-- DROP TABLE IF EXISTS promos CASCADE;
-- DROP TABLE IF EXISTS price_history CASCADE;
-- DROP TABLE IF EXISTS hero_slides CASCADE;
-- DROP TABLE IF EXISTS site_settings CASCADE;
-- DROP TABLE IF EXISTS products CASCADE;
-- DROP TABLE IF EXISTS gold_prices CASCADE;
-- DROP TABLE IF EXISTS store_settings CASCADE;
-- DROP TABLE IF EXISTS about_content CASCADE;
-- DROP TABLE IF EXISTS admin_users CASCADE;

-- ================================================================
-- 1. GOLD PRICES (Harga Emas Harian)
-- ================================================================
CREATE TABLE IF NOT EXISTS gold_prices (
  id SERIAL PRIMARY KEY,
  kadar VARCHAR(20) UNIQUE NOT NULL,
  price_per_gram BIGINT NOT NULL,
  buyback_price BIGINT,
  trend VARCHAR(10) DEFAULT 'stable', -- 'up', 'down', 'stable'
  trend_value DECIMAL(10,2) DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ================================================================
-- 2. PRICE HISTORY (Riwayat Harga untuk Grafik)
-- ================================================================
CREATE TABLE IF NOT EXISTS price_history (
  id SERIAL PRIMARY KEY,
  kadar VARCHAR(20) NOT NULL,
  price_per_gram BIGINT NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_price_history_kadar_date 
  ON price_history(kadar, recorded_at DESC);

-- ================================================================
-- 3. STORE SETTINGS (Pengaturan Toko)
-- ================================================================
CREATE TABLE IF NOT EXISTS store_settings (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL DEFAULT 'TokoDaffa Gold',
  tagline VARCHAR(255),
  description TEXT,
  logo_url TEXT,
  logo_highlight VARCHAR(50) DEFAULT 'Daffa',
  hero_title VARCHAR(255),
  hero_subtitle TEXT,
  hero_image TEXT,
  address TEXT,
  maps_embed TEXT,
  phone VARCHAR(50),
  whatsapp VARCHAR(50) NOT NULL DEFAULT '6281365555411',
  whatsapp_secondary VARCHAR(50),
  email VARCHAR(100),
  operating_hours JSONB DEFAULT '{"weekday":"09:00 - 18:00 WIB","saturday":"09:00 - 17:00 WIB","sunday":"Tutup"}'::jsonb,
  social_media JSONB DEFAULT '{}'::jsonb,
  certifications JSONB DEFAULT '[]'::jsonb,
  trust_badges JSONB DEFAULT '[]'::jsonb,
  stats JSONB DEFAULT '{"clients":"10K+","designs":"500+","years":"20","authentic":"100%"}'::jsonb,
  meta_keywords TEXT,
  meta_description TEXT,
  ga_tracking_id VARCHAR(50),
  fb_pixel_id VARCHAR(50),
  since INTEGER DEFAULT 2005,
  show_reservation BOOLEAN DEFAULT TRUE,
  show_buyback BOOLEAN DEFAULT TRUE,
  show_blog BOOLEAN DEFAULT TRUE,
  show_news BOOLEAN DEFAULT TRUE,
  banner_announcement TEXT,
  banner_active BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ================================================================
-- 4. ABOUT CONTENT
-- ================================================================
CREATE TABLE IF NOT EXISTS about_content (
  id SERIAL PRIMARY KEY,
  history TEXT NOT NULL,
  extra TEXT,
  vision TEXT NOT NULL,
  mission TEXT,
  strengths TEXT[] DEFAULT ARRAY[]::TEXT[],
  team JSONB DEFAULT '[]'::jsonb,
  milestones JSONB DEFAULT '[]'::jsonb,
  awards JSONB DEFAULT '[]'::jsonb,
  founder_name VARCHAR(255),
  founder_quote TEXT,
  founder_photo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ================================================================
-- 5. PRODUCTS (Katalog Produk - LENGKAP)
-- ================================================================
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  sku VARCHAR(50) UNIQUE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  kadar VARCHAR(20) NOT NULL,
  weight DECIMAL(10,2) NOT NULL,
  price BIGINT NOT NULL,
  ongkos BIGINT DEFAULT 0,
  buyback_price BIGINT,
  stock INTEGER NOT NULL DEFAULT 0,
  reserved_stock INTEGER DEFAULT 0,
  photo TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  video_url TEXT,
  description TEXT,
  short_description TEXT,
  category VARCHAR(50) NOT NULL,
  material VARCHAR(50) NOT NULL DEFAULT 'emas',
  brand VARCHAR(100),
  origin VARCHAR(100),
  craftsman VARCHAR(100),
  warranty_info TEXT,
  certificate_url TEXT,
  size_options JSONB DEFAULT '[]'::jsonb,
  color_options JSONB DEFAULT '[]'::jsonb,
  specifications JSONB DEFAULT '{}'::jsonb,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  featured BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  is_bestseller BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  views_count INTEGER DEFAULT 0,
  inquiries_count INTEGER DEFAULT 0,
  meta_title VARCHAR(255),
  meta_description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_material ON products(material);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- ================================================================
-- 6. CATEGORIES (Kategori Produk - bisa dikelola admin)
-- ================================================================
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  icon VARCHAR(50),
  image TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- 7. PARTNERS (Partner / Kerjasama)
-- ================================================================
CREATE TABLE IF NOT EXISTS partners (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo TEXT NOT NULL,
  website TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- 8. SERVICES (Layanan Toko)
-- ================================================================
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  icon VARCHAR(50),
  short_desc TEXT,
  description TEXT,
  features TEXT[] DEFAULT ARRAY[]::TEXT[],
  image TEXT,
  price_range VARCHAR(100),
  duration VARCHAR(100),
  wa_template TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- 9. TESTIMONIALS (Testimoni Pelanggan)
-- ================================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100),
  photo TEXT,
  text TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  product_purchased VARCHAR(255),
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- 10. FAQS (Frequently Asked Questions)
-- ================================================================
CREATE TABLE IF NOT EXISTS faqs (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'umum',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- 11. BLOG POSTS / NEWS (Artikel & Berita)
-- ================================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  category VARCHAR(50) DEFAULT 'berita',
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  author VARCHAR(100) DEFAULT 'Admin TokoDaffa',
  is_published BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  meta_title VARCHAR(255),
  meta_description TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, published_at DESC);

-- ================================================================
-- 12. PROMOS (Promosi & Diskon)
-- ================================================================
CREATE TABLE IF NOT EXISTS promos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  banner_image TEXT,
  promo_type VARCHAR(50) DEFAULT 'percent', -- 'percent', 'fixed', 'event'
  discount_value DECIMAL(10,2) DEFAULT 0,
  wa_template TEXT,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- 13. HERO SLIDES (Slide Banner Homepage)
-- ================================================================
CREATE TABLE IF NOT EXISTS hero_slides (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  image TEXT,
  cta_text VARCHAR(100),
  cta_link VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- 14. CUSTOMERS (User Management)
-- ================================================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  avatar_url TEXT,
  auth_user_id UUID REFERENCES auth.users(id),
  loyalty_points INTEGER DEFAULT 0,
  membership_tier VARCHAR(20) DEFAULT 'bronze',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- 15. ADDRESSES (Customer Addresses)
-- ================================================================
CREATE TABLE IF NOT EXISTS addresses (
  id SERIAL PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  label VARCHAR(50) NOT NULL,
  recipient_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city VARCHAR(100) NOT NULL,
  province VARCHAR(100) NOT NULL,
  postal_code VARCHAR(10) NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- 16. RESERVATIONS (Booking/Reservasi Produk → semua flow ke WA)
-- ================================================================
CREATE TABLE IF NOT EXISTS reservations (
  id SERIAL PRIMARY KEY,
  reservation_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_email VARCHAR(255),
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(255),
  product_photo TEXT,
  kadar VARCHAR(20),
  weight DECIMAL(10,2),
  estimated_price BIGINT,
  visit_date DATE,
  visit_time VARCHAR(20),
  notes TEXT,
  reservation_type VARCHAR(50) DEFAULT 'view', -- 'view', 'buy', 'custom', 'service'
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
  admin_notes TEXT,
  whatsapp_sent BOOLEAN DEFAULT FALSE,
  ip_address VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_created ON reservations(created_at DESC);

-- ================================================================
-- 17. CONTACT MESSAGES (Form Hubungi Kami)
-- ================================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'new', -- 'new', 'read', 'replied', 'archived'
  admin_reply TEXT,
  replied_at TIMESTAMP WITH TIME ZONE,
  ip_address VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);

-- ================================================================
-- 18. REVIEWS (Product Reviews)
-- ================================================================
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT NOT NULL,
  images JSONB DEFAULT '[]',
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(status) WHERE status = 'approved';

-- ================================================================
-- 19. WISHLIST (Customer Wishlist)
-- ================================================================
CREATE TABLE IF NOT EXISTS wishlist (
  id SERIAL PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(customer_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlist_customer ON wishlist(customer_id);

-- ================================================================
-- 20. NEWSLETTERS (Subscriber Email)
-- ================================================================
CREATE TABLE IF NOT EXISTS newsletters (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  source VARCHAR(50) DEFAULT 'footer',
  is_active BOOLEAN DEFAULT TRUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- ================================================================
-- 21. ACTIVITY LOGS (Audit Trail Admin)
-- ================================================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id SERIAL PRIMARY KEY,
  admin_username VARCHAR(100) DEFAULT 'admin',
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id VARCHAR(50),
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at DESC);

-- ================================================================
-- 22. ADMIN USERS (Multi Admin)
-- ================================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE,
  pin VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  email VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin', -- 'super_admin', 'admin', 'staff'
  permissions JSONB DEFAULT '{}'::jsonb,
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- 23. PAGE VIEWS (Analytics sederhana)
-- ================================================================
CREATE TABLE IF NOT EXISTS page_views (
  id SERIAL PRIMARY KEY,
  page_url VARCHAR(500),
  page_title VARCHAR(255),
  referrer VARCHAR(500),
  ip_address VARCHAR(50),
  user_agent TEXT,
  session_id VARCHAR(100),
  device_type VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_page_views_created ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_page ON page_views(page_url);

-- ================================================================
-- 24. WA INQUIRIES (Track click WhatsApp)
-- ================================================================
CREATE TABLE IF NOT EXISTS wa_inquiries (
  id SERIAL PRIMARY KEY,
  source VARCHAR(50), -- 'product', 'calculator', 'service', 'contact', 'reservation'
  reference_id INTEGER,
  reference_name VARCHAR(255),
  message_template TEXT,
  ip_address VARCHAR(50),
  device_type VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wa_inquiries_source ON wa_inquiries(source);

-- ================================================================
-- ROW LEVEL SECURITY POLICIES
-- ================================================================
ALTER TABLE gold_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE promos ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE wa_inquiries ENABLE ROW LEVEL SECURITY;

-- Public read access untuk frontend (drop dulu kalau ada)
DROP POLICY IF EXISTS "public_read_gold_prices" ON gold_prices;
DROP POLICY IF EXISTS "public_read_price_history" ON price_history;
DROP POLICY IF EXISTS "public_read_store_settings" ON store_settings;
DROP POLICY IF EXISTS "public_read_about" ON about_content;
DROP POLICY IF EXISTS "public_read_products" ON products;
DROP POLICY IF EXISTS "public_read_categories" ON categories;
DROP POLICY IF EXISTS "public_read_partners" ON partners;
DROP POLICY IF EXISTS "public_read_services" ON services;
DROP POLICY IF EXISTS "public_read_testimonials" ON testimonials;
DROP POLICY IF EXISTS "public_read_faqs" ON faqs;
DROP POLICY IF EXISTS "public_read_blog" ON blog_posts;
DROP POLICY IF EXISTS "public_read_promos" ON promos;
DROP POLICY IF EXISTS "public_read_hero" ON hero_slides;
DROP POLICY IF EXISTS "public_read_reviews" ON reviews;
DROP POLICY IF EXISTS "public_read_admin_pin" ON admin_users;
DROP POLICY IF EXISTS "public_read_customers" ON customers;
DROP POLICY IF EXISTS "public_read_addresses" ON addresses;

CREATE POLICY "public_read_gold_prices" ON gold_prices FOR SELECT USING (true);
CREATE POLICY "public_read_price_history" ON price_history FOR SELECT USING (true);
CREATE POLICY "public_read_store_settings" ON store_settings FOR SELECT USING (true);
CREATE POLICY "public_read_about" ON about_content FOR SELECT USING (true);
CREATE POLICY "public_read_products" ON products FOR SELECT USING (is_active = TRUE);
CREATE POLICY "public_read_categories" ON categories FOR SELECT USING (is_active = TRUE);
CREATE POLICY "public_read_partners" ON partners FOR SELECT USING (is_active = TRUE);
CREATE POLICY "public_read_services" ON services FOR SELECT USING (is_active = TRUE);
CREATE POLICY "public_read_testimonials" ON testimonials FOR SELECT USING (is_active = TRUE);
CREATE POLICY "public_read_faqs" ON faqs FOR SELECT USING (is_active = TRUE);
CREATE POLICY "public_read_blog" ON blog_posts FOR SELECT USING (is_published = TRUE);
CREATE POLICY "public_read_promos" ON promos FOR SELECT USING (is_active = TRUE);
CREATE POLICY "public_read_hero" ON hero_slides FOR SELECT USING (is_active = TRUE);
CREATE POLICY "public_read_reviews" ON reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "public_read_admin_pin" ON admin_users FOR SELECT USING (true);
CREATE POLICY "public_read_customers" ON customers FOR SELECT USING (auth.uid() = id);
CREATE POLICY "public_read_addresses" ON addresses FOR SELECT USING (auth.uid() = customer_id);

-- Public insert untuk form (reservation, contact, review, newsletter, wishlist)
DROP POLICY IF EXISTS "public_insert_reservation" ON reservations;
DROP POLICY IF EXISTS "public_insert_contact" ON contact_messages;
DROP POLICY IF EXISTS "public_insert_review" ON reviews;
DROP POLICY IF EXISTS "public_insert_wishlist" ON wishlist;
DROP POLICY IF EXISTS "public_delete_wishlist" ON wishlist;
DROP POLICY IF EXISTS "public_read_wishlist" ON wishlist;
DROP POLICY IF EXISTS "public_insert_newsletter" ON newsletters;
DROP POLICY IF EXISTS "public_insert_pageview" ON page_views;
DROP POLICY IF EXISTS "public_insert_wa_inquiry" ON wa_inquiries;
DROP POLICY IF EXISTS "public_insert_customer" ON customers;
DROP POLICY IF EXISTS "public_insert_address" ON addresses;

CREATE POLICY "public_insert_reservation" ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_contact" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_review" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_wishlist" ON wishlist FOR INSERT WITH CHECK (true);
CREATE POLICY "public_read_wishlist" ON wishlist FOR SELECT USING (true);
CREATE POLICY "public_delete_wishlist" ON wishlist FOR DELETE USING (true);
CREATE POLICY "public_insert_newsletter" ON newsletters FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_pageview" ON page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_wa_inquiry" ON wa_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_customer" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_address" ON addresses FOR INSERT WITH CHECK (true);

-- Public update views_count
DROP POLICY IF EXISTS "public_update_product_views" ON products;
CREATE POLICY "public_update_product_views" ON products FOR UPDATE 
  USING (true) WITH CHECK (true);

-- Public update for customers and addresses
DROP POLICY IF EXISTS "public_update_customer" ON customers;
CREATE POLICY "public_update_customer" ON customers FOR UPDATE
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "public_update_address" ON addresses;
CREATE POLICY "public_update_address" ON addresses FOR UPDATE
  USING (auth.uid() = customer_id) WITH CHECK (auth.uid() = customer_id);

-- ================================================================
-- TRIGGER: Auto-update updated_at
-- ================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at_products ON products;
CREATE TRIGGER set_updated_at_products BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_blog ON blog_posts;
CREATE TRIGGER set_updated_at_blog BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_store ON store_settings;
CREATE TRIGGER set_updated_at_store BEFORE UPDATE ON store_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_about ON about_content;
CREATE TRIGGER set_updated_at_about BEFORE UPDATE ON about_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_reservations ON reservations;
CREATE TRIGGER set_updated_at_reservations BEFORE UPDATE ON reservations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_reviews ON reviews;
CREATE TRIGGER set_updated_at_reviews BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_customers ON customers;
CREATE TRIGGER set_updated_at_customers BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ================================================================
-- SEED DATA
-- ================================================================

-- Gold Prices
INSERT INTO gold_prices (kadar, price_per_gram, buyback_price, trend) VALUES
('24K', 1100000, 1045000, 'up'),
('22K', 1008000, 957000, 'up'),
('18K', 825000, 783000, 'stable'),
('16K', 733000, 696000, 'stable'),
('Perak', 15000, 13500, 'up')
ON CONFLICT (kadar) DO NOTHING;

-- Store Settings (1 row utama)
INSERT INTO store_settings (
  name, tagline, description, address, phone, whatsapp, email,
  operating_hours, social_media, certifications, since,
  hero_title, hero_subtitle, banner_announcement, banner_active
) VALUES (
  'TokoDaffa Gold',
  'Jual Beli Emas & Perak Terpercaya',
  'Kedai emas terpercaya dengan koleksi perhiasan emas berkualitas tinggi. Harga transparan, garansi buyback 100%, sertifikat keaslian. Datang langsung ke toko kami untuk pengalaman belanja emas terbaik.',
  'F2QW+QVC, Jl. Lintas Petapahan - Bangkinang, Suka Mulya, Kec. Bangkinang Kota, Kabupaten Kampar, Riau 28464',
  '+6281365555411',
  '6281365555411',
  'info@tokodaffa.com',
  '{"weekday":"09:00 - 18:00 WIB","saturday":"09:00 - 17:00 WIB","sunday":"Tutup"}'::jsonb,
  '{"instagram":"https://instagram.com/tokodaffagold","facebook":"https://facebook.com/tokodaffagold","tiktok":"https://tiktok.com/@tokodaffagold"}'::jsonb,
  '["Sertifikat Keaslian Resmi","Garansi Buyback 100% Sesuai Pasar","Timbangan Digital Tersertifikasi","Harga Transparan & Jujur"]'::jsonb,
  2005,
  'Jual Beli Emas & Perak Terpercaya',
  'Koleksi perhiasan premium, logam mulia, dan layanan custom perhiasan impian Anda. Datang ke toko kami untuk pengalaman terbaik. Harga jujur, transparan, dan bergaransi.',
  '🎉 Promo Spesial! Buyback 100% sesuai harga pasar — Datang langsung ke toko atau chat WA kami.',
  TRUE
) ON CONFLICT DO NOTHING;

-- About Content
INSERT INTO about_content (history, extra, vision, mission, strengths, founder_name, founder_quote) VALUES (
  'Didirikan pada tahun 2005, TokoDaffa Gold telah menjadi destinasi terpercaya bagi para pecinta dan investor emas di Kabupaten Kampar dan sekitarnya. Selama lebih dari dua dekade, kami konsisten mengedepankan kejujuran, transparansi harga, dan kepuasan pelanggan dalam setiap transaksi.',
  'Dengan tim ahli yang berpengalaman dan tukang emas yang teruji, kami melayani ribuan pelanggan dengan beragam kebutuhan — mulai dari investasi emas batangan, perhiasan harian, hingga custom design untuk momen spesial seperti pernikahan dan hadiah.',
  'Menjadi standar emas (gold standard) dalam industri perhiasan ritel di Indonesia yang mengedepankan kepercayaan, kualitas, dan inovasi pelayanan.',
  'Memberikan pengalaman jual beli emas yang transparan, jujur, dan menyenangkan dengan harga real-time, garansi buyback 100%, serta layanan custom design yang berkualitas tinggi.',
  ARRAY['Sertifikat Keaslian Resmi pada Setiap Produk','Garansi Buyback 100% Sesuai Harga Pasar','Timbangan Digital Tersertifikasi Metrologi','Harga Real-Time & Transparan','Tukang Ahli Bersertifikat','Layanan Custom Design Sesuai Permintaan','Lebih dari 20 Tahun Pengalaman','Dipercaya Ribuan Pelanggan'],
  'Bapak Daffa',
  'Kepercayaan pelanggan adalah aset terbesar kami. Setiap gram emas yang kami jual adalah amanah.'
) ON CONFLICT DO NOTHING;

-- Categories
INSERT INTO categories (name, slug, icon, description, display_order) VALUES
('Cincin', 'cincin', '💍', 'Koleksi cincin emas & perak untuk setiap momen', 1),
('Gelang', 'gelang', '⭕', 'Gelang elegan untuk pria dan wanita', 2),
('Kalung', 'kalung', '📿', 'Kalung emas premium dengan beragam desain', 3),
('Anting', 'anting', '✨', 'Anting cantik untuk melengkapi gaya', 4),
('Liontin', 'liontin', '💎', 'Liontin eksklusif dengan ukiran spesial', 5),
('Batangan', 'batangan', '💰', 'Logam mulia untuk investasi jangka panjang', 6),
('Set Perhiasan', 'set', '🎁', 'Paket perhiasan lengkap untuk hadiah', 7)
ON CONFLICT (slug) DO NOTHING;

-- Products
INSERT INTO products (sku, name, slug, kadar, weight, price, ongkos, stock, photo, description, short_description, category, material, featured, is_bestseller, is_new, tags) VALUES
('TKD-CRC-24K-001', 'Cincin Emas Polos Classic', 'cincin-emas-polos-classic', '24K', 5.0, 5500000, 150000, 3, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800', 'Cincin emas murni 24 karat dengan desain classic elegan. Cocok untuk investasi dan koleksi pribadi. Finishing halus dengan kilau premium. Diproduksi oleh tukang ahli bersertifikat.', 'Cincin emas 24K classic untuk investasi', 'cincin', 'emas', true, true, false, ARRAY['classic','investasi','elegant']),
('TKD-GLG-22K-001', 'Gelang Emas Rantai Italia', 'gelang-emas-rantai-italia', '22K', 10.5, 10584000, 250000, 2, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800', 'Gelang emas 22 karat dengan model rantai Italia yang elegan. Desain timeless yang cocok untuk pria dan wanita. Kunci pengaman lobster ganda untuk keamanan maksimal.', 'Gelang rantai Italia premium', 'gelang', 'emas', true, true, false, ARRAY['italia','premium','unisex']),
('TKD-KLG-18K-001', 'Kalung Emas Liontin Hati', 'kalung-emas-liontin-hati', '18K', 8.0, 6600000, 200000, 5, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800', 'Kalung emas 18 karat dengan liontin berbentuk hati. Hadiah sempurna untuk orang tersayang. Bisa custom ukiran nama sesuai permintaan.', 'Kalung liontin hati 18K romantis', 'kalung', 'emas', true, false, true, ARRAY['romantis','hadiah','liontin']),
('TKD-ANT-PRK-001', 'Anting Perak Permata Zirconia', 'anting-perak-permata-zirconia', '925', 3.2, 450000, 50000, 8, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800', 'Anting perak sterling 925 dengan aksen permata zirconia. Desain minimalis dan modern, anti karat dengan finishing rhodium plating.', 'Anting perak minimalis modern', 'anting', 'perak', false, false, true, ARRAY['minimalis','modern','perak']),
('TKD-CRC-PRK-001', 'Cincin Perak Pria Ukir', 'cincin-perak-pria-ukir', '925', 7.5, 650000, 100000, 1, 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800', 'Cincin perak tebal khusus pria dengan ukiran premium. Elegan dan maskulin, cocok untuk pemakaian harian maupun acara formal.', 'Cincin perak pria ukir premium', 'cincin', 'perak', true, false, false, ARRAY['pria','ukir','perak']),
('TKD-GLG-24K-001', 'Gelang Emas Bangle Polos', 'gelang-emas-bangle-polos', '24K', 15.0, 16500000, 350000, 4, 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800', 'Gelang bangle emas murni 24 karat. Investasi emas dalam bentuk perhiasan mewah. Kilau natural emas murni tanpa campuran.', 'Bangle emas 24K untuk investasi', 'gelang', 'emas', true, true, false, ARRAY['investasi','bangle','luxury']),
('TKD-KLG-22K-001', 'Kalung Emas Rantai Figaro', 'kalung-emas-rantai-figaro', '22K', 12.0, 12096000, 280000, 3, 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800', 'Kalung emas 22 karat dengan model rantai Figaro yang kuat dan elegan. Cocok untuk pria dengan style maskulin atau wanita yang menyukai bold.', 'Kalung Figaro kuat & elegan', 'kalung', 'emas', false, false, false, ARRAY['figaro','rantai','bold']),
('TKD-CRC-18K-001', 'Cincin Emas Wedding Ring', 'cincin-emas-wedding-ring', '18K', 4.0, 3300000, 200000, 10, 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800', 'Cincin emas 18 karat spesial untuk pernikahan. Tersedia custom ukiran nama dan tanggal pernikahan. Box eksklusif gratis.', 'Cincin nikah custom ukir', 'cincin', 'emas', true, true, false, ARRAY['wedding','nikah','custom']),
('TKD-KLG-PRK-001', 'Kalung Perak Liontin Salib', 'kalung-perak-liontin-salib', '925', 5.5, 550000, 80000, 6, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800', 'Kalung perak 925 dengan liontin salib minimalis. Cocok dipakai sehari-hari, anti tarnish.', 'Kalung salib perak minimalis', 'kalung', 'perak', false, false, false, ARRAY['salib','religi','perak']),
('TKD-LNT-22K-001', 'Liontin Emas Kaligrafi', 'liontin-emas-kaligrafi', '22K', 5.5, 5544000, 180000, 4, 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800', 'Liontin emas 22 karat dengan ukiran kaligrafi Arab. Bernilai seni dan spiritual tinggi. Bisa custom kata sesuai pesanan.', 'Liontin kaligrafi spiritual', 'liontin', 'emas', false, false, true, ARRAY['kaligrafi','religi','arabic']),
('TKD-BTG-10G', 'Emas Batangan 10 Gram', 'emas-batangan-10-gram', '24K', 10.0, 11000000, 0, 5, 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800', 'Emas batangan murni 24 karat berat 10 gram. Investasi terbaik dengan sertifikat keaslian resmi. Kemasan vacuum sealed.', 'Emas batangan 10g bersertifikat', 'batangan', 'emas', true, true, false, ARRAY['investasi','antam','batangan']),
('TKD-BTG-5G', 'Emas Batangan 5 Gram', 'emas-batangan-5-gram', '24K', 5.0, 5500000, 0, 8, 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800', 'Emas batangan murni 24 karat berat 5 gram. Pilihan investasi terjangkau. Bersertifikat resmi.', 'Emas batangan 5g terjangkau', 'batangan', 'emas', false, false, false, ARRAY['investasi','batangan','terjangkau']),
('TKD-BTG-1G', 'Emas Batangan 1 Gram', 'emas-batangan-1-gram', '24K', 1.0, 1100000, 0, 20, 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800', 'Emas batangan murni 1 gram. Investasi entry-level untuk pemula. Cocok untuk hadiah & koleksi.', 'Emas mini 1g untuk pemula', 'batangan', 'emas', true, false, true, ARRAY['pemula','hadiah','mini']),
('TKD-BTG-25G', 'Emas Batangan 25 Gram', 'emas-batangan-25-gram', '24K', 25.0, 27500000, 0, 2, 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800', 'Emas batangan murni 25 gram. Investasi besar bersertifikat keaslian. Untuk investor serius.', 'Emas 25g untuk investor besar', 'batangan', 'emas', true, false, false, ARRAY['investor','besar','premium']),
('TKD-CRC-22K-002', 'Cincin Emas Permata Topaz', 'cincin-emas-permata-topaz', '22K', 6.0, 6500000, 280000, 4, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800', 'Cincin emas 22K dengan permata topaz biru. Desain elegan untuk wanita yang ingin tampil mempesona.', 'Cincin topaz elegan untuk wanita', 'cincin', 'emas', false, false, true, ARRAY['permata','topaz','wanita']),
('TKD-ANT-22K-001', 'Anting Emas Bulan Sabit', 'anting-emas-bulan-sabit', '22K', 3.5, 3500000, 150000, 7, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800', 'Anting emas 22K bentuk bulan sabit, simbol keindahan. Ringan dan nyaman dipakai sepanjang hari.', 'Anting bulan sabit nyaman', 'anting', 'emas', false, true, false, ARRAY['minimalis','daily','bulan']),
('TKD-SET-22K-001', 'Set Perhiasan Pengantin Emas', 'set-perhiasan-pengantin-emas', '22K', 35.0, 38500000, 1500000, 2, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800', 'Set lengkap perhiasan pengantin: kalung + gelang + cincin + anting. Desain mewah dengan ukiran tradisional modern.', 'Set pengantin lengkap & mewah', 'set', 'emas', true, true, true, ARRAY['pengantin','set','mewah'])
ON CONFLICT (sku) DO NOTHING;

-- Partners
INSERT INTO partners (name, logo, website, display_order) VALUES
('PT Antam Tbk', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Antam_logo.svg/200px-Antam_logo.svg.png', 'https://www.antam.com', 1),
('UBS Gold', 'https://logo.clearbit.com/ubs.com', 'https://www.ubsgold.com', 2),
('Pegadaian', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Logo_Pegadaian.svg/200px-Logo_Pegadaian.svg.png', 'https://www.pegadaian.co.id', 3),
('Bank Indonesia', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Logo_of_Bank_Indonesia.svg/200px-Logo_of_Bank_Indonesia.svg.png', 'https://www.bi.go.id', 4),
('BSN (SNI)', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Logo_BSN.png/200px-Logo_BSN.png', 'https://www.bsn.go.id', 5),
('Kementerian Perdagangan', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Logo_of_the_Ministry_of_Trade_of_the_Republic_of_Indonesia.svg/200px-Logo_of_the_Ministry_of_Trade_of_the_Republic_of_Indonesia.svg.png', 'https://www.kemendag.go.id', 6)
ON CONFLICT DO NOTHING;

-- Services
INSERT INTO services (title, slug, icon, short_desc, description, features, display_order, wa_template) VALUES
('Custom Design Perhiasan', 'custom-design', '✏️', 'Buat perhiasan sesuai imajinasi Anda', 'Punya referensi cincin kawin atau kalung dari Pinterest/Instagram? Kami bisa membuatkannya dengan tingkat kemiripan tinggi. Tukang ahli kami akan mengerjakan dengan ketelitian dan presisi tinggi.', ARRAY['Konsultasi gratis','Sketsa desain awal','Material berkualitas premium','Pengerjaan 7-14 hari','Garansi keaslian'], 1, 'Halo TokoDaffa, saya ingin custom design perhiasan. Bisa konsultasi?'),
('Sepuh / Cuci Emas', 'sepuh-cuci-emas', '✨', 'Kembalikan kilau emas lama Anda', 'Perhiasan lama Anda mulai kusam? Kembalikan kilau kuning cerah perhiasan Anda seperti baru beli. Pengerjaan cepat dengan kualitas terbaik.', ARRAY['Pengerjaan 1-2 jam','Tidak mengurangi berat emas','Garansi hasil','Harga terjangkau'], 2, 'Halo TokoDaffa, saya ingin sepuh/cuci emas. Berapa biayanya?'),
('Servis & Perbaikan', 'servis-perbaikan', '🔧', 'Perbaiki perhiasan rusak Anda', 'Cincin kebesaran? Kalung putus? Gelang patah? Tukang ahli kami siap memperbaiki perhiasan Anda dengan rapi dan presisi tinggi.', ARRAY['Pengecekan gratis','Estimasi biaya transparan','Pengerjaan rapi & presisi','Garansi hasil 30 hari'], 3, 'Halo TokoDaffa, saya ingin servis/perbaiki perhiasan. Bisa diperbaiki?'),
('Buyback Emas', 'buyback-emas', '💰', 'Jual kembali emas dengan harga pasar', 'Kami menerima buyback emas Anda dengan harga real-time mengikuti pasar. Proses cepat, transparan, dan adil. Bawa langsung ke toko untuk penaksiran gratis.', ARRAY['Harga pasar real-time','Penaksiran gratis','Pembayaran tunai/transfer langsung','Tanpa biaya potongan tersembunyi'], 4, 'Halo TokoDaffa, saya ingin buyback emas. Berapa harga hari ini?'),
('Konsultasi Investasi Emas', 'konsultasi-investasi', '📊', 'Konsultasi gratis dengan pakar emas', 'Bingung mulai investasi emas? Konsultasi gratis dengan pakar kami. Kami akan bantu Anda memilih produk yang sesuai dengan tujuan dan budget.', ARRAY['Konsultasi gratis','Analisis tujuan investasi','Rekomendasi produk','Tips & trik investasi emas'], 5, 'Halo TokoDaffa, saya ingin konsultasi investasi emas. Bisa dijadwalkan?')
ON CONFLICT (slug) DO NOTHING;

-- Testimonials
INSERT INTO testimonials (name, role, text, rating, is_featured, product_purchased, display_order) VALUES
('Ibu Sarah Wijaya', 'Pelanggan Setia', 'Sudah langganan TokoDaffa Gold sejak 2018. Kualitas selalu juara, harga jujur, pelayanan ramah. Tidak pernah kecewa!', 5, true, 'Cincin & Kalung 24K', 1),
('Pak Ahmad Malik', 'Investor Emas', 'Investasi emas batangan di sini sangat memuaskan. Bersertifikat resmi, harga real-time, buyback cepat dan adil. Recommended!', 5, true, 'Emas Batangan 25g', 2),
('Dina Pratiwi', 'Pengantin Baru', 'Order custom cincin nikah 18K. Hasilnya luar biasa, mirip persis dengan referensi. Pengerjaan rapi dan tepat waktu.', 5, true, 'Wedding Ring 18K Custom', 3),
('Bapak Rudi Hartono', 'Pengusaha', 'Beli set perhiasan untuk hadiah istri. Anniversary kemarin. Istri sangat happy, kualitas perhiasan premium. Terima kasih TokoDaffa!', 5, true, 'Set Perhiasan 22K', 4),
('Ibu Linda Wijaya', 'Ibu Rumah Tangga', 'Sepuh perhiasan lama saya jadi mengkilap lagi seperti baru. Harga terjangkau, hasilnya memuaskan. Pasti balik lagi!', 5, false, 'Layanan Sepuh', 5),
('Pak Joko Susanto', 'Petani', 'Beli batangan 5g untuk tabungan. Stafnya jelasin dengan sabar, harga sesuai pasar. Bukti investasi emas memang aman.', 5, false, 'Emas Batangan 5g', 6)
ON CONFLICT DO NOTHING;

-- FAQs
INSERT INTO faqs (question, answer, category, display_order) VALUES
('Apakah emas yang dijual asli & bersertifikat?', 'Ya, 100% asli! Setiap produk emas kami dilengkapi sertifikat keaslian resmi. Kadar emas (24K, 22K, 18K, 16K) dipastikan akurat dan diuji dengan alat tester emas profesional.', 'umum', 1),
('Bagaimana cara membeli emas di TokoDaffa?', 'Sangat mudah! Pilih produk di website, chat WA admin via tombol "Tanya Stok", atau langsung datang ke toko kami di Bangkinang. Untuk emas, kami menyarankan datang langsung agar bisa lihat dan pilih sendiri.', 'transaksi', 2),
('Apakah ada garansi buyback?', 'Ya! Kami menjamin buyback 100% sesuai harga pasar saat ini. Bawa kembali emas Anda kapan saja (dengan nota pembelian) dan kami akan beli kembali dengan harga adil.', 'buyback', 3),
('Berapa lama proses custom design?', 'Tergantung kompleksitas. Umumnya 7-14 hari kerja untuk perhiasan custom. Konsultasi & sketsa awal gratis. Bayar DP 50% setelah desain disetujui.', 'custom', 4),
('Apakah bisa pesan online dan dikirim?', 'Untuk emas, kami sangat menyarankan datang langsung ke toko untuk pengalaman terbaik (cek kualitas, timbangan, dan dokumen sertifikat). Untuk reservasi/booking produk, silakan chat via WhatsApp.', 'transaksi', 5),
('Apa saja pembayaran yang diterima?', 'Kami menerima pembayaran: Tunai (Cash), Transfer Bank (BCA, BRI, Mandiri, BNI), QRIS, dan Debit/Kredit (di toko). Pembayaran dilakukan saat transaksi di toko.', 'transaksi', 6),
('Jam buka toko?', 'Senin-Jumat: 09:00-18:00 WIB, Sabtu: 09:00-17:00 WIB, Minggu: Tutup. Untuk konsultasi via WA, kami responsive di hari Minggu juga.', 'umum', 7),
('Apakah harga emas di website real-time?', 'Ya! Harga emas di website kami selalu update mengikuti harga pasar terkini. Namun untuk transaksi final, harga ditentukan saat di toko (karena fluktuasi pasar).', 'harga', 8),
('Bisakah sepuh/cuci emas di sini?', 'Tentu! Kami layani sepuh (gold plating) untuk perhiasan kusam Anda. Cukup 1-2 jam pengerjaan, dijamin mengkilap kembali. Harga terjangkau, hubungi WA kami untuk info biaya.', 'layanan', 9),
('Apakah aman datang ke toko dengan barang berharga?', 'Tentu! Toko kami dilengkapi CCTV, security, dan brankas anti-rampok. Anda aman membawa emas/perak untuk ditaksir atau buyback. Privasi pelanggan terjaga.', 'umum', 10)
ON CONFLICT DO NOTHING;

-- Hero Slides
INSERT INTO hero_slides (title, subtitle, image, cta_text, cta_link, display_order) VALUES
('Jual Beli Emas & Perak Terpercaya', 'Koleksi perhiasan premium dengan harga real-time, transparan, dan bergaransi. Datang ke toko kami untuk pengalaman terbaik.', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1920', 'Lihat Koleksi', '/produk', 1),
('Investasi Emas Mulai dari 1 Gram', 'Emas batangan bersertifikat, mudah dan aman untuk investasi jangka panjang. Mulai dari yang terjangkau.', 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=1920', 'Cek Harga Emas', '/harga-emas', 2),
('Custom Design Perhiasan Impian', 'Wujudkan perhiasan impian Anda dengan layanan custom kami. Konsultasi gratis dengan tukang ahli kami.', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1920', 'Konsultasi Sekarang', '/layanan', 3)
ON CONFLICT DO NOTHING;

-- Blog Posts / News
INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, category, tags, is_featured, published_at) VALUES
('5 Tips Memilih Emas untuk Investasi Pemula', 
'tips-memilih-emas-investasi-pemula',
'Panduan lengkap untuk Anda yang baru ingin mulai investasi emas. Pahami kadar, sertifikat, dan strategi terbaik.',
'<h2>Mengapa Investasi Emas?</h2><p>Emas telah menjadi pilihan investasi populer selama ribuan tahun karena nilainya yang stabil dan cenderung naik mengikuti inflasi.</p><h3>1. Pilih Emas Bersertifikat</h3><p>Pastikan emas yang Anda beli memiliki sertifikat keaslian resmi (Antam, UBS, atau lokal terpercaya).</p><h3>2. Pahami Kadar Emas</h3><p>Kadar emas menentukan kemurnian: 24K (99,9% murni), 22K (91,6%), 18K (75%), 16K (66%).</p><h3>3. Beli di Tempat Terpercaya</h3><p>Pilih toko emas yang sudah terbukti seperti TokoDaffa Gold dengan garansi buyback 100%.</p><h3>4. Mulai dari yang Terjangkau</h3><p>Tidak harus langsung besar! Mulai dari emas batangan 1 gram atau 5 gram.</p><h3>5. Simpan dengan Aman</h3><p>Investasi emas perlu penyimpanan yang aman. Bisa di safe deposit box bank atau brankas pribadi.</p>',
'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=1200',
'investasi',
ARRAY['investasi','pemula','tips'],
TRUE,
NOW() - INTERVAL '2 days'),

('Harga Emas Diprediksi Naik di 2026 — Saatnya Beli!',
'harga-emas-naik-2026',
'Analisis pasar menunjukkan tren positif harga emas di tahun 2026. Apa saja faktor pendukungnya?',
'<h2>Tren Harga Emas 2026</h2><p>Berdasarkan analisis pasar global, harga emas diprediksi terus naik di sepanjang tahun 2026 karena beberapa faktor:</p><ul><li>Ketidakpastian ekonomi global</li><li>Inflasi yang masih tinggi</li><li>Pelemahan dolar AS</li><li>Permintaan industri yang meningkat</li></ul><p>Saat ini adalah momen yang tepat untuk mulai berinvestasi atau menambah koleksi emas Anda. TokoDaffa Gold menyediakan emas batangan bersertifikat dengan harga real-time dan transparan.</p>',
'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1200',
'berita',
ARRAY['harga','tren','2026'],
TRUE,
NOW() - INTERVAL '5 days'),

('Cara Merawat Perhiasan Emas Agar Tetap Berkilau',
'cara-merawat-perhiasan-emas',
'Perhiasan emas Anda kusam? Ikuti tips perawatan ini agar tetap berkilau seperti baru.',
'<h2>Tips Merawat Perhiasan Emas</h2><h3>1. Hindari Kontak dengan Bahan Kimia</h3><p>Lepas perhiasan saat mandi, berenang, atau memakai parfum/lotion.</p><h3>2. Simpan di Tempat Kering</h3><p>Gunakan kotak perhiasan dengan kantong individual untuk mencegah goresan.</p><h3>3. Bersihkan Secara Berkala</h3><p>Gunakan air hangat + sabun lembut, gosok dengan sikat lembut, lalu lap kering.</p><h3>4. Servis Profesional</h3><p>Setiap 6-12 bulan, bawa ke TokoDaffa untuk sepuh/cuci profesional agar perhiasan tetap berkilau.</p>',
'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200',
'tips',
ARRAY['perawatan','tips','perhiasan'],
FALSE,
NOW() - INTERVAL '10 days'),

('Beda Emas 24K, 22K, dan 18K — Mana yang Cocok?',
'beda-emas-24k-22k-18k',
'Bingung pilih kadar emas? Simak perbedaan dan kelebihan masing-masing kadar emas.',
'<h2>Memahami Kadar Emas</h2><h3>Emas 24K (99,9% Murni)</h3><p>Paling murni, kuning paling cerah. Lunak, lebih cocok untuk investasi (batangan/koin).</p><h3>Emas 22K (91,6%)</h3><p>Campuran 8% logam lain untuk kekuatan. Cocok untuk perhiasan harian.</p><h3>Emas 18K (75%)</h3><p>Lebih kuat dan tahan lama. Cocok untuk cincin nikah dan perhiasan dengan permata.</p><h3>Emas 16K (66%)</h3><p>Lebih ekonomis dengan kekuatan baik. Cocok untuk perhiasan modern.</p>',
'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=1200',
'edukasi',
ARRAY['kadar','edukasi','panduan'],
FALSE,
NOW() - INTERVAL '15 days')
ON CONFLICT (slug) DO NOTHING;

-- Promos
INSERT INTO promos (title, description, banner_image, promo_type, discount_value, valid_from, valid_until, is_featured) VALUES
('Promo Lebaran Spesial', 'Dapatkan diskon ongkos tukang hingga 30% untuk pembelian set perhiasan. Promo terbatas, datang ke toko sekarang!', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1200', 'percent', 30, NOW(), NOW() + INTERVAL '30 days', TRUE),
('Buyback Premium', 'Khusus member, dapatkan harga buyback +2% di atas harga pasar! Berlaku untuk semua produk emas.', 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=1200', 'percent', 2, NOW(), NOW() + INTERVAL '60 days', FALSE),
('Free Sepuh Setiap Pembelian', 'Setiap pembelian perhiasan emas di atas 5 gram, dapatkan voucher sepuh gratis 1x!', 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1200', 'event', 0, NOW(), NOW() + INTERVAL '90 days', FALSE)
ON CONFLICT DO NOTHING;

-- Admin Users (Super Admin)
INSERT INTO admin_users (username, pin, full_name, role) VALUES
('superadmin', '240708daffa', 'Super Administrator', 'super_admin')
ON CONFLICT (pin) DO NOTHING;

-- Initial Price History (for chart)
INSERT INTO price_history (kadar, price_per_gram, recorded_at) VALUES
('24K', 1080000, NOW() - INTERVAL '30 days'),
('24K', 1085000, NOW() - INTERVAL '25 days'),
('24K', 1090000, NOW() - INTERVAL '20 days'),
('24K', 1095000, NOW() - INTERVAL '15 days'),
('24K', 1092000, NOW() - INTERVAL '10 days'),
('24K', 1098000, NOW() - INTERVAL '5 days'),
('24K', 1100000, NOW()),
('22K', 988000, NOW() - INTERVAL '30 days'),
('22K', 992000, NOW() - INTERVAL '25 days'),
('22K', 998000, NOW() - INTERVAL '20 days'),
('22K', 1003000, NOW() - INTERVAL '15 days'),
('22K', 1001000, NOW() - INTERVAL '10 days'),
('22K', 1005000, NOW() - INTERVAL '5 days'),
('22K', 1008000, NOW()),
('18K', 810000, NOW() - INTERVAL '30 days'),
('18K', 815000, NOW() - INTERVAL '25 days'),
('18K', 818000, NOW() - INTERVAL '20 days'),
('18K', 820000, NOW() - INTERVAL '15 days'),
('18K', 822000, NOW() - INTERVAL '10 days'),
('18K', 824000, NOW() - INTERVAL '5 days'),
('18K', 825000, NOW())
ON CONFLICT DO NOTHING;

-- ================================================================
-- DONE! Refresh schema cache di Supabase setelah ini.
-- ================================================================
