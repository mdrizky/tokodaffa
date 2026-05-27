import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('why_choose_us')
      .select('id, title, description, icon, statistic')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .limit(10);

    if (error) throw error;

    return NextResponse.json({ data: data || [] });
  } catch (error) {
    console.error('Error fetching why_choose_us:', error);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}
