"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./Admin.module.css";

const EMPTY_FORM = {
  title: '', slug: '', category: 'investasi', excerpt: '', content: '', cover_image: '',
  author: 'Admin TokoDaffa', is_featured: false, status: 'published', tags: '',
  meta_title: '', meta_description: ''
};
const CATEGORIES = ['investasi', 'tips', 'berita', 'edukasi', 'promo', 'lainnya'];

export default function AdminBlog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [form, setForm] = useState<any>(EMPTY_FORM);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{type:'ok'|'err',text:string}|null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchPosts = async () => {
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    setPosts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const showMsg = (type:'ok'|'err', text:string) => { setMsg({type,text}); setTimeout(()=>setMsg(null),3000); };

  const handleEdit = (p: any) => {
    setForm({ ...p, tags: Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags||'') });
    setEditId(p.id); setShowForm(true);
    window.scrollTo({top:0,behavior:'smooth'});
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus artikel ini?')) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    fetchPosts(); showMsg('ok', 'Artikel dihapus');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const payload = {
      ...form,
      tags: form.tags ? form.tags.split(',').map((t:string)=>t.trim()).filter(Boolean) : [],
      slug: form.slug || form.title.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,''),
      published_at: form.published_at || new Date().toISOString(),
    };
    delete payload.id;
    if (editId) {
      const { error } = await supabase.from('blog_posts').update(payload).eq('id', editId);
      if (error) showMsg('err', error.message); else showMsg('ok', '✅ Artikel diperbarui!');
    } else {
      const { error } = await supabase.from('blog_posts').insert(payload);
      if (error) showMsg('err', error.message); else showMsg('ok', '✅ Artikel dipublikasikan!');
    }
    setSaving(false); fetchPosts(); setShowForm(false); setForm(EMPTY_FORM); setEditId(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    const fileName = `blog/${Date.now()}-${file.name.replace(/\s/g,'_')}`;
    const { error } = await supabase.storage.from('images').upload(fileName, file);
    if (error) { showMsg('err', 'Upload gagal'); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName);
    setForm((f:any) => ({...f, cover_image: urlData.publicUrl}));
    setUploading(false); showMsg('ok', 'Gambar diupload!');
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', {day:'numeric',month:'short',year:'numeric'});

  return (
    <div className={styles.section}>
      {msg && <div className={`${styles.toast} ${msg.type==='ok'?styles.toastOk:styles.toastErr}`}>{msg.text}</div>}

      <div className={styles.sectionHeader}>
        <h3 className={styles.cardTitle}>📝 Kelola Blog & Artikel</h3>
        <button className={styles.btnPrimary} onClick={()=>{setForm(EMPTY_FORM);setEditId(null);setShowForm(true);}}>✍️ Tulis Artikel Baru</button>
      </div>

      {showForm && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>{editId ? '✏️ Edit Artikel' : '✍️ Artikel Baru'}</h3>
            <button className={styles.closeBtn} onClick={()=>setShowForm(false)}>✕</button>
          </div>
          <form onSubmit={handleSubmit} className={styles.formGrid}>
            <div className={`${styles.formField} ${styles.formFieldFull}`}>
              <label>Judul Artikel *</label>
              <input required value={form.title} onChange={e=>setForm((f:any)=>({...f,title:e.target.value}))} placeholder="Judul artikel yang menarik..." />
            </div>
            <div className={styles.formField}>
              <label>Slug URL</label>
              <input value={form.slug} onChange={e=>setForm((f:any)=>({...f,slug:e.target.value}))} placeholder="auto dari judul jika kosong" />
            </div>
            <div className={styles.formField}>
              <label>Kategori</label>
              <select value={form.category} onChange={e=>setForm((f:any)=>({...f,category:e.target.value}))}>
                {CATEGORIES.map(c=><option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
              </select>
            </div>
            <div className={styles.formField}>
              <label>Penulis</label>
              <input value={form.author} onChange={e=>setForm((f:any)=>({...f,author:e.target.value}))} placeholder="Admin TokoDaffa" />
            </div>
            <div className={styles.formField}>
              <label>Status</label>
              <select value={form.status} onChange={e=>setForm((f:any)=>({...f,status:e.target.value}))}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div className={`${styles.formField} ${styles.formFieldFull}`}>
              <label>Gambar Cover</label>
              <div className={styles.photoUploadRow}>
                <input value={form.cover_image} onChange={e=>setForm((f:any)=>({...f,cover_image:e.target.value}))} placeholder="URL gambar atau upload" />
                <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleImageUpload} />
                <button type="button" className={styles.btnSecondary} onClick={()=>fileRef.current?.click()} disabled={uploading}>
                  {uploading ? '⏳' : '📁 Upload'}
                </button>
              </div>
              {form.cover_image && <img src={form.cover_image} alt="cover" className={styles.photoPreview} />}
            </div>
            <div className={`${styles.formField} ${styles.formFieldFull}`}>
              <label>Ringkasan / Excerpt</label>
              <textarea rows={2} value={form.excerpt} onChange={e=>setForm((f:any)=>({...f,excerpt:e.target.value}))} placeholder="Ringkasan 1-3 kalimat..." />
            </div>
            <div className={`${styles.formField} ${styles.formFieldFull}`}>
              <label>Konten Artikel (HTML diperbolehkan)</label>
              <textarea rows={12} value={form.content} onChange={e=>setForm((f:any)=>({...f,content:e.target.value}))} placeholder="Tulis konten artikel di sini... HTML tag seperti <h2>, <p>, <ul> didukung." className={styles.contentEditor} />
            </div>
            <div className={styles.formField}>
              <label>Tags (pisah koma)</label>
              <input value={form.tags} onChange={e=>setForm((f:any)=>({...f,tags:e.target.value}))} placeholder="emas, investasi, tips" />
            </div>
            <div className={styles.formField}>
              <label>Meta Title (SEO)</label>
              <input value={form.meta_title} onChange={e=>setForm((f:any)=>({...f,meta_title:e.target.value}))} placeholder="Judul SEO (kosong = otomatis dari judul)" />
            </div>
            <div className={`${styles.formField} ${styles.formFieldFull}`}>
              <label>Meta Description (SEO)</label>
              <input value={form.meta_description} onChange={e=>setForm((f:any)=>({...f,meta_description:e.target.value}))} placeholder="Deskripsi SEO 150-160 karakter" />
            </div>
            <div className={styles.formField}>
              <label>Status Pilihan</label>
              <label className={styles.checkboxLabel}><input type="checkbox" checked={form.is_featured} onChange={e=>setForm((f:any)=>({...f,is_featured:e.target.checked}))} /> Tandai sebagai Artikel Pilihan</label>
            </div>
            <div className={`${styles.formActions} ${styles.formFieldFull}`}>
              <button type="button" className={styles.btnSecondary} onClick={()=>setShowForm(false)}>Batal</button>
              <button type="submit" className={styles.btnPrimary} disabled={saving}>
                {saving ? '⏳ Menyimpan...' : editId ? '💾 Update' : '🚀 Publikasikan'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.card}>
        {loading ? <div className={styles.loadingText}>Memuat artikel...</div> : posts.length === 0 ? (
          <p className={styles.emptyText}>Belum ada artikel. Tulis yang pertama!</p>
        ) : (
          <div className={styles.blogList}>
            {posts.map(p => (
              <div key={p.id} className={styles.blogItem}>
                {p.cover_image && <img src={p.cover_image} alt={p.title} className={styles.blogThumb} />}
                <div className={styles.blogItemInfo}>
                  <div className={styles.blogItemTitle}>{p.title}</div>
                  <div className={styles.blogItemMeta}>
                    <span className={`${styles.tag} ${p.status === 'published' ? styles.tagGreen : styles.tagGray}`}>{p.status}</span>
                    <span>{p.category}</span>
                    <span>{formatDate(p.created_at)}</span>
                    {p.is_featured && <span className={styles.badgeGold}>⭐ Pilihan</span>}
                  </div>
                </div>
                <div className={styles.actionBtns}>
                  <a href={`/blog/${p.slug}`} target="_blank" className={styles.btnView}>👁️</a>
                  <button className={styles.btnEdit} onClick={()=>handleEdit(p)}>✏️</button>
                  <button className={styles.btnDelete} onClick={()=>handleDelete(p.id)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
