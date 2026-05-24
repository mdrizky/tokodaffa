"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./Admin.module.css";

const EMPTY = { name: '', logo: '', website: '', description: '', is_active: true, sort_order: 0 };

export default function AdminPartners() {
  const [partners, setPartners] = useState<any[]>([]);
  const [form, setForm] = useState<any>(EMPTY);
  const [editId, setEditId] = useState<number|null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{type:'ok'|'err',text:string}|null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetch_ = async () => {
    const { data } = await supabase.from('partners').select('*').order('sort_order');
    setPartners(data || []); setLoading(false);
  };

  useEffect(() => { fetch_(); }, []);

  const showMsg = (type:'ok'|'err', text:string) => { setMsg({type,text}); setTimeout(()=>setMsg(null),3000); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const payload = { ...form }; delete payload.id;
    if (editId) {
      const {error} = await supabase.from('partners').update(payload).eq('id', editId);
      if (error) showMsg('err', error.message); else showMsg('ok','✅ Partner diperbarui!');
    } else {
      const {error} = await supabase.from('partners').insert(payload);
      if (error) showMsg('err', error.message); else showMsg('ok','✅ Partner ditambahkan!');
    }
    setSaving(false); fetch_(); setShowForm(false); setForm(EMPTY); setEditId(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus partner?')) return;
    await supabase.from('partners').delete().eq('id', id);
    fetch_(); showMsg('ok','Partner dihapus');
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return; setUploading(true);
    const fn = `partners/${Date.now()}-${file.name.replace(/\s/g,'_')}`;
    const {error} = await supabase.storage.from('images').upload(fn, file);
    if (error) { showMsg('err','Upload gagal'); setUploading(false); return; }
    const {data:u} = supabase.storage.from('images').getPublicUrl(fn);
    setForm((f:any) => ({...f, logo: u.publicUrl}));
    setUploading(false); showMsg('ok','Logo diupload!');
  };

  return (
    <div className={styles.section}>
      {msg && <div className={`${styles.toast} ${msg.type==='ok'?styles.toastOk:styles.toastErr}`}>{msg.text}</div>}
      <div className={styles.sectionHeader}>
        <h3 className={styles.cardTitle}>🤝 Kelola Mitra/Partner</h3>
        <button className={styles.btnPrimary} onClick={()=>{setForm(EMPTY);setEditId(null);setShowForm(true);}}>➕ Tambah Partner</button>
      </div>
      {showForm && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>{editId?'✏️ Edit Partner':'➕ Partner Baru'}</h3>
            <button className={styles.closeBtn} onClick={()=>setShowForm(false)}>✕</button>
          </div>
          <form onSubmit={handleSubmit} className={styles.formGrid}>
            <div className={styles.formField}><label>Nama Partner *</label><input required value={form.name} onChange={e=>setForm((f:any)=>({...f,name:e.target.value}))} /></div>
            <div className={styles.formField}><label>Website</label><input value={form.website} onChange={e=>setForm((f:any)=>({...f,website:e.target.value}))} placeholder="https://..." /></div>
            <div className={styles.formField}><label>Deskripsi</label><input value={form.description} onChange={e=>setForm((f:any)=>({...f,description:e.target.value}))} /></div>
            <div className={styles.formField}><label>Urutan</label><input type="number" value={form.sort_order} onChange={e=>setForm((f:any)=>({...f,sort_order:parseInt(e.target.value)}))} /></div>
            <div className={`${styles.formField} ${styles.formFieldFull}`}>
              <label>Logo</label>
              <div className={styles.photoUploadRow}>
                <input value={form.logo} onChange={e=>setForm((f:any)=>({...f,logo:e.target.value}))} placeholder="URL logo atau upload" />
                <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleUpload} />
                <button type="button" className={styles.btnSecondary} onClick={()=>fileRef.current?.click()} disabled={uploading}>{uploading?'⏳':'📁 Upload'}</button>
              </div>
              {form.logo && <img src={form.logo} alt="logo" className={styles.photoPreview} style={{maxHeight:'60px',objectFit:'contain'}} />}
            </div>
            <div className={styles.formField}><label><input type="checkbox" checked={form.is_active} onChange={e=>setForm((f:any)=>({...f,is_active:e.target.checked}))} /> Aktif (tampil di website)</label></div>
            <div className={`${styles.formActions} ${styles.formFieldFull}`}>
              <button type="button" className={styles.btnSecondary} onClick={()=>setShowForm(false)}>Batal</button>
              <button type="submit" className={styles.btnPrimary} disabled={saving}>{saving?'⏳':'💾 Simpan'}</button>
            </div>
          </form>
        </div>
      )}
      <div className={styles.card}>
        {loading ? <div className={styles.loadingText}>Memuat...</div> : partners.length === 0 ? (
          <p className={styles.emptyText}>Belum ada partner.</p>
        ) : (
          <div className={styles.partnerGrid}>
            {partners.map(p => (
              <div key={p.id} className={`${styles.partnerCard} ${!p.is_active?styles.partnerInactive:''}`}>
                {p.logo ? <img src={p.logo} alt={p.name} className={styles.partnerLogo} /> : <div className={styles.noLogo}>🤝</div>}
                <div className={styles.partnerName}>{p.name}</div>
                {p.website && <a href={p.website} target="_blank" rel="noopener" className={styles.partnerLink}>🔗 Website</a>}
                <div className={styles.partnerStatus}>{p.is_active ? '✅ Aktif' : '⛔ Nonaktif'}</div>
                <div className={styles.actionBtns}>
                  <button className={styles.btnEdit} onClick={()=>{setForm(p);setEditId(p.id);setShowForm(true);}}>✏️</button>
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
