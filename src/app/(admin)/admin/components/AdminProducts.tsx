"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./Admin.module.css";

const CATEGORIES = ['cincin', 'gelang', 'kalung', 'anting', 'liontin', 'batangan', 'koin', 'jam', 'bros', 'perak', 'lainnya'];
const KADAR = ['24K', '22K', '18K', '17K', '16K', '14K', 'perak 925'];

const EMPTY_FORM = {
  name: '', slug: '', category: 'cincin', kadar: '24K', weight: '', price: '', stock: '',
  material: 'emas', photo: '', description: '', short_description: '', featured: false,
  is_new: false, is_bestseller: false, tags: ''
};

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState<any>(EMPTY_FORM);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{type:'ok'|'err', text:string}|null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('id', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (p: any) => {
    setForm({ ...p, tags: Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || '') });
    setEditId(p.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus produk ini?')) return;
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
    showMsg('ok', 'Produk dihapus');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      weight: parseFloat(form.weight),
      price: parseInt(form.price),
      stock: parseInt(form.stock),
      tags: form.tags ? form.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    };
    delete payload.id;

    if (editId) {
      const { error } = await supabase.from('products').update(payload).eq('id', editId);
      if (error) showMsg('err', 'Gagal update: ' + error.message);
      else showMsg('ok', '✅ Produk diperbarui!');
    } else {
      const { error } = await supabase.from('products').insert(payload);
      if (error) showMsg('err', 'Gagal simpan: ' + error.message);
      else showMsg('ok', '✅ Produk ditambahkan!');
    }
    setSaving(false);
    fetchProducts();
    resetForm();
  };

  const resetForm = () => {
    setForm(EMPTY_FORM); setEditId(null); setShowForm(false);
  };

  const showMsg = (type: 'ok'|'err', text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fileName = `products/${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    const { data, error } = await supabase.storage.from('images').upload(fileName, file);
    if (error) { showMsg('err', 'Upload gagal: ' + error.message); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName);
    setForm((f: any) => ({ ...f, photo: urlData.publicUrl }));
    setUploading(false);
    showMsg('ok', 'Foto berhasil diupload!');
  };

  const formatPrice = (p: number) => new Intl.NumberFormat('id-ID').format(p);

  return (
    <div className={styles.section}>
      {msg && <div className={`${styles.toast} ${msg.type === 'ok' ? styles.toastOk : styles.toastErr}`}>{msg.text}</div>}

      {/* Header */}
      <div className={styles.sectionHeader}>
        <input className={styles.searchInput} placeholder="🔍 Cari produk..." value={search} onChange={e => setSearch(e.target.value)} />
        <button className={styles.btnPrimary} onClick={() => { resetForm(); setShowForm(true); }}>
          ➕ Tambah Produk
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>{editId ? '✏️ Edit Produk' : '➕ Tambah Produk Baru'}</h3>
            <button className={styles.closeBtn} onClick={resetForm}>✕</button>
          </div>
          <form onSubmit={handleSubmit} className={styles.formGrid}>
            <div className={styles.formField}>
              <label>Nama Produk *</label>
              <input required value={form.name} onChange={e => setForm((f:any)=>({...f, name:e.target.value}))} placeholder="Contoh: Cincin Emas 24K Model Bunga" />
            </div>
            <div className={styles.formField}>
              <label>Slug URL</label>
              <input value={form.slug} onChange={e => setForm((f:any)=>({...f, slug:e.target.value}))} placeholder="cincin-emas-24k-bunga (auto jika kosong)" />
            </div>
            <div className={styles.formField}>
              <label>Kategori *</label>
              <select required value={form.category} onChange={e => setForm((f:any)=>({...f, category:e.target.value}))}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
              </select>
            </div>
            <div className={styles.formField}>
              <label>Kadar *</label>
              <select required value={form.kadar} onChange={e => setForm((f:any)=>({...f, kadar:e.target.value}))}>
                {KADAR.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div className={styles.formField}>
              <label>Material</label>
              <select value={form.material} onChange={e => setForm((f:any)=>({...f, material:e.target.value}))}>
                <option value="emas">Emas</option>
                <option value="perak">Perak</option>
                <option value="emas_putih">Emas Putih</option>
                <option value="platinum">Platinum</option>
              </select>
            </div>
            <div className={styles.formField}>
              <label>Berat (gram) *</label>
              <input required type="number" step="0.01" min="0.01" value={form.weight} onChange={e => setForm((f:any)=>({...f, weight:e.target.value}))} placeholder="2.5" />
            </div>
            <div className={styles.formField}>
              <label>Harga (Rp) *</label>
              <input required type="number" min="1000" value={form.price} onChange={e => setForm((f:any)=>({...f, price:e.target.value}))} placeholder="1500000" />
            </div>
            <div className={styles.formField}>
              <label>Stok *</label>
              <input required type="number" min="0" value={form.stock} onChange={e => setForm((f:any)=>({...f, stock:e.target.value}))} placeholder="5" />
            </div>

            {/* Photo Upload */}
            <div className={`${styles.formField} ${styles.formFieldFull}`}>
              <label>Foto Produk</label>
              <div className={styles.photoUploadRow}>
                <input value={form.photo} onChange={e => setForm((f:any)=>({...f, photo:e.target.value}))} placeholder="URL foto atau upload di bawah" />
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
                <button type="button" className={styles.btnSecondary} onClick={() => fileRef.current?.click()} disabled={uploading}>
                  {uploading ? '⏳ Upload...' : '📁 Upload Foto'}
                </button>
              </div>
              {form.photo && <img src={form.photo} alt="preview" className={styles.photoPreview} />}
            </div>

            <div className={`${styles.formField} ${styles.formFieldFull}`}>
              <label>Deskripsi Singkat</label>
              <input value={form.short_description} onChange={e => setForm((f:any)=>({...f, short_description:e.target.value}))} placeholder="Deskripsi singkat 1-2 kalimat" />
            </div>
            <div className={`${styles.formField} ${styles.formFieldFull}`}>
              <label>Deskripsi Lengkap</label>
              <textarea rows={4} value={form.description} onChange={e => setForm((f:any)=>({...f, description:e.target.value}))} placeholder="Deskripsi detail produk..." />
            </div>
            <div className={styles.formField}>
              <label>Tags (pisah koma)</label>
              <input value={form.tags} onChange={e => setForm((f:any)=>({...f, tags:e.target.value}))} placeholder="klasik, modern, hadiah" />
            </div>
            <div className={styles.formField}>
              <label>Status</label>
              <div className={styles.checkboxGroup}>
                <label><input type="checkbox" checked={form.featured} onChange={e => setForm((f:any)=>({...f, featured:e.target.checked}))} /> Unggulan</label>
                <label><input type="checkbox" checked={form.is_new} onChange={e => setForm((f:any)=>({...f, is_new:e.target.checked}))} /> Baru</label>
                <label><input type="checkbox" checked={form.is_bestseller} onChange={e => setForm((f:any)=>({...f, is_bestseller:e.target.checked}))} /> Terlaris</label>
              </div>
            </div>

            <div className={`${styles.formActions} ${styles.formFieldFull}`}>
              <button type="button" className={styles.btnSecondary} onClick={resetForm}>Batal</button>
              <button type="submit" className={styles.btnPrimary} disabled={saving}>
                {saving ? '⏳ Menyimpan...' : editId ? '💾 Update Produk' : '➕ Simpan Produk'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Product Table */}
      <div className={styles.card}>
        <div className={styles.tableWrap}>
          {loading ? <div className={styles.loadingText}>Memuat produk...</div> : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Foto</th><th>Nama</th><th>Kategori</th><th>Kadar</th>
                  <th>Berat</th><th>Harga</th><th>Stok</th><th>Status</th><th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={9} className={styles.emptyText}>Tidak ada produk ditemukan</td></tr>
                ) : filtered.map(p => (
                  <tr key={p.id}>
                    <td>
                      {p.photo && !p.photo.startsWith('/products/') ? (
                        <img src={p.photo} alt={p.name} className={styles.thumbImg} />
                      ) : <span className={styles.noImg}>📷</span>}
                    </td>
                    <td className={styles.nameCell}>
                      <strong>{p.name}</strong>
                      {p.short_description && <small>{p.short_description}</small>}
                    </td>
                    <td><span className={styles.tag}>{p.category}</span></td>
                    <td><span className={styles.tag}>{p.kadar}</span></td>
                    <td>{p.weight}g</td>
                    <td className={styles.priceCell}>{formatPrice(p.price)}</td>
                    <td>
                      <span className={p.stock > 0 ? styles.stockOk : styles.stockOut}>
                        {p.stock} {p.stock === 0 ? '(Habis)' : ''}
                      </span>
                    </td>
                    <td>
                      <div className={styles.statusBadges}>
                        {p.featured && <span className={styles.badgeGold}>⭐</span>}
                        {p.is_new && <span className={styles.badgeGreen}>🆕</span>}
                        {p.is_bestseller && <span className={styles.badgeRed}>🔥</span>}
                      </div>
                    </td>
                    <td>
                      <div className={styles.actionBtns}>
                        <button className={styles.btnEdit} onClick={() => handleEdit(p)}>✏️</button>
                        <button className={styles.btnDelete} onClick={() => handleDelete(p.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className={styles.tableFooter}>Total: {filtered.length} produk</div>
      </div>
    </div>
  );
}
