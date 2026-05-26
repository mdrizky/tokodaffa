import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { assertAdminRequest } from "@/lib/adminAuth";

interface WATrackPayload {
  event?: "product_inquiry" | "reservation_click" | "contact_click";
  product_id?: number;
  product_name?: string;
  referrer?: string;
  
  source?: string;
  reference_id?: number;
  reference_name?: string;
  message_template?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as WATrackPayload;

    const eventType = body.event || body.source;
    if (!eventType) {
      return NextResponse.json({ error: "event/source wajib diisi" }, { status: 400 });
    }

    const ip_address = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const user_agent = req.headers.get('user-agent') || 'unknown';
    const device_type = user_agent.match(/Mobile|Android|iPhone|iPad|iPod/i) ? 'mobile' : 'desktop';

    // Track in wa_inquiries
    const { error } = await supabase.from('wa_inquiries').insert({
      source: eventType,
      reference_id: body.product_id || body.reference_id || null,
      reference_name: body.product_name || body.reference_name || null,
      message_template: body.message_template || null,
      ip_address,
      user_agent,
      device_type,
      created_at: new Date().toISOString(),
    });

    if (error) {
      return NextResponse.json({ error: "Gagal track event.", details: error.message }, { status: 500 });
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
    .from("wa_inquiries")
    .select("source, created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) return NextResponse.json({ error: "Gagal mengambil data WA." }, { status: 500 });

  const summary = data.reduce<Record<string, number>>((acc, item) => {
    if (item.source) {
      acc[item.source] = (acc[item.source] || 0) + 1;
    }
    return acc;
  }, {});

  return NextResponse.json({ success: true, summary, recent: data.slice(0, 50) });
}
