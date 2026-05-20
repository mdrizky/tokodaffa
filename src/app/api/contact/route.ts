import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Semua field wajib diisi kecuali nomor telepon" },
        { status: 400 }
      );
    }

    // Get admin email from environment or use default
    const adminEmail = process.env.ADMIN_EMAIL || "admin@tokodaffa.com";

    // In a real implementation, you would use an email service like:
    // - Nodemailer (if using SMTP)
    // - SendGrid
    // - Mailgun
    // - Resend
    // - AWS SES

    // For now, we'll log the message and return success
    console.log("=== NEW CONTACT FORM SUBMISSION ===");
    console.log(`From: ${name} (${email})`);
    console.log(`Phone: ${phone || "Not provided"}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    console.log("====================================");

    // TODO: Implement actual email sending
    // Example with Nodemailer (requires SMTP configuration):
    /*
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: adminEmail,
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });
    */

    return NextResponse.json(
      { success: true, message: "Pesan berhasil dikirim" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengirim pesan" },
      { status: 500 }
    );
  }
}
