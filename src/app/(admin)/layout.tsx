import type { Metadata } from "next";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Admin Dashboard | TokoDaffa Gold",
  description: "Panel manajemen TokoDaffa Gold",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <div className="admin-root">
        {children}
      </div>
    </Providers>
  );
}
