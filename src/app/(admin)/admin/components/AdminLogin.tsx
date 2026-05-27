"use client";
import { useState } from "react";
import styles from "./Admin.module.css";

export default function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || "240708";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    await new Promise(r => setTimeout(r, 600));
    if (pin === ADMIN_PIN) { onLogin(); }
    else { setError("PIN salah. Coba lagi."); }
    setLoading(false);
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.loginLogo}>
          <span className={styles.loginLogoIcon}>◆</span>
          <h1>Admin Panel</h1>
          <p>TokoDaffa Gold</p>
        </div>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.pinInputWrap}>
            <input
              type="password" inputMode="numeric" maxLength={8}
              placeholder="Masukkan PIN Admin"
              value={pin} onChange={e => setPin(e.target.value)}
              className={styles.pinInput} autoFocus
            />
          </div>
          {error && <div className={styles.loginError}>❌ {error}</div>}
          <button type="submit" disabled={loading || pin.length < 4} className={styles.loginBtn}>
            {loading ? "Memverifikasi..." : "🔐 Masuk"}
          </button>
        </form>
        <div className={styles.loginFooter}>
          <a href="/" className={styles.backHome}>← Kembali ke Website</a>
        </div>
      </div>
    </div>
  );
}
