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
