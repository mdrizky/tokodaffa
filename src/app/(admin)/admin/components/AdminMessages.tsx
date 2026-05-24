"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./Admin.module.css";

export default function AdminMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [filter, setFilter] = useState<'all'|'new'|'read'>('all');
  const [storeWa, setStoreWa] = useState('');

  useEffect(() => {
    supabase.from('store_settings').select('whatsapp').single().then(({data}) => {
      if (data) setStoreWa(data.whatsapp || '');
    });
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    setMessages(data || []);
    setLoading(false);
  };

  const markRead = async (id: number) => {
    await supabase.from('contact_messages').update({ status: 'read' }).eq('id', id);
    fetchMessages();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus pesan ini?')) return;
    await supabase.from('contact_messages').delete().eq('id', id);
    fetchMessages();
    if (selected?.id === id) setSelected(null);
  };

  const replyWa = (msg: any) => {
    if (!storeWa) return;
    const text = `Halo ${msg.name} 👋\n\nTerima kasih sudah menghubungi TokoDaffa Gold.\n\nMenanggapi pesan Anda tentang: "${msg.subject}"\n\n`;
    window.open(`https://wa.me/${msg.phone?.replace(/\D/g,'')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const filtered = messages.filter(m => filter === 'all' ? true : m.status === filter);
  const newCount = messages.filter(m => m.status === 'new').length;
  const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.filterTabs}>
          <button className={`${styles.filterTab} ${filter==='all'?styles.filterTabActive:''}`} onClick={()=>setFilter('all')}>Semua ({messages.length})</button>
          <button className={`${styles.filterTab} ${filter==='new'?styles.filterTabActive:''}`} onClick={()=>setFilter('new')}>🔴 Baru ({newCount})</button>
          <button className={`${styles.filterTab} ${filter==='read'?styles.filterTabActive:''}`} onClick={()=>setFilter('read')}>Dibaca</button>
        </div>
      </div>

      <div className={styles.twoColMessages}>
        {/* List */}
        <div className={styles.messageList}>
          {loading ? <div className={styles.loadingText}>Memuat pesan...</div> :
            filtered.length === 0 ? <p className={styles.emptyText}>Tidak ada pesan.</p> :
            filtered.map(msg => (
              <div
                key={msg.id}
                className={`${styles.messageItem} ${selected?.id===msg.id?styles.messageItemActive:''} ${msg.status==='new'?styles.messageItemNew:''}`}
                onClick={() => { setSelected(msg); markRead(msg.id); }}
              >
                <div className={styles.messageItemHeader}>
                  <strong>{msg.name}</strong>
                  {msg.status==='new' && <span className={styles.badgeNew}>Baru</span>}
                </div>
                <div className={styles.messageItemSubject}>{msg.subject}</div>
                <div className={styles.messageItemDate}>{formatDate(msg.created_at)}</div>
              </div>
            ))
          }
        </div>

        {/* Detail */}
        <div className={styles.messageDetail}>
          {!selected ? (
            <div className={styles.messageDetailEmpty}>
              <span>📧</span>
              <p>Pilih pesan untuk membaca</p>
            </div>
          ) : (
            <div>
              <div className={styles.messageDetailHeader}>
                <h3>{selected.subject}</h3>
                <button className={styles.btnDelete} onClick={() => handleDelete(selected.id)}>🗑️</button>
              </div>
              <div className={styles.messageDetailMeta}>
                <div><strong>Dari:</strong> {selected.name}</div>
                <div><strong>Email:</strong> {selected.email}</div>
                {selected.phone && <div><strong>HP:</strong> {selected.phone}</div>}
                <div><strong>Waktu:</strong> {formatDate(selected.created_at)}</div>
              </div>
              <div className={styles.messageBody}>{selected.message}</div>
              <div className={styles.messageActions}>
                {selected.phone && (
                  <button className={styles.btnWa} onClick={() => replyWa(selected)}>
                    📱 Balas via WhatsApp
                  </button>
                )}
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className={styles.btnSecondary}>
                  📧 Balas via Email
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
