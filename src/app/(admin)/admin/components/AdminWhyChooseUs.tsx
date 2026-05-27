"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./Admin.module.css";

export default function AdminWhyChooseUs() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "",
    statistic: "",
    is_active: true,
    display_order: 0,
  });

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    const { data } = await supabase
      .from("why_choose_us")
      .select("*")
      .order("display_order", { ascending: true });
    setItems(data || []);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      await supabase
        .from("why_choose_us")
        .update(formData)
        .eq("id", editing.id);
    } else {
      await supabase.from("why_choose_us").insert([formData]);
    }
    setEditing(null);
    setFormData({ title: "", description: "", icon: "", statistic: "", is_active: true, display_order: 0 });
    loadItems();
  }

  async function handleDelete(id: number) {
    if (confirm("Hapus item ini?")) {
      await supabase.from("why_choose_us").delete().eq("id", id);
      loadItems();
    }
  }

  async function handleToggleActive(item: any) {
    await supabase
      .from("why_choose_us")
      .update({ is_active: !item.is_active })
      .eq("id", item.id);
    loadItems();
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.section}>
      <h3 className={styles.cardTitle}>⭐ Kelola "Kenapa Memilih Kami"</h3>
      
      {/* Form */}
      <div className={styles.card}>
        <h4>{editing ? "Edit Item" : "Tambah Item Baru"}</h4>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label>Judul *</label>
              <input
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className={styles.formField}>
              <label>Icon (emoji)</label>
              <input
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="Contoh: 💍, 🛡️, 🏆"
              />
            </div>
            <div className={styles.formField}>
              <label>Statistik</label>
              <input
                value={formData.statistic}
                onChange={(e) => setFormData({ ...formData, statistic: e.target.value })}
                placeholder="Contoh: 10K+, 25 Tahun"
              />
            </div>
            <div className={styles.formField}>
              <label>Urutan Tampilan</label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <div className={styles.formField}>
            <label>Deskripsi</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className={styles.formField}>
            <label>
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              Tampilkan di website
            </label>
          </div>
          <div className={styles.formActions}>
            <button type="submit" className="btn btn-primary">
              {editing ? "Update" : "Tambah"}
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setFormData({ title: "", description: "", icon: "", statistic: "", is_active: true, display_order: 0 });
                }}
                className="btn btn-secondary"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div className={styles.card}>
        <h4>Daftar Item</h4>
        <div className={styles.list}>
          {items.map((item) => (
            <div key={item.id} className={styles.listItem}>
              <div className={styles.listItemTitle}>
                {item.icon} {item.title} <span className={`${styles.badge} ${item.is_active ? styles.badgeNew : styles.badgeRead}`}>
                  {item.is_active ? "Aktif" : "Nonaktif"}
                </span>
              </div>
              <div className={styles.listItemMeta}>{item.statistic}</div>
              <div className={styles.listItemDate}>{item.description}</div>
              <div className={styles.listItemActions}>
                <button onClick={() => { setEditing(item); setFormData(item); }}>Edit</button>
                <button onClick={() => handleToggleActive(item)}>
                  {item.is_active ? "Sembunyikan" : "Tampilkan"}
                </button>
                <button onClick={() => handleDelete(item.id)}>Hapus</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
