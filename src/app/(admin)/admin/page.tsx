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

  const ADMIN_PIN = "240708daffa";

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
      for (const kadar of ["24K", "22K", "18K", "16K", "Perak"]) {
        await supabase
          .from("gold_prices")
          .update({ price_per_gram: Number(prices[kadar]), last_updated: new Date().toISOString() })
          .eq("kadar", kadar);
      }
      alert("Berhasil update harga!");
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
    if (!confirm("Hapus produk ini?")) return;
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
            <span className={styles.navIcon}>💰</span> Harga & Ongkos
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
            <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}</h1>
            <p>Sistem Manajemen TokoDaffa Gold</p>
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

              <div className={styles.panel}>
                <div className={styles.panelHeader}>
                  <h3>Update Cepat Harga Hari Ini</h3>
                  <button className={styles.primaryBtn} onClick={handlePriceUpdate} disabled={saving}>
                    {saving ? "Menyimpan..." : "Simpan Harga"}
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
            </>
          )}

          {activeTab === 'prices' && (
             <div className={styles.panel}>
                <div className={styles.panelHeader}>
                  <h3>Manajemen Harga Detail</h3>
                  <button className={styles.primaryBtn} onClick={handlePriceUpdate} disabled={saving}>Simpan Perubahan</button>
                </div>
                <div style={{ padding: '24px' }}>
                  <p style={{ marginBottom: '20px', color: '#64748b' }}>Gunakan panel ini untuk sinkronisasi harga per gram ke seluruh sistem.</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
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
                <h3>Daftar Produk</h3>
                <button className={styles.primaryBtn} onClick={() => {
                  setEditingProduct({ name: '', price: 0, stock: 1, weight: 0, kadar: '24K', material: 'Emas', category: 'Cincin', description: '', photo: '' });
                  setIsAddingProduct(true);
                }}>+ Tambah Produk</button>
              </div>

              {editingProduct && (
                <div style={{ padding: '24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <h4>{isAddingProduct ? 'Tambah Produk Baru' : 'Edit Produk'}</h4>
                  <form onSubmit={handleSaveProduct} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                    <div className={styles.inputGroup}><label>Nama Produk</label><input required value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} /></div>
                    <div className={styles.inputGroup}><label>Kategori</label><input required value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} /></div>
                    <div className={styles.inputGroup}><label>Harga Total (Rp)</label><input type="number" required value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} /></div>
                    <div className={styles.inputGroup}><label>Ongkos Tukang (Rp)</label><input type="number" required value={editingProduct.ongkos || 0} onChange={e => setEditingProduct({...editingProduct, ongkos: Number(e.target.value)})} /></div>
                    <div className={styles.inputGroup}><label>Berat (Gram)</label><input type="number" step="0.01" required value={editingProduct.weight} onChange={e => setEditingProduct({...editingProduct, weight: Number(e.target.value)})} /></div>
                    <div className={styles.inputGroup}><label>Kadar</label><input required value={editingProduct.kadar} onChange={e => setEditingProduct({...editingProduct, kadar: e.target.value})} /></div>
                    <div className={styles.inputGroup}><label>Stok</label><input type="number" required value={editingProduct.stock} onChange={e => setEditingProduct({...editingProduct, stock: Number(e.target.value)})} /></div>
                    <div className={styles.inputGroup}><label>URL Foto</label><input required value={editingProduct.photo} onChange={e => setEditingProduct({...editingProduct, photo: e.target.value})} /></div>
                    <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}><label>Deskripsi</label><textarea style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }} rows={3} value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} /></div>
                    <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px' }}>
                      <button type="submit" className={styles.primaryBtn}>Simpan</button>
                      <button type="button" onClick={() => setEditingProduct(null)} style={{ background: '#e2e8f0', color: '#475569' }} className={styles.primaryBtn}>Batal</button>
                    </div>
                  </form>
                </div>
              )}

              <div className={styles.tableWrap}>
                <table className={styles.adminTable}>
                  <thead>
                    <tr>
                      <th>Produk</th>
                      <th>Kadar/Berat</th>
                      <th>Harga</th>
                      <th>Stok</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src={p.photo} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                            <strong>{p.name}</strong>
                          </div>
                        </td>
                        <td>{p.kadar} / {p.weight}g</td>
                        <td>Rp {p.price.toLocaleString()}</td>
                        <td><span className={`${styles.badge} ${p.stock > 0 ? styles.badgeSuccess : styles.badgeDanger}`}>{p.stock > 0 ? `Tersedia (${p.stock})` : 'Habis'}</span></td>
                        <td>
                          <button onClick={() => { setEditingProduct(p); setIsAddingProduct(false); }} style={{ color: '#3b82f6', marginRight: '10px' }}>Edit</button>
                          <button onClick={() => handleDeleteProduct(p.id)} style={{ color: '#ef4444' }}>Hapus</button>
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
                <h3>Pengaturan Toko</h3>
                <button className={styles.primaryBtn} onClick={handleStoreUpdate} disabled={saving}>Simpan Pengaturan</button>
              </div>
              <form style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                 <div className={styles.inputGroup}><label>Nama Toko</label><input value={storeInfo.name} onChange={e => setStoreInfo({...storeInfo, name: e.target.value})} /></div>
                 <div className={styles.inputGroup}><label>WhatsApp (62xxx)</label><input value={storeInfo.whatsapp} onChange={e => setStoreInfo({...storeInfo, whatsapp: e.target.value})} /></div>
                 <div className={styles.inputGroup}><label>Email</label><input value={storeInfo.email} onChange={e => setStoreInfo({...storeInfo, email: e.target.value})} /></div>
                 <div className={styles.inputGroup}><label>Instagram URL</label><input value={storeInfo.instagram} onChange={e => setStoreInfo({...storeInfo, instagram: e.target.value})} /></div>
                 <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}><label>Alamat Lengkap</label><textarea style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }} rows={2} value={storeInfo.address} onChange={e => setStoreInfo({...storeInfo, address: e.target.value})} /></div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
