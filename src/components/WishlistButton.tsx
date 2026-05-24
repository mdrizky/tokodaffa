"use client";

import { useWishlist } from '@/hooks/useWishlist';
import styles from './WishlistButton.module.css';

interface WishlistButtonProps {
  productId: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function WishlistButton({ productId, size = 'md', showLabel = false }: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist, loading } = useWishlist();
  const saved = isInWishlist(productId);

  return (
    <button
      className={`${styles.btn} ${styles[size]} ${saved ? styles.saved : ''}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(productId);
      }}
      disabled={loading}
      title={saved ? 'Hapus dari Wishlist' : 'Simpan ke Wishlist'}
      aria-label={saved ? 'Hapus dari Wishlist' : 'Simpan ke Wishlist'}
    >
      <svg
        width={size === 'sm' ? 16 : size === 'lg' ? 24 : 20}
        height={size === 'sm' ? 16 : size === 'lg' ? 24 : 20}
        viewBox="0 0 24 24"
        fill={saved ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {showLabel && <span>{saved ? 'Tersimpan' : 'Simpan'}</span>}
    </button>
  );
}
