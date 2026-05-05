import Link from "next/link";
import styles from "./page.module.css";
import products from "@/data/products.json";

export default function AdminDashboardMock() {
  const totalProducts = products.length;
  const outOfStock = products.filter(p => p.stock === 0).length;
  
  return (
    <div className={styles.adminPage}>
      {/* Sidebar Mock */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>Toko<span>Daffa</span> Admin</div>
        <nav className={styles.nav}>
          <a href="#" className={styles.active}>📊 Dashboard</a>
          <a href="#">🛍️ Produk</a>
          <a href="#">🪙 Harga Emas</a>
          <a href="#">🛠️ Layanan</a>
          <a href="#">💬 WA Tracking</a>
          <a href="#">⚙️ Settings</a>
        </nav>
        <div className={styles.logout}>Keluar</div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <header className={styles.header}>
          <h1>Dashboard (Preview)</h1>
          <div className={styles.adminProfile}>Admin Store</div>
        </header>

        {/* Warning Banner */}
        <div className={styles.warningBanner}>
          <strong>⚠️ Tampilan Demonstrasi:</strong> Ini adalah versi visual dari konsep Admin Panel. Untuk membuat tombol-tombol di bawah ini berfungsi merubah data secara otomatis tanpa *coding*, sistem perlu disambungkan ke database Supabase (Fase 2).
        </div>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>Jumlah Produk</h3>
            <div className={styles.statValue}>{totalProducts}</div>
          </div>
          <div className={styles.statCard} style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
            <h3>Produk Habis</h3>
            <div className={styles.statValue} style={{ color: 'var(--accent-danger)' }}>{outOfStock}</div>
          </div>
          <div className={styles.statCard}>
            <h3>Klik WA Hari Ini</h3>
            <div className={styles.statValue}>128 <span style={{fontSize:'0.9rem', color:'var(--accent-success)'}}>↑ 12%</span></div>
          </div>
          <div className={styles.statCard}>
            <h3>Harga 24K Saat Ini</h3>
            <div className={styles.statValue} style={{ fontSize: '1.5rem'}}>Rp 1.100.000 /g</div>
          </div>
        </div>

        {/* Action Sections */}
        <div className={styles.contentGrid}>
          
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2>Manajemen Harga Emas (Mock)</h2>
              <button className={styles.btnMock}>Update Semua</button>
            </div>
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label>Harga 24K (Per Gram)</label>
                <input type="text" value="1100000" readOnly />
              </div>
              <div className={styles.inputGroup}>
                <label>Harga 22K (Per Gram)</label>
                <input type="text" value="1008000" readOnly />
              </div>
              <div className={styles.inputGroup}>
                <label>Harga 18K (Per Gram)</label>
                <input type="text" value="825000" readOnly />
              </div>
              <div className={styles.inputGroup}>
                <label>Harga 16K (Per Gram)</label>
                <input type="text" value="733000" readOnly />
              </div>
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2>WA Tracking (Mock)</h2>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '0.9rem' }}>Produk paling sering ditanyakan via WhatsApp bulan ini:</p>
            <table className={styles.mockTable}>
              <thead>
                <tr>
                  <th>Produk</th>
                  <th>Jumlah Klik WA</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Cincin Emas Polos Classic (24K)</td>
                  <td><span style={{ color: 'var(--gold-primary)', fontWeight: 'bold' }}>45 klik</span></td>
                </tr>
                <tr>
                  <td>Kalung Emas Liontin Hati (18K)</td>
                  <td>28 klik</td>
                </tr>
                <tr>
                  <td>Emas Batangan 10 Gram</td>
                  <td>15 klik</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </main>
    </div>
  );
}
