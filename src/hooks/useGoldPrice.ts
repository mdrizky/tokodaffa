import { useState, useEffect } from 'react';

export function useGoldPrice(initialData?: any) {
  const [data, setData] = useState<any>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  const fetchPrice = async () => {
    try {
      const res = await fetch('/api/gold-price');
      if (!res.ok) throw new Error('Failed to fetch from smart API');
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch if no initialData
    if (!initialData) {
      fetchPrice();
    }

    // Polling every 60 seconds for real-time updates
    const interval = setInterval(() => {
      fetchPrice();
    }, 60000);

    return () => clearInterval(interval);
  }, [initialData]);

  return { data, loading, error, refetch: fetchPrice };
}
