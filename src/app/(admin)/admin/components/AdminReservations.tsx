"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./Admin.module.css";

const STATUS_OPTIONS = ['pending', 'confirmed', 'completed', 'cancelled'];

export default function AdminReservations() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [filter, setFilter] = useState<string>('all');
  const [storeWa, setStoreWa] = useState('');

  useEffect(() => {
    supabase.from('store_settings').select('whatsapp').single().then(({data}) => {
      if (data) setStoreWa(data.whatsapp || '');
    });
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    const { data } = await supabase.from('reservations').select('*').order('created_at', { ascending: false });
    setReservations(data || []);
    setLoading(false);
  };

  const updateStatus = async (id: number, status: string) => {
    await supabase.from('reservations').update({ status }).eq('id', id);
    fetchReservations();
    if (selected?.id === id) setSelected((s: any) => ({...s, status}));
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus reservasi ini?')) return;
    await supabase.from('reservations').delete().eq('id', id);
    fetchReservations();
    if (selected?.id === id) setSelected(null);
  };

  const contactWa = (rsv: any) => {
    const text = `Halo ${rsv.customer_name} 👋\n\nKonfirmasi reservasi Anda di TokoDaffa Gold:\n\n📅 Tanggal: ${rsv.visit_date}\n🔧 Layanan: ${rsv.reservation_type}\n\nKami tunggu kedatangan Anda!\n\nTokoDaffa Gold ◆`;
    const phone = rsv.customer_phone?.replace(/\D/g, '');
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const filtered = filter === 'all' ? reservations : reservations.filter(r => r.status === filter);
  const pending = reservations.filter(r => r.status === 'pending').length;
  const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const statusColor = (s: string) => {
    if (s === 'confirmed') return styles.tagGreen;
    if (s === 'completed') return styles.tagBlue;
    if (s === 'cancelled') return styles.tagRed;
    return styles.tagYellow;
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.filterTabs}>
          <button className={`${styles.filterTab} ${filter==='all'?styles.filterTabActive:''}`} onClick={()=>setFilter('all')}>Semua ({reservations.length})</button>
          <button className={`${styles.filterTab} ${filter==='pending'?styles.filterTabActive:''}`} onClick={()=>setFilter('pending')}>⏳ Pending ({pending})</button>
          <button className={`${styles.filterTab} ${filter==='confirmed'?styles.filterTabActive:''}`} onClick={()=>setFilter('confirmed')}>✅ Confirmed</button>
          <button className={`${styles.filterTab} ${filter==='completed'?styles.filterTabActive:''}`} onClick={()=>setFilter('completed')}>🏁 Selesai</button>
        </div>
      </div>

      <div className={styles.twoColMessages}>
        <div className={styles.messageList}>
          {loading ? <div className={styles.loadingText}>Memuat...</div> :
            filtered.length === 0 ? <p className={styles.emptyText}>Tidak ada reservasi.</p> :
            filtered.map(rsv => (
              <div
                key={rsv.id}
                className={`${styles.messageItem} ${selected?.id===rsv.id?styles.messageItemActive:''} ${rsv.status==='pending'?styles.messageItemNew:''}`}
                onClick={() => setSelected(rsv)}
              >
                <div className={styles.messageItemHeader}>
                  <strong>{rsv.customer_name}</strong>
                  <span className={`${styles.tag} ${statusColor(rsv.status)}`}>{rsv.status}</span>
                </div>
                <div className={styles.messageItemSubject}>{rsv.reservation_type}</div>
                <div className={styles.messageItemDate}>{rsv.visit_date} • {formatDate(rsv.created_at)}</div>
              </div>
            ))
          }
        </div>

        <div className={styles.messageDetail}>
          {!selected ? (
            <div className={styles.messageDetailEmpty}><span>📋</span><p>Pilih reservasi</p></div>
          ) : (
            <div>
              <div className={styles.messageDetailHeader}>
                <h3>Reservasi #{selected.id}</h3>
                <button className={styles.btnDelete} onClick={() => handleDelete(selected.id)}>🗑️</button>
              </div>
              <div className={styles.messageDetailMeta}>
                <div><strong>Nama:</strong> {selected.customer_name}</div>
                <div><strong>HP/WA:</strong> {selected.customer_phone}</div>
                {selected.customer_email && <div><strong>Email:</strong> {selected.customer_email}</div>}
                <div><strong>Layanan:</strong> {selected.reservation_type}</div>
                <div><strong>Tanggal Diinginkan:</strong> {selected.visit_date}</div>
                {selected.visit_time && <div><strong>Jam:</strong> {selected.visit_time}</div>}
                {selected.product_name && <div><strong>Produk:</strong> {selected.product_name}</div>}
                {selected.notes && <div><strong>Catatan:</strong> {selected.notes}</div>}
              </div>

              <div className={styles.formField} style={{marginTop:'16px'}}>
                <label>Update Status:</label>
                <select
                  value={selected.status}
                  onChange={e => updateStatus(selected.id, e.target.value)}
                  className={styles.statusSelect}
                >
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                </select>
              </div>

              <div className={styles.messageActions}>
                {selected.customer_phone && (
                  <button className={styles.btnWa} onClick={() => contactWa(selected)}>
                    📱 Konfirmasi via WA
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
