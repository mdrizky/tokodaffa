# 🚀 RENCANA IMPLEMENTASI TOKO MAS DAFFA

## 📅 TIMELINE IMPLEMENTASI

### **FASE 1: Foundation & Critical Features** (Sekarang - 2 Minggu)

#### Week 1: Core E-Commerce
- [x] Analisis lengkap sistem
- [ ] Setup database schema baru (orders, customers, cart, reviews)
- [ ] Implementasi Shopping Cart System
- [ ] Implementasi User Authentication (Supabase Auth)
- [ ] Implementasi Search & Filter produk
- [ ] Upload foto produk real (minimal 20 produk)
- [ ] Tambah data produk (target 50+ produk)

#### Week 2: Admin Enhancement
- [ ] Image upload system di admin (Supabase Storage)
- [ ] Rich text editor untuk deskripsi produk
- [ ] Real analytics dashboard (bukan mock data)
- [ ] Bulk operations (import/export CSV)
- [ ] Contact form yang berfungsi (save to DB + email)
- [ ] Activity log system
- [ ] Multi-admin dengan roles

---

## 🗄️ DATABASE SCHEMA BARU

Berikut schema yang akan ditambahkan ke Supabase:

### 1. **customers** (User Management)
```sql
CREATE TABLE customers (
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
```

### 2. **addresses** (Customer Addresses)
```sql
CREATE TABLE addresses (
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
```

### 3. **cart** (Shopping Cart)
```sql
CREATE TABLE cart (
  id SERIAL PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  custom_options JSONB DEFAULT '{}',
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. **orders** (Order Management)
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id),
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  
  -- Shipping
  shipping_address JSONB NOT NULL,
  shipping_method VARCHAR(50) NOT NULL,
  shipping_cost INTEGER NOT NULL,
  
  -- Payment
  payment_method VARCHAR(50) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'pending',
  payment_proof TEXT,
  
  -- Order Details
  subtotal INTEGER NOT NULL,
  discount INTEGER DEFAULT 0,
  total INTEGER NOT NULL,
  notes TEXT,
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE,
  shipped_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE
);
```

### 5. **order_items** (Order Line Items)
```sql
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  product_photo TEXT,
  kadar VARCHAR(10) NOT NULL,
  weight DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  price_per_unit INTEGER NOT NULL,
  subtotal INTEGER NOT NULL,
  custom_options JSONB DEFAULT '{}'
);
```

### 6. **reviews** (Product Reviews)
```sql
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  order_id INTEGER REFERENCES orders(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  images JSONB DEFAULT '[]',
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 7. **wishlist** (Customer Wishlist)
```sql
CREATE TABLE wishlist (
  id SERIAL PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(customer_id, product_id)
);
```

### 8. **coupons** (Discount Coupons)
```sql
CREATE TABLE coupons (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) NOT NULL,
  discount_value INTEGER NOT NULL,
  min_purchase INTEGER DEFAULT 0,
  max_discount INTEGER,
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 9. **activity_logs** (Admin Activity Tracking)
```sql
CREATE TABLE activity_logs (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER REFERENCES admin_users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id INTEGER,
  old_data JSONB,
  new_data JSONB,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 10. **contact_messages** (Contact Form Submissions)
```sql
CREATE TABLE contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'new',
  replied_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 11. **newsletters** (Newsletter Subscribers)
```sql
CREATE TABLE newsletters (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active',
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE
);
```

