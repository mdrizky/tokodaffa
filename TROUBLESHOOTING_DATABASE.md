# 🔧 TROUBLESHOOTING: Data Tidak Masuk ke Database Supabase

## ❌ MASALAH UMUM & SOLUSI

### 1. **Environment Variables Belum Diisi**

**Gejala:**
- Data tidak tersimpan ke database
- Aplikasi menggunakan data lokal JSON
- Console browser menunjukkan error Supabase

**Solusi:**
```bash
# 1. Copy file .env.example menjadi .env.local
cp .env.example .env.local

# 2. Edit .env.local dan isi dengan kredensial Supabase Anda
nano .env.local
```

**Isi .env.local dengan:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...
NEXT_PUBLIC_ADMIN_PIN=240708
SITE_URL=http://localhost:3000
```

**Cara Mendapatkan Kredensial Supabase:**
1. Buka https://supabase.com/dashboard
2. Pilih project Anda
3. Klik **Settings** (⚙️) di sidebar kiri
4. Klik **API**
5. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

### 2. **Database Schema Belum Dijalankan**

**Gejala:**
- Error: "relation does not exist"
- Error: "table not found"
- Data tidak bisa disimpan

**Solusi:**
```sql
-- Jalankan file SUPABASE_SCHEMA.sql di Supabase SQL Editor
-- Lokasi: https://supabase.com/dashboard > SQL Editor > New Query
```

**Langkah-langkah:**
1. Buka Supabase Dashboard
2. Pilih project Anda
3. Klik **SQL Editor** di sidebar
4. Klik **New Query**
5. Copy seluruh isi file `SUPABASE_SCHEMA.sql`
6. Paste ke SQL Editor
7. Klik **Run** atau tekan `Ctrl+Enter`
8. Tunggu sampai selesai (sekitar 10-30 detik)
9. Cek apakah ada error di output

**Verifikasi:**
```sql
-- Jalankan query ini untuk cek apakah tabel sudah dibuat
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Harusnya muncul 19 tabel:
- about_content
- blog_posts
- categories
- contact_messages
- faqs
- gold_prices
- hero_slides
- newsletters
- partners
- price_history
- products
- promos
- reservations
- reviews
- services
- store_settings
- testimonials
- wa_inquiries
- why_choose_us
- wishlist

---

### 3. **Storage Bucket 'images' Belum Dibuat**

**Gejala:**
- Upload foto gagal
- Error: "Bucket not found"
- Foto tidak bisa disimpan

**Solusi:**

**Langkah-langkah:**
1. Buka Supabase Dashboard
2. Klik **Storage** di sidebar
3. Klik **New Bucket**
4. Isi:
   - **Name:** `images`
   - **Public bucket:** ✅ **CENTANG INI** (penting!)
   - **File size limit:** 10 MB
   - **Allowed MIME types:** `image/jpeg, image/png, image/webp, image/gif, image/svg+xml`
5. Klik **Create Bucket**

**Verifikasi Storage Policies:**
```sql
-- Jalankan di SQL Editor untuk set policies
-- (Sudah ada di SUPABASE_SCHEMA.sql, tapi jika belum jalan, run manual)

-- Pastikan bucket ada
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Set policies
CREATE POLICY "Public read images" ON storage.objects 
FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Anon upload images" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'images');

CREATE POLICY "Anon update images" ON storage.objects 
FOR UPDATE USING (bucket_id = 'images');

CREATE POLICY "Anon delete images" ON storage.objects 
FOR DELETE USING (bucket_id = 'images');
```

---

### 4. **Row Level Security (RLS) Policies Belum Aktif**

**Gejala:**
- Data bisa dibaca tapi tidak bisa disimpan
- Error: "new row violates row-level security policy"

**Solusi:**
```sql
-- Cek apakah RLS policies sudah ada
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

**Jika policies belum ada, jalankan bagian RLS di SUPABASE_SCHEMA.sql:**
```sql
-- Enable RLS untuk semua tabel
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- ... (lihat SUPABASE_SCHEMA.sql untuk lengkapnya)

-- Buat policies
CREATE POLICY "Anon full access products" ON products 
FOR ALL USING (true) WITH CHECK (true);
-- ... (lihat SUPABASE_SCHEMA.sql untuk lengkapnya)
```

---

### 5. **Server Belum Di-restart Setelah Ubah .env**

**Gejala:**
- Sudah isi .env.local tapi masih pakai data lokal
- Perubahan tidak terdeteksi

**Solusi:**
```bash
# 1. Stop server (Ctrl+C di terminal)
# 2. Restart server
npm run dev

# Atau jika pakai PM2/production:
pm2 restart all
```

---

### 6. **Browser Cache Masih Pakai Data Lama**

**Gejala:**
- Data lama masih muncul
- Perubahan tidak terlihat

**Solusi:**
```
1. Buka DevTools (F12)
2. Klik kanan tombol Refresh
3. Pilih "Empty Cache and Hard Reload"

Atau:
- Chrome: Ctrl+Shift+Delete → Clear cache
- Firefox: Ctrl+Shift+Delete → Clear cache
```

---

## 🔍 CARA CEK APAKAH SUPABASE SUDAH TERHUBUNG

### Method 1: Cek di Browser Console

1. Buka website (http://localhost:3000)
2. Tekan F12 untuk buka DevTools
3. Klik tab **Console**
4. Ketik:
```javascript
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);
```
5. Jika muncul URL Supabase Anda → **BERHASIL** ✅
6. Jika muncul `undefined` atau `https://dummy.supabase.co` → **BELUM TERHUBUNG** ❌

