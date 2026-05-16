// Vercel Build Trigger: 2026-05-06
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export const metadata: Metadata = {
  title: "Toko Mas Daffa - Jewelry Premium & Emas Berkualitas",
  description: "Belanja perhiasan emas premium, cincin, gelang, dan custom jewelry dengan harga emas realtime dan kualitas terpercaya di Toko Mas Daffa.",
  keywords: [
    "toko emas",
    "emas",
    "jewelry",
    "cincin emas",
    "emas antam",
    "toko perhiasan premium",
    "emas batangan"
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Toko Mas Daffa - Jewelry Premium",
    description: "Luxury Jewelry Premium. Belanja emas dan perhiasan dengan harga realtime.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  // Build Trigger: v2
  children: React.ReactNode;
}>) {
  // Structured Data JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    "name": "Toko Mas Daffa",
    "url": "https://tokodaffa.vercel.app", // Will be updated to domain later
    "logo": "https://tokodaffa.vercel.app/logo.png",
    "description": "Toko emas premium modern dengan koleksi jewelry dan custom cincin.",
    "image": "https://tokodaffa.vercel.app/logo.png",
  };

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Providers>
          <Navbar />
          {children}
          <Footer />
          <WhatsAppFloat />
        </Providers>
      </body>
    </html>
  );
}
