"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { getProducts, getGoldPrices } from "@/lib/dataFetch";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const [products, setProducts] = useState<any[]>([]);
  const [prices, setPrices] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const ADMIN_PIN = "240708daffa";

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  async function loadData() {
    const p = await getProducts();
    const g = await getGoldPrices();
    setProducts(p);
    
    setPrices({
      "24K": g.prices["24K"] || 1100000,
      "22K": g.prices["22K"] || 1008000,
      "18K": g.prices["18K"] || 825000,
      "16K": g.prices["16K"] || 733000,
      "Perak": g.prices["Perak"] || 15000,
    });
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("PIN salah!");
    }
  };

  const handlePriceUpdate = async () => {
    setSaving(true);
    try {
      const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!hasSupabase) {
        alert("Supabase belum dikonfigurasi!");
        setSaving(false);
        return;
      }

      for (const kadar of ["24K", "22K", "18K", "16K", "Perak"]) {
        await supabase
          .from("gold_prices")
          .update({ price_per_gram: Number(prices[kadar]), last_updated: new Date().toISOString() })
          .eq("kadar", kadar);
      }
      alert("Berhasil update harga!");
    } catch (err) {
      alert("Gagal update harga");
    }
    setSaving(false);
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.loginPage}>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <div className={styles.loginLogo}>◆</div>
            <h2>TokoDaffa Gold</h2>
            <p>Admin Control Panel</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className={styles.inputGroup}>
              <label>Security PIN</label>
              <input 
                type="password" 
                placeholder="••••••••••" 
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                autoFocus
              />
            </div>
            {error && <p className={styles.loginError}>{error}</p>}
            <button type="submit" className={styles.loginBtn}>Unlock Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  const outOfStock = products.filter(p => p.stock === 0).length;
  const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);

  return (
    <div className={styles.adminContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <span className={styles.brandIcon}>◆</span>
          <span className={styles.brandText}>TokoDaffa <span>Admin</span></span>
        </div>
        
        <nav className={styles.sidebarNav}>
          <button className={activeTab === 'dashboard' ? styles.navActive : ''} onClick={() => setActiveTab('dashboard')}>
            <span className={styles.navIcon}>📊</span> Dashboard
          </button>
          <button className={activeTab === 'prices' ? styles.navActive : ''} onClick={() => setActiveTab('prices')}>
            <span className={styles.navIcon}>💰</span> Harga Emas & Perak
          </button>
          <button className={activeTab === 'products' ? styles.navActive : ''} onClick={() => setActiveTab('products')}>
            <span className={styles.navIcon}>🛍️</span> Inventori Produk
          </button>
          <button className={activeTab === 'settings' ? styles.navActive : ''} onClick={() => setActiveTab('settings')}>
            <span className={styles.navIcon}>⚙️</span> Pengaturan Toko
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <button onClick={() => setIsAuthenticated(false)} className={styles.logoutBtn}>
             🚪 Keluar Sesi
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <header className={styles.mainHeader}>
          <div className={styles.headerTitle}>
            <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
            <p>Selamat datang kembali, Admin Daffa.</p>
          </div>
          <div className={styles.headerActions}>
            <span className={styles.statusBadge}>● Sistem Online</span>
          </div>
        </header>

        <div className={styles.content}>
          {activeTab === 'dashboard' && (
            <>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon} style={{ background: '#fef3c7', color: '#d97706' }}>📦</div>
                  <div className={styles.statInfo}>
                    <label>Total Produk</label>
                    <strong>{products.length}</strong>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon} style={{ background: '#fee2e2', color: '#dc2626' }}>⚠️</div>
                  <div className={styles.statInfo}>
                    <label>Stok Habis</label>
                    <strong style={{ color: '#dc2626' }}>{outOfStock}</strong>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon} style={{ background: '#dcfce7', color: '#16a34a' }}>💰</div>
                  <div className={styles.statInfo}>
                    <label>Estimasi Nilai Stok</label>
                    <strong>Rp {(totalValue / 1000000).toFixed(1)}jt</strong>
                  </div>
                </div>
              </div>

              <div className={styles.dashboardGrid}>
                <div className={styles.panel}>
                  <div className={styles.panelHeader}>
                    <h3>Update Cepat Harga Hari Ini</h3>
                    <button className={styles.primaryBtn} onClick={handlePriceUpdate} disabled={saving}>
                      {saving ? "Menyimpan..." : "Simpan Ke Database"}
                    </button>
                  </div>
                  {prices && (
                    <div className={styles.quickPrices}>
                      {Object.entries(prices).map(([k, v]: [string, any]) => (
                        <div className={styles.priceField} key={k}>
                          <label>{k}</label>
                          <input 
                            type="number" 
                            value={v} 
                            onChange={(e) => setPrices({...prices, [k]: e.target.value})} 
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab !== 'dashboard' && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🚧</div>
              <h2>Fitur Dalam Pengembangan</h2>
              <p>Halaman {activeTab} sedang dalam proses integrasi database. Silakan gunakan Dashboard untuk saat ini.</p>
            </div>
          )}
        </div>
      </main>
    </div>
    </div>
  );
}