### 12. **price_history** (Gold Price History)
```sql
CREATE TABLE price_history (
  id SERIAL PRIMARY KEY,
  kadar VARCHAR(10) NOT NULL,
  price_per_gram INTEGER NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🎨 KOMPONEN BARU YANG AKAN DIBUAT

### 1. Shopping Cart
- `src/components/Cart/CartButton.tsx` - Mini cart di navbar
- `src/components/Cart/CartDrawer.tsx` - Sliding cart drawer
- `src/components/Cart/CartItem.tsx` - Item dalam cart
- `src/components/Cart/CartSummary.tsx` - Summary total
- `src/hooks/useCart.ts` - Cart state management

### 2. Authentication
- `src/components/Auth/LoginModal.tsx` - Login modal
- `src/components/Auth/RegisterModal.tsx` - Register modal
- `src/components/Auth/UserMenu.tsx` - User dropdown menu
- `src/hooks/useAuth.ts` - Auth state management

### 3. Search & Filter
- `src/components/Search/SearchBar.tsx` - Search bar dengan autocomplete
- `src/components/Search/SearchResults.tsx` - Search results
- `src/components/Filter/FilterSidebar.tsx` - Filter sidebar
- `src/components/Filter/FilterChips.tsx` - Active filters

### 4. Product Enhancement
- `src/components/Product/ProductGallery.tsx` - Image gallery dengan zoom
- `src/components/Product/ProductReviews.tsx` - Reviews section
- `src/components/Product/RelatedProducts.tsx` - Related products
- `src/components/Product/QuickView.tsx` - Quick view modal

### 5. Checkout
- `src/app/(public)/checkout/page.tsx` - Checkout page
- `src/components/Checkout/ShippingForm.tsx` - Shipping form
- `src/components/Checkout/PaymentMethod.tsx` - Payment selection
- `src/components/Checkout/OrderSummary.tsx` - Order summary

### 6. Customer Dashboard
- `src/app/(customer)/dashboard/page.tsx` - Customer dashboard
- `src/app/(customer)/orders/page.tsx` - Order history
- `src/app/(customer)/wishlist/page.tsx` - Wishlist
- `src/app/(customer)/profile/page.tsx` - Profile settings

### 7. Admin Enhancement
- `src/components/Admin/ImageUpload.tsx` - Image upload component
- `src/components/Admin/RichTextEditor.tsx` - Rich text editor
- `src/components/Admin/DataTable.tsx` - Reusable data table
- `src/components/Admin/BulkActions.tsx` - Bulk action toolbar
- `src/app/(admin)/admin/orders/page.tsx` - Order management
- `src/app/(admin)/admin/customers/page.tsx` - Customer management
- `src/app/(admin)/admin/reviews/page.tsx` - Review moderation
- `src/app/(admin)/admin/analytics/page.tsx` - Real analytics

---

## 📦 DEPENDENCIES BARU

```json
{
  "dependencies": {
    "@supabase/auth-helpers-nextjs": "^0.10.0",
    "@tiptap/react": "^2.1.13",
    "@tiptap/starter-kit": "^2.1.13",
    "react-dropzone": "^14.2.3",
    "react-hot-toast": "^2.4.1",
    "zustand": "^4.4.7",
    "date-fns": "^3.0.6",
    "react-image-zoom": "^1.3.1",
    "react-select": "^5.8.0",
    "jspdf": "^2.5.1",
    "papaparse": "^5.4.1",
    "@types/papaparse": "^5.3.14"
  }
}
```

---

## 🔄 API ROUTES BARU

### Cart API
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove` - Remove from cart
- `GET /api/cart` - Get cart items

### Order API
- `POST /api/orders/create` - Create order
- `GET /api/orders/:id` - Get order details
- `GET /api/orders` - Get customer orders
- `PUT /api/orders/:id/status` - Update order status
- `POST /api/orders/:id/cancel` - Cancel order

### Review API
- `POST /api/reviews/create` - Submit review
- `GET /api/reviews/:productId` - Get product reviews
- `PUT /api/reviews/:id/helpful` - Mark review helpful

### Customer API
- `GET /api/customer/profile` - Get profile
- `PUT /api/customer/profile` - Update profile
- `GET /api/customer/wishlist` - Get wishlist
- `POST /api/customer/wishlist/add` - Add to wishlist

### Search API
- `GET /api/search?q=query` - Search products
- `GET /api/search/suggestions?q=query` - Autocomplete

### Upload API
- `POST /api/upload/image` - Upload image to Supabase Storage

---

## 🎯 PRIORITAS IMPLEMENTASI HARI INI

1. ✅ Buat analisis lengkap (DONE)
2. ⏳ Buat database schema baru
3. ⏳ Implementasi Shopping Cart System
4. ⏳ Implementasi Search Bar
5. ⏳ Implementasi User Authentication
6. ⏳ Perbaiki Admin Dashboard (real data)
7. ⏳ Implementasi Image Upload

---

**Status**: 🟢 Ready to implement
**Next Action**: Create database migration file
