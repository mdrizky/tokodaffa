<<<<<<< HEAD
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { assertAdminRequest } from "@/lib/adminAuth";

interface WATrackPayload {
  event: "product_inquiry" | "reservation_click" | "contact_click";
  product_id?: number;
  product_name?: string;
  referrer?: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as WATrackPayload;

    if (!body.event) {
      return NextResponse.json({ error: "event wajib diisi" }, { status: 400 });
    }

    const { error } = await supabase.from("wa_tracking_events").insert([
      {
        event: body.event,
        product_id: body.product_id ?? null,
        product_name: body.product_name ?? null,
        referrer: body.referrer ?? null,
        tracked_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      return NextResponse.json({ error: "Gagal track event." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Request tidak valid." }, { status: 400 });
  }
}


export async function GET(req: Request) {
  const authError = assertAdminRequest(req);
  if (authError) return authError;

  const { data, error } = await supabase
    .from("wa_tracking_events")
    .select("event, tracked_at")
    .order("tracked_at", { ascending: false })
    .limit(500);

  if (error) return NextResponse.json({ error: "Gagal mengambil data WA." }, { status: 500 });

  const summary = data.reduce<Record<string, number>>((acc, item) => {
    acc[item.event] = (acc[item.event] || 0) + 1;
    return acc;
  }, {});

  return NextResponse.json({ success: true, summary, recent: data.slice(0, 50) });
}
=======
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { source, reference_id, reference_name, message_template } = body;

    if (!source) {
      return NextResponse.json({ error: 'Source is required' }, { status: 400 });
    }

    const ip_address = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const user_agent = req.headers.get('user-agent') || 'unknown';
    const device_type = user_agent.match(/Mobile|Android|iPhone|iPad|iPod/i) ? 'mobile' : 'desktop';

    const { data, error } = await supabase.from('wa_inquiries').insert({
      source,
      reference_id: reference_id || null,
      reference_name: reference_name || null,
      message_template: message_template || null,
      ip_address,
      user_agent,
      device_type,
      created_at: new Date().toISOString(),
    }).select().single();

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'WhatsApp inquiry tracked', data });
  } catch (err: any) {
    console.error('WA Track API error:', err);
    return NextResponse.json({ error: 'Failed to track WhatsApp inquiry', details: err.message }, { status: 500 });
  }
}
>>>>>>> ad8eef7 (continue)
