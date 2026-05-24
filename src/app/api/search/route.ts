import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const limit = Number(searchParams.get('limit')) || 10;
    const offset = Number(searchParams.get('offset')) || 0;

    if (!query || query.trim().length < 2) {
      return NextResponse.json([]);
    }

    const searchQuery = `%${query.trim().toLowerCase()}%`;

    const { data, error } = await supabase
      .from('products')
      .select('id, name, slug, photo, kadar, weight, price, category')
      .or(
        `name.ilike.${searchQuery},category.ilike.${searchQuery},kadar.ilike.${searchQuery},description.ilike.${searchQuery},tags.cs.{${query.trim().toLowerCase()}}`
      )
      .eq(
        'is_active', true
      )

      .order('name', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Search API error:', error);
      throw error;
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error('Search API error:', err);
    return NextResponse.json({ error: 'Failed to perform search', details: err.message }, { status: 500 });
  }
}
