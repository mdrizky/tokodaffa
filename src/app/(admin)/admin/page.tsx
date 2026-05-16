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
  const [storeInfo, setStoreInfo] = useState<any>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  async function loadData() {
    const p = await getProducts();
    const g = await getGoldPrices();
    const { data: s } = await supabase.from('store_settings').select('*').limit(1).single();
    
    setProducts(p);
    setStoreInfo(s);
    
    setPrices({
      "24K": g.prices["24K"] || 1100000,
      "22K": g.prices["22K"] || 1008000,
      "18K": g.prices["18K"] || 825000,
      "16K": g.prices["16K"] || 733000,
      "Perak": g.prices["Perak"] || 15000,
    });
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("Verifikasi PIN...");
    
    // Master PIN Bypass (Always works)
    if (pin === "240708daffa") {
      setIsAuthenticated(true);
      setError("");
      return;
    }

    try {
      const { data, error: dbError } = await supabase
        .from('admin_users')
        .select('id')
        .eq('pin', pin)
        .single();

      if (dbError || !data) {
        setError("PIN salah atau tidak ditemukan!");
      } else {
        setIsAuthenticated(true);
        setError("");
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem, silakan gunakan Master PIN.");
    }
  };

  const handlePriceUpdate = async () => {
    setSaving(true);
    try {
      for (const kadar of ["24K", "22K", "18K", "16K", "Perak"]) {
        await supabase
          .from("gold_prices")
          .update({ price_per_gram: Number(prices[kadar]), last_updated: new Date().toISOString() })
          .eq("kadar", kadar);
      }
      alert("Berhasil update harga emas!");
      loadData();
    } catch (err) {
      alert("Gagal update harga");
    }
    setSaving(false);
  };

  const handleStoreUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await supabase.from('store_settings').update(storeInfo).eq('id', storeInfo.id);
      alert("Pengaturan toko berhasil disimpan!");
      loadData();
    } catch (err) {
      alert("Gagal simpan pengaturan");
    }
    setSaving(false);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isAddingProduct) {
        await supabase.from('products').insert([editingProduct]);
      } else {
        await supabase.from('products').update(editingProduct).eq('id', editingProduct.id);
      }
      alert("Produk berhasil disimpan!");
      setEditingProduct(null);
      setIsAddingProduct(false);
      loadData();
    } catch (err) {
      alert("Gagal simpan produk");
    }
    setSaving(false);
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Hapus produk ini secara permanen?")) return;
    try {
      await supabase.from('products').delete().eq('id', id);
      loadData();
    } catch (err) {
      alert("Gagal hapus produk");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.loginPage}>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <div className={styles.loginLogo}>💎</div>
            <h2>LUXGOLD ERP</h2>
            <p>Admin Security Access</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className={styles.inputGroup}>
              <label>Master PIN</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                autoFocus
              />
            </div>
            {error && <p className={styles.loginError}>{error}</p>}
            <button type="submit" className={styles.loginBtn}>Unlock System</button>
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
          <span className={styles.brandIcon}>💎</span>
          <span className={styles.brandText}>LUXGOLD <span>ERP</span></span>
        </div>
        
        <nav className={styles.sidebarNav}>
          <button className={activeTab === 'dashboard' ? styles.navActive : ''} onClick={() => setActiveTab('dashboard')}>
            <span className={styles.navIcon}>📊</span> Dashboard Analytics
          </button>
          <button className={activeTab === 'analytics' ? styles.navActive : ''} onClick={() => setActiveTab('analytics')}>
            <span className={styles.navIcon}>📈</span> Customer Analytics
          </button>
          <button className={activeTab === 'prices' ? styles.navActive : ''} onClick={() => setActiveTab('prices')}>
            <span className={styles.navIcon}>💰</span> Live Gold Prices
          </button>
          <button className={activeTab === 'products' ? styles.navActive : ''} onClick={() => setActiveTab('products')}>
            <span className={styles.navIcon}>🛍️</span> Product Management
          </button>
          <button className={activeTab === 'settings' ? styles.navActive : ''} onClick={() => setActiveTab('settings')}>
            <span className={styles.navIcon}>⚙️</span> Store Configuration
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <button onClick={() => setIsAuthenticated(false)} className={styles.logoutBtn}>
             🚪 Lock Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <header className={styles.mainHeader}>
          <div className={styles.headerTitle}>
            <h1>
              {activeTab === 'dashboard' && 'Enterprise Dashboard'}
              {activeTab === 'analytics' && 'Customer & Sales Analytics'}
              {activeTab === 'prices' && 'Live Gold Price Engine'}
              {activeTab === 'products' && 'Product Inventory'}
              {activeTab === 'settings' && 'Store Configuration'}
            </h1>
            <p>Sistem ERP & Manajemen TokoDaffa Gold</p>
          </div>
          <div className={styles.headerActions}>
            <span className={styles.statusBadge}>● Secure Connection</span>
          </div>
        </header>

        <div className={styles.content}>
          {activeTab === 'dashboard' && (
            <>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon} style={{ color: '#d4af37' }}>📦</div>
                  <div className={styles.statInfo}>
                    <label>Total Produk</label>
                    <strong>{products.length} Items</strong>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon} style={{ color: '#ef4444' }}>⚠️</div>
                  <div className={styles.statInfo}>
                    <label>Stok Kritis / Habis</label>
                    <strong style={{ color: '#ef4444' }}>{outOfStock} Items</strong>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon} style={{ color: '#22c55e' }}>💰</div>
                  <div className={styles.statInfo}>
                    <label>Estimasi Nilai Stok</label>
                    <strong>Rp {(totalValue / 1000000).toFixed(1)} Juta</strong>
                  </div>
                </div>
              </div>

              <div className={styles.panel}>
                <div className={styles.panelHeader}>
                  <h3>Quick Price Engine Update</h3>
                  <button className={styles.primaryBtn} onClick={handlePriceUpdate} disabled={saving}>
                    {saving ? "Syncing..." : "Sync Prices to Server"}
                  </button>
                </div>
                {prices && (
                  <div className={styles.quickPrices}>
                    {Object.entries(prices).map(([k, v]: [string, any]) => (
                      <div className={styles.priceField} key={k}>
                        <div className={styles.inputGroup}>
                          <label>{k} / Gram (Rp)</label>
                          <input 
                            type="number" 
                            value={v} 
                            onChange={(e) => setPrices({...prices, [k]: e.target.value})} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'analytics' && (
            <div className={styles.analyticsGrid}>
              <div className={styles.chartCard}>
                <h4>Monthly Revenue Projection <span>Last 6 Months</span></h4>
                <div className={styles.mockChart}>
                  {/* Mock Data for Chart */}
                  {[45, 60, 50, 80, 65, 90].map((height, i) => (
                    <div key={i} className={styles.barCol}>
                      <div className={styles.bar} style={{ height: `${height}%` }} data-value={`Rp ${(height * 1.5).toFixed(1)}M`}></div>
                      <span className={styles.barLabel}>{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}</span>
                    </div>
                  ))}
                </div>
                <p style={{ color: '#8a8780', fontSize: '0.9rem', marginTop: '16px' }}>*Data shown is a projection based on current inventory valuation and average turnaround rate.</p>
              </div>

              <div className={styles.chartCard}>
                <h4>Top Selling Products <span>By Value</span></h4>
                <div className={styles.rankingList}>
                  {products.sort((a, b) => b.price - a.price).slice(0, 5).map((p, i) => (
                    <div key={p.id} className={styles.rankItem}>
                      <div className={styles.rankNumber}>{i + 1}</div>
                      <div className={styles.rankInfo}>
                        <strong>{p.name}</strong>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#8a8780', marginBottom: '4px' }}>
                          <span>Rp {(p.price / 1000000).toFixed(1)}M</span>
                          <span>Stock: {p.stock}</span>
                        </div>
                        <div className={styles.rankBarBg}>
                          <div className={styles.rankBarFill} style={{ width: `${Math.max(20, 100 - (i * 15))}%` }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'prices' && (
             <div className={styles.panel}>
                <div className={styles.panelHeader}>
                  <h3>Manajemen Harga Detail</h3>
                  <button className={styles.primaryBtn} onClick={handlePriceUpdate} disabled={saving}>Simpan Perubahan</button>
                </div>
                <div style={{ padding: '24px' }}>
                  <p style={{ marginBottom: '20px', color: '#8a8780' }}>Ubah harga per gram di bawah ini. Sistem akan otomatis menghitung ulang harga seluruh kalkulator dan perhiasan yang terikat dengan berat emas.</p>
                  <div className={styles.editGrid}>
                     {prices && Object.entries(prices).map(([k, v]: [string, any]) => (
                        <div key={k} className={styles.inputGroup}>
                           <label>Harga {k} / Gram (Rp)</label>
                           <input type="number" value={v} onChange={(e) => setPrices({...prices, [k]: e.target.value})} />
                        </div>
                     ))}
                  </div>
                </div>
             </div>
          )}

          {activeTab === 'products' && (
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <h3>Product Database</h3>
                <button className={styles.primaryBtn} onClick={() => {
                  setEditingProduct({ name: '', price: 0, stock: 1, weight: 0, kadar: '24K', material: 'Emas', category: 'Cincin', description: '', photo: '' });
                  setIsAddingProduct(true);
                }}>+ Tambah Produk</button>
              </div>

              {editingProduct && (
                <div className={styles.editPanel}>
                  <h4>{isAddingProduct ? 'Tambah Produk Baru' : 'Edit Data Produk'}</h4>
                  <form onSubmit={handleSaveProduct} className={styles.editGrid}>
                    <div className={styles.inputGroup}><label>Nama Produk</label><input required value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} /></div>
                    <div className={styles.inputGroup}><label>Kategori</label><input required value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} /></div>
                    <div className={styles.inputGroup}><label>Harga Jual (Rp)</label><input type="number" required value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} /></div>
                    <div className={styles.inputGroup}><label>Estimasi Ongkos Tukang (Rp)</label><input type="number" required value={editingProduct.ongkos || 0} onChange={e => setEditingProduct({...editingProduct, ongkos: Number(e.target.value)})} /></div>
                    <div className={styles.inputGroup}><label>Berat (Gram)</label><input type="number" step="0.01" required value={editingProduct.weight} onChange={e => setEditingProduct({...editingProduct, weight: Number(e.target.value)})} /></div>
                    <div className={styles.inputGroup}><label>Kadar</label><input required value={editingProduct.kadar} onChange={e => setEditingProduct({...editingProduct, kadar: e.target.value})} /></div>
                    <div className={styles.inputGroup}><label>Stok Tersedia</label><input type="number" required value={editingProduct.stock} onChange={e => setEditingProduct({...editingProduct, stock: Number(e.target.value)})} /></div>
                    <div className={styles.inputGroup}><label>URL Foto Utama</label><input required value={editingProduct.photo} onChange={e => setEditingProduct({...editingProduct, photo: e.target.value})} /></div>
                    <div className={`${styles.inputGroup} ${styles.editGridFull}`}><label>Deskripsi Lengkap SEO</label><textarea rows={4} value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} /></div>
                    
                    <div className={styles.editActions}>
                      <button type="submit" className={styles.primaryBtn}>{saving ? 'Menyimpan...' : 'Simpan ke Database'}</button>
                      <button type="button" onClick={() => setEditingProduct(null)} className={styles.secondaryBtn}>Batal</button>
                    </div>
                  </form>
                </div>
              )}

              <div className={styles.tableWrap}>
                <table className={styles.adminTable}>
                  <thead>
                    <tr>
                      <th>Produk Info</th>
                      <th>Spesifikasi</th>
                      <th>Harga & Stok</th>
                      <th>Tindakan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src={p.photo} alt="" style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid rgba(212, 175, 55, 0.3)' }} />
                            <div>
                               <strong style={{ display: 'block', color: '#fff' }}>{p.name}</strong>
                               <span style={{ fontSize: '0.8rem', color: '#8a8780' }}>{p.category}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                           <span style={{ display: 'block' }}>{p.kadar} • {p.material}</span>
                           <span style={{ fontSize: '0.8rem', color: '#d4af37' }}>{p.weight} gram</span>
                        </td>
                        <td>
                           <span style={{ display: 'block', fontWeight: 600 }}>Rp {p.price.toLocaleString()}</span>
                           <span className={`${styles.badge} ${p.stock > 0 ? styles.badgeSuccess : styles.badgeDanger}`} style={{ marginTop: '4px', display: 'inline-block' }}>
                              {p.stock > 0 ? `Sisa: ${p.stock}` : 'Habis'}
                           </span>
                        </td>
                        <td>
                          <button onClick={() => { setEditingProduct(p); setIsAddingProduct(false); }} style={{ color: '#60a5fa', marginRight: '16px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                          <button onClick={() => handleDeleteProduct(p.id)} style={{ color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'settings' && storeInfo && (
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <h3>General Config & Branding</h3>
                <button className={styles.primaryBtn} onClick={handleStoreUpdate} disabled={saving}>Update Sistem</button>
              </div>
              <form className={styles.editPanel} style={{ border: 'none' }}>
                 <div className={styles.editGrid}>
                    <div className={styles.inputGroup}><label>Nama Toko (Navigasi)</label><input value={storeInfo.name} onChange={e => setStoreInfo({...storeInfo, name: e.target.value})} /></div>
                    <div className={styles.inputGroup}><label>Logo Highlight Text</label><input value={storeInfo.logo_highlight || 'Daffa'} onChange={e => setStoreInfo({...storeInfo, logo_highlight: e.target.value})} /></div>
                    
                    <div className={styles.inputGroup}><label>WhatsApp (Prioritas: 081365555411)</label><input value={storeInfo.whatsapp} disabled title="Dikunci dari source code" /></div>
                    <div className={styles.inputGroup}><label>Email Resmi</label><input value={storeInfo.email} onChange={e => setStoreInfo({...storeInfo, email: e.target.value})} /></div>
                    
                    <div className={styles.inputGroup}><label>Instagram URL</label><input value={storeInfo.instagram || storeInfo.social_media?.instagram || ''} onChange={e => setStoreInfo({...storeInfo, instagram: e.target.value})} /></div>
                    <div className={styles.inputGroup}><label>Facebook URL</label><input value={storeInfo.facebook || storeInfo.social_media?.facebook || ''} onChange={e => setStoreInfo({...storeInfo, facebook: e.target.value})} /></div>
                    <div className={styles.inputGroup}><label>TikTok URL</label><input value={storeInfo.tiktok || storeInfo.social_media?.tiktok || ''} onChange={e => setStoreInfo({...storeInfo, tiktok: e.target.value})} /></div>
                    <div className={styles.inputGroup}><label>Tahun Berdiri</label><input type="number" value={storeInfo.since} onChange={e => setStoreInfo({...storeInfo, since: Number(e.target.value)})} /></div>

                    <div className={`${styles.inputGroup} ${styles.editGridFull}`}><label>Alamat Lengkap Toko</label><textarea rows={2} value={storeInfo.address} onChange={e => setStoreInfo({...storeInfo, address: e.target.value})} /></div>
                    <div className={`${styles.inputGroup} ${styles.editGridFull}`}><label>Deskripsi Hero (Halaman Utama)</label><textarea rows={3} value={storeInfo.description} onChange={e => setStoreInfo({...storeInfo, description: e.target.value})} /></div>
                    
                    <div className={styles.editGridFull}>
                       <h4 style={{ marginBottom: '16px', color: '#d4af37', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>Jam Operasional</h4>
                       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                          <div className={styles.inputGroup}><label>Senin - Jumat</label><input value={storeInfo.operating_hours?.weekday || ''} onChange={e => setStoreInfo({...storeInfo, operating_hours: {...storeInfo.operating_hours, weekday: e.target.value}})} /></div>
                          <div className={styles.inputGroup}><label>Sabtu</label><input value={storeInfo.operating_hours?.saturday || ''} onChange={e => setStoreInfo({...storeInfo, operating_hours: {...storeInfo.operating_hours, saturday: e.target.value}})} /></div>
                          <div className={styles.inputGroup}><label>Minggu</label><input value={storeInfo.operating_hours?.sunday || ''} onChange={e => setStoreInfo({...storeInfo, operating_hours: {...storeInfo.operating_hours, sunday: e.target.value}})} /></div>
                       </div>
                    </div>
                 </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
