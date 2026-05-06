import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "TokoDaffa Gold — Kedai Emas Terpercaya | Perhiasan & Investasi Emas",
  description: "Kedai emas terpercaya dengan koleksi perhiasan emas berkualitas tinggi 24K, 22K, 18K, 16K. Harga transparan, garansi buyback 100%, sertifikat keaslian.",
  keywords: "emas, gold, perhiasan, jewelry, 24K, 22K, investasi emas, kedai emas, toko emas, medan",
  openGraph: {
    title: "TokoDaffa Gold — Kedai Emas Terpercaya",
    description: "Koleksi perhiasan emas berkualitas tinggi dengan harga transparan dan garansi buyback 100%.",
    type: "website",
  },
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppFloat />
    </Providers>
  );
}
