"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import styles from "./page.module.css";

// ==================== ADMIN SECTIONS ====================
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import AdminProducts from "./components/AdminProducts";
import AdminGoldPrice from "./components/AdminGoldPrice";
import AdminPartners from "./components/AdminPartners";
import AdminSettings from "./components/AdminSettings";
import AdminBlog from "./components/AdminBlog";
import AdminMessages from "./components/AdminMessages";
import AdminReservations from "./components/AdminReservations";
import AdminAbout from "./components/AdminAbout";
import AdminTestimonials from "./components/AdminTestimonials";
import AdminWhyChooseUs from "./components/AdminWhyChooseUs";

export type AdminSection = 
  | "dashboard" | "products" | "gold-price" | "partners" 
  | "settings" | "blog" | "messages" | "reservations" | "about"
  | "testimonials" | "why-choose-us";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [section, setSection] = useState<AdminSection>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const pin = sessionStorage.getItem("admin_authed");
    setAuthed(pin === "true");
    setLoading(false);
  }, []);

  const handleLogin = () => {
    sessionStorage.setItem("admin_authed", "true");
    setAuthed(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authed");
    setAuthed(false);
    setSection("dashboard");
  };

  if (loading) return <div className={styles.loading}><div className={styles.spinner} /></div>;
  if (!authed) return <AdminLogin onLogin={handleLogin} />;

  const navItems = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "products", icon: "💍", label: "Produk" },
    { id: "gold-price", icon: "💰", label: "Harga Emas" },
    { id: "blog", icon: "📝", label: "Blog/Artikel" },
    { id: "reservations", icon: "📋", label: "Reservasi/Pesan" },
    { id: "messages", icon: "💬", label: "Pesan Masuk" },
    { id: "testimonials", icon: "⭐", label: "Testimoni" },
    { id: "why-choose-us", icon: "🏆", label: "Kenapa Kami" },
    { id: "partners", icon: "🤝", label: "Mitra/Partner" },
    { id: "about", icon: "ℹ️", label: "Tentang Kami" },
    { id: "settings", icon: "⚙️", label: "Pengaturan Toko" },
  ];

  const renderSection = () => {
    switch(section) {
      case "dashboard": return <AdminDashboard />;
      case "products": return <AdminProducts />;
      case "gold-price": return <AdminGoldPrice />;
      case "blog": return <AdminBlog />;
      case "reservations": return <AdminReservations />;
      case "messages": return <AdminMessages />;
      case "testimonials": return <AdminTestimonials />;
      case "why-choose-us": return <AdminWhyChooseUs />;
      case "partners": return <AdminPartners />;
      case "about": return <AdminAbout />;
      case "settings": return <AdminSettings />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarLogo}>
            <img 
              src="/images/logo_toko_4-removebg-preview.png" 
              alt="Toko Mas Daffa" 
              style={{ height: '40px', width: 'auto' }}
            />
            {sidebarOpen && <span className={styles.sidebarLogoText}>Admin Panel</span>}
          </div>
          <button className={styles.toggleBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`${styles.navItem} ${section === item.id ? styles.navItemActive : ""}`}
              onClick={() => setSection(item.id as AdminSection)}
              title={!sidebarOpen ? item.label : undefined}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {sidebarOpen && <span className={styles.navLabel}>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <a href="/" target="_blank" className={styles.viewSiteBtn} title="Lihat Website">
            <span>🌐</span>
            {sidebarOpen && <span>Lihat Website</span>}
          </a>
          <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">
            <span>🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.topBar}>
          <h1 className={styles.pageTitle}>
            {navItems.find(n => n.id === section)?.icon} {navItems.find(n => n.id === section)?.label}
          </h1>
          <div className={styles.topBarRight}>
            <span className={styles.adminBadge}>👤 Admin</span>
            <span className={styles.timestamp}>{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        <div className={styles.content}>
          {renderSection()}
        </div>
      </main>
    </div>
  );
}
