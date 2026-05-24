import { supabase, hasSupabase } from './supabase';
import localProducts from '@/data/products.json';
import localGoldPrices from '@/data/gold-prices.json';
import localStoreInfo from '@/data/store-info.json';

// ============================================================
// PRODUCTS
// ============================================================
export async function getProducts(): Promise<any[]> {
  if (hasSupabase) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .order('id', { ascending: true });
    if (!error && data && data.length > 0) return data;
  }
  return localProducts;
}

export async function getProductBySlugOrId(slugOrId: string): Promise<any | null> {
  if (hasSupabase) {
    // try slug first
    const { data: bySlug } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slugOrId)
      .eq('is_active', true)
      .maybeSingle();
    if (bySlug) return bySlug;

    // then by id
    const id = parseInt(slugOrId);
    if (!isNaN(id)) {
      const { data: byId } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .maybeSingle();
      if (byId) return byId;
    }
  }
  return localProducts.find((p: any) => p.id.toString() === slugOrId || p.slug === slugOrId) || null;
}

export async function getFeaturedProducts(): Promise<any[]> {
  if (hasSupabase) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .eq('featured', true)
      .order('display_order', { ascending: true })
      .limit(8);
    if (!error && data && data.length > 0) return data;
  }
  return localProducts.filter((p: any) => p.featured).slice(0, 8);
}

export async function getRelatedProducts(category: string, excludeId: number): Promise<any[]> {
  if (hasSupabase) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .eq('category', category)
      .neq('id', excludeId)
      .limit(4);
    if (!error && data && data.length > 0) return data;
  }
  return localProducts.filter((p: any) => p.category === category && p.id !== excludeId).slice(0, 4);
}

export async function incrementProductViews(productId: number): Promise<void> {
  if (hasSupabase) {
    try {
      await supabase.from('products').select('views_count').eq('id', productId).single().then(async ({ data }) => {
        if (data) {
          await supabase.from('products').update({ views_count: (data.views_count || 0) + 1 }).eq('id', productId);
        }
      });
    } catch {
      // silent fail
    }
  }
}

// ============================================================
// GOLD PRICES
// ============================================================
export async function getGoldPrices(): Promise<{ prices: Record<string, number>; buyback?: Record<string, number>; trends?: Record<string, string>; last_updated?: string; source?: string }> {
  if (hasSupabase) {
    const { data, error } = await supabase.from('gold_prices').select('*');
    if (!error && data && data.length > 0) {
      const pricesMap: Record<string, number> = {};
      const buybackMap: Record<string, number> = {};
      const trendsMap: Record<string, string> = {};
      data.forEach((item: any) => {
        pricesMap[item.kadar] = item.price_per_gram;
        if (item.buyback_price) buybackMap[item.kadar] = item.buyback_price;
        if (item.trend) trendsMap[item.kadar] = item.trend;
      });
      return {
        prices: pricesMap,
        buyback: buybackMap,
        trends: trendsMap,
        last_updated: data[0].last_updated,
        source: 'supabase',
      };
    }
  }
  return { ...localGoldPrices, source: 'local' };
}

export async function getPriceHistory(kadar: string = '24K', days: number = 30): Promise<any[]> {
  if (hasSupabase) {
    const { data, error } = await supabase
      .from('price_history')
      .select('*')
      .eq('kadar', kadar)
      .gte('recorded_at', new Date(Date.now() - days * 86400000).toISOString())
      .order('recorded_at', { ascending: true });
    if (!error && data && data.length > 0) return data;
  }
  // Fallback: generate dummy history
  return Array.from({ length: 7 }, (_, i) => ({
    kadar,
    price_per_gram: 1080000 + i * 3000,
    recorded_at: new Date(Date.now() - (6 - i) * 86400000).toISOString(),
  }));
}

// ============================================================
// ABOUT CONTENT
// ============================================================
export async function getAboutContent(): Promise<any> {
  if (hasSupabase) {
    const { data, error } = await supabase
      .from('about_content')
      .select('*')
      .limit(1)
      .maybeSingle();
    if (!error && data) return data;
  }
  return {
    history: (localStoreInfo as any).about_history,
    extra: (localStoreInfo as any).about_extra,
    vision: (localStoreInfo as any).about_vision,
    strengths: (localStoreInfo as any).about_strengths || (localStoreInfo as any).certifications,
  };
}

// ============================================================
// CATEGORIES
// ============================================================
export async function getCategories(): Promise<any[]> {
  if (hasSupabase) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    if (!error && data && data.length > 0) return data;
  }
  return [
    { id: 1, name: 'Cincin', slug: 'cincin', icon: '💍' },
    { id: 2, name: 'Gelang', slug: 'gelang', icon: '⭕' },
    { id: 3, name: 'Kalung', slug: 'kalung', icon: '📿' },
    { id: 4, name: 'Anting', slug: 'anting', icon: '✨' },
    { id: 5, name: 'Liontin', slug: 'liontin', icon: '💎' },
    { id: 6, name: 'Batangan', slug: 'batangan', icon: '💰' },
  ];
}

