// Vercel Build Trigger: 2026-05-06
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TokoDaffa Gold — Kedai Emas Terpercaya",
  description: "Kedai emas terpercaya dengan koleksi perhiasan emas berkualitas tinggi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  // Build Trigger: v2
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
