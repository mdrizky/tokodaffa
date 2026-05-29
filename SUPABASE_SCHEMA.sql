-- ============================================================
-- SUPABASE SCHEMA LENGKAP - TOKO MAS DAFFA
-- Jalankan di Supabase SQL Editor (https://supabase.com/dashboard)
-- Urutan: jalankan dari atas ke bawah
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. STORE SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS store_settings (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'TokoDaffa Gold',
  tagline TEXT DEFAULT 'Jual Emas & Perak Terpercaya',
  description TEXT,
  whatsapp TEXT DEFAULT '6281365555411',
  email TEXT DEFAULT 'info@tokodaffa.com',
  phone TEXT DEFAULT '+6281365555411',
  address TEXT,
  city TEXT DEFAULT 'Bangkinang',
  province TEXT DEFAULT 'Riau',
  maps_embed TEXT,
  maps_url TEXT,
  hours_weekday TEXT DEFAULT '09:00 - 18:00 WIB',
  hours_saturday TEXT DEFAULT '09:00 - 17:00 WIB',
  hours_sunday TEXT DEFAULT 'Tutup',
  instagram TEXT,
  facebook TEXT,
  youtube TEXT,
  tiktok TEXT,
  logo_url TEXT,
  logo_highlight TEXT DEFAULT 'Daffa',
  favicon_url TEXT,
  og_image TEXT,
  banner_active BOOLEAN DEFAULT FALSE,
  banner_announcement TEXT,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  admin_pin TEXT DEFAULT '240708',
  since INTEGER DEFAULT 2005,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  sku TEXT UNIQUE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  category TEXT NOT NULL DEFAULT 'cincin',
  kadar TEXT NOT NULL DEFAULT '24K',
  weight NUMERIC(10,2) NOT NULL DEFAULT 1.0,
  price BIGINT NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  material TEXT DEFAULT 'emas',
  photo TEXT,
  images TEXT[] DEFAULT '{}',
  description TEXT,
  short_description TEXT,
  warranty_info TEXT DEFAULT 'Garansi buyback 100% sesuai harga pasar',
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  is_bestseller BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk performa query
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_kadar ON products(kadar);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- ============================================================
-- 3. GOLD PRICES
-- ============================================================
CREATE TABLE IF NOT EXISTS gold_prices (
  id BIGSERIAL PRIMARY KEY,
  kadar TEXT NOT NULL UNIQUE,
  buy_price BIGINT NOT NULL DEFAULT 0,
  sell_price BIGINT NOT NULL DEFAULT 0,
  price_per_gram BIGINT GENERATED ALWAYS AS (sell_price) STORED,
  buyback_price BIGINT GENERATED ALWAYS AS (buy_price) STORED,
  trend TEXT DEFAULT 'stable' CHECK (trend IN ('up', 'down', 'stable')),
  change_amount BIGINT DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. PRICE HISTORY (untuk grafik)
-- ============================================================
CREATE TABLE IF NOT EXISTS price_history (
  id BIGSERIAL PRIMARY KEY,
  kadar TEXT NOT NULL,
  price_per_gram BIGINT NOT NULL,
  buy_price BIGINT,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_price_history_kadar ON price_history(kadar);
CREATE INDEX IF NOT EXISTS idx_price_history_recorded_at ON price_history(recorded_at);

-- ============================================================
-- 5. BLOG POSTS
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  category TEXT DEFAULT 'investasi',
  tags TEXT[] DEFAULT '{}',
  author TEXT DEFAULT 'Admin TokoDaffa',
  is_published BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  views_count INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_published ON blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);

-- ============================================================
-- 6. CONTACT MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  source TEXT DEFAULT 'website-contact',
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);

-- ============================================================
-- 7. RESERVATIONS (Pemesanan/Janji Temu)
-- ============================================================
CREATE TABLE IF NOT EXISTS reservations (
  id BIGSERIAL PRIMARY KEY,
  reservation_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  phone TEXT,
  customer_email TEXT,
  product_id BIGINT REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT,
  product_photo TEXT,
  kadar TEXT,
  weight NUMERIC(10,2),
  estimated_price BIGINT,
  visit_date DATE,
  appointment_date DATE,
  visit_time TEXT,
  notes TEXT,
  reservation_type TEXT DEFAULT 'view' CHECK (reservation_type IN ('view', 'buy', 'custom', 'service', 'consultation', 'buyback')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  admin_notes TEXT,
  whatsapp_sent BOOLEAN DEFAULT FALSE,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_customer_phone ON reservations(customer_phone);
CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON reservations(created_at);

-- ============================================================
-- 8. TESTIMONIALS
-- ============================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'Pelanggan',
  text TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  product_purchased TEXT,
  photo TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 9. WHY CHOOSE US
-- ============================================================
CREATE TABLE IF NOT EXISTS why_choose_us (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '⭐',
  statistic TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 10. PARTNERS / MITRA
-- ============================================================
CREATE TABLE IF NOT EXISTS partners (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  logo TEXT,
  website TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 11. ABOUT CONTENT
-- ============================================================
CREATE TABLE IF NOT EXISTS about_content (
  id BIGSERIAL PRIMARY KEY,
  hero_title TEXT DEFAULT 'Tentang TokoDaffa Gold',
  hero_subtitle TEXT,
  hero_image TEXT,
  story_title TEXT DEFAULT 'Sejarah Kami',
  story_content TEXT,
  history TEXT,
  extra TEXT,
  vision TEXT,
  mission TEXT,
  founder_name TEXT,
  founder_quote TEXT,
  stats JSONB DEFAULT '[]',
  team JSONB DEFAULT '[]',
  certifications JSONB DEFAULT '[]',
  values JSONB DEFAULT '[]',
  strengths TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 12. WA INQUIRIES (Tracking klik WhatsApp)
-- ============================================================
CREATE TABLE IF NOT EXISTS wa_inquiries (
  id BIGSERIAL PRIMARY KEY,
  source TEXT NOT NULL,
  reference_id BIGINT,
  reference_name TEXT,
  message_template TEXT,
  ip_address TEXT,
  user_agent TEXT,
  device_type TEXT DEFAULT 'desktop',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wa_inquiries_source ON wa_inquiries(source);
CREATE INDEX IF NOT EXISTS idx_wa_inquiries_created_at ON wa_inquiries(created_at);

-- ============================================================
-- 13. WISHLIST
-- ============================================================
CREATE TABLE IF NOT EXISTS wishlist (
  id BIGSERIAL PRIMARY KEY,
  identifier TEXT NOT NULL,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(identifier, product_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlist_identifier ON wishlist(identifier);

-- ============================================================
-- 14. REVIEWS / ULASAN PRODUK
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  comment TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_is_approved ON reviews(is_approved);

-- ============================================================
-- 15. NEWSLETTERS
-- ============================================================
CREATE TABLE IF NOT EXISTS newsletters (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 16. CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT DEFAULT '💍',
  description TEXT,
  image TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0
);

-- ============================================================
-- 17. SERVICES (Layanan)
-- ============================================================
CREATE TABLE IF NOT EXISTS services (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  icon TEXT DEFAULT '✨',
  short_desc TEXT,
  description TEXT,
  price_info TEXT,
  wa_template TEXT,
  image TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0
);

-- ============================================================
-- 18. FAQS
-- ============================================================
CREATE TABLE IF NOT EXISTS faqs (
  id BIGSERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'umum',
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0
);

-- ============================================================
-- 19. HERO SLIDES
-- ============================================================
CREATE TABLE IF NOT EXISTS hero_slides (
  id BIGSERIAL PRIMARY KEY,
  title TEXT,
  subtitle TEXT,
  image TEXT,
  cta_text TEXT,
  cta_link TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0
);

-- ============================================================
-- 20. PROMOS / DISKON
-- ============================================================
CREATE TABLE IF NOT EXISTS promos (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  discount_type TEXT DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10,2) DEFAULT 0,
  code TEXT UNIQUE,
  min_purchase BIGINT DEFAULT 0,
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- STORAGE BUCKET (jalankan di Supabase Storage)
-- ============================================================
-- Buat bucket 'images' di Supabase Storage > New Bucket
-- Nama: images
-- Public: YES (centang "Public bucket")
-- Allowed MIME types: image/jpeg, image/png, image/webp, image/gif, image/svg+xml

-- ============================================================
-- ROW LEVEL SECURITY (RLS) - PENTING!
-- ============================================================
-- Aktifkan RLS untuk semua tabel
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE gold_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE why_choose_us ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE wa_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE promos ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES - PUBLIC READ (semua orang bisa baca)
-- ============================================================
CREATE POLICY "Public read store_settings" ON store_settings FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public read gold_prices" ON gold_prices FOR SELECT USING (true);
CREATE POLICY "Public read price_history" ON price_history FOR SELECT USING (true);
CREATE POLICY "Public read blog_posts" ON blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Public read why_choose_us" ON why_choose_us FOR SELECT USING (is_active = true);
CREATE POLICY "Public read partners" ON partners FOR SELECT USING (is_active = true);
CREATE POLICY "Public read about_content" ON about_content FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Public read faqs" ON faqs FOR SELECT USING (is_active = true);
CREATE POLICY "Public read hero_slides" ON hero_slides FOR SELECT USING (is_active = true);
CREATE POLICY "Public read promos" ON promos FOR SELECT USING (is_active = true);
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (is_approved = true);

-- ============================================================
-- RLS POLICIES - PUBLIC INSERT (form submissions)
-- ============================================================
CREATE POLICY "Public insert contact_messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert reservations" ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert wa_inquiries" ON wa_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert wishlist" ON wishlist FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert newsletters" ON newsletters FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert price_history" ON price_history FOR INSERT WITH CHECK (true);

-- ============================================================
-- RLS POLICIES - PUBLIC DELETE (wishlist)
-- ============================================================
CREATE POLICY "Public delete wishlist" ON wishlist FOR DELETE USING (true);

-- ============================================================
-- RLS POLICIES - ANON KEY FULL ACCESS (untuk admin panel)
-- Karena admin pakai anon key + PIN di frontend, kita beri akses penuh
-- ============================================================
CREATE POLICY "Anon full access store_settings" ON store_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access gold_prices" ON gold_prices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access blog_posts" ON blog_posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access contact_messages" ON contact_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access reservations" ON reservations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access testimonials" ON testimonials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access why_choose_us" ON why_choose_us FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access partners" ON partners FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access about_content" ON about_content FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access services" ON services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access faqs" ON faqs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access hero_slides" ON hero_slides FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access promos" ON promos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access reviews" ON reviews FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access newsletters" ON newsletters FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access wa_inquiries" ON wa_inquiries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon full access wishlist" ON wishlist FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- STORAGE POLICIES (untuk bucket 'images')
-- ============================================================
-- Jalankan ini setelah buat bucket 'images' di Storage
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public read images" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Anon upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');
CREATE POLICY "Anon update images" ON storage.objects FOR UPDATE USING (bucket_id = 'images');
CREATE POLICY "Anon delete images" ON storage.objects FOR DELETE USING (bucket_id = 'images');

-- ============================================================
-- SEED DATA - DATA AWAL
-- ============================================================

-- Store Settings
INSERT INTO store_settings (
  name, tagline, description, whatsapp, email, phone, address, city, province,
  hours_weekday, hours_saturday, hours_sunday,
  instagram, facebook, tiktok,
  logo_highlight, banner_active, since,
  maps_embed
) VALUES (
  'TokoDaffa Gold',
  'Jual Emas & Perak Terpercaya',
  'Fokus pada kualitas & kejujuran. Melayani ribuan pelanggan sejak tahun 2005. Menjamin harga transparan, kualitas tinggi, dan pelayanan terbaik untuk investasi maupun perhiasan Anda.',
  '6281365555411',
  'info@tokodaffa.com',
  '+6281365555411',
  'F2QW+QVC, Jl. Lintas Petapahan - Bangkinang, Suka Mulya, Kec. Bangkinang Kota, Kabupaten Kampar, Riau 28464',
  'Bangkinang',
  'Riau',
  '09:00 - 18:00 WIB',
  '09:00 - 17:00 WIB',
  'Tutup',
  'https://instagram.com/tokodaffagold',
  'https://facebook.com/tokodaffagold',
  'https://tiktok.com/@tokodaffagold',
  'Daffa',
  false,
  2005,
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.65!2d101.036034!3d0.380756!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMDCsMjInNTAuNyJOIDEwMcKwMDInMDkuNyJF!5e0!3m2!1sen!2sid!4v1'
) ON CONFLICT DO NOTHING;

-- Gold Prices Seed
INSERT INTO gold_prices (kadar, buy_price, sell_price, trend, change_amount) VALUES
  ('24K', 1050000, 1100000, 'up', 15000),
  ('22K', 960000, 1008000, 'up', 12000),
  ('18K', 785000, 825000, 'stable', 0),
  ('16K', 695000, 733000, 'down', -5000),
  ('Perak', 12000, 15000, 'stable', 0)
ON CONFLICT (kadar) DO UPDATE SET
  buy_price = EXCLUDED.buy_price,
  sell_price = EXCLUDED.sell_price,
  updated_at = NOW();

-- Categories Seed
INSERT INTO categories (name, slug, icon, display_order) VALUES
  ('Cincin', 'cincin', '💍', 1),
  ('Gelang', 'gelang', '⭕', 2),
  ('Kalung', 'kalung', '📿', 3),
  ('Anting', 'anting', '✨', 4),
  ('Liontin', 'liontin', '💎', 5),
  ('Batangan', 'batangan', '🏅', 6),
  ('Set Perhiasan', 'set', '👑', 7),
  ('Koin Emas', 'koin', '🪙', 8)
ON CONFLICT (slug) DO NOTHING;

-- Products Seed (30 produk lengkap)
INSERT INTO products (name, slug, category, kadar, weight, price, stock, material, description, short_description, warranty_info, featured, is_new, is_bestseller, is_active, display_order, tags) VALUES
  ('Cincin Emas Polos Classic 24K', 'cincin-emas-polos-classic-24k', 'cincin', '24K', 5.0, 5500000, 3, 'emas', 'Cincin emas murni 24 karat dengan desain classic elegan. Cocok untuk investasi dan koleksi pribadi. Finishing halus dengan kilau premium. Tersedia dalam berbagai ukuran.', 'Cincin emas 24K classic, cocok untuk investasi', 'Garansi buyback 100% sesuai harga pasar', true, false, true, true, 1, ARRAY['classic', 'investasi', 'polos']),
  ('Gelang Emas Rantai Italia 22K', 'gelang-emas-rantai-italia-22k', 'gelang', '22K', 10.5, 10584000, 2, 'emas', 'Gelang emas 22 karat dengan model rantai Italia yang elegan. Desain timeless yang cocok untuk pria dan wanita. Pengerjaan halus dengan teknik tradisional Italia.', 'Gelang rantai Italia 22K, elegan dan timeless', 'Garansi buyback 100% sesuai harga pasar', true, false, true, true, 2, ARRAY['rantai', 'italia', 'elegan']),
  ('Kalung Emas Liontin Hati 18K', 'kalung-emas-liontin-hati-18k', 'kalung', '18K', 8.0, 6600000, 5, 'emas', 'Kalung emas 18 karat dengan liontin berbentuk hati. Hadiah sempurna untuk orang tersayang. Desain romantis yang cocok untuk berbagai kesempatan.', 'Kalung liontin hati 18K, hadiah sempurna', 'Garansi buyback 100% sesuai harga pasar', true, false, false, true, 3, ARRAY['liontin', 'hati', 'hadiah', 'romantis']),
  ('Anting Perak Permata Zirconia 925', 'anting-perak-permata-zirconia-925', 'anting', '925', 3.2, 450000, 8, 'perak', 'Anting perak sterling 925 dengan aksen permata zirconia. Desain minimalis dan modern, anti karat. Cocok untuk penggunaan sehari-hari maupun acara formal.', 'Anting perak 925 dengan zirconia, minimalis modern', 'Garansi keaslian perak 925', false, true, false, true, 4, ARRAY['perak', 'zirconia', 'minimalis']),
  ('Cincin Perak Pria Ukir 925', 'cincin-perak-pria-ukir-925', 'cincin', '925', 7.5, 650000, 1, 'perak', 'Cincin perak tebal khusus pria dengan ukiran premium. Elegan dan maskulin. Cocok untuk pria yang menginginkan aksesori berkelas.', 'Cincin perak pria dengan ukiran premium', 'Garansi keaslian perak 925', true, false, false, true, 5, ARRAY['pria', 'ukir', 'maskulin']),
  ('Gelang Emas Bangle Polos 24K', 'gelang-emas-bangle-polos-24k', 'gelang', '24K', 15.0, 16500000, 0, 'emas', 'Gelang bangle emas murni 24 karat. Investasi emas dalam bentuk perhiasan mewah. Desain minimalis yang tidak lekang oleh waktu.', 'Gelang bangle 24K, investasi mewah', 'Garansi buyback 100% sesuai harga pasar', true, false, false, true, 6, ARRAY['bangle', 'investasi', 'mewah']),
  ('Kalung Emas Rantai Figaro 22K', 'kalung-emas-rantai-figaro-22k', 'kalung', '22K', 12.0, 12096000, 3, 'emas', 'Kalung emas 22 karat dengan model rantai Figaro yang kuat dan elegan. Cocok untuk pria. Desain maskulin dengan kilau emas premium.', 'Kalung rantai Figaro 22K untuk pria', 'Garansi buyback 100% sesuai harga pasar', false, false, false, true, 7, ARRAY['figaro', 'pria', 'rantai']),
  ('Cincin Emas Wedding Ring 18K', 'cincin-emas-wedding-ring-18k', 'cincin', '18K', 4.0, 3300000, 10, 'emas', 'Cincin emas 18 karat spesial untuk pernikahan. Tersedia custom ukiran nama. Simbol cinta abadi yang akan menemani perjalanan hidup Anda.', 'Cincin nikah 18K, bisa custom ukiran nama', 'Garansi buyback 100% + sertifikat keaslian', true, false, true, true, 8, ARRAY['wedding', 'nikah', 'custom', 'pasangan']),
  ('Kalung Perak Liontin Salib 925', 'kalung-perak-liontin-salib-925', 'kalung', '925', 5.5, 550000, 6, 'perak', 'Kalung perak 925 dengan liontin salib minimalis. Cocok dipakai sehari-hari. Desain sederhana namun bermakna mendalam.', 'Kalung perak liontin salib, cocok sehari-hari', 'Garansi keaslian perak 925', false, false, false, true, 9, ARRAY['salib', 'rohani', 'minimalis']),
  ('Liontin Emas Kaligrafi 22K', 'liontin-emas-kaligrafi-22k', 'liontin', '22K', 5.5, 5544000, 4, 'emas', 'Liontin emas 22 karat dengan ukiran kaligrafi Arab. Bernilai seni dan spiritual tinggi. Cocok sebagai hadiah untuk orang yang Anda cintai.', 'Liontin kaligrafi 22K, bernilai seni tinggi', 'Garansi buyback 100% sesuai harga pasar', false, false, false, true, 10, ARRAY['kaligrafi', 'arab', 'spiritual', 'hadiah']),
  ('Emas Batangan 10 Gram 24K', 'emas-batangan-10-gram-24k', 'batangan', '24K', 10.0, 11000000, 5, 'emas', 'Emas batangan murni 24 karat berat 10 gram. Investasi terbaik dengan sertifikat keaslian. Disimpan dalam kemasan premium anti-gores.', 'Emas batangan 10g 24K dengan sertifikat', 'Sertifikat keaslian + garansi buyback 100%', true, false, true, true, 11, ARRAY['batangan', 'investasi', 'sertifikat']),
  ('Emas Batangan 5 Gram 24K', 'emas-batangan-5-gram-24k', 'batangan', '24K', 5.0, 5500000, 8, 'emas', 'Emas batangan murni 24 karat berat 5 gram. Pilihan investasi terjangkau dengan nilai yang terus meningkat.', 'Emas batangan 5g 24K, investasi terjangkau', 'Sertifikat keaslian + garansi buyback 100%', false, false, false, true, 12, ARRAY['batangan', 'investasi']),
  ('Cincin Emas Bermata Berlian 18K', 'cincin-emas-bermata-berlian-18k', 'cincin', '18K', 3.5, 4500000, 4, 'emas', 'Cincin emas 18 karat dengan batu berlian sintetis berkualitas tinggi. Kilau yang memukau untuk setiap kesempatan spesial.', 'Cincin 18K dengan berlian sintetis premium', 'Garansi buyback 100% + sertifikat', true, true, false, true, 13, ARRAY['berlian', 'mewah', 'spesial']),
  ('Gelang Emas Charm Butterfly 18K', 'gelang-emas-charm-butterfly-18k', 'gelang', '18K', 6.0, 4950000, 3, 'emas', 'Gelang emas 18 karat dengan charm kupu-kupu yang cantik. Desain feminin yang cocok untuk wanita modern.', 'Gelang charm kupu-kupu 18K, feminin dan cantik', 'Garansi buyback 100% sesuai harga pasar', false, true, false, true, 14, ARRAY['charm', 'butterfly', 'feminin', 'wanita']),
  ('Kalung Emas Choker Minimalis 22K', 'kalung-emas-choker-minimalis-22k', 'kalung', '22K', 7.0, 7056000, 2, 'emas', 'Kalung choker emas 22 karat dengan desain minimalis modern. Tampil elegan dan stylish di setiap kesempatan.', 'Kalung choker 22K minimalis, stylish modern', 'Garansi buyback 100% sesuai harga pasar', false, true, false, true, 15, ARRAY['choker', 'minimalis', 'modern', 'stylish'])
ON CONFLICT (slug) DO NOTHING;

-- More Products
INSERT INTO products (name, slug, category, kadar, weight, price, stock, material, description, short_description, warranty_info, featured, is_new, is_bestseller, is_active, display_order, tags) VALUES
  ('Anting Emas Gantung Bunga 22K', 'anting-emas-gantung-bunga-22k', 'anting', '22K', 4.0, 4032000, 5, 'emas', 'Anting emas 22 karat model gantung dengan motif bunga. Anggun dan feminin untuk berbagai acara.', 'Anting gantung bunga 22K, anggun dan feminin', 'Garansi buyback 100% sesuai harga pasar', false, false, false, true, 16, ARRAY['gantung', 'bunga', 'feminin']),
  ('Set Perhiasan Emas Pengantin 18K', 'set-perhiasan-emas-pengantin-18k', 'set', '18K', 25.0, 20625000, 2, 'emas', 'Set perhiasan lengkap untuk pengantin: kalung, gelang, anting, dan cincin. Emas 18 karat dengan desain mewah dan elegan.', 'Set perhiasan pengantin 18K lengkap 4 pcs', 'Garansi buyback 100% + sertifikat keaslian', true, false, true, true, 17, ARRAY['set', 'pengantin', 'wedding', 'lengkap']),
  ('Cincin Emas Polos Pria 22K', 'cincin-emas-polos-pria-22k', 'cincin', '22K', 6.0, 6048000, 4, 'emas', 'Cincin emas 22 karat polos untuk pria. Desain maskulin dan elegan, cocok untuk penggunaan sehari-hari.', 'Cincin emas pria 22K, maskulin dan elegan', 'Garansi buyback 100% sesuai harga pasar', false, false, false, true, 18, ARRAY['pria', 'polos', 'maskulin']),
  ('Gelang Perak Charm Love 925', 'gelang-perak-charm-love-925', 'gelang', '925', 8.0, 750000, 6, 'perak', 'Gelang perak 925 dengan charm love yang romantis. Hadiah sempurna untuk pasangan atau orang tersayang.', 'Gelang perak charm love, hadiah romantis', 'Garansi keaslian perak 925', false, true, false, true, 19, ARRAY['charm', 'love', 'romantis', 'hadiah']),
  ('Liontin Emas Nama Custom 18K', 'liontin-emas-nama-custom-18k', 'liontin', '18K', 3.0, 2475000, 10, 'emas', 'Liontin emas 18 karat dengan ukiran nama custom. Hadiah personal yang bermakna untuk orang spesial. Proses 3-5 hari kerja.', 'Liontin nama custom 18K, hadiah personal bermakna', 'Garansi buyback 100% sesuai harga pasar', false, true, true, true, 20, ARRAY['custom', 'nama', 'personal', 'hadiah']),
  ('Emas Batangan 1 Gram 24K', 'emas-batangan-1-gram-24k', 'batangan', '24K', 1.0, 1100000, 20, 'emas', 'Emas batangan murni 24 karat berat 1 gram. Investasi emas paling terjangkau dengan nilai yang terus meningkat.', 'Emas batangan 1g 24K, investasi paling terjangkau', 'Sertifikat keaslian + garansi buyback 100%', false, false, true, true, 21, ARRAY['batangan', 'investasi', 'terjangkau']),
  ('Emas Batangan 25 Gram 24K', 'emas-batangan-25-gram-24k', 'batangan', '24K', 25.0, 27500000, 3, 'emas', 'Emas batangan murni 24 karat berat 25 gram. Investasi besar dengan nilai yang terjamin. Dilengkapi sertifikat keaslian resmi.', 'Emas batangan 25g 24K, investasi besar terjamin', 'Sertifikat keaslian + garansi buyback 100%', true, false, false, true, 22, ARRAY['batangan', 'investasi', 'premium']),
  ('Cincin Emas Bermata Batu Merah 18K', 'cincin-emas-bermata-batu-merah-18k', 'cincin', '18K', 4.5, 5625000, 3, 'emas', 'Cincin emas 18 karat dengan batu merah (ruby sintetis) yang memukau. Desain mewah untuk wanita modern.', 'Cincin 18K dengan ruby sintetis, mewah dan memukau', 'Garansi buyback 100% + sertifikat', false, false, false, true, 23, ARRAY['ruby', 'batu merah', 'mewah', 'wanita']),
  ('Kalung Emas Rantai Box 24K', 'kalung-emas-rantai-box-24k', 'kalung', '24K', 9.0, 9900000, 2, 'emas', 'Kalung emas 24 karat dengan model rantai box yang kuat dan elegan. Cocok untuk investasi sekaligus aksesori.', 'Kalung rantai box 24K, investasi sekaligus aksesori', 'Garansi buyback 100% sesuai harga pasar', false, false, false, true, 24, ARRAY['rantai', 'box', 'investasi']),
  ('Gelang Emas Rantai Rolo 22K', 'gelang-emas-rantai-rolo-22k', 'gelang', '22K', 8.0, 8064000, 4, 'emas', 'Gelang emas 22 karat dengan model rantai rolo yang klasik. Desain unisex yang cocok untuk pria dan wanita.', 'Gelang rantai rolo 22K, unisex dan klasik', 'Garansi buyback 100% sesuai harga pasar', false, false, false, true, 25, ARRAY['rolo', 'unisex', 'klasik']),
  ('Anting Emas Stud Bulat 18K', 'anting-emas-stud-bulat-18k', 'anting', '18K', 2.0, 1650000, 7, 'emas', 'Anting emas 18 karat model stud bulat minimalis. Cocok untuk penggunaan sehari-hari maupun acara formal.', 'Anting stud bulat 18K, minimalis dan serbaguna', 'Garansi buyback 100% sesuai harga pasar', false, true, false, true, 26, ARRAY['stud', 'bulat', 'minimalis', 'sehari-hari']),
  ('Cincin Emas Ukir Batik 22K', 'cincin-emas-ukir-batik-22k', 'cincin', '22K', 5.0, 5040000, 3, 'emas', 'Cincin emas 22 karat dengan ukiran motif batik khas Indonesia. Memadukan keindahan tradisional dengan kemewahan emas.', 'Cincin 22K ukiran batik, keindahan tradisional Indonesia', 'Garansi buyback 100% sesuai harga pasar', false, false, false, true, 27, ARRAY['batik', 'ukir', 'tradisional', 'indonesia']),
  ('Kalung Perak Rantai Figaro 925', 'kalung-perak-rantai-figaro-925', 'kalung', '925', 10.0, 850000, 5, 'perak', 'Kalung perak 925 dengan model rantai figaro yang kuat. Pilihan ekonomis dengan kualitas premium.', 'Kalung perak figaro 925, ekonomis berkualitas', 'Garansi keaslian perak 925', false, false, false, true, 28, ARRAY['figaro', 'perak', 'ekonomis']),
  ('Liontin Emas Zodiak Custom 18K', 'liontin-emas-zodiak-custom-18k', 'liontin', '18K', 2.5, 2062500, 8, 'emas', 'Liontin emas 18 karat dengan simbol zodiak pilihan. Hadiah unik dan personal untuk orang tersayang.', 'Liontin zodiak 18K, hadiah unik dan personal', 'Garansi buyback 100% sesuai harga pasar', false, true, false, true, 29, ARRAY['zodiak', 'custom', 'personal', 'hadiah']),
  ('Gelang Emas Tali Kulit 18K', 'gelang-emas-tali-kulit-18k', 'gelang', '18K', 5.0, 4125000, 4, 'emas', 'Gelang kombinasi emas 18 karat dengan tali kulit premium. Desain modern dan maskulin untuk pria aktif.', 'Gelang emas-kulit 18K, modern dan maskulin', 'Garansi buyback 100% sesuai harga pasar', false, true, false, true, 30, ARRAY['kulit', 'pria', 'modern', 'aktif'])
ON CONFLICT (slug) DO NOTHING;

-- Testimonials Seed
INSERT INTO testimonials (name, role, text, rating, product_purchased, is_active, display_order) VALUES
  ('Sarah Wijaya', 'Kolektor Emas', 'Sudah langganan TokoDaffa Gold sejak 2018. Kualitas selalu juara, harga jujur dan transparan. Tidak pernah kecewa!', 5, 'Cincin Emas 24K', true, 1),
  ('Ahmad Malik', 'Investor', 'Investasi emas batangan di sini sangat memuaskan. Bersertifikat resmi, proses buyback cepat dan harga sesuai pasar.', 5, 'Emas Batangan 25 Gram', true, 2),
  ('Dina Pratiwi', 'Pengantin', 'Order custom cincin nikah 18K. Hasilnya luar biasa, pengerjaan rapi dan sesuai desain yang saya minta. Sangat puas!', 5, 'Cincin Wedding Ring 18K', true, 3),
  ('Budi Santoso', 'Pelanggan Setia', 'Harga paling transparan di antara toko emas yang pernah saya kunjungi. Timbangan digital tersertifikasi, tidak ada yang disembunyikan.', 5, 'Gelang Emas 22K', true, 4),
  ('Rina Kusuma', 'Ibu Rumah Tangga', 'Beli kalung untuk hadiah ulang tahun suami. Pelayanannya ramah, produknya berkualitas. Pasti balik lagi!', 5, 'Kalung Emas 22K', true, 5),
  ('Hendra Gunawan', 'Pengusaha', 'Sudah beli emas batangan 3 kali di sini. Selalu puas dengan kualitas dan pelayanannya. Recommended banget!', 5, 'Emas Batangan 10 Gram', true, 6)
ON CONFLICT DO NOTHING;

-- Why Choose Us Seed
INSERT INTO why_choose_us (title, description, icon, statistic, is_active, display_order) VALUES
  ('Sertifikat Keaslian Resmi', 'Setiap produk dilengkapi sertifikat keaslian yang dapat diverifikasi. Kami menjamin 100% keaslian setiap gram emas yang Anda beli.', '🏆', '100% Bersertifikat', true, 1),
  ('Garansi Buyback 100%', 'Kami menerima kembali semua produk yang dibeli dengan harga sesuai pasar. Investasi Anda selalu terlindungi.', '🔄', 'Buyback Terjamin', true, 2),
  ('Harga Paling Transparan', 'Tidak ada biaya tersembunyi. Harga emas kami update setiap hari sesuai harga pasar internasional.', '💰', 'Update Harian', true, 3),
  ('Timbangan Tersertifikasi', 'Timbangan digital kami tersertifikasi oleh Metrologi resmi. Setiap gram dihitung dengan akurat dan jujur.', '⚖️', 'Akurasi 0.01g', true, 4),
  ('Pengalaman 20+ Tahun', 'Berdiri sejak 2005, kami telah melayani ribuan pelanggan dengan kepuasan tertinggi di industri perhiasan.', '📅', '20+ Tahun', true, 5),
  ('Layanan Custom Design', 'Wujudkan perhiasan impian Anda. Tim pengrajin berpengalaman kami siap membuat perhiasan sesuai desain Anda.', '✏️', 'Custom Available', true, 6)
ON CONFLICT DO NOTHING;

-- Services Seed
INSERT INTO services (title, icon, short_desc, description, price_info, wa_template, is_active, display_order) VALUES
  ('Custom Design Perhiasan', '✏️', 'Buat perhiasan sesuai imajinasi Anda', 'Punya referensi cincin kawin atau kalung dari Pinterest/Instagram? Kami bisa membuatkannya untuk Anda dengan tingkat kemiripan tinggi. Konsultasi gratis, pengerjaan 7-14 hari.', 'Mulai dari Rp 500.000 (tergantung berat & kadar)', 'Halo TokoDaffa, saya ingin custom design perhiasan. Bisa konsultasi gratis?', true, 1),
  ('Sepuh / Cuci Emas', '✨', 'Kembalikan kilau emas lama Anda', 'Perhiasan lama Anda mulai kusam? Kembalikan kilau kuning cerah perhiasan Anda seperti baru beli. Proses 1-2 hari, hasil memuaskan.', 'Mulai dari Rp 50.000 per item', 'Halo TokoDaffa, saya ingin sepuh/cuci emas. Berapa biayanya?', true, 2),
  ('Servis & Perbaikan', '🔧', 'Perbaiki perhiasan rusak Anda', 'Cincin kebesaran? Kalung putus? Anting bengkok? Tukang ahli kami siap memperbaiki perhiasan Anda dengan rapi dan profesional.', 'Mulai dari Rp 30.000 (tergantung kerusakan)', 'Halo TokoDaffa, saya ingin servis perhiasan. Bisa diperbaiki?', true, 3),
  ('Buyback Emas', '💰', 'Jual kembali emas dengan harga pasar', 'Kami menerima buyback semua jenis emas dengan harga sesuai pasar hari ini. Proses cepat, pembayaran tunai langsung.', 'Harga sesuai pasar hari ini', 'Halo TokoDaffa, saya ingin buyback emas. Berapa harga beli hari ini?', true, 4),
  ('Konsultasi Investasi Emas', '📊', 'Konsultasi gratis strategi investasi emas', 'Bingung mulai investasi emas? Tim kami siap memberikan konsultasi gratis tentang strategi investasi emas yang tepat untuk Anda.', 'Gratis', 'Halo TokoDaffa, saya ingin konsultasi investasi emas. Kapan bisa?', true, 5),
  ('Ukir Nama / Inisial', '🖊️', 'Personalisasi perhiasan dengan ukiran nama', 'Tambahkan sentuhan personal pada perhiasan Anda dengan ukiran nama, inisial, atau tanggal spesial. Hadiah yang tak terlupakan.', 'Mulai dari Rp 75.000', 'Halo TokoDaffa, saya ingin ukir nama di perhiasan. Bisa?', true, 6)
ON CONFLICT DO NOTHING;

-- FAQs Seed
INSERT INTO faqs (question, answer, category, is_active, display_order) VALUES
  ('Apakah emas yang dijual sudah bersertifikat?', 'Ya, semua produk emas kami dilengkapi sertifikat keaslian resmi. Anda bisa memverifikasi keasliannya kapan saja.', 'produk', true, 1),
  ('Bagaimana cara buyback emas di TokoDaffa?', 'Cukup datang ke toko dengan membawa emas dan sertifikat (jika ada). Kami akan menimbang dan memberikan harga sesuai pasar hari ini. Pembayaran tunai langsung.', 'layanan', true, 2),
  ('Apakah bisa custom design perhiasan?', 'Tentu! Kami menerima custom design perhiasan. Bawa referensi gambar atau desain Anda, tim pengrajin kami akan mewujudkannya. Konsultasi gratis.', 'layanan', true, 3),
  ('Berapa lama proses custom perhiasan?', 'Proses custom biasanya memakan waktu 7-14 hari kerja tergantung kompleksitas desain. Kami akan memberikan estimasi waktu yang akurat saat konsultasi.', 'layanan', true, 4),
  ('Apakah harga emas di website selalu update?', 'Ya, harga emas di website kami diupdate setiap hari mengikuti harga pasar internasional. Untuk harga real-time, silakan hubungi kami via WhatsApp.', 'harga', true, 5),
  ('Apakah ada garansi untuk perhiasan yang dibeli?', 'Semua perhiasan emas kami bergaransi buyback 100% sesuai harga pasar. Kami juga memberikan garansi keaslian seumur hidup.', 'garansi', true, 6),
  ('Bagaimana cara memesan perhiasan?', 'Anda bisa datang langsung ke toko, atau hubungi kami via WhatsApp untuk reservasi/konsultasi terlebih dahulu. Tidak ada pembelian online, semua transaksi dilakukan di toko.', 'pembelian', true, 7),
  ('Apakah bisa cicilan?', 'Saat ini kami belum menyediakan layanan cicilan. Semua transaksi dilakukan secara tunai di toko. Untuk informasi lebih lanjut, hubungi kami via WhatsApp.', 'pembayaran', true, 8)
ON CONFLICT DO NOTHING;

-- About Content Seed
INSERT INTO about_content (
  hero_title, hero_subtitle, story_title, story_content, history, vision, mission, 
  founder_name, founder_quote, stats, strengths
) VALUES (
  'Tentang TokoDaffa Gold',
  'Dipercaya sejak 2005 sebagai toko emas terpercaya dengan komitmen pada kualitas, kejujuran, dan kepuasan pelanggan.',
  'Sejarah Kami',
  '<p>TokoDaffa Gold didirikan pada tahun 2005 dengan visi menjadi toko emas terpercaya yang mengutamakan kejujuran dan transparansi. Berawal dari toko kecil di Bangkinang, Riau, kami kini telah melayani ribuan pelanggan dari berbagai daerah.</p><p>Dengan pengalaman lebih dari 20 tahun di industri perhiasan, kami memahami betul kebutuhan pelanggan akan kualitas, harga yang jujur, dan pelayanan yang profesional. Setiap produk yang kami jual dilengkapi dengan sertifikat keaslian dan garansi buyback 100%.</p><p>Kepercayaan pelanggan adalah aset terbesar kami. Oleh karena itu, kami selalu menjaga kualitas produk dan memberikan pelayanan terbaik di setiap transaksi.</p>',
  'Didirikan pada tahun 2005, TokoDaffa Gold telah menjadi destinasi terpercaya untuk koleksi perhiasan berkualitas dan layanan investasi emas.',
  'Menjadi standar emas di industri perhiasan ritel dengan mengutamakan kualitas, transparansi harga, dan layanan yang profesional.',
  'Menyediakan perhiasan emas berkualitas tinggi dengan harga transparan
Memberikan layanan investasi emas yang aman dan terpercaya
Mengutamakan kepuasan dan kepercayaan pelanggan
Terus berinovasi dalam desain dan layanan',
  'H. Daffa Rizky',
  'Kejujuran adalah fondasi bisnis kami. Kami tidak hanya menjual emas, tetapi membangun kepercayaan yang bertahan selamanya.',
  '[
    {"label": "Tahun Berpengalaman", "value": "20+"},
    {"label": "Produk Tersedia", "value": "500+"},
    {"label": "Pelanggan Puas", "value": "10.000+"},
    {"label": "Kota Terlayani", "value": "50+"}
  ]',
  ARRAY[
    'Sertifikat Keaslian Resmi',
    'Garansi Buyback 100% Sesuai Pasar',
    'Timbangan Digital Tersertifikasi Metrologi',
    'Jaminan Harga Paling Transparan',
    'Pengalaman 20+ Tahun',
    'Tim Pengrajin Berpengalaman'
  ]
) ON CONFLICT DO NOTHING;

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Function untuk auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers untuk auto-update updated_at
CREATE TRIGGER update_store_settings_updated_at BEFORE UPDATE ON store_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gold_prices_updated_at BEFORE UPDATE ON gold_prices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_about_content_updated_at BEFORE UPDATE ON about_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_why_choose_us_updated_at BEFORE UPDATE ON why_choose_us FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- SELESAI! 
-- ============================================================
-- Setelah menjalankan SQL ini:
-- 1. Buat bucket 'images' di Supabase Storage (public)
-- 2. Copy SUPABASE_URL dan ANON_KEY ke .env.local
-- 3. Jalankan: npm run dev
-- 4. Login admin dengan PIN: 240708
-- 5. Upload foto produk di Admin > Produk
-- ============================================================
