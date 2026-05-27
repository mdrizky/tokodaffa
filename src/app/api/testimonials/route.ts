import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('id, name, role, text, rating, product_purchased')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .limit(10);

    if (error) throw error;

    return NextResponse.json({ data: data || [] });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}
