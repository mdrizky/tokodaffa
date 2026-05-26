import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { assertAdminRequest } from "@/lib/adminAuth";

interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ContactPayload;
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Nama, email, subjek, dan pesan wajib diisi." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.from('contact_messages').insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      subject: subject.trim(),
      message: message.trim(),
      status: 'new',
      created_at: new Date().toISOString(),
      source: "website-contact",
    }).select().single();

    if (error) {
      return NextResponse.json(
        { error: "Gagal menyimpan pesan. Coba lagi." },
        { status: 500 }
      );
    }

    // Get store WhatsApp for forward notification
    const { data: store } = await supabase.from('store_settings').select('whatsapp, name').maybeSingle();
    
    const waForwardMsg = store?.whatsapp 
      ? `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(
          `📩 Pesan Baru dari Website!\n\n👤 Nama: ${name}\n📧 Email: ${email}\n📱 HP: ${phone || '-'}\n📌 Subjek: ${subject}\n\n💬 Pesan:\n${message}\n\n— TokoDaffa Website`
        )}`
      : null;

    return NextResponse.json({ 
      success: true, 
      message: 'Pesan berhasil dikirim!',
      wa_forward: waForwardMsg,
    });
  } catch (err: any) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: "Request tidak valid." }, { status: 400 });
  }
}

export async function GET(req: Request) {
  const authError = assertAdminRequest(req);
  if (authError) return authError;

  const url = new URL(req.url);
  const limit = Math.min(Number(url.searchParams.get("limit") || "50"), 200);

  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: "Gagal mengambil data kontak." }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
