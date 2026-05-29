#!/usr/bin/env node

/**
 * SCRIPT DIAGNOSTIC KONEKSI SUPABASE
 * 
 * Jalankan dengan: node check-supabase-connection.js
 * 
 * Script ini akan mengecek:
 * 1. Apakah .env.local ada
 * 2. Apakah kredensial Supabase sudah diisi
 * 3. Apakah koneksi ke Supabase berhasil
 * 4. Apakah tabel-tabel sudah dibuat
 * 5. Apakah storage bucket 'images' sudah ada
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 DIAGNOSTIC KONEKSI SUPABASE\n');
console.log('='.repeat(60));

// 1. Cek .env.local
console.log('\n📄 [1/6] Mengecek file .env.local...');
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ File .env.local TIDAK DITEMUKAN!');
  console.log('   Solusi: Copy .env.example menjadi .env.local');
  console.log('   Command: cp .env.example .env.local');
  process.exit(1);
}
console.log('✅ File .env.local ditemukan');

// 2. Baca environment variables
console.log('\n🔑 [2/6] Mengecek kredensial Supabase...');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envLines = envContent.split('\n');

let supabaseUrl = '';
let supabaseKey = '';

envLines.forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
    supabaseUrl = line.split('=')[1]?.trim();
  }
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
    supabaseKey = line.split('=')[1]?.trim();
  }
});

if (!supabaseUrl || supabaseUrl === 'https://your-project-id.supabase.co') {
  console.log('❌ NEXT_PUBLIC_SUPABASE_URL belum diisi atau masih default!');
  console.log('   Solusi: Edit .env.local dan isi dengan URL Supabase Anda');
  console.log('   Dapatkan dari: https://supabase.com/dashboard > Settings > API');
  process.exit(1);
}

if (!supabaseKey || supabaseKey === 'your-anon-key-here') {
  console.log('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY belum diisi atau masih default!');
  console.log('   Solusi: Edit .env.local dan isi dengan Anon Key Supabase Anda');
  console.log('   Dapatkan dari: https://supabase.com/dashboard > Settings > API');
  process.exit(1);
}

console.log('✅ Supabase URL:', supabaseUrl);
console.log('✅ Supabase Key:', supabaseKey.substring(0, 20) + '...' + supabaseKey.substring(supabaseKey.length - 10));

// 3. Test koneksi ke Supabase
console.log('\n🌐 [3/6] Testing koneksi ke Supabase...');

(async () => {
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test query sederhana
    const { data, error } = await supabase.from('store_settings').select('id').limit(1);
    
    if (error) {
      console.log('❌ Koneksi GAGAL!');
      console.log('   Error:', error.message);
      
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        console.log('\n💡 Kemungkinan: Tabel belum dibuat di database');
        console.log('   Solusi: Jalankan SUPABASE_SCHEMA.sql di Supabase SQL Editor');
        console.log('   Lokasi: https://supabase.com/dashboard > SQL Editor');
      }
      
      process.exit(1);
    }
    
    console.log('✅ Koneksi ke Supabase BERHASIL!');

    // 4. Cek tabel-tabel
    console.log('\n📊 [4/6] Mengecek tabel-tabel database...');
    
    const requiredTables = [
      'store_settings',
      'products',
      'gold_prices',
      'categories',
      'services',
      'testimonials',
      'faqs',
      'blog_posts',
      'contact_messages',
      'reservations',
      'reviews',
      'wishlist',
      'newsletters',
      'partners',
      'about_content',
      'wa_inquiries',
      'price_history',
      'hero_slides',
      'promos',
      'why_choose_us'
    ];

    let missingTables = [];
    
    for (const table of requiredTables) {
      const { error } = await supabase.from(table).select('id').limit(1);
      if (error) {
        missingTables.push(table);
      }
    }

    if (missingTables.length > 0) {
      console.log(`❌ ${missingTables.length} tabel TIDAK DITEMUKAN:`);
      missingTables.forEach(t => console.log(`   - ${t}`));
      console.log('\n💡 Solusi: Jalankan SUPABASE_SCHEMA.sql di Supabase SQL Editor');
      process.exit(1);
    }

    console.log(`✅ Semua ${requiredTables.length} tabel ditemukan!`);

    // 5. Cek data seed
    console.log('\n🌱 [5/6] Mengecek data seed...');
    
    const { data: products } = await supabase.from('products').select('id');
    const { data: goldPrices } = await supabase.from('gold_prices').select('id');
    const { data: categories } = await supabase.from('categories').select('id');
    
    console.log(`   - Products: ${products?.length || 0} items`);
    console.log(`   - Gold Prices: ${goldPrices?.length || 0} items`);
    console.log(`   - Categories: ${categories?.length || 0} items`);
    
    if (!products || products.length === 0) {
      console.log('\n⚠️  WARNING: Tidak ada data produk!');
      console.log('   Data seed mungkin belum dijalankan.');
      console.log('   Cek bagian INSERT di SUPABASE_SCHEMA.sql');
    } else {
      console.log('✅ Data seed ditemukan');
    }

    // 6. Cek storage bucket
    console.log('\n📦 [6/6] Mengecek storage bucket...');
    
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.log('❌ Gagal mengecek storage buckets');
      console.log('   Error:', bucketError.message);
    } else {
      const imagesBucket = buckets?.find(b => b.id === 'images');
      
      if (!imagesBucket) {
        console.log('❌ Bucket "images" TIDAK DITEMUKAN!');
        console.log('   Solusi:');
        console.log('   1. Buka Supabase Dashboard > Storage');
        console.log('   2. Klik "New Bucket"');
        console.log('   3. Nama: images');
        console.log('   4. CENTANG "Public bucket"');
        console.log('   5. Klik "Create Bucket"');
      } else {
        console.log('✅ Bucket "images" ditemukan');
        console.log(`   - Public: ${imagesBucket.public ? 'Yes ✅' : 'No ❌ (harus public!)'}`);
        
        if (!imagesBucket.public) {
          console.log('\n⚠️  WARNING: Bucket "images" tidak public!');
          console.log('   Solusi: Edit bucket settings dan centang "Public bucket"');
        }
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('✅ DIAGNOSTIC SELESAI - SEMUA OK!');
    console.log('='.repeat(60));
    console.log('\n📝 Langkah selanjutnya:');
    console.log('   1. Jalankan: npm run dev');
    console.log('   2. Buka: http://localhost:3000/admin');
    console.log('   3. Login dengan PIN: 240708');
    console.log('   4. Coba tambah produk baru');
    console.log('\n');

  } catch (err) {
    console.log('\n❌ ERROR:', err.message);
    console.log('\n💡 Kemungkinan masalah:');
    console.log('   1. Dependencies belum terinstall: npm install');
    console.log('   2. Kredensial Supabase salah');
    console.log('   3. Network/firewall blocking koneksi');
    console.log('\n');
    process.exit(1);
  }
})();
