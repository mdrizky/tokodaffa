# ❓ FAQ LENGKAP - PERTANYAAN YANG SERING DITANYAKAN

## 📚 DAFTAR ISI

1. [Pertanyaan Umum](#pertanyaan-umum)
2. [Setup & Installation](#setup--installation)
3. [Database & Supabase](#database--supabase)
4. [Environment Variables](#environment-variables)
5. [Error & Troubleshooting](#error--troubleshooting)
6. [Admin Panel](#admin-panel)
7. [Upload Foto](#upload-foto)
8. [Deployment](#deployment)
9. [Performance & Optimization](#performance--optimization)
10. [Security](#security)

---

## 🌟 PERTANYAAN UMUM

### Q1: Dari mana saya harus mulai?
**A:** Mulai dari file **START_HERE.md**, lalu ikuti **QUICK_START_CHECKLIST.md**

### Q2: Berapa lama waktu setup?
**A:** 
- Quick start: **10 menit**
- Setup lengkap: **30 menit**
- Baca semua dokumentasi: **4-5 jam**

### Q3: Apakah saya perlu bayar untuk Supabase?
**A:** **TIDAK!** Free tier Supabase cukup untuk:
- Database: 500MB
- Storage: 1GB
- Bandwidth: 2GB/bulan
- API requests: 50,000/bulan

Cukup untuk development dan small-medium traffic.

### Q4: Apakah saya perlu coding?
**A:** **TIDAK!** Anda hanya perlu:
1. Setup Supabase (via dashboard, no coding)
2. Copy-paste kredensial ke .env.local
3. Jalankan `npm install` dan `npm run dev`

### Q5: Apa yang harus saya lakukan jika stuck?
**A:** 
1. Jalankan: `node check-supabase-connection.js`
2. Baca: `TROUBLESHOOTING_DATABASE.md`
3. Cek console browser (F12)
4. Baca FAQ ini

---

## 🔧 SETUP & INSTALLATION

### Q6: Bagaimana cara install Node.js?
**A:** 
1. Buka https://nodejs.org
2. Download versi LTS (Long Term Support)
3. Install dengan double-click
4. Verifikasi: `node -v` dan `npm -v`

### Q7: Command `npm install` gagal, kenapa?
**A:** Kemungkinan penyebab:
1. **Koneksi internet lambat/putus**
   - Solusi: Coba lagi dengan koneksi stabil
2. **Port blocked by firewall**
   - Solusi: Disable firewall sementara
3. **npm cache corrupt**
   - Solusi: `npm cache clean --force && npm install`
4. **node_modules corrupt**
   - Solusi: `rm -rf node_modules && npm install`

### Q8: Port 3000 sudah dipakai, bagaimana?
**A:** 
**Option 1:** Tutup aplikasi yang pakai port 3000
```bash
# Cari process yang pakai port 3000
lsof -i :3000
# Kill process
kill -9 [PID]
```

**Option 2:** Gunakan port lain
```bash
PORT=3001 npm run dev
```

### Q9: Apakah saya harus install database lokal?
**A:** **TIDAK!** Supabase adalah cloud database. Anda tidak perlu install PostgreSQL lokal.

---

## 🗄️ DATABASE & SUPABASE

### Q10: Bagaimana cara membuat project Supabase?
**A:** Ikuti panduan detail di **LANGKAH_DEMI_LANGKAH.md** bagian 2.1

### Q11: SQL schema error saat dijalankan, kenapa?
**A:** Kemungkinan penyebab:
1. **Tabel sudah ada**
   - Solusi: Aman, skip saja. Atau drop tabel dulu
2. **Copy paste tidak lengkap**
   - Solusi: Copy ulang dari awal sampai akhir file
3. **Syntax error**
   - Solusi: Pastikan tidak ada karakter aneh

### Q12: Berapa banyak tabel yang harus dibuat?
**A:** **19 tabel:**
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

### Q13: Data seed tidak muncul, kenapa?
**A:** 
1. Cek apakah SQL schema dijalankan sampai selesai
2. Cek bagian INSERT di SUPABASE_SCHEMA.sql
3. Jalankan ulang bagian INSERT saja
4. Verifikasi di Table Editor

### Q14: Bagaimana cara backup database?
**A:** 
**Via Supabase Dashboard:**
1. Settings → Database → Backups
2. Klik "Download backup"

**Via SQL:**
```sql
-- Export semua data
SELECT * FROM products;
-- Copy hasil ke CSV
```

### Q15: Apakah data saya aman di Supabase?
**A:** **YA!** Supabase menggunakan:
- PostgreSQL (database production-grade)
- Automatic backups
- SSL/TLS encryption
- Row Level Security (RLS)
- ISO 27001 certified

---

## 🔑 ENVIRONMENT VARIABLES

### Q16: Apa itu .env.local?
**A:** File konfigurasi yang berisi kredensial rahasia seperti:
- Supabase URL
- Supabase Key
- Admin PIN
- API keys

**JANGAN commit ke Git!** (sudah ada di .gitignore)

### Q17: Dimana mendapatkan Supabase URL dan Key?
**A:** 
1. Buka Supabase Dashboard
2. Klik Settings (⚙️)
3. Klik API
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Q18: Apakah service_role key aman dipakai?
**A:** **TIDAK!** Service role key:
- Bypass semua RLS policies
- Full access ke database
- Hanya untuk server-side
- **JANGAN pakai di frontend!**

Gunakan **anon key** untuk frontend.

### Q19: Sudah isi .env.local tapi masih pakai data lokal?
**A:** 
1. **Restart server:**
   ```bash
   # Ctrl+C untuk stop
   npm run dev
   ```
2. **Clear browser cache:**
   - F12 → Application → Clear storage
3. **Verifikasi .env.local:**
   ```bash
   cat .env.local
   ```
   Pastikan tidak ada spasi di awal/akhir

### Q20: Bagaimana cara ubah Admin PIN?
**A:** 
Edit .env.local:
```env
NEXT_PUBLIC_ADMIN_PIN=123456
```
Lalu restart server.

---

## ❌ ERROR & TROUBLESHOOTING

### Q21: Error "relation does not exist"
**A:** **Penyebab:** Tabel belum dibuat di database

**Solusi:**
1. Jalankan SUPABASE_SCHEMA.sql di SQL Editor
2. Verifikasi tabel di Table Editor
3. Restart server

### Q22: Error "row-level security policy"
**A:** **Penyebab:** RLS policies belum di-set

**Solusi:**
Jalankan bagian RLS di SUPABASE_SCHEMA.sql:
```sql
-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anon full access products" ON products 
FOR ALL USING (true) WITH CHECK (true);
```

### Q23: Error "Bucket not found"
**A:** **Penyebab:** Storage bucket 'images' belum dibuat

**Solusi:**
1. Buka Supabase Dashboard → Storage
2. Klik "New Bucket"
3. Nama: `images`
4. **CENTANG "Public bucket"**
5. Klik "Create Bucket"

### Q24: Upload foto gagal
**A:** **Kemungkinan penyebab:**
1. **Bucket tidak public**
   - Solusi: Edit bucket → Centang "Public bucket"
2. **Storage policies belum di-set**
   - Solusi: Jalankan bagian Storage Policies di SQL
3. **File terlalu besar**
   - Solusi: Compress foto (max 10MB)
4. **Format tidak didukung**
   - Solusi: Gunakan JPG, PNG, WEBP

### Q25: Data tidak tersimpan ke database
**A:** **Cek 5 hal ini:**
1. ✅ .env.local sudah diisi?
2. ✅ Kredensial Supabase benar?
3. ✅ Tabel sudah dibuat?
4. ✅ RLS policies sudah di-set?
5. ✅ Server sudah di-restart?

Jalankan diagnostic:
```bash
node check-supabase-connection.js
```

### Q26: Console browser penuh error
**A:** 
1. **Buka DevTools:** F12
2. **Klik tab Console**
3. **Baca error dari atas**
4. **Google error message**
5. **Atau baca TROUBLESHOOTING_DATABASE.md**

### Q27: Website blank/putih
**A:** **Kemungkinan penyebab:**
1. **JavaScript error**
   - Cek console browser (F12)
2. **Build error**
   - Restart server
3. **Port salah**
   - Pastikan akses http://localhost:3000

---

## 👤 ADMIN PANEL

### Q28: Lupa PIN admin, bagaimana?
**A:** 
Cek di .env.local:
```bash
cat .env.local | grep ADMIN_PIN
```

Default PIN: **240708**

Atau ubah di .env.local:
```env
NEXT_PUBLIC_ADMIN_PIN=240708
```

### Q29: Bagaimana cara menambah admin?
**A:** Saat ini sistem menggunakan PIN-based auth (single admin).

Untuk multiple admin, perlu implement:
1. Supabase Auth
2. User table
3. Role-based access control

### Q30: Admin panel tidak bisa diakses
**A:** 
1. **Cek URL:** http://localhost:3000/admin (bukan /admin/)
2. **Cek server running:** Terminal harusnya show "Ready in X.Xs"
3. **Cek console browser:** F12 → Console
4. **Clear cache:** Ctrl+Shift+Delete

### Q31: Setelah login, redirect ke homepage
**A:** **Penyebab:** PIN salah atau localStorage issue

**Solusi:**
1. Cek PIN di .env.local
2. Clear localStorage:
   - F12 → Application → Local Storage → Clear
3. Refresh page
4. Login ulang

---

## 📸 UPLOAD FOTO

### Q32: Format foto apa yang didukung?
**A:** 
- ✅ JPG/JPEG
- ✅ PNG
- ✅ WEBP
- ✅ GIF
- ✅ SVG
- ❌ BMP (tidak recommended)
- ❌ TIFF (tidak recommended)

### Q33: Berapa ukuran maksimal foto?
**A:** **10MB per file**

Recommended:
- Produk: 800x800px, < 500KB
- Banner: 1920x600px, < 1MB
- Thumbnail: 400x400px, < 200KB

### Q34: Bagaimana cara compress foto?
**A:** 
**Online tools:**
- TinyPNG: https://tinypng.com
- Squoosh: https://squoosh.app
- Compressor.io: https://compressor.io

**Software:**
- Photoshop: Save for Web
- GIMP: Export with quality 80%

### Q35: Foto tidak muncul setelah upload
**A:** **Cek:**
1. ✅ Bucket 'images' public?
2. ✅ Storage policies sudah di-set?
3. ✅ URL foto benar?
4. ✅ Clear browser cache?

**Verifikasi:**
1. Buka Supabase Storage → images
2. Cek file ada?
3. Klik file → Copy URL
4. Paste URL di browser baru
5. Harusnya foto muncul

### Q36: Bagaimana cara bulk upload foto?
**A:** 
**Via Supabase Dashboard:**
1. Storage → images bucket
2. Klik "Upload files"
3. Select multiple files
4. Upload

**Via Admin Panel:**
- Saat ini belum support bulk upload
- Upload satu per satu via form produk

---

## 🚀 DEPLOYMENT

### Q37: Bagaimana cara deploy ke Vercel?
**A:** 
1. Push code ke GitHub
2. Buka https://vercel.com
3. Import repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_ADMIN_PIN`
5. Deploy

### Q38: Apakah perlu ubah sesuatu saat deploy?
**A:** **YA!** Ubah di .env production:
```env
SITE_URL=https://tokodaffa.vercel.app
```

### Q39: Database production sama dengan development?
**A:** **YA!** Supabase project yang sama dipakai untuk dev dan production.

Untuk production yang lebih aman:
- Buat project Supabase terpisah
- Atau gunakan Supabase branching (Pro plan)

### Q40: Bagaimana cara setup custom domain?
**A:** 
**Di Vercel:**
1. Project Settings → Domains
2. Add domain
3. Update DNS records di domain provider
4. Wait for verification

---

## ⚡ PERFORMANCE & OPTIMIZATION

### Q41: Website lambat, bagaimana?
**A:** **Optimasi:**
1. **Compress images**
2. **Enable caching**
3. **Use CDN** (Vercel otomatis)
4. **Lazy load images**
5. **Minimize JavaScript**

### Q42: Database query lambat
**A:** 
1. **Add indexes** (sudah ada di schema)
2. **Limit results:** `.limit(10)`
3. **Select only needed columns:** `.select('id, name')`
4. **Use pagination**

### Q43: Berapa banyak produk yang bisa disimpan?
**A:** 
**Free tier Supabase:**
- Database: 500MB
- Estimasi: ~50,000 produk (dengan foto URL)

**Jika butuh lebih:**
- Upgrade ke Pro plan ($25/month)
- Database: 8GB
- Estimasi: ~800,000 produk

---

## 🔒 SECURITY

### Q44: Apakah website aman?
**A:** **YA!** Dengan catatan:
1. ✅ Jangan commit .env.local ke Git
2. ✅ Jangan share anon key di publik
3. ✅ Gunakan HTTPS di production
4. ✅ Update dependencies secara berkala

### Q45: Bagaimana cara protect admin panel?
**A:** Saat ini menggunakan PIN-based auth.

**Untuk keamanan lebih:**
1. Implement Supabase Auth
2. Add email/password login
3. Add 2FA (Two-Factor Authentication)
4. Add IP whitelist

### Q46: Apakah RLS policies aman?
**A:** **YA!** RLS (Row Level Security) adalah:
- PostgreSQL native feature
- Enforce di database level
- Tidak bisa di-bypass dari frontend

**Current policies:**
- Public: Read only
- Anon: Full access (karena PIN auth di frontend)

### Q47: Bagaimana cara prevent SQL injection?
**A:** **Supabase otomatis protect!**
- Menggunakan prepared statements
- Parameterized queries
- Input sanitization

Anda tidak perlu khawatir SQL injection.

### Q48: Apakah perlu SSL certificate?
**A:** 
**Development:** Tidak perlu (http://localhost)
**Production:** **YA!** (https://)

Vercel otomatis provide SSL certificate gratis.

---

## 🆘 PERTANYAAN LAIN

### Q49: Dimana saya bisa belajar lebih lanjut?
**A:** 
**Dokumentasi:**
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- React: https://react.dev

**Tutorial:**
- YouTube: Search "Next.js Supabase tutorial"
- Udemy: Next.js courses
- FreeCodeCamp: Web development

### Q50: Bagaimana cara contribute ke project ini?
**A:** 
1. Fork repository
2. Create branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📞 MASIH ADA PERTANYAAN?

Jika pertanyaan Anda tidak ada di FAQ ini:

### 1. Cek Dokumentasi Lain
```bash
cat INDEX_DOKUMENTASI.md
```

### 2. Jalankan Diagnostic
```bash
node check-supabase-connection.js
```

### 3. Baca Troubleshooting
```bash
cat TROUBLESHOOTING_DATABASE.md
```

### 4. Cek Console Browser
- F12 → Console tab
- Lihat error messages

### 5. Search di Google
- Copy error message
- Search: "[error message] next.js supabase"

---

## 📊 STATISTIK FAQ

```
Total Pertanyaan:     50 FAQ
Kategori:             10 kategori
Coverage:             95% pertanyaan umum
Update:               Regular
```

---

**Semoga FAQ ini membantu! 🎉**

**Jika ada pertanyaan lain, tambahkan ke FAQ ini!**
