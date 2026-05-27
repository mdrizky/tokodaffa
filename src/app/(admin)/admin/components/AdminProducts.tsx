"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./Admin.module.css";

const CATEGORIES = ['cincin', 'gelang', 'kalung', 'anting', 'liontin', 'batangan', 'set', 'koin', 'jam', 'bros', 'lainnya'];
const KADAR = ['24K', '22K', '18K', '17K', '16K', '14K', '925', 'perak'];

const EMPTY_FORM = {
  sku: '', name: '', slug: '', category: 'cincin', kadar: '24K', weight: '', price: '', stock: '',
  material: 'emas', photo: '', images: [], description: '', short_description: '', warranty_info: '',
  featured: false, is_new: false, is_bestseller: false, is_active: true, tags: ''
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
  const multiFileRef = useRef<HTMLInputElement>(null);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('id', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
  );

  const handleEdit = (p: any) => {
    setForm({ 
      ...p, 
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || ''),
      images: p.images || []
    });
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

  const handleDuplicate = async (p: any) => {
    if (!confirm('Duplikat produk ini?')) return;
    const { id, ...rest } = p;
    rest.name = `${rest.name} (Copy)`;
    rest.slug = rest.slug ? `${rest.slug}-copy-${Date.now()}` : null;
    rest.sku = rest.sku ? `${rest.sku}-COPY` : null;
    const { error } = await supabase.from('products').insert(rest);
    if (error) showMsg('err', 'Gagal duplikat: ' + error.message);
    else {
      showMsg('ok', 'Produk berhasil diduplikat');
      fetchProducts();
    }
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isPrimary: boolean = true) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/bmp', 'image/tiff'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!validTypes.includes(file.type)) {
        showMsg('err', `File ${file.name} tidak didukung. Gunakan: JPG, PNG, WEBP, GIF, SVG, BMP, TIFF`);
        return;
      }
      if (file.size > maxSize) {
        showMsg('err', `File ${file.name} terlalu besar. Maksimal 10MB`);
        return;
      }
    }
    
    setUploading(true);

    if (isPrimary) {
      const file = files[0];
      const fileName = `products/${Date.now()}-${file.name.replace(/\s/g, '_')}`;
      console.log('Uploading primary image:', fileName, file.type, file.size);
      
      const { data, error } = await supabase.storage.from('images').upload(fileName, file);
      if (error) { 
        console.error('Upload error:', error);
        showMsg('err', 'Upload gagal: ' + error.message); 
        setUploading(false); 
        return; 
      }
      const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName);
      setForm((f: any) => ({ ...f, photo: urlData.publicUrl }));
      console.log('Upload success:', urlData.publicUrl);
    } else {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = `products/${Date.now()}-${i}-${file.name.replace(/\s/g, '_')}`;
        console.log('Uploading gallery image:', fileName, file.type, file.size);
        
        const { error } = await supabase.storage.from('images').upload(fileName, file);
        if (error) {
          console.error('Gallery upload error:', error);
          showMsg('err', `Upload ${file.name} gagal: ${error.message}`);
          continue;
        }
        const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName);
        uploadedUrls.push(urlData.publicUrl);
        console.log('Gallery upload success:', urlData.publicUrl);
      }
      setForm((f: any) => ({ ...f, images: [...(f.images || []), ...uploadedUrls] }));
    }

    setUploading(false);
    showMsg('ok', 'Foto berhasil diupload!');
  };

  const removeGalleryImage = (index: number) => {
    setForm((f: any) => {
      const newImages = [...f.images];
      newImages.splice(index, 1);
      return { ...f, images: newImages };
    });
  };

  const formatPrice = (p: number) => new Intl.NumberFormat('id-ID').format(p);

  return (
    <div className={styles.section}>
      {msg && <div className={`${styles.toast} ${msg.type === 'ok' ? styles.toastOk : styles.toastErr}`}>{msg.text}</div>}

      <div className={styles.sectionHeader}>
        <input className={styles.searchInput} placeholder="🔍 Cari nama/kategori/SKU..." value={search} onChange={e => setSearch(e.target.value)} />
        <button className={styles.btnPrimary} onClick={() => { resetForm(); setShowForm(true); }}>
          ➕ Tambah Produk
        </button>
      </div>

      {showForm && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>{editId ? '✏️ Edit Produk' : '➕ Tambah Produk Baru'}</h3>
            <button className={styles.closeBtn} onClick={resetForm}>✕</button>
          </div>
          <form onSubmit={handleSubmit} className={styles.formGrid}>
            <div className={styles.formField}>
              <label>SKU</label>
              <input value={form.sku || ''} onChange={e => setForm((f:any)=>({...f, sku:e.target.value}))} placeholder="TKD-CRC-24K-001" />
            </div>
            <div className={styles.formField}>
              <label>Nama Produk *</label>
              <input required value={form.name} onChange={e => setForm((f:any)=>({...f, name:e.target.value}))} placeholder="Contoh: Cincin Emas 24K Model Bunga" />
            </div>
            <div className={styles.formField}>
              <label>Slug URL</label>
              <input value={form.slug || ''} onChange={e => setForm((f:any)=>({...f, slug:e.target.value}))} placeholder="cincin-emas-24k-bunga (auto jika kosong)" />
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

            {/* Photo Upload Primary */}
            <div className={`${styles.formField} ${styles.formFieldFull}`}>
              <label>Foto Utama *</label>
              <div className={styles.photoUploadRow}>
                <input value={form.photo || ''} onChange={e => setForm((f:any)=>({...f, photo:e.target.value}))} placeholder="URL foto atau upload di bawah" />
                <input ref={fileRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/svg+xml,image/bmp,image/tiff" style={{ display: 'none' }} onChange={(e) => handleImageUpload(e, true)} />
                <button type="button" className={styles.btnSecondary} onClick={() => fileRef.current?.click()} disabled={uploading}>
                  {uploading ? '⏳ Upload...' : '📁 Upload Foto Utama'}
                </button>
              </div>
              {form.photo && <img src={form.photo} alt="preview" className={styles.photoPreview} />}
            </div>

            {/* Gallery Upload */}
            <div className={`${styles.formField} ${styles.formFieldFull}`}>
              <label>Galeri Foto (Multiple)</label>
              <div className={styles.photoUploadRow}>
                <input ref={multiFileRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/svg+xml,image/bmp,image/tiff" multiple style={{ display: 'none' }} onChange={(e) => handleImageUpload(e, false)} />
                <button type="button" className={styles.btnSecondary} onClick={() => multiFileRef.current?.click()} disabled={uploading}>
                  {uploading ? '⏳ Uploading...' : '📁 Tambah Foto Galeri'}
                </button>
              </div>
              {form.images && form.images.length > 0 && (
                <div className={styles.galleryPreviewRow}>
                  {form.images.map((img: string, idx: number) => (
                    <div key={idx} className={styles.galleryPreviewItem}>
                      <img src={img} alt={`gallery-${idx}`} />
                      <button type="button" className={styles.removeImgBtn} onClick={() => removeGalleryImage(idx)}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={`${styles.formField} ${styles.formFieldFull}`}>
              <label>Deskripsi Singkat</label>
              <input value={form.short_description || ''} onChange={e => setForm((f:any)=>({...f, short_description:e.target.value}))} placeholder="Deskripsi singkat 1-2 kalimat" />
            </div>
            <div className={`${styles.formField} ${styles.formFieldFull}`}>
              <label>Deskripsi Lengkap</label>
              <textarea rows={4} value={form.description || ''} onChange={e => setForm((f:any)=>({...f, description:e.target.value}))} placeholder="Deskripsi detail produk..." />
            </div>
            <div className={`${styles.formField} ${styles.formFieldFull}`}>
              <label>Info Garansi</label>
              <input value={form.warranty_info || ''} onChange={e => setForm((f:any)=>({...f, warranty_info:e.target.value}))} placeholder="Garansi buyback 100%..." />
            </div>
            <div className={styles.formField}>
              <label>Tags (pisah koma)</label>
              <input value={form.tags || ''} onChange={e => setForm((f:any)=>({...f, tags:e.target.value}))} placeholder="klasik, modern, hadiah" />
            </div>
            <div className={styles.formField}>
              <label>Status & Badges</label>
              <div className={styles.checkboxGroup}>
                <label><input type="checkbox" checked={form.is_active ?? true} onChange={e => setForm((f:any)=>({...f, is_active:e.target.checked}))} /> Aktif</label>
                <label><input type="checkbox" checked={form.featured || false} onChange={e => setForm((f:any)=>({...f, featured:e.target.checked}))} /> Unggulan</label>
                <label><input type="checkbox" checked={form.is_new || false} onChange={e => setForm((f:any)=>({...f, is_new:e.target.checked}))} /> Baru</label>
                <label><input type="checkbox" checked={form.is_bestseller || false} onChange={e => setForm((f:any)=>({...f, is_bestseller:e.target.checked}))} /> Terlaris</label>
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
                  <th>Foto</th><th>Detail</th><th>Kategori</th><th>Stok</th><th>Status</th><th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className={styles.emptyText}>Tidak ada produk ditemukan</td></tr>
                ) : filtered.map(p => (
                  <tr key={p.id}>
                    <td>
                      {p.photo && !p.photo.startsWith('/products/') ? (
                        <img src={p.photo} alt={p.name} className={styles.thumbImg} />
                      ) : <span className={styles.noImg}>📷</span>}
                    </td>
                    <td className={styles.nameCell}>
                      <strong>{p.name}</strong>
                      <small className={styles.skuText}>{p.sku || p.slug}</small>
                      <small>{p.weight}g • {p.kadar} • {formatPrice(p.price)}</small>
                    </td>
                    <td><span className={styles.tag}>{p.category}</span></td>
                    <td>
                      <span className={p.stock > 0 ? styles.stockOk : styles.stockOut}>
                        {p.stock} {p.stock === 0 ? '(Habis)' : ''}
                      </span>
                    </td>
                    <td>
                      <div className={styles.statusBadges}>
                        {!p.is_active && <span className={styles.badgeRed}>Archive</span>}
                        {p.featured && <span className={styles.badgeGold}>⭐</span>}
                        {p.is_new && <span className={styles.badgeGreen}>🆕</span>}
                        {p.is_bestseller && <span className={styles.badgeRed}>🔥</span>}
                      </div>
                    </td>
                    <td>
                      <div className={styles.actionBtns}>
                        <button className={styles.btnEdit} onClick={() => handleEdit(p)} title="Edit">✏️</button>
                        <button className={styles.btnSecondary} onClick={() => handleDuplicate(p)} title="Duplicate" style={{padding: '0.4rem', border:'1px solid #ddd', borderRadius: '6px', background: 'white', cursor: 'pointer'}}>📄</button>
                        <button className={styles.btnDelete} onClick={() => handleDelete(p.id)} title="Hapus">🗑️</button>
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
