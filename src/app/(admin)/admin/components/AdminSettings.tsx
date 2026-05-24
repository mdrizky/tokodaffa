"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./Admin.module.css";

export default function AdminSettings() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{type:'ok'|'err',text:string}|null>(null);
  const [activeTab, setActiveTab] = useState<'store'|'contact'|'social'|'seo'|'appearance'>('store');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.from('store_settings').select('*').single().then(({ data }) => {
      setSettings(data || {
        name: 'TokoDaffa Gold', tagline: '', description: '', whatsapp: '', email: '',
        phone: '', address: '', city: '', province: '', maps_embed: '', maps_url: '',
        hours_weekday: '08:00 - 17:00', hours_saturday: '08:00 - 15:00', hours_sunday: 'Tutup',
        instagram: '', facebook: '', youtube: '', tiktok: '',
        logo_url: '', favicon_url: '', logo_highlight: 'Daffa',
        banner_active: false, banner_announcement: '',
        meta_title: '', meta_description: '', meta_keywords: '',
        admin_pin: '1234',
      });
      setLoading(false);
    });
  }, []);

  const showMsg = (type:'ok'|'err', text:string) => { setMsg({type,text}); setTimeout(()=>setMsg(null),3500); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const { error } = await supabase.from('store_settings').upsert({ ...settings, updated_at: new Date().toISOString() });
    setSaving(false);
    if (error) showMsg('err', error.message); else showMsg('ok', '✅ Pengaturan disimpan!');
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0]; if (!file) return; setUploading(true);
    const fn = `settings/${Date.now()}-${file.name.replace(/\s/g,'_')}`;
    const {error} = await supabase.storage.from('images').upload(fn, file);
    if (error) { showMsg('err','Upload gagal'); setUploading(false); return; }
    const {data:u} = supabase.storage.from('images').getPublicUrl(fn);
    setSettings((s:any) => ({...s, [field]: u.publicUrl}));
    setUploading(false); showMsg('ok','File diupload!');
  };

  const S = (field: string) => ({ value: settings?.[field] || '', onChange: (e: any) => setSettings((s:any)=>({...s,[field]:e.target.value})) });

  if (loading) return <div className={styles.loadingText}>Memuat pengaturan...</div>;

  return (
    <div className={styles.section}>
      {msg && <div className={`${styles.toast} ${msg.type==='ok'?styles.toastOk:styles.toastErr}`}>{msg.text}</div>}

      <div className={styles.tabsRow}>
        {(['store','contact','social','seo','appearance'] as const).map(t => (
          <button key={t} className={`${styles.tab} ${activeTab===t?styles.tabActive:''}`} onClick={()=>setActiveTab(t)}>
            {t === 'store' ? '🏪 Toko' : t === 'contact' ? '📞 Kontak' : t === 'social' ? '📱 Sosmed' : t === 'seo' ? '🔍 SEO' : '🎨 Tampilan'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave}>
        {activeTab === 'store' && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>🏪 Informasi Toko</h3>
            <div className={styles.formGrid}>
              <div className={styles.formField}><label>Nama Toko *</label><input required {...S('name')} /></div>
              <div className={styles.formField}><label>Tagline</label><input {...S('tagline')} placeholder="Terpercaya, Transparan, Berkualitas" /></div>
              <div className={`${styles.formField} ${styles.formFieldFull}`}><label>Deskripsi Toko</label><textarea rows={3} {...S('description')} /></div>
              <div className={styles.formField}><label>Sorot Nama (Logo Highlight)</label><input {...S('logo_highlight')} placeholder="Daffa" /></div>
              <div className={styles.formField}><label>PIN Admin</label><input type="password" {...S('admin_pin')} /></div>
              <div className={`${styles.formField} ${styles.formFieldFull}`}>
                <label style={{display:'flex',alignItems:'center',gap:'8px'}}>
                  <input type="checkbox" checked={!!settings?.banner_active} onChange={e=>setSettings((s:any)=>({...s,banner_active:e.target.checked}))} /> Tampilkan Banner Pengumuman
                </label>
              </div>
              {settings?.banner_active && (
                <div className={`${styles.formField} ${styles.formFieldFull}`}><label>Teks Banner</label><input {...S('banner_announcement')} placeholder="⚡ Promo spesial hari ini! Dapatkan diskon 10% untuk pembelian pertama" /></div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>📞 Kontak & Lokasi</h3>
            <div className={styles.formGrid}>
              <div className={styles.formField}><label>WhatsApp *</label><input required {...S('whatsapp')} placeholder="6281234567890" /></div>
              <div className={styles.formField}><label>Email</label><input type="email" {...S('email')} /></div>
              <div className={styles.formField}><label>No. Telepon</label><input {...S('phone')} /></div>
              <div className={`${styles.formField} ${styles.formFieldFull}`}><label>Alamat Lengkap</label><textarea rows={2} {...S('address')} /></div>
              <div className={styles.formField}><label>Kota</label><input {...S('city')} /></div>
              <div className={styles.formField}><label>Provinsi</label><input {...S('province')} /></div>
              <div className={`${styles.formField} ${styles.formFieldFull}`}><label>Embed Google Maps (iframe src)</label><input {...S('maps_embed')} placeholder="https://maps.google.com/maps?..." /></div>
              <div className={`${styles.formField} ${styles.formFieldFull}`}><label>URL Google Maps</label><input {...S('maps_url')} placeholder="https://maps.google.com/..." /></div>
              <div className={styles.formField}><label>Jam Senin-Jumat</label><input {...S('hours_weekday')} placeholder="08:00 - 17:00" /></div>
              <div className={styles.formField}><label>Jam Sabtu</label><input {...S('hours_saturday')} placeholder="08:00 - 15:00" /></div>
              <div className={styles.formField}><label>Jam Minggu</label><input {...S('hours_sunday')} placeholder="Tutup" /></div>
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>📱 Media Sosial</h3>
            <div className={styles.formGrid}>
              <div className={styles.formField}><label>📸 Instagram</label><input {...S('instagram')} placeholder="https://instagram.com/tokodaffa" /></div>
              <div className={styles.formField}><label>📘 Facebook</label><input {...S('facebook')} placeholder="https://facebook.com/tokodaffa" /></div>
              <div className={styles.formField}><label>▶️ YouTube</label><input {...S('youtube')} placeholder="https://youtube.com/@tokodaffa" /></div>
              <div className={styles.formField}><label>🎵 TikTok</label><input {...S('tiktok')} placeholder="https://tiktok.com/@tokodaffa" /></div>
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>🔍 SEO & Meta Tags</h3>
            <div className={styles.formGrid}>
              <div className={`${styles.formField} ${styles.formFieldFull}`}><label>Meta Title</label><input {...S('meta_title')} placeholder="TokoDaffa Gold - Jual Beli Emas Terpercaya" /></div>
              <div className={`${styles.formField} ${styles.formFieldFull}`}><label>Meta Description</label><textarea rows={2} {...S('meta_description')} placeholder="150-160 karakter deskripsi" /></div>
              <div className={`${styles.formField} ${styles.formFieldFull}`}><label>Keywords</label><input {...S('meta_keywords')} placeholder="emas, perhiasan, jual emas, beli emas" /></div>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>🎨 Tampilan & Branding</h3>
            <div className={styles.formGrid}>
              <div className={`${styles.formField} ${styles.formFieldFull}`}>
                <label>Logo URL</label>
                <div className={styles.photoUploadRow}>
                  <input {...S('logo_url')} placeholder="URL logo" />
                  <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={e=>handleUpload(e,'logo_url')} />
                  <button type="button" className={styles.btnSecondary} onClick={()=>fileRef.current?.click()} disabled={uploading}>{uploading?'⏳':'📁 Upload'}</button>
                </div>
                {settings?.logo_url && <img src={settings.logo_url} alt="logo" className={styles.photoPreview} style={{maxHeight:'60px',objectFit:'contain'}} />}
              </div>
              <div className={`${styles.formField} ${styles.formFieldFull}`}>
                <label>OG Image (untuk share di sosmed)</label>
                <input {...S('og_image')} placeholder="URL gambar 1200x630px" />
              </div>
            </div>
          </div>
        )}

        <div className={styles.formActions}>
          <button type="submit" className={styles.btnPrimary} disabled={saving}>
            {saving ? '⏳ Menyimpan...' : '💾 Simpan Pengaturan'}
          </button>
        </div>
      </form>
    </div>
  );
}
