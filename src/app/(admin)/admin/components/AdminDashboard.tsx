"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./Admin.module.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, messages: 0, reservations: 0, blogs: 0, goldWa: 0 });
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [recentReservations, setRecentReservations] = useState<any[]>([]);
  const [goldPrice, setGoldPrice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        // Load stats first (critical)
        const [prod, msg, rsv, blg, waClick] = await Promise.all([
          supabase.from('products').select('id', { count: 'exact', head: true }),
          supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
          supabase.from('reservations').select('id', { count: 'exact', head: true }),
          supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
          supabase.from('wa_inquiries').select('id', { count: 'exact', head: true }),
        ]);

        if (mounted) {
          setStats({
            products: prod.count || 0,
            messages: msg.count || 0,
            reservations: rsv.count || 0,
            blogs: blg.count || 0,
            goldWa: waClick.count || 0,
          });
          setLoading(false); // Show stats immediately
        }

        // Load detailed data in background
        const [gld, msgLatest, rsvLatest] = await Promise.all([
          supabase.from('gold_prices').select('*').order('updated_at', { ascending: false }).limit(5),
          supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(5),
          supabase.from('reservations').select('*').order('created_at', { ascending: false }).limit(5),
        ]);

        if (mounted) {
          setGoldPrice(gld.data?.[0]);
          setRecentMessages(msgLatest.data || []);
          setRecentReservations(rsvLatest.data || []);
        }
      } catch (e) {
        console.error(e);
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const formatPrice = (p: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p);
  const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className={styles.section}>
      {/* Header with Logo */}
      <div className={styles.dashboardHeader}>
        <img 
          src="/images/logo_toko_4-removebg-preview.png" 
          alt="Toko Mas Daffa" 
          style={{ height: '60px', width: 'auto' }}
        />
        <h1>Dashboard Admin</h1>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.statGold}`}>
          <div className={styles.statIcon}>💍</div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{stats.products}</div>
            <div className={styles.statLabel}>Total Produk</div>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.statGreen}`}>
          <div className={styles.statIcon}>💬</div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{stats.messages}</div>
            <div className={styles.statLabel}>Pesan Masuk</div>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.statBlue}`}>
          <div className={styles.statIcon}>📋</div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{stats.reservations}</div>
            <div className={styles.statLabel}>Reservasi</div>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.statPurple}`}>
          <div className={styles.statIcon}>📝</div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{stats.blogs}</div>
            <div className={styles.statLabel}>Artikel Blog</div>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.statOrange}`}>
          <div className={styles.statIcon}>📱</div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{stats.goldWa}</div>
            <div className={styles.statLabel}>Klik WA</div>
          </div>
        </div>
        {goldPrice && (
          <div className={`${styles.statCard} ${styles.statGold}`}>
            <div className={styles.statIcon}>💰</div>
            <div className={styles.statInfo}>
              <div className={styles.statValue} style={{ fontSize: '0.95rem' }}>{formatPrice(goldPrice.buy_price || 0)}</div>
              <div className={styles.statLabel}>Harga Beli /gram ({goldPrice.kadar})</div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>⚡ Aksi Cepat</h3>
        <div className={styles.quickActions}>
          <a href="/admin#products" className={styles.quickAction} onClick={() => {}}>
            <span>➕</span> Tambah Produk
          </a>
          <a href="/admin#gold-price" className={styles.quickAction}>
            <span>💱</span> Update Harga Emas
          </a>
          <a href="/admin#blog" className={styles.quickAction}>
            <span>✍️</span> Tulis Artikel
          </a>
          <a href="/" target="_blank" className={styles.quickAction}>
            <span>🌐</span> Lihat Website
          </a>
        </div>
      </div>

      <div className={styles.twoCol}>
        {/* Recent Messages */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>💬 Pesan Terbaru</h3>
          {recentMessages.length === 0 ? (
            <p className={styles.emptyText}>Belum ada pesan.</p>
          ) : (
            <div className={styles.list}>
              {recentMessages.map(msg => (
                <div key={msg.id} className={styles.listItem}>
                  <div className={styles.listItemTitle}>{msg.name} <span className={`${styles.badge} ${msg.status === 'new' ? styles.badgeNew : styles.badgeRead}`}>{msg.status === 'new' ? 'Baru' : 'Dibaca'}</span></div>
                  <div className={styles.listItemMeta}>{msg.subject}</div>
                  <div className={styles.listItemDate}>{formatDate(msg.created_at)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Reservations */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>📋 Reservasi Terbaru</h3>
          {recentReservations.length === 0 ? (
            <p className={styles.emptyText}>Belum ada reservasi.</p>
          ) : (
            <div className={styles.list}>
              {recentReservations.map(rsv => (
                <div key={rsv.id} className={styles.listItem}>
                  <div className={styles.listItemTitle}>{rsv.customer_name} <span className={`${styles.badge} ${rsv.status === 'pending' ? styles.badgeNew : styles.badgeRead}`}>{rsv.status}</span></div>
                  <div className={styles.listItemMeta}>{rsv.reservation_type} - {rsv.visit_date}</div>
                  <div className={styles.listItemDate}>{formatDate(rsv.created_at)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
