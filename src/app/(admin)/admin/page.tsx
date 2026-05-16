"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { getProducts, getGoldPrices } from "@/lib/dataFetch";
import { supabase } from "@/lib/supabase";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

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
            <div className={styles.loginLogo}>
              <img src="/logo.png" alt="Logo" style={{ height: '60px', width: 'auto' }} />
            </div>
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

  const revenueData = [
    { name: 'Jan', Omzet: 400 },
    { name: 'Feb', Omzet: 300 },
    { name: 'Mar', Omzet: 550 },
    { name: 'Apr', Omzet: 480 },
    { name: 'May', Omzet: 700 },
    { name: 'Jun', Omzet: 900 },
  ];

  const topProductsData = products.slice(0, 5).map(p => ({
    name: p.name.substring(0, 10) + '...',
    Terjual: Math.floor(Math.random() * 50) + 10
  }));

  return (
    <div className={styles.adminContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <img src="/logo.png" alt="Logo" style={{ height: '40px', width: 'auto' }} />
          <div className={styles.brandText}>LUXGOLD <span>ERP</span></div>
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
            <div className="grid-1">
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>📦</div>
                  <div className={styles.statInfo}>
                    <span>Total Produk</span>
                    <h3>{products.length} Items</h3>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>⚠️</div>
                  <div className={styles.statInfo}>
                    <span>Stok Kritis / Habis</span>
                    <h3 style={{color: '#ef4444'}}>{outOfStock} Items</h3>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>💰</div>
                  <div className={styles.statInfo}>
                    <span>Estimasi Nilai Stok</span>
                    <h3>Rp {(totalValue / 1000000).toFixed(1)} Juta</h3>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>👥</div>
                  <div className={styles.statInfo}>
                    <span>Customer Aktif</span>
                    <h3>1,248</h3>
                  </div>
                </div>
              </div>

              <div className="grid-2" style={{ marginTop: '24px', gap: '24px' }}>
                <div className={styles.dashboardCard}>
                  <div className={styles.cardHeader}>
                    <h3>📈 Proyeksi Omzet Bulanan (Juta Rp)</h3>
                  </div>
                  <div style={{ height: 300, width: '100%', marginTop: '16px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData}>
                        <defs>
                          <linearGradient id="colorOmzet" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#d4af37" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="name" stroke="#a09d94" />
                        <YAxis stroke="#a09d94" />
                        <Tooltip contentStyle={{ backgroundColor: '#111118', borderColor: '#d4af37', color: '#fff' }} />
                        <Area type="monotone" dataKey="Omzet" stroke="#d4af37" fillOpacity={1} fill="url(#colorOmzet)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className={styles.dashboardCard}>
                  <div className={styles.cardHeader}>
                    <h3>🔥 Produk Terlaris Bulan Ini</h3>
                  </div>
                  <div style={{ height: 300, width: '100%', marginTop: '16px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topProductsData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis type="number" stroke="#a09d94" />
                        <YAxis dataKey="name" type="category" stroke="#a09d94" width={100} />
                        <Tooltip contentStyle={{ backgroundColor: '#111118', borderColor: '#d4af37', color: '#fff' }} cursor={{fill: 'rgba(212, 175, 55, 0.1)'}} />
                        <Bar dataKey="Terjual" fill="#d4af37" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className={styles.dashboardCard} style={{ marginTop: '24px' }}>
                <div className={styles.cardHeader}>
                  <h3>⚡ Quick Price Engine Update</h3>
                  <button className="btn btn-gold" onClick={() => setActiveTab('prices')} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                    Sync Prices to Server
                  </button>
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
