"use client";

import { useState } from "react";
import styles from "./ContactForm.module.css";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    bot_field: "" // Honeypot field
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setStatus("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("Pesan berhasil dikirim! Kami akan menghubungi Anda segera.");
        setFormData({ name: "", email: "", phone: "", subject: "", message: "", bot_field: "" });
      } else {
        setStatus(data.error || "Gagal mengirim pesan. Silakan coba lagi.");
      }
    } catch (error) {
      setStatus("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={styles.contactForm}>
      <div className={styles.formHeader}>
        <h2>Hubungi Kami</h2>
        <p>Kirim pesan kepada kami dan kami akan segera merespon</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Honeypot field to catch spam bots */}
        <div style={{ display: "none" }} aria-hidden="true">
          <label htmlFor="bot_field">Don't fill this out if you're human:</label>
          <input
            type="text"
            id="bot_field"
            name="bot_field"
            value={formData.bot_field}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nama Lengkap *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Masukkan nama lengkap Anda"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="email@contoh.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Nomor Telepon</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="08xxxxxxxxxx"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="subject">Subjek *</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="Subjek pesan Anda"
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="message">Pesan *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              placeholder="Tulis pesan Anda di sini..."
            />
          </div>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={sending}>
          {sending ? "Mengirim..." : "Kirim Pesan"}
        </button>

        {status && (
          <div className={`${styles.statusMessage} ${status.includes("berhasil") ? styles.success : styles.error}`}>
            {status}
          </div>
        )}
      </form>
    </div>
  );
}
