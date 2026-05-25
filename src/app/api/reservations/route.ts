import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { assertAdminRequest } from "@/lib/adminAuth";

interface ReservationPayload {
  customer_name: string;
  phone: string;
  product_id?: number;
  product_name: string;
  appointment_date?: string;
  notes?: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ReservationPayload;
    const { customer_name, phone, product_id, product_name, appointment_date, notes } = body;

    if (!customer_name || !phone || !product_name) {
      return NextResponse.json(
        { error: "Nama, nomor WA, dan nama produk wajib diisi." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("reservations")
      .insert([
        {
          customer_name,
          phone,
          product_id: product_id ?? null,
          product_name,
          appointment_date: appointment_date ?? null,
          notes: notes ?? null,
          status: "pending",
        },
      ])
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: "Gagal menyimpan reservasi." }, { status: 500 });
    }

    return NextResponse.json({ success: true, reservation_id: data.id });
  } catch {
    return NextResponse.json({ error: "Request tidak valid." }, { status: 400 });
  }
}


export async function GET(req: Request) {
  const authError = assertAdminRequest(req);
  if (authError) return authError;

  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const limit = Math.min(Number(url.searchParams.get("limit") || "50"), 200);

  let query = supabase
    .from("reservations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (status) query = query.eq("status", status);

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: "Gagal mengambil reservasi." }, { status: 500 });

  return NextResponse.json({ success: true, data });
}

export async function PATCH(req: Request) {
  const authError = assertAdminRequest(req);
  if (authError) return authError;

  try {
    const body = await req.json() as { id?: number; status?: string };
    if (!body.id || !body.status) {
      return NextResponse.json({ error: "id dan status wajib diisi." }, { status: 400 });
    }

    const allowed = ["pending", "confirmed", "completed", "cancelled"];
    if (!allowed.includes(body.status)) {
      return NextResponse.json({ error: "Status tidak valid." }, { status: 400 });
    }

    const { error } = await supabase
      .from("reservations")
      .update({ status: body.status })
      .eq("id", body.id);

    if (error) return NextResponse.json({ error: "Gagal update status." }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Request tidak valid." }, { status: 400 });
  }
}
