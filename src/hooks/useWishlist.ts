"use client";

import { useState, useEffect, useCallback } from 'react';
import { addToWishlist, removeFromWishlist } from '@/lib/dataFetch';

const WISHLIST_KEY = 'tkd_wishlist';
const IDENTIFIER_KEY = 'tkd_uid';

function getOrCreateIdentifier(): string {
  if (typeof window === 'undefined') return '';
  let uid = localStorage.getItem(IDENTIFIER_KEY);
  if (!uid) {
    uid = `tkd_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(IDENTIFIER_KEY, uid);
  }
  return uid;
}

function getLocalWishlist(): number[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(WISHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setLocalWishlist(ids: number[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setWishlist(getLocalWishlist());
  }, []);

  const isInWishlist = useCallback((productId: number) => {
    return wishlist.includes(productId);
  }, [wishlist]);

  const toggleWishlist = useCallback(async (productId: number) => {
    setLoading(true);
    const identifier = getOrCreateIdentifier();
    const current = getLocalWishlist();
    
    if (current.includes(productId)) {
      // Remove
      const updated = current.filter(id => id !== productId);
      setLocalWishlist(updated);
      setWishlist(updated);
      await removeFromWishlist(identifier, productId);
    } else {
      // Add
      const updated = [...current, productId];
      setLocalWishlist(updated);
      setWishlist(updated);
      await addToWishlist(identifier, productId);
    }
    setLoading(false);
  }, []);

  const clearWishlist = useCallback(() => {
    setLocalWishlist([]);
    setWishlist([]);
  }, []);

  return { wishlist, isInWishlist, toggleWishlist, clearWishlist, loading };
}
