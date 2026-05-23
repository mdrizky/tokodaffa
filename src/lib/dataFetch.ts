import { supabase } from './supabase';
import localProducts from '@/data/products.json';
import localGoldPrices from '@/data/gold-prices.json';

const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function getProducts() {
  if (hasSupabase) {
    const { data, error } = await supabase.from('products').select('*').order('id');
    if (!error && data) return data;
  }
  return localProducts;
}

export async function getGoldPrices() {
  if (hasSupabase) {
    const { data, error } = await supabase.from('gold_prices').select('*');
    if (!error && data && data.length > 0) {
      const pricesMap: Record<string, number> = {};
      data.forEach((item) => {
        pricesMap[item.kadar] = item.price_per_gram;
      });
      return { prices: pricesMap, last_updated: data[0].last_updated };
    }
  }
  return localGoldPrices;
}

export async function getAboutContent() {
  if (hasSupabase) {
    const { data, error } = await supabase.from('about_content').select('*').limit(1).single();
    if (!error && data) {
      return {
        history: data.history,
        extra: data.extra,
        vision: data.vision,
        strengths: data.strengths,
      };
    }
  }

  return {
    history: localStoreInfo.about_history,
    extra: localStoreInfo.about_extra,
    vision: localStoreInfo.about_vision,
    strengths: localStoreInfo.about_strengths || localStoreInfo.certifications,
  };
}
