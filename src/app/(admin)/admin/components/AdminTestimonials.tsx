"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./Admin.module.css";

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    text: "",
    rating: 5,
    product_purchased: "",
    is_active: true,
  });

  useEffect(() => {
    let mounted = true;
    async function loadTestimonials() {
      try {
        const { data } = await supabase
          .from("testimonials")
          .select("id, name, role, text, rating, product_purchased, is_active, display_order")
          .order("display_order", { ascending: true });
        if (mounted) {
          setTestimonials(data || []);
          setLoading(false);
        }
      } catch (e) {
        console.error(e);
        if (mounted) setLoading(false);
      }
    }
    loadTestimonials();
    return () => { mounted = false; };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      await supabase
        .from("testimonials")
        .update(formData)
        .eq("id", editing.id);
    } else {
      await supabase.from("testimonials").insert([formData]);
    }
    setEditing(null);
    setFormData({ name: "", role: "", text: "", rating: 5, product_purchased: "", is_active: true });
    loadTestimonials();
  }

  async function handleDelete(id: number) {
    if (confirm("Hapus testimoni ini?")) {
      await supabase.from("testimonials").delete().eq("id", id);
      loadTestimonials();
    }
  }

  async function handleToggleActive(item: any) {
    await supabase
      .from("testimonials")
      .update({ is_active: !item.is_active })
      .eq("id", item.id);
    loadTestimonials();
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.section}>
      <h3 className={styles.cardTitle}>💬 Kelola Testimoni</h3>
      
      {/* Form */}
      <div className={styles.card}>
        <h4>{editing ? "Edit Testimoni" : "Tambah Testimoni Baru"}</h4>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label>Nama *</label>
              <input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className={styles.formField}>
              <label>Role</label>
              <input
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="Contoh: Pelanggan, Investor, dll"
              />
            </div>
            <div className={styles.formField}>
              <label>Rating (1-5)</label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} Bintang
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formField}>
              <label>Produk yang Dibeli</label>
              <input
                value={formData.product_purchased}
                onChange={(e) => setFormData({ ...formData, product_purchased: e.target.value })}
              />
            </div>
          </div>
          <div className={styles.formField}>
            <label>Testimoni *</label>
            <textarea
              required
              rows={4}
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
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
                  setFormData({ name: "", role: "", text: "", rating: 5, product_purchased: "", is_active: true });
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
        <h4>Daftar Testimoni</h4>
        <div className={styles.list}>
          {testimonials.map((item) => (
            <div key={item.id} className={styles.listItem}>
              <div className={styles.listItemTitle}>
                {item.name} <span className={`${styles.badge} ${item.is_active ? styles.badgeNew : styles.badgeRead}`}>
                  {item.is_active ? "Aktif" : "Nonaktif"}
                </span>
              </div>
              <div className={styles.listItemMeta}>{item.role} • {item.rating}⭐ • {item.product_purchased}</div>
              <div className={styles.listItemDate}>"{item.text}"</div>
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
