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

  // Hardcoded simple PIN for quick MVP implementation
  const ADMIN_PIN = "123456";

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  async function loadData() {
    const p = await getProducts();
    const g = await getGoldPrices();
    setProducts(p);
    
    // Transform back to simple state for form editing if from supabase
    // Assuming g.prices has the keys
    setPrices({
      "24K": g.prices["24K"] || 1100000,
      "22K": g.prices["22K"] || 1008000,
      "18K": g.prices["18K"] || 825000,
      "16K": g.prices["16K"] || 733000,
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
        alert("Supabase belum dikonfigurasi di Environment Variables!");
        setSaving(false);
        return;
      }

      // Update one by one
      for (const kadar of ["24K", "22K", "18K", "16K"]) {
        await supabase
          .from("gold_prices")
          .update({ price_per_gram: Number(prices[kadar]), last_updated: new Date().toISOString() })
          .eq("kadar", kadar);
      }
      alert("Berhasil update harga emas!");
    } catch (err) {
      alert("Gagal update harga");
    }
    setSaving(false);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <form onSubmit={handleLogin} style={{ background: 'var(--bg-surface)', padding: '40px', borderRadius: '12px', border: '1px solid var(--border-gold)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--gold-primary)', marginBottom: '24px' }}>Admin Login</h2>
          <input 
            type="password" 
            placeholder="Masukkan PIN" 
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            style={{ width: '100%', padding: '12px', marginBottom: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: 'white', borderRadius: '8px' }}
          />
          {error && <p style={{ color: 'var(--accent-danger)', fontSize: '0.9rem', marginBottom: '16px' }}>{error}</p>}
          <button type="submit" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center' }}>Masuk</button>
        </form>
      </div>
    );
  }

  const outOfStock = products.filter(p => p.stock === 0).length;

  return (
    <div className={styles.adminPage}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>Toko<span>Daffa</span> Admin</div>
        <nav className={styles.nav}>
          <a href="#" className={styles.active}>📊 Dashboard</a>
          <a href="#">🛍️ Produk (Akan Datang)</a>
          <a href="#">💬 WA Tracking (Akan Datang)</a>
        </nav>
        <div className={styles.logout} onClick={() => setIsAuthenticated(false)}>Keluar</div>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <h1>Dashboard (Live Database)</h1>
          <div className={styles.adminProfile}>Admin Store</div>
        </header>

        {!process.env.NEXT_PUBLIC_SUPABASE_URL && (
           <div className={styles.warningBanner}>
            <strong>⚠️ Mode Lokal Terdeteksi:</strong> Supabase URL belum ada di .env.local. Anda hanya melihat data statis. Silakan tambahkan Environment Variables.
          </div>
        )}

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>Jumlah Produk</h3>
            <div className={styles.statValue}>{products.length}</div>
          </div>
          <div className={styles.statCard} style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
            <h3>Produk Habis</h3>
            <div className={styles.statValue} style={{ color: 'var(--accent-danger)' }}>{outOfStock}</div>
          </div>
        </div>

        <div className={styles.contentGrid}>
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2>Manajemen Harga Emas</h2>
              <button className={styles.btnMock} onClick={handlePriceUpdate} disabled={saving || !prices}>
                {saving ? "Menyimpan..." : "Update Supabase"}
              </button>
            </div>
            
            {prices ? (
              <div className={styles.formGrid}>
                {["24K", "22K", "18K", "16K"].map((k) => (
                  <div className={styles.inputGroup} key={k}>
                    <label>Harga {k} (Per Gram)</label>
                    <input 
                      type="number" 
                      value={prices[k]} 
                      onChange={(e) => setPrices({...prices, [k]: e.target.value})} 
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p>Memuat harga emas...</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
