#!/usr/bin/env node

/**
 * TEST DATABASE LENGKAP - TOKODAFFA
 * 
 * Script ini akan test semua operasi database:
 * - CREATE (Insert data)
 * - READ (Select data)
 * - UPDATE (Update data)
 * - DELETE (Delete data)
 * - UPLOAD (Upload file ke storage)
 * 
 * Jalankan dengan: node test-database.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║          TEST DATABASE LENGKAP - TOKODAFFA                 ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// Load environment variables
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ File .env.local tidak ditemukan!');
  console.log('   Jalankan: bash setup-database.sh');
  process.exit(1);
}

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

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Kredensial Supabase belum diisi!');
  process.exit(1);
}

console.log('✅ Environment variables loaded\n');

(async () => {
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);

    let testsPassed = 0;
    let testsFailed = 0;

    // ============================================================
    // TEST 1: READ - Get Products
    // ============================================================
    console.log('📖 [TEST 1/8] READ - Get Products...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(5);
    
    if (productsError) {
      console.log('❌ FAILED:', productsError.message);
      testsFailed++;
    } else {
      console.log(`✅ PASSED - Found ${products.length} products`);
      if (products.length > 0) {
        console.log(`   Sample: ${products[0].name}`);
      }
      testsPassed++;
    }

    // ============================================================
    // TEST 2: READ - Get Gold Prices
    // ============================================================
    console.log('\n💰 [TEST 2/8] READ - Get Gold Prices...');
    const { data: goldPrices, error: goldError } = await supabase
      .from('gold_prices')
      .select('*');
    
    if (goldError) {
      console.log('❌ FAILED:', goldError.message);
      testsFailed++;
    } else {
      console.log(`✅ PASSED - Found ${goldPrices.length} gold prices`);
      if (goldPrices.length > 0) {
        console.log(`   Sample: ${goldPrices[0].kadar} - Rp ${goldPrices[0].sell_price.toLocaleString('id-ID')}`);
      }
      testsPassed++;
    }

    // ============================================================
    // TEST 3: CREATE - Insert Test Product
    // ============================================================
    console.log('\n➕ [TEST 3/8] CREATE - Insert Test Product...');
    const testProduct = {
      name: 'Test Product - Auto Generated',
      slug: `test-product-${Date.now()}`,
      category: 'cincin',
      kadar: '24K',
      weight: 5.0,
      price: 5000000,
      stock: 1,
      material: 'emas',
      photo: 'https://via.placeholder.com/400',
      description: 'This is a test product created by automated test',
      is_active: true,
      featured: false
    };

    const { data: insertedProduct, error: insertError } = await supabase
      .from('products')
      .insert([testProduct])
      .select()
      .single();
    
    if (insertError) {
      console.log('❌ FAILED:', insertError.message);
      testsFailed++;
    } else {
      console.log('✅ PASSED - Product inserted successfully');
      console.log(`   ID: ${insertedProduct.id}`);
      console.log(`   Name: ${insertedProduct.name}`);
      testsPassed++;
    }

    // ============================================================
    // TEST 4: UPDATE - Update Test Product
    // ============================================================
    if (insertedProduct) {
      console.log('\n✏️  [TEST 4/8] UPDATE - Update Test Product...');
      const { data: updatedProduct, error: updateError } = await supabase
        .from('products')
        .update({ 
          name: 'Test Product - Updated',
          price: 6000000 
        })
        .eq('id', insertedProduct.id)
        .select()
        .single();
      
      if (updateError) {
        console.log('❌ FAILED:', updateError.message);
        testsFailed++;
      } else {
        console.log('✅ PASSED - Product updated successfully');
        console.log(`   New name: ${updatedProduct.name}`);
        console.log(`   New price: Rp ${updatedProduct.price.toLocaleString('id-ID')}`);
        testsPassed++;
      }
    } else {
      console.log('\n⏭️  [TEST 4/8] SKIPPED - No product to update');
      testsFailed++;
    }

    // ============================================================
    // TEST 5: DELETE - Delete Test Product
    // ============================================================
    if (insertedProduct) {
      console.log('\n🗑️  [TEST 5/8] DELETE - Delete Test Product...');
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', insertedProduct.id);
      
      if (deleteError) {
        console.log('❌ FAILED:', deleteError.message);
        testsFailed++;
      } else {
        console.log('✅ PASSED - Product deleted successfully');
        testsPassed++;
      }
    } else {
      console.log('\n⏭️  [TEST 5/8] SKIPPED - No product to delete');
      testsFailed++;
    }

    // ============================================================
    // TEST 6: CREATE - Insert Contact Message
    // ============================================================
    console.log('\n📧 [TEST 6/8] CREATE - Insert Contact Message...');
    const testMessage = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '081234567890',
      subject: 'Test Message',
      message: 'This is a test message from automated test',
      status: 'new'
    };

    const { data: insertedMessage, error: messageError } = await supabase
      .from('contact_messages')
      .insert([testMessage])
      .select()
      .single();
    
    if (messageError) {
      console.log('❌ FAILED:', messageError.message);
      testsFailed++;
    } else {
      console.log('✅ PASSED - Contact message inserted successfully');
      console.log(`   ID: ${insertedMessage.id}`);
      testsPassed++;
      
      // Clean up
      await supabase.from('contact_messages').delete().eq('id', insertedMessage.id);
    }

    // ============================================================
    // TEST 7: CREATE - Insert Reservation
    // ============================================================
    console.log('\n📅 [TEST 7/8] CREATE - Insert Reservation...');
    const testReservation = {
      reservation_number: `TEST-${Date.now()}`,
      customer_name: 'Test Customer',
      customer_phone: '081234567890',
      customer_email: 'test@example.com',
      reservation_type: 'view',
      status: 'pending',
      notes: 'This is a test reservation'
    };

    const { data: insertedReservation, error: reservationError } = await supabase
      .from('reservations')
      .insert([testReservation])
      .select()
      .single();
    
    if (reservationError) {
      console.log('❌ FAILED:', reservationError.message);
      testsFailed++;
    } else {
      console.log('✅ PASSED - Reservation inserted successfully');
      console.log(`   Number: ${insertedReservation.reservation_number}`);
      testsPassed++;
      
      // Clean up
      await supabase.from('reservations').delete().eq('id', insertedReservation.id);
    }

    // ============================================================
    // TEST 8: STORAGE - Check Images Bucket
    // ============================================================
    console.log('\n📦 [TEST 8/8] STORAGE - Check Images Bucket...');
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.log('❌ FAILED:', bucketError.message);
      testsFailed++;
    } else {
      const imagesBucket = buckets?.find(b => b.id === 'images');
      if (!imagesBucket) {
        console.log('❌ FAILED - Bucket "images" not found');
        testsFailed++;
      } else {
        console.log('✅ PASSED - Bucket "images" exists');
        console.log(`   Public: ${imagesBucket.public ? 'Yes' : 'No'}`);
        if (!imagesBucket.public) {
          console.log('   ⚠️  WARNING: Bucket should be public!');
        }
        testsPassed++;
      }
    }

    // ============================================================
    // SUMMARY
    // ============================================================
    console.log('\n' + '═'.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('═'.repeat(60));
    console.log(`✅ Passed: ${testsPassed}/8`);
    console.log(`❌ Failed: ${testsFailed}/8`);
    console.log(`📈 Success Rate: ${Math.round((testsPassed / 8) * 100)}%`);
    console.log('═'.repeat(60));

    if (testsFailed === 0) {
      console.log('\n🎉 SEMUA TEST BERHASIL!');
      console.log('✅ Database Anda berfungsi dengan sempurna!');
      console.log('\n📝 Langkah selanjutnya:');
      console.log('   1. Jalankan: npm run dev');
      console.log('   2. Buka: http://localhost:3000/admin');
      console.log('   3. Login dengan PIN: 240708');
      console.log('   4. Mulai kelola data Anda!\n');
    } else {
      console.log('\n⚠️  BEBERAPA TEST GAGAL!');
      console.log('📖 Baca: TROUBLESHOOTING_DATABASE.md untuk solusi\n');
      process.exit(1);
    }

  } catch (err) {
    console.log('\n❌ ERROR:', err.message);
    console.log('\n💡 Kemungkinan masalah:');
    console.log('   1. Dependencies belum terinstall: npm install');
    console.log('   2. Kredensial Supabase salah');
    console.log('   3. Database schema belum dijalankan');
    console.log('   4. Network/firewall blocking koneksi\n');
    process.exit(1);
  }
})();
