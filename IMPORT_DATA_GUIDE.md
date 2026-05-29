# 📦 PANDUAN IMPORT DATA PRODUK

## Cara Import Data Produk ke Supabase

### Metode 1: Via SQL (Sudah Otomatis)
✅ **Data produk sudah otomatis ter-import** saat Anda menjalankan `SUPABASE_SCHEMA.sql`!

File SQL tersebut sudah include 30 produk sample. Anda tinggal:
1. Upload foto produk
2. Edit produk di admin panel
3. Update foto URL

---

### Metode 2: Import Manual via Admin Panel

#### Langkah 1: Login ke Admin
1. Buka **http://localhost:3000/admin**
2. Login dengan PIN: **240708**

#### Langkah 2: Tambah Produk Baru
1. Klik menu **"Produk"**
2. Klik tombol **"➕ Tambah Produk"**
3. Isi form:
   - **SKU**: Kode unik (contoh: TKD-CRC-24K-001)
   - **Nama Produk**: Cincin Emas Polos Classic 24K
   - **Kategori**: cincin
   - **Kadar**: 24K
   - **Berat**: 5.0 (gram)
   - **Harga**: 5500000 (Rupiah)
   - **Stok**: 3
   - **Material**: emas
   - **Deskripsi**: (isi deskripsi lengkap)
4. Upload foto:
   - Klik **"📁 Upload Foto Utama"**
   - Pilih foto produk
   - Tunggu sampai terupload
5. Klik **"💾 Simpan Produk"**

---

### Metode 3: Import Bulk via CSV (Advanced)

#### Langkah 1: Siapkan File CSV
Buat file `products.csv` dengan format:

```csv
name,slug,category,kadar,weight,price,stock,material,description,short_description,tags
"Cincin Emas Polos 24K","cincin-emas-polos-24k","cincin","24K",5.0,5500000,3,"emas","Deskripsi lengkap...","Deskripsi singkat","classic,investasi,polos"
"Gelang Emas 22K","gelang-emas-22k","gelang","22K",10.5,10584000,2,"emas","Deskripsi lengkap...","Deskripsi singkat","rantai,italia,elegan"
```

#### Langkah 2: Import ke Supabase
1. Buka Supabase Dashboard
2. Klik **Table Editor** > **products**
3. Klik **"Insert"** > **"Import data from CSV"**
4. Upload file `products.csv`
5. Map kolom CSV ke kolom tabel
6. Klik **"Import"**

---

## 📸 Upload Foto Produk Massal

### Cara 1: Via Supabase Storage (Bulk Upload)
1. Buka Supabase Dashboard > **Storage** > **images**
2. Buka folder **products/**
3. Klik **"Upload"**
4. Pilih **semua foto produk** sekaligus (bisa multiple select)
5. Tunggu sampai semua terupload
6. Copy URL setiap foto:
   - Klik foto > **"Copy URL"**
   - Paste ke Excel/Notepad
7. Update URL foto di admin panel atau via SQL:

```sql
UPDATE products SET photo = 'https://abc.supabase.co/storage/v1/object/public/images/products/cincin-1.jpg' WHERE id = 1;
UPDATE products SET photo = 'https://abc.supabase.co/storage/v1/object/public/images/products/gelang-1.jpg' WHERE id = 2;
-- dst...
```

### Cara 2: Via Admin Panel (Satu-satu)
1. Login admin panel
2. Klik **"Produk"** > **"Edit"** pada produk
3. Upload foto satu per satu
4. Klik **"Update Produk"**

---

## 🎯 Tips Import Data

### Naming Convention Foto
Gunakan nama file yang konsisten:
```
cincin-emas-24k-1.jpg
cincin-emas-24k-2.jpg
gelang-emas-22k-1.jpg
kalung-emas-18k-1.jpg
```

### Struktur Folder di Storage
```
images/
├── products/
│   ├── cincin-emas-24k-1.jpg
│   ├── cincin-emas-24k-2.jpg
│   ├── gelang-emas-22k-1.jpg
│   └── ...
├── blog/
│   └── artikel-1.jpg
└── settings/
    └── logo.png
```

### Format Harga
- **Jangan** pakai titik/koma: ❌ `5.500.000` atau `5,500,000`
- **Gunakan** angka bulat: ✅ `5500000`

### Format Berat
- Gunakan desimal dengan titik: ✅ `5.0` atau `10.5`
- Satuan: gram

### Tags
- Pisahkan dengan koma: `classic,investasi,polos`
- Lowercase semua
- Tanpa spasi setelah koma

---

## 🔄 Update Data Produk Massal

### Via SQL
```sql
-- Update harga semua produk 24K (naik 5%)
UPDATE products 
SET price = price * 1.05 
WHERE kadar = '24K';

-- Update stok semua produk kategori cincin
UPDATE products 
SET stock = 10 
WHERE category = 'cincin';

-- Tandai semua produk baru sebagai featured
UPDATE products 
SET featured = true 
WHERE is_new = true;
```

### Via Admin Panel
1. Edit produk satu per satu
2. Atau gunakan fitur **"Duplicate"** untuk produk serupa

---

## 📊 Contoh Data Produk Lengkap

```json
{
  "name": "Cincin Emas Polos Classic 24K",
  "slug": "cincin-emas-polos-classic-24k",
  "sku": "TKD-CRC-24K-001",
  "category": "cincin",
  "kadar": "24K",
  "weight": 5.0,
  "price": 5500000,
  "stock": 3,
  "material": "emas",
  "photo": "https://abc.supabase.co/storage/v1/object/public/images/products/cincin-24k.jpg",
  "images": [
    "https://abc.supabase.co/storage/v1/object/public/images/products/cincin-24k-1.jpg",
    "https://abc.supabase.co/storage/v1/object/public/images/products/cincin-24k-2.jpg"
  ],
  "description": "Cincin emas murni 24 karat dengan desain classic elegan. Cocok untuk investasi dan koleksi pribadi. Finishing halus dengan kilau premium. Tersedia dalam berbagai ukuran.",
  "short_description": "Cincin emas 24K classic, cocok untuk investasi",
  "warranty_info": "Garansi buyback 100% sesuai harga pasar",
  "tags": ["classic", "investasi", "polos"],
  "featured": true,
  "is_new": false,
  "is_bestseller": true,
  "is_active": true,
  "display_order": 1
}
```

---

## ❓ FAQ Import Data

### Q: Berapa maksimal produk yang bisa diimport?
**A:** Tidak ada limit. Supabase free tier support sampai 500MB database.

### Q: Apakah bisa import dari Excel?
**A:** Ya, save Excel as CSV dulu, lalu import via Supabase Table Editor.

### Q: Foto harus di Supabase Storage?
**A:** Tidak wajib. Bisa pakai URL eksternal (Imgur, Cloudinary, dll). Tapi Supabase Storage lebih cepat dan terintegrasi.

### Q: Bagaimana cara backup data produk?
**A:** Di Supabase Dashboard > Table Editor > products > Export to CSV

---

**Selamat mengimport data! 🎉**