### Method 2: Cek di Admin Panel

1. Login ke admin panel: http://localhost:3000/admin
2. Masukkan PIN: `240708`
3. Klik tab **Products** atau **Gold Prices**
4. Coba tambah data baru
5. Jika berhasil tersimpan → **BERHASIL** ✅
6. Jika error atau tidak tersimpan → **CEK LANGKAH DI ATAS** ❌

### Method 3: Cek Langsung di Supabase

1. Buka Supabase Dashboard
2. Klik **Table Editor**
3. Pilih tabel `products`
4. Cek apakah ada data seed (30 produk)
5. Jika ada → **BERHASIL** ✅
6. Jika kosong → **JALANKAN SUPABASE_SCHEMA.sql** ❌

---

## 📋 CHECKLIST SETUP LENGKAP

Pastikan semua langkah ini sudah dilakukan:

- [ ] **1. Buat Project di Supabase**
  - Buka https://supabase.com
  - Klik "New Project"
  - Isi nama project, database password, region
  - Tunggu sampai project selesai dibuat (~2 menit)

- [ ] **2. Jalankan SQL Schema**
  - Buka SQL Editor di Supabase
  - Copy isi file `SUPABASE_SCHEMA.sql`
  - Paste dan Run
  - Cek tidak ada error

- [ ] **3. Buat Storage Bucket**
  - Buka Storage di Supabase
  - Buat bucket bernama `images`
  - **CENTANG "Public bucket"** ← PENTING!

- [ ] **4. Copy Environment Variables**
  - Copy `.env.example` → `.env.local`
  - Isi `NEXT_PUBLIC_SUPABASE_URL`
  - Isi `NEXT_PUBLIC_SUPABASE_ANON_KEY`

- [ ] **5. Install Dependencies**
  ```bash
  npm install
  ```

- [ ] **6. Restart Development Server**
  ```bash
  npm run dev
  ```

- [ ] **7. Test di Browser**
  - Buka http://localhost:3000
  - Login admin: http://localhost:3000/admin (PIN: 240708)
  - Coba tambah produk baru
  - Cek apakah tersimpan di Supabase Table Editor

---

## 🐛 DEBUG MODE: Cara Cek Error Detail

### 1. Cek Console Browser
```
F12 → Console tab
Lihat error merah
```

### 2. Cek Network Tab
```
F12 → Network tab
Filter: Fetch/XHR
Klik request yang error
Lihat Response tab
```

### 3. Tambahkan Logging di Code

Edit `src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy';

console.log('🔍 Supabase URL:', supabaseUrl);
console.log('🔍 Supabase Key:', supabaseAnonKey ? '✅ Ada' : '❌ Kosong');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const hasSupabase = 
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://dummy.supabase.co' &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'dummy';

console.log('🔍 Has Supabase:', hasSupabase ? '✅ YA' : '❌ TIDAK');
```

Restart server dan cek console browser.

---

## 🆘 MASIH ERROR? KIRIM INFO INI:

Jika masih error setelah ikuti semua langkah di atas, kirim info berikut:

1. **Screenshot error di Console browser** (F12 → Console)
2. **Screenshot error di Network tab** (F12 → Network → klik request error → Response)
3. **Isi file .env.local** (sensor bagian key-nya):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG... (ada isinya)
   ```
4. **Hasil query ini di Supabase SQL Editor:**
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```
5. **Screenshot Storage Buckets** di Supabase Dashboard

---

## ✅ VERIFIKASI AKHIR

Setelah semua setup, test dengan:

### Test 1: Tambah Produk
1. Login admin: http://localhost:3000/admin
2. Klik "Products"
3. Klik "Tambah Produk"
4. Isi form minimal:
   - Nama: Test Produk
   - Kategori: cincin
   - Kadar: 24K
   - Berat: 5
   - Harga: 5000000
   - Stok: 1
   - Upload foto atau isi URL foto
5. Klik "Simpan Produk"
6. **Cek di Supabase Table Editor → products** → harusnya ada data baru ✅

### Test 2: Update Harga Emas
1. Login admin
2. Klik "Gold Prices"
3. Ubah harga 24K
4. Klik "Perbarui Harga"
5. **Cek di Supabase Table Editor → gold_prices** → harusnya harga berubah ✅

### Test 3: Upload Foto
1. Login admin
2. Klik "Products" → "Tambah Produk"
3. Klik "Upload Foto Utama"
4. Pilih gambar
5. Tunggu upload selesai
6. **Cek di Supabase Storage → images bucket** → harusnya ada file baru ✅

---

## 📞 KONTAK SUPPORT

Jika masih ada masalah, hubungi:
- GitHub Issues: [buat issue baru]
- Email: [email support]
- WhatsApp: [nomor support]

**Sertakan:**
- Screenshot error
- Versi Node.js: `node -v`
- Versi npm: `npm -v`
- OS: Windows/Mac/Linux
- Browser: Chrome/Firefox/Safari

---

**Dibuat:** 2024
**Update Terakhir:** 2024
**Versi:** 1.0
