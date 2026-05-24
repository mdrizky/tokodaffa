"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./Admin.module.css";

export default function AdminAbout() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{type:'ok'|'err',text:string}|null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.from('about_content').select('*').single().then(({ data: d }) => {
      setData(d || {
        hero_title: '', hero_subtitle: '', story_title: '', story_content: '',
        vision: '', mission: '', hero_image: '',
        stats: JSON.stringify([
          { label: 'Tahun Berpengalaman', value: '10+' },
          { label: 'Produk Tersedia', value: '500+' },
          { label: 'Pelanggan Puas', value: '10.000+' },
          { label: 'Kota Terlayani', value: '50+' },
        ]),
        team: JSON.stringify([]),
        certifications: JSON.stringify([]),
        values: JSON.stringify([]),
      });
      setLoading(false);
    });
  }, []);

  const showMsg = (type:'ok'|'err', text:string) => { setMsg({type,text}); setTimeout(()=>setMsg(null),3000); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const { error } = await supabase.from('about_content').upsert({ ...data, updated_at: new Date().toISOString() });
    setSaving(false);
    if (error) showMsg('err', error.message); else showMsg('ok', '✅ Konten Tentang Kami disimpan!');
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return; setUploading(true);
    const fn = `about/${Date.now()}-${file.name.replace(/\s/g,'_')}`;
    const {error} = await supabase.storage.from('images').upload(fn, file);
    if (error) { showMsg('err','Upload gagal'); setUploading(false); return; }
    const {data:u} = supabase.storage.from('images').getPublicUrl(fn);
    setData((d:any) => ({...d, hero_image: u.publicUrl}));
    setUploading(false); showMsg('ok','Foto diupload!');
  };

  if (loading) return <div className={styles.loadingText}>Memuat...</div>;

  return (
    <div className={styles.section}>
      {msg && <div className={`${styles.toast} ${msg.type==='ok'?styles.toastOk:styles.toastErr}`}>{msg.text}</div>}
      <form onSubmit={handleSave}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>🦸 Hero Section</h3>
          <div className={styles.formGrid}>
            <div className={`${styles.formField} ${styles.formFieldFull}`}><label>Judul Hero</label><input value={data.hero_title||''} onChange={e=>setData((d:any)=>({...d,hero_title:e.target.value}))} placeholder="Tentang TokoDaffa Gold" /></div>
            <div className={`${styles.formField} ${styles.formFieldFull}`}><label>Subtitle Hero</label><textarea rows={2} value={data.hero_subtitle||''} onChange={e=>setData((d:any)=>({...d,hero_subtitle:e.target.value}))} /></div>
            <div className={`${styles.formField} ${styles.formFieldFull}`}>
              <label>Gambar Hero</label>
              <div className={styles.photoUploadRow}>
                <input value={data.hero_image||''} onChange={e=>setData((d:any)=>({...d,hero_image:e.target.value}))} placeholder="URL gambar" />
                <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleUpload} />
                <button type="button" className={styles.btnSecondary} onClick={()=>fileRef.current?.click()} disabled={uploading}>{uploading?'⏳':'📁 Upload'}</button>
              </div>
              {data.hero_image && <img src={data.hero_image} alt="hero" className={styles.photoPreview} />}
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>📖 Sejarah & Cerita</h3>
          <div className={styles.formGrid}>
            <div className={`${styles.formField} ${styles.formFieldFull}`}><label>Judul Sejarah</label><input value={data.story_title||''} onChange={e=>setData((d:any)=>({...d,story_title:e.target.value}))} /></div>
            <div className={`${styles.formField} ${styles.formFieldFull}`}><label>Konten Sejarah (HTML)</label><textarea rows={6} value={data.story_content||''} onChange={e=>setData((d:any)=>({...d,story_content:e.target.value}))} /></div>
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>🎯 Visi & Misi</h3>
          <div className={styles.formGrid}>
            <div className={`${styles.formField} ${styles.formFieldFull}`}><label>Visi</label><textarea rows={3} value={data.vision||''} onChange={e=>setData((d:any)=>({...d,vision:e.target.value}))} /></div>
            <div className={`${styles.formField} ${styles.formFieldFull}`}><label>Misi (satu per baris)</label><textarea rows={4} value={data.mission||''} onChange={e=>setData((d:any)=>({...d,mission:e.target.value}))} /></div>
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>📊 Statistik (JSON)</h3>
          <div className={styles.infoBox}>Format: <code>[{`{"label":"...", "value":"..."}`}, ...]</code></div>
          <div className={styles.formGrid}>
            <div className={`${styles.formField} ${styles.formFieldFull}`}>
              <textarea rows={6} value={data.stats||''} onChange={e=>setData((d:any)=>({...d,stats:e.target.value}))} className={styles.contentEditor} />
            </div>
          </div>
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.btnPrimary} disabled={saving}>
            {saving ? '⏳ Menyimpan...' : '💾 Simpan Semua Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
}
