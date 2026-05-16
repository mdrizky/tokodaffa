"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import JewelryViewer3D from "@/components/builder/JewelryViewer3D";
import { getGoldPrices } from "@/lib/dataFetch";
import { Check, ChevronLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function JewelryBuilder() {
  const [jewelryType, setJewelryType] = useState("ring");
  const [material, setMaterial] = useState("gold");
  const [stone, setStone] = useState("diamond");
  const [engraving, setEngraving] = useState("");
  const [size, setSize] = useState(15);
  
  const [basePrice, setBasePrice] = useState(1100000); // Default 24K
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  // Constants
  const baseWeight = 5; // grams
  const stonePrices: Record<string, number> = {
    diamond: 5000000,
    ruby: 3000000,
    sapphire: 3500000,
    emerald: 4000000
  };
  const engravePricePerChar = 50000;
  
  useEffect(() => {
    async function load() {
      const g = await getGoldPrices();
      if (g && g.prices) {
        setBasePrice(g.prices["24K"] || 1100000);
      }
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    let metalMultiplier = 1;
    if (material === 'rose-gold') metalMultiplier = 0.9;
    if (material === 'silver') metalMultiplier = 0.1;
    if (material === 'titanium') metalMultiplier = 0.5;

    const metalCost = basePrice * metalMultiplier * baseWeight;
    const stoneCost = stonePrices[stone] || 0;
    const engraveCost = (engraving.length * engravePricePerChar);
    const sizeCost = (size - 15) * 100000; // Extra cost for larger sizes

    setTotalPrice(metalCost + stoneCost + engraveCost + (sizeCost > 0 ? sizeCost : 0));
  }, [material, stone, engraving, size, basePrice]);

  const handleCheckout = () => {
    const text = `Halo TokoDaffa! Saya ingin memesan cincin custom dari 3D Builder:\n\n- Material: ${material.toUpperCase()}\n- Batu: ${stone.toUpperCase()}\n- Ukuran: ${size}\n- Ukiran: ${engraving || 'Tidak ada'}\n- Estimasi Harga: Rp ${totalPrice.toLocaleString()}\n\nMohon dibantu prosesnya.`;
    window.open(`https://wa.me/081365555411?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) {
    return (
      <div className={styles.loadingOverlay}>
        <div className={styles.loadingSpinner}></div>
        <p style={{ color: '#d4af37', letterSpacing: '2px' }}>INITIALIZING 3D STUDIO...</p>
      </div>
    );
  }

  return (
    <div className={styles.builderContainer}>
      <Link href="/" className={styles.backBtn}>
        <ChevronLeft size={20} /> Back to Catalog
      </Link>

      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
           <h2>Bespoke Studio</h2>
           <p>Design your masterpiece. Every detail is rendered in real-time perfection.</p>
        </div>

        <div className={styles.configSection}>
          <div className={styles.configTitle}>1. Jewelry Type</div>
          <div className={styles.configGrid} style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
             <button className={`${styles.optionBtn} ${jewelryType === 'ring' ? styles.active : ''}`} onClick={() => setJewelryType('ring')}>
               <span style={{ fontSize: '1.5rem' }}>💍</span>
               <span>Ring</span>
             </button>
             <button className={`${styles.optionBtn} ${jewelryType === 'bracelet' ? styles.active : ''}`} onClick={() => setJewelryType('bracelet')}>
               <span style={{ fontSize: '1.5rem' }}>⭕</span>
               <span>Bracelet</span>
             </button>
             <button className={`${styles.optionBtn} ${jewelryType === 'necklace' ? styles.active : ''}`} onClick={() => setJewelryType('necklace')}>
               <span style={{ fontSize: '1.5rem' }}>📿</span>
               <span>Necklace</span>
             </button>
          </div>
        </div>

        <div className={styles.configSection}>
          <div className={styles.configTitle}>2. Precious Metal</div>
          <div className={styles.configGrid}>
             <button className={`${styles.optionBtn} ${material === 'gold' ? styles.active : ''}`} onClick={() => setMaterial('gold')}>
               <div className={styles.optionColor} style={{ background: '#FFD700' }} />
               <span>24K Gold</span>
             </button>
             <button className={`${styles.optionBtn} ${material === 'rose-gold' ? styles.active : ''}`} onClick={() => setMaterial('rose-gold')}>
               <div className={styles.optionColor} style={{ background: '#B76E79' }} />
               <span>Rose Gold</span>
             </button>
             <button className={`${styles.optionBtn} ${material === 'silver' ? styles.active : ''}`} onClick={() => setMaterial('silver')}>
               <div className={styles.optionColor} style={{ background: '#E5E4E2' }} />
               <span>Platinum Silver</span>
             </button>
             <button className={`${styles.optionBtn} ${material === 'titanium' ? styles.active : ''}`} onClick={() => setMaterial('titanium')}>
               <div className={styles.optionColor} style={{ background: '#1a1a1a' }} />
               <span>Black Titanium</span>
             </button>
          </div>
        </div>

        <div className={styles.configSection}>
          <div className={styles.configTitle}>3. Gemstone</div>
          <div className={styles.configGrid}>
             <button className={`${styles.optionBtn} ${stone === 'diamond' ? styles.active : ''}`} onClick={() => setStone('diamond')}>
               <div className={styles.optionColor} style={{ background: '#ffffff', boxShadow: '0 0 10px #fff' }} />
               <span>Flawless Diamond</span>
             </button>
             <button className={`${styles.optionBtn} ${stone === 'ruby' ? styles.active : ''}`} onClick={() => setStone('ruby')}>
               <div className={styles.optionColor} style={{ background: '#e0115f' }} />
               <span>Royal Ruby</span>
             </button>
             <button className={`${styles.optionBtn} ${stone === 'sapphire' ? styles.active : ''}`} onClick={() => setStone('sapphire')}>
               <div className={styles.optionColor} style={{ background: '#0f52ba' }} />
               <span>Ocean Sapphire</span>
             </button>
             <button className={`${styles.optionBtn} ${stone === 'emerald' ? styles.active : ''}`} onClick={() => setStone('emerald')}>
               <div className={styles.optionColor} style={{ background: '#50c878' }} />
               <span>Imperial Emerald</span>
             </button>
          </div>
        </div>

        <div className={styles.configSection}>
          <div className={styles.configTitle}>4. Personal Engraving</div>
          <p style={{ fontSize: '0.8rem', color: '#8a8780', marginBottom: '12px' }}>Leave a mark for eternity. (Max 10 chars)</p>
          <input 
            type="text" 
            className={styles.inputField} 
            placeholder="e.g. FOREVER" 
            maxLength={10}
            value={engraving}
            onChange={(e) => setEngraving(e.target.value)}
          />
        </div>

        <div className={styles.configSection} style={{ borderBottom: 'none' }}>
          <div className={styles.configTitle}>5. Size (HK)</div>
          <p style={{ fontSize: '0.8rem', color: '#8a8780', marginBottom: '12px' }}>Selected Size: {size}</p>
          <input 
            type="range" 
            min="10" 
            max="25" 
            value={size} 
            onChange={(e) => setSize(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#d4af37' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666', marginTop: '8px' }}>
             <span>Size 10</span>
             <span>Size 25</span>
          </div>
        </div>
      </div>

      <div className={styles.canvasWrapper}>
        <JewelryViewer3D jewelryType={jewelryType} material={material} stone={stone} engraving={engraving} size={size} />
        
        <motion.div 
          className={styles.priceCalculator}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className={styles.priceInfo}>
             <h4>Estimated Investment</h4>
             <div className={styles.total}>Rp {totalPrice.toLocaleString()}</div>
          </div>
          <button className={styles.checkoutBtn} onClick={handleCheckout}>
             <ShoppingBag size={20} />
             Add to Custom Order
          </button>
        </motion.div>
      </div>
    </div>
  );
}
