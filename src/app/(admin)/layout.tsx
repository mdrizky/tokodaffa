import type { Metadata } from "next";


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
    <div className="admin-root">
      {children}
    </div>
  );
}
