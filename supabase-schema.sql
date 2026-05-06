-- Buat tabel untuk Harga Emas Harian
CREATE TABLE gold_prices (
  id SERIAL PRIMARY KEY,
  kadar VARCHAR(10) UNIQUE NOT NULL,
  price_per_gram INTEGER NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Buat tabel untuk Pengaturan Toko (Store Settings)
CREATE TABLE store_settings (
  id SERIAL PRIMARY KEY,
  store_name VARCHAR(255) NOT NULL,
  tagline VARCHAR(255),
  description TEXT,
  address TEXT,
  maps_embed TEXT,
  phone VARCHAR(50),
  whatsapp VARCHAR(50),
  email VARCHAR(100),
  operating_hours JSONB,
  social_media JSONB,
  certifications JSONB,
  since INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Buat tabel untuk Produk
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  kadar VARCHAR(10) NOT NULL,
  weight DECIMAL(10,2) NOT NULL,
  price INTEGER NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  photo VARCHAR(255),
  description TEXT,
  category VARCHAR(50) NOT NULL,
  material VARCHAR(50) NOT NULL DEFAULT 'emas',
  featured BOOLEAN DEFAULT FALSE,
  images JSONB DEFAULT '[]'::jsonb,
  specifications JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Masukkan data awal Harga Emas
INSERT INTO gold_prices (kadar, price_per_gram) VALUES
('24K', 1100000),
('22K', 1008000),
('18K', 825000),
('16K', 733000),
('Perak', 15000);

-- Masukkan data awal Produk
INSERT INTO products (name, kadar, weight, price, stock, photo, description, category, material, featured) VALUES
('Cincin Emas Polos Classic', '24K', 5.0, 5500000, 3, '/products/cincin-24k.jpg', 'Cincin emas murni 24 karat dengan desain classic elegan. Cocok untuk investasi dan koleksi pribadi. Finishing halus dengan kilau premium.', 'cincin', 'emas', true),
('Gelang Emas Rantai Italia', '22K', 10.5, 10584000, 2, '/products/gelang-22k.jpg', 'Gelang emas 22 karat dengan model rantai Italia yang elegan. Desain timeless yang cocok untuk pria dan wanita.', 'gelang', 'emas', true),
('Kalung Emas Liontin Hati', '18K', 8.0, 6600000, 5, '/products/kalung-18k.jpg', 'Kalung emas 18 karat dengan liontin berbentuk hati. Hadiah sempurna untuk orang tersayang.', 'kalung', 'emas', true),
('Anting Perak Permata Zirconia', '925', 3.2, 450000, 8, '/products/anting-perak.jpg', 'Anting perak sterling 925 dengan aksen permata zirconia. Desain minimalis dan modern, anti karat.', 'anting', 'perak', false),
('Cincin Perak Pria Ukir', '925', 7.5, 650000, 1, '/products/cincin-perak-pria.jpg', 'Cincin perak tebal khusus pria dengan ukiran premium. Elegan dan maskulin.', 'cincin', 'perak', true),
('Gelang Emas Bangle Polos', '24K', 15.0, 16500000, 0, '/products/bangle-24k.jpg', 'Gelang bangle emas murni 24 karat. Investasi emas dalam bentuk perhiasan mewah.', 'gelang', 'emas', true),
('Kalung Emas Rantai Figaro', '22K', 12.0, 12096000, 3, '/products/kalung-figaro-22k.jpg', 'Kalung emas 22 karat dengan model rantai Figaro yang kuat dan elegan. Cocok untuk pria.', 'kalung', 'emas', false),
('Cincin Emas Wedding Ring', '18K', 4.0, 3300000, 10, '/products/wedding-ring-18k.jpg', 'Cincin emas 18 karat spesial untuk pernikahan. Tersedia custom ukiran nama.', 'cincin', 'emas', true),
('Kalung Perak Liontin Salib', '925', 5.5, 550000, 6, '/products/kalung-salib-perak.jpg', 'Kalung perak 925 dengan liontin salib minimalis. Cocok dipakai sehari-hari.', 'kalung', 'perak', false),
('Liontin Emas Kaligrafi', '22K', 5.5, 5544000, 4, '/products/liontin-kaligrafi-22k.jpg', 'Liontin emas 22 karat dengan ukiran kaligrafi Arab. Bernilai seni dan spiritual tinggi.', 'liontin', 'emas', false),
('Emas Batangan 10 Gram', '24K', 10.0, 11000000, 5, '/products/batangan-10g.jpg', 'Emas batangan murni 24 karat berat 10 gram. Investasi terbaik dengan sertifikat keaslian.', 'batangan', 'emas', true),
('Emas Batangan 5 Gram', '24K', 5.0, 5500000, 8, '/products/batangan-5g.jpg', 'Emas batangan murni 24 karat berat 5 gram. Pilihan investasi terjangkau.', 'batangan', 'emas', false);

-- Izinkan Public Read (Anonymous Access) untuk frontend
ALTER TABLE gold_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
  ON gold_prices FOR SELECT
  USING ( true );

CREATE POLICY "Products are viewable by everyone."
  ON products FOR SELECT
  USING ( true );

ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Store settings are viewable by everyone."
  ON store_settings FOR SELECT
  USING ( true );

-- Supaya Vercel API (menggunakan service_role atau authenticated route handler) bisa UPDATE tanpa RLS untuk admin
-- Tapi untuk saat ini, kita bisa bypass RLS jika query dilakukan dengan Server Components / API routes yang memakai SSR dengan proper key.
