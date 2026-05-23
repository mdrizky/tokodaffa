import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const ADMIN_PIN = process.env.ADMIN_PIN || process.env.NEXT_PUBLIC_ADMIN_PIN || '240708daffa';

function verifyAdmin(req: NextRequest) {
  const token = req.headers.get('x-admin-token') || req.headers.get('authorization')?.replace('Bearer ', '');
  return token === ADMIN_PIN;
}

const localStoreInfo = {
  history: 'Didirikan pada tahun 2005, TokoDaffa Gold telah menjadi destinasi terpercaya untuk koleksi perhiasan berkualitas dan layanan investasi emas.',
  extra: 'Kami mengutamakan kejujuran, transparansi harga, dan layanan purna jual yang responsif untuk setiap pelanggan.',
  vision: 'Menjadi standar emas di industri perhiasan ritel dengan mengedepankan kualitas, kepercayaan, dan layanan inovatif.',
  strengths: [
    'Sertifikat Keaslian Resmi',
    'Garansi Buyback 100% Sesuai Pasar',
    'Timbangan Digital Tersertifikasi Metrologi',
    'Jaminan Harga Paling Transparan',
  ],
};

export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json(localStoreInfo);
  }

  const { data, error } = await supabase.from('about_content').select('*').limit(1).single();
  if (!error && data) {
    return NextResponse.json({
      history: data.history || localStoreInfo.history,
      extra: data.extra || localStoreInfo.extra,
      vision: data.vision || localStoreInfo.vision,
      strengths: data.strengths || localStoreInfo.strengths,
      updated_at: data.updated_at || null,
    });
  }

  return NextResponse.json(localStoreInfo);
}

export async function PUT(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { history, extra, vision, strengths } = body;

  if (!history || !vision) {
    return NextResponse.json({ error: 'History and vision are required' }, { status: 400 });
  }

  const { data: existing } = await supabase.from('about_content').select('id').limit(1).single();

  if (existing?.id) {
    const { error } = await supabase
      .from('about_content')
      .update({ history, extra, vision, strengths, updated_at: new Date().toISOString() })
      .eq('id', existing.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'About content updated successfully' });
  }

  const { error } = await supabase.from('about_content').insert([{
    history,
    extra,
    vision,
    strengths,
  }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'About content created successfully' });
}

export async function DELETE(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: existing, error: selectError } = await supabase.from('about_content').select('id').limit(1).single();
  if (selectError || !existing?.id) {
    return NextResponse.json({ error: 'No about content found' }, { status: 404 });
  }

  const { error } = await supabase.from('about_content').delete().eq('id', existing.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'About content deleted successfully' });
}
