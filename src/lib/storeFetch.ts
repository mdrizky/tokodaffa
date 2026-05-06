import { supabase } from './supabase';
import localStoreInfo from '@/data/store-info.json';

const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function getStoreInfo() {
  if (hasSupabase) {
    const { data, error } = await supabase.from('store_settings').select('*').limit(1).single();
    if (!error && data) {
      return {
        ...localStoreInfo, // Fallback fields
        ...data,
      };
    }
  }
  return localStoreInfo;
}