// ============================================================
// SERVICES
// ============================================================
export async function getServices(): Promise<any[]> {
  if (hasSupabase) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    if (!error && data && data.length > 0) return data;
  }
  return [
    { id: 1, title: 'Custom Design Perhiasan', icon: '✏️', short_desc: 'Buat perhiasan sesuai imajinasi Anda', wa_template: 'Halo TokoDaffa, saya ingin custom design perhiasan. Bisa konsultasi?' },
    { id: 2, title: 'Sepuh / Cuci Emas', icon: '✨', short_desc: 'Kembalikan kilau emas lama Anda', wa_template: 'Halo TokoDaffa, saya ingin sepuh/cuci emas. Berapa biayanya?' },
    { id: 3, title: 'Servis & Perbaikan', icon: '🔧', short_desc: 'Perbaiki perhiasan rusak Anda', wa_template: 'Halo TokoDaffa, saya ingin servis perhiasan. Bisa diperbaiki?' },
    { id: 4, title: 'Buyback Emas', icon: '💰', short_desc: 'Jual kembali emas dengan harga pasar', wa_template: 'Halo TokoDaffa, saya ingin buyback emas. Berapa harga hari ini?' },
  ];
}

// ============================================================
// TESTIMONIALS
// ============================================================
export async function getTestimonials(featuredOnly: boolean = false): Promise<any[]> {
  if (hasSupabase) {
    let q = supabase.from('testimonials').select('*').eq('is_active', true).order('display_order', { ascending: true });
    if (featuredOnly) q = q.eq('is_featured', true);
    const { data, error } = await q;
    if (!error && data && data.length > 0) return data;
  }
  return [
    { id: 1, name: 'Sarah Wijaya', role: 'Collector', text: 'Sudah langganan TokoDaffa Gold sejak 2018. Kualitas selalu juara, harga jujur!', rating: 5 },
    { id: 2, name: 'Ahmad Malik', role: 'Investor', text: 'Investasi emas batangan di sini sangat memuaskan. Bersertifikat, buyback cepat.', rating: 5 },
    { id: 3, name: 'Dina Pratiwi', role: 'Pengantin', text: 'Order custom cincin nikah 18K. Hasilnya luar biasa, pengerjaan rapi!', rating: 5 },
  ];
}

// ============================================================
// FAQS
// ============================================================
export async function getFaqs(category?: string): Promise<any[]> {
  if (hasSupabase) {
    let q = supabase.from('faqs').select('*').eq('is_active', true).order('display_order', { ascending: true });
    if (category) q = q.eq('category', category);
    const { data, error } = await q;
    if (!error && data && data.length > 0) return data;
  }
  return [];
}

// ============================================================
// BLOG POSTS
// ============================================================
export async function getBlogPosts(limit: number = 10, featuredOnly: boolean = false): Promise<any[]> {
  if (hasSupabase) {
    let q = supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, cover_image, category, tags, author, views_count, published_at, is_featured')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(limit);
    if (featuredOnly) q = q.eq('is_featured', true);
    const { data, error } = await q;
    if (!error && data && data.length > 0) return data;
  }
  return [];
}

export async function getBlogPost(slug: string): Promise<any | null> {
  if (hasSupabase) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();
    if (!error && data) return data;
  }
  return null;
}

// ============================================================
// PARTNERS
// ============================================================
export async function getPartners(): Promise<any[]> {
  if (hasSupabase) {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    if (!error && data && data.length > 0) return data;
  }
  // fallback to local JSON
  try {
    const localPartners = require('@/data/partners.json');
    return localPartners;
  } catch {
    return [];
  }
}

// ============================================================
// PROMOS
// ============================================================
export async function getPromos(featuredOnly: boolean = false): Promise<any[]> {
  if (hasSupabase) {
    let q = supabase.from('promos').select('*').eq('is_active', true).order('display_order', { ascending: true });
    if (featuredOnly) q = q.eq('is_featured', true);
    const { data, error } = await q;
    if (!error && data && data.length > 0) return data;
  }
  return [];
}

// ============================================================
// REVIEWS
// ============================================================
export async function getProductReviews(productId: number): Promise<any[]> {
  if (hasSupabase) {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });
    if (!error && data) return data;
  }
  return [];
}

