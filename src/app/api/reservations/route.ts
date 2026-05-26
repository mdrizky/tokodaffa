import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { assertAdminRequest } from "@/lib/adminAuth";

interface ReservationPayload {
  customer_name: string;
  customer_phone?: string;
  phone?: string; 
  customer_email?: string;
  product_id?: number;
  product_name?: string;
  product_photo?: string;
  kadar?: string;
  weight?: number;
  estimated_price?: number;
  visit_date?: string;
  visit_time?: string;
  appointment_date?: string; 
  notes?: string;
  reservation_type?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ReservationPayload;
    const customer_name = body.customer_name;
    const phone = body.customer_phone || body.phone;
    const product_id = body.product_id;
    const product_name = body.product_name;
    const customer_email = body.customer_email;
    const product_photo = body.product_photo;
    const kadar = body.kadar;
    const weight = body.weight;
    const estimated_price = body.estimated_price;
    const visit_date = body.visit_date || body.appointment_date;
    const visit_time = body.visit_time;
    const notes = body.notes;
    const reservation_type = body.reservation_type;

    if (!customer_name || !phone || !product_name) {
      return NextResponse.json(
        { error: "Nama, nomor WA, dan nama produk wajib diisi." },
        { status: 400 }
      );
    }

    const reservation_number = `RSV-${Date.now()}`;
    const ip_address = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

    const { data, error } = await supabase
      .from("reservations")
      .insert([
        {
          reservation_number,
          customer_name: customer_name.trim(),
          customer_phone: phone.trim(),
          phone: phone.trim(),
          customer_email: customer_email?.trim().toLowerCase() || null,
          product_id: product_id ?? null,
          product_name,
          product_photo,
          kadar,
          weight,
          estimated_price,
          visit_date: visit_date ?? null,
          appointment_date: visit_date ?? null, 
          visit_time,
          notes: notes ?? null,
          reservation_type: reservation_type || 'view',
          status: "pending",
          ip_address,
          created_at: new Date().toISOString(),
        },
      ])
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: "Gagal menyimpan reservasi.", details: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      reservation_id: data.id,
      message: 'Reservasi berhasil dibuat. Tim kami akan segera menghubungi Anda untuk konfirmasi.'
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Request tidak valid.", details: err.message }, { status: 400 });
  }
}

export async function GET(req: Request) {
  const authError = assertAdminRequest(req);
  if (authError) return authError;

  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const customer_phone = url.searchParams.get("customer_phone");
  const limit = Math.min(Number(url.searchParams.get("limit") || "50"), 200);

  let query = supabase
    .from("reservations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (status) query = query.eq("status", status);
  if (customer_phone) query = query.eq("customer_phone", customer_phone);

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: "Gagal mengambil reservasi." }, { status: 500 });

  return NextResponse.json({ success: true, data });
}

export async function PATCH(req: Request) {
  const authError = assertAdminRequest(req);
  if (authError) return authError;

  try {
    const body = await req.json() as { id?: number; status?: string; admin_notes?: string; whatsapp_sent?: boolean };
    if (!body.id) {
      return NextResponse.json({ error: "id wajib diisi." }, { status: 400 });
    }

    const updatePayload: any = { updated_at: new Date().toISOString() };
    if (body.status) {
      const allowed = ["pending", "confirmed", "completed", "cancelled"];
      if (!allowed.includes(body.status)) {
        return NextResponse.json({ error: "Status tidak valid." }, { status: 400 });
      }
      updatePayload.status = body.status;
    }
    
    if (body.admin_notes !== undefined) updatePayload.admin_notes = body.admin_notes;
    if (body.whatsapp_sent !== undefined) updatePayload.whatsapp_sent = body.whatsapp_sent;

    const { error } = await supabase
      .from("reservations")
      .update(updatePayload)
      .eq("id", body.id);

    if (error) return NextResponse.json({ error: "Gagal update status." }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Request tidak valid." }, { status: 400 });
  }
}
