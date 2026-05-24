"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./Admin.module.css";

export default function AdminGoldPrice() {
  const [prices, setPrices] = useState<any[]>([]);
  const [editData, setEditData] = useState<Record<number, any>>({});
  const [saving, setSaving] = useState<number | null>(null);
  const [msg, setMsg] = useState<{type:'ok'|'err', text:string}|null>(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newForm, setNewForm] = useState({ kadar: '24K', buy_price: '', sell_price: '' });

  const fetchPrices = async () => {
    const { data } = await supabase.from('gold_prices').select('*').order('kadar');
    setPrices(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchPrices(); }, []);

  const showMsg = (type: 'ok'|'err', text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleUpdate = async (price: any) => {
    const edit = editData[price.id] || price;
    setSaving(price.id);
    const { error } = await supabase.from('gold_prices').update({
      buy_price: parseInt(edit.buy_price || price.buy_price),
      sell_price: parseInt(edit.sell_price || price.sell_price),
      updated_at: new Date().toISOString(),
    }).eq('id', price.id);
    setSaving(null);
    if (error) showMsg('err', 'Gagal update: ' + error.message);
    else { showMsg('ok', `✅ Harga ${price.kadar} diperbarui!`); fetchPrices(); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('gold_prices').upsert({
      kadar: newForm.kadar,
      buy_price: parseInt(newForm.buy_price),
      sell_price: parseInt(newForm.sell_price),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'kadar' });
    if (error) showMsg('err', error.message);
    else { showMsg('ok', '✅ Harga ditambahkan!'); setShowAdd(false); setNewForm({ kadar: '24K', buy_price: '', sell_price: '' }); fetchPrices(); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus data harga ini?')) return;
    await supabase.from('gold_prices').delete().eq('id', id);
    fetchPrices();
    showMsg('ok', 'Data dihapus');
  };

  const formatPrice = (p: number) => new Intl.NumberFormat('id-ID').format(p);

  return (
    <div className={styles.section}>
      {msg && <div className={`${styles.toast} ${msg.type === 'ok' ? styles.toastOk : styles.toastErr}`}>{msg.text}</div>}

      <div className={styles.infoBox}>
        <strong>💡 Info:</strong> Perbarui harga emas secara berkala. Harga ini akan tampil di halaman Harga Emas dan digunakan Kalkulator.
      </div>

      <div className={styles.sectionHeader}>
        <h3 className={styles.cardTitle}>💰 Daftar Harga Emas & Perak</h3>
        <button className={styles.btnPrimary} onClick={() => setShowAdd(!showAdd)}>
          ➕ Tambah Kadar Baru
        </button>
      </div>

      {showAdd && (
        <div className={styles.card}>
          <h4 className={styles.cardTitle}>Tambah Kadar Baru</h4>
          <form onSubmit={handleAdd} className={styles.formGrid}>
            <div className={styles.formField}>
              <label>Kadar</label>
              <input required value={newForm.kadar} onChange={e => setNewForm(f => ({...f, kadar:e.target.value}))} placeholder="24K / perak 925" />
            </div>
            <div className={styles.formField}>
              <label>Harga Beli /gram (Rp)</label>
              <input required type="number" min="1000" value={newForm.buy_price} onChange={e => setNewForm(f => ({...f, buy_price:e.target.value}))} placeholder="1050000" />
            </div>
            <div className={styles.formField}>
              <label>Harga Jual /gram (Rp)</label>
              <input required type="number" min="1000" value={newForm.sell_price} onChange={e => setNewForm(f => ({...f, sell_price:e.target.value}))} placeholder="1100000" />
            </div>
            <div className={`${styles.formActions} ${styles.formFieldFull}`}>
              <button type="button" className={styles.btnSecondary} onClick={() => setShowAdd(false)}>Batal</button>
              <button type="submit" className={styles.btnPrimary}>Simpan</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className={styles.loadingText}>Memuat harga...</div>
      ) : (
        <div className={styles.priceCards}>
          {prices.map(price => {
            const edit = editData[price.id] || {};
            return (
              <div key={price.id} className={styles.priceCard}>
                <div className={styles.priceCardHeader}>
                  <h3>{price.kadar}</h3>
                  <button className={styles.btnDelete} onClick={() => handleDelete(price.id)}>🗑️</button>
                </div>
                <div className={styles.priceCardBody}>
                  <div className={styles.formField}>
                    <label>Harga Beli /gram (Rp)</label>
                    <input
                      type="number"
                      defaultValue={price.buy_price}
                      onChange={e => setEditData(d => ({...d, [price.id]: {...(d[price.id]||{}), buy_price: e.target.value}}))}
                      placeholder={formatPrice(price.buy_price)}
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>Harga Jual /gram (Rp)</label>
                    <input
                      type="number"
                      defaultValue={price.sell_price}
                      onChange={e => setEditData(d => ({...d, [price.id]: {...(d[price.id]||{}), sell_price: e.target.value}}))}
                      placeholder={formatPrice(price.sell_price)}
                    />
                  </div>
                  <div className={styles.priceCurrent}>
                    <span>Beli: <strong style={{color:'#22c55e'}}>Rp {formatPrice(price.buy_price)}</strong></span>
                    <span>Jual: <strong style={{color:'#d4af37'}}>Rp {formatPrice(price.sell_price)}</strong></span>
                  </div>
                  <button
                    className={styles.btnPrimary}
                    onClick={() => handleUpdate(price)}
                    disabled={saving === price.id}
                  >
                    {saving === price.id ? '⏳ Menyimpan...' : '💾 Perbarui Harga'}
                  </button>
                  <small className={styles.updatedAt}>
                    Update: {new Date(price.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </small>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