export async function submitReview(review: {
  product_id: number;
  customer_name: string;
  customer_email?: string;
  rating: number;
  title?: string;
  comment: string;
}): Promise<{ success: boolean; message: string }> {
  if (hasSupabase) {
    const { error } = await supabase.from('reviews').insert([{ ...review, is_approved: false }]);
    if (error) return { success: false, message: error.message };
    return { success: true, message: 'Review berhasil dikirim, menunggu persetujuan admin.' };
  }
  return { success: true, message: 'Review berhasil dikirim (mode offline).' };
}

// ============================================================
// WISHLIST
// ============================================================
export async function getWishlist(identifier: string): Promise<any[]> {
  if (hasSupabase && identifier) {
    const { data, error } = await supabase
      .from('wishlist')
      .select('*, products(*)')
      .eq('identifier', identifier);
    if (!error && data) return data;
  }
  return [];
}

export async function addToWishlist(identifier: string, productId: number): Promise<boolean> {
  if (hasSupabase) {
    const { error } = await supabase.from('wishlist').upsert([{ identifier, product_id: productId }]);
    return !error;
  }
  return true;
}

export async function removeFromWishlist(identifier: string, productId: number): Promise<boolean> {
  if (hasSupabase) {
    const { error } = await supabase.from('wishlist').delete().eq('identifier', identifier).eq('product_id', productId);
    return !error;
  }
  return true;
}

// ============================================================
// HERO SLIDES
// ============================================================
export async function getHeroSlides(): Promise<any[]> {
  if (hasSupabase) {
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    if (!error && data && data.length > 0) return data;
  }
  return [];
}

// ============================================================
// RESERVATIONS
// ============================================================
export async function submitReservation(data: {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  product_id?: number;
  product_name?: string;
  product_photo?: string;
  kadar?: string;
  weight?: number;
  estimated_price?: number;
  visit_date?: string;
  visit_time?: string;
  notes?: string;
  reservation_type?: string;
}): Promise<{ success: boolean; number?: string; message: string }> {
  const number = `RSV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  if (hasSupabase) {
    const { error } = await supabase.from('reservations').insert([{
      ...data,
      reservation_number: number,
      status: 'pending',
    }]);
    if (error) return { success: false, message: error.message };
    return { success: true, number, message: 'Reservasi berhasil! Admin akan konfirmasi via WhatsApp.' };
  }
  return { success: true, number, message: 'Reservasi tercatat (mode offline).' };
}

// ============================================================
// CONTACT MESSAGES
// ============================================================
export async function submitContactMessage(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; message: string }> {
  if (hasSupabase) {
    const { error } = await supabase.from('contact_messages').insert([{ ...data, status: 'new' }]);
    if (error) return { success: false, message: error.message };
    return { success: true, message: 'Pesan berhasil dikirim! Kami akan merespon segera.' };
  }
  return { success: true, message: 'Pesan diterima (mode offline).' };
}

// ============================================================
// NEWSLETTER
// ============================================================
export async function subscribeNewsletter(email: string, name?: string): Promise<{ success: boolean; message: string }> {
  if (hasSupabase) {
    const { error } = await supabase.from('newsletters').upsert([{ email, name, is_active: true }]);
    if (error) return { success: false, message: 'Email sudah terdaftar atau terjadi kesalahan.' };
    return { success: true, message: 'Berhasil subscribe newsletter!' };
  }
  return { success: true, message: 'Subscribe berhasil (mode offline).' };
}

// ============================================================
// WA TRACKING
// ============================================================
export async function trackWaClick(source: string, referenceId?: number, referenceName?: string): Promise<void> {
  if (hasSupabase) {
    try {
      await supabase.from('wa_inquiries').insert([{
        source,
        reference_id: referenceId,
        reference_name: referenceName,
      }]);
    } catch {
      // silent fail
    }
  }
}

// ============================================================
// ANALYTICS (Admin)
// ============================================================
export async function getAdminStats(): Promise<any> {
  if (!hasSupabase) return null;

  const [
    { count: totalProducts },
    { count: outOfStock },
    { count: newReservations },
    { count: newMessages },
    { count: totalReviews },
    { count: totalNewsletters },
    { count: totalWaClicks },
    { data: waBySource },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('stock', 0).eq('is_active', true),
    supabase.from('reservations').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('is_approved', false),
    supabase.from('newsletters').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('wa_inquiries').select('*', { count: 'exact', head: true }),
    supabase.from('wa_inquiries').select('source').order('created_at', { ascending: false }).limit(100),
  ]);

  return {
    totalProducts: totalProducts || 0,
    outOfStock: outOfStock || 0,
    newReservations: newReservations || 0,
    newMessages: newMessages || 0,
    pendingReviews: totalReviews || 0,
    totalNewsletters: totalNewsletters || 0,
    totalWaClicks: totalWaClicks || 0,
    waBySource: waBySource || [],
  };
}
