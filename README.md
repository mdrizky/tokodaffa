# 💍 TokoDaffa Gold - Website Toko Emas Modern

Website e-commerce perhiasan emas dan perak berbasis **Next.js 16.2.4** dengan integrasi **Supabase** untuk database.

## ✨ Fitur Utama

### 🛍️ Untuk Customer
- ✅ Katalog produk dengan filter & search
- ✅ Detail produk lengkap dengan galeri foto
- ✅ Harga emas real-time (update harian)
- ✅ Kalkulator investasi emas
- ✅ Wishlist produk favorit
- ✅ Reservasi/janji temu via WhatsApp
- ✅ Blog artikel tentang emas & investasi
- ✅ Multi-language (Indonesia/English)
- ✅ Dark/Light theme
- ✅ Responsive mobile-first design

### 🎛️ Untuk Admin
- ✅ Dashboard analytics real-time
- ✅ Manajemen produk (CRUD + upload foto)
- ✅ Update harga emas
- ✅ Kelola blog/artikel
- ✅ Lihat pesan & reservasi
- ✅ Kelola testimoni & partner
- ✅ Pengaturan toko lengkap
- ✅ Tracking klik WhatsApp

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
1. Buat project di [Supabase](https://supabase.com)
2. Jalankan `SUPABASE_SCHEMA.sql` di SQL Editor
3. Buat bucket `images` (public) di Storage

### 3. Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_ADMIN_PIN=240708
```

### 4. Run Development Server
```bash
npm run dev
```

Buka: **http://localhost:3000**

Admin panel: **http://localhost:3000/admin** (PIN: 240708)

## 📚 Dokumentasi Lengkap

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Panduan setup lengkap step-by-step
- **[SUPABASE_SCHEMA.sql](./SUPABASE_SCHEMA.sql)** - SQL schema untuk import ke Supabase
- **[ANALISIS_LENGKAP.md](./ANALISIS_LENGKAP.md)** - Analisis fitur & roadmap
- **[IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)** - Rencana implementasi

## 🛠️ Tech Stack

- **Framework**: Next.js 16.2.4 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **UI**: CSS Modules + Framer Motion
- **Charts**: Recharts
- **Deployment**: Vercel

## 📁 Struktur Project

```
tokodaffa/
├── src/
│   ├── app/
│   │   ├── (public)/          # Halaman publik
│   │   ├── (admin)/           # Admin panel
│   │   └── api/               # API routes
│   ├── components/            # Reusable components
│   ├── lib/                   # Utilities & helpers
│   ├── hooks/                 # Custom React hooks
│   ├── services/              # Business logic
│   └── data/                  # Fallback JSON data
├── public/                    # Static assets
├── SUPABASE_SCHEMA.sql        # Database schema
├── SETUP_GUIDE.md             # Setup guide
└── .env.example               # Environment template
```

## 🔐 Keamanan

- ✅ Row Level Security (RLS) di Supabase
- ✅ PIN-based admin authentication
- ✅ API token untuk admin endpoints
- ✅ Honeypot untuk spam protection
- ✅ Rate limiting ready

## 🌐 Deploy ke Production

### Vercel (Recommended)
1. Push code ke GitHub
2. Import project di [Vercel](https://vercel.com)
3. Tambahkan environment variables
4. Deploy!

### Environment Variables untuk Production
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_ADMIN_PIN=your-secure-pin
SITE_URL=https://tokodaffa.vercel.app
```

## 📊 Database Schema

Database terdiri dari 19 tabel utama:
- `products` - Produk perhiasan
- `gold_prices` - Harga emas per kadar
- `blog_posts` - Artikel blog
- `contact_messages` - Pesan dari customer
- `reservations` - Reservasi/janji temu
- `testimonials` - Testimoni pelanggan
- `why_choose_us` - Keunggulan toko
- `partners` - Mitra/partner
- `store_settings` - Pengaturan toko
- Dan 10 tabel lainnya...

Lihat `SUPABASE_SCHEMA.sql` untuk detail lengkap.

## 🎨 Customization

### Ganti Logo
1. Upload logo baru ke `public/images/`
2. Update di Admin > Pengaturan > Tampilan

### Ganti Warna Brand
Edit file `src/app/globals.css`:
```css
:root {
  --gold-primary: #d4af37;  /* Warna emas utama */
  --gold-dark: #b8941e;     /* Emas gelap */
}
```

### Tambah Halaman Baru
Buat file di `src/app/(public)/nama-halaman/page.tsx`

## 🐛 Troubleshooting

### Error: "Failed to fetch"
- Cek `.env.local` sudah diisi
- Restart dev server: `Ctrl+C` → `npm run dev`

### Foto tidak muncul
- Pastikan bucket `images` di Supabase sudah **public**
- Cek URL foto dimulai dengan `https://`

### Admin tidak bisa login
- Default PIN: `240708`
- Cek `.env.local` > `NEXT_PUBLIC_ADMIN_PIN`

Lihat [SETUP_GUIDE.md](./SETUP_GUIDE.md) untuk troubleshooting lengkap.

## 📝 License

MIT License - bebas digunakan untuk project komersial.

## 🙏 Credits

Built with ❤️ using:
- [Next.js](https://nextjs.org)
- [Supabase](https://supabase.com)
- [Framer Motion](https://www.framer.com/motion)
- [Recharts](https://recharts.org)

---

**Website siap 100%!** Tinggal setup Supabase dan upload foto produk. 🚀
