<<<<<<< HEAD
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
=======
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customer_name,
      customer_phone,
      customer_email,
      product_id,
      product_name,
      product_photo,
      kadar,
      weight,
      estimated_price,
      visit_date,
      visit_time,
      notes,
      reservation_type,
    } = body;

    if (!customer_name || !customer_phone || !visit_date || !visit_time) {
      return NextResponse.json({ error: 'Data reservasi tidak lengkap' }, { status: 400 });
    }

    const reservation_number = `RSV-${Date.now()}`;
    const ip_address = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const user_agent = req.headers.get('user-agent') || 'unknown';

    const { data, error } = await supabase.from('reservations').insert({
      reservation_number,
      customer_name: customer_name.trim(),
      customer_phone: customer_phone.trim(),
      customer_email: customer_email?.trim().toLowerCase() || null,
      product_id,
      product_name,
      product_photo,
      kadar,
      weight,
      estimated_price,
      visit_date,
      visit_time,
      notes,
      reservation_type: reservation_type || 'view',
      status: 'pending',
      ip_address,
      created_at: new Date().toISOString(),
    }).select().single();

    if (error) throw error;

    // Send WhatsApp notification to store (optional, can be moved to a webhook)
    const { data: storeSettings } = await supabase.from('store_settings').select('whatsapp').single();
    if (storeSettings?.whatsapp) {
      const waMessage = encodeURIComponent(
        `🔔 Reservasi Baru!\n\nNomor Reservasi: ${reservation_number}\nNama: ${customer_name}\nTelepon: ${customer_phone}\nEmail: ${customer_email || '-'}\n\nProduk: ${product_name || 'Tidak Spesifik'}\nKadar: ${kadar || '-'}\nBerat: ${weight || '-'}\nHarga Estimasi: ${estimated_price ? `Rp ${estimated_price.toLocaleString('id-ID')}` : '-'}\n\nTanggal Kunjungan: ${visit_date}\nWaktu Kunjungan: ${visit_time}\n\nCatatan: ${notes || '-'}\n\nTipe Reservasi: ${reservation_type || 'view'}\n\nMohon segera konfirmasi reservasi ini.`
      );
      // In a real app, this would be a server-side call to a WhatsApp API, not a direct link.
      // For now, we'll just indicate it for tracking.
      console.log(`WhatsApp Admin Link: https://wa.me/${storeSettings.whatsapp}?text=${waMessage}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Reservasi berhasil dibuat. Tim kami akan segera menghubungi Anda untuk konfirmasi.',
      data,
    });
  } catch (err: any) {
    console.error('Reservation API error:', err);
    return NextResponse.json({ error: 'Gagal membuat reservasi', details: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const status = searchParams.get('status');
  const customer_phone = searchParams.get('customer_phone');

  let query = supabase.from('reservations').select('*');

  if (id) {
    query = query.eq('id', id);
  }
  if (status) {
    query = query.eq('status', status);
  }
  if (customer_phone) {
    query = query.eq('customer_phone', customer_phone);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, admin_notes, whatsapp_sent } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID reservasi tidak ditemukan' }, { status: 400 });
    }

    const updatePayload: any = { updated_at: new Date().toISOString() };
    if (status) updatePayload.status = status;
    if (admin_notes) updatePayload.admin_notes = admin_notes;
    if (whatsapp_sent !== undefined) updatePayload.whatsapp_sent = whatsapp_sent;

    const { data, error } = await supabase
      .from('reservations')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Reservasi berhasil diperbarui', data });
  } catch (err: any) {
    console.error('Reservation PUT API error:', err);
    return NextResponse.json({ error: 'Gagal memperbarui reservasi', details: err.message }, { status: 500 });
>>>>>>> ad8eef7 (continue)
  }
}
