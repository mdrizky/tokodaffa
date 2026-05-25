import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { assertAdminRequest } from "@/lib/adminAuth";

interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ContactPayload;
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Nama, email, subjek, dan pesan wajib diisi." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("contact_messages").insert([
      {
        name,
        email,
        phone: phone || null,
        subject,
        message,
        source: "website-contact",
      },
    ]);

    if (error) {
      return NextResponse.json(
        { error: "Gagal menyimpan pesan. Coba lagi." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Pesan berhasil dikirim." });
  } catch {
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
