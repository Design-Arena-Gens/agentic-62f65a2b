'use client';

import { useEffect } from 'react';
import { useDriverStore } from '@/state/useDriverStore';

export function useAutoSync() {
  const syncWithCloud = useDriverStore((state) => state.syncWithCloud);
  const ready = useDriverStore((state) => state.ready);

  useEffect(() => {
    if (!ready) return;
    const syncIfOnline = () => {
      if (typeof navigator !== 'undefined' && navigator.onLine) {
        void syncWithCloud();
      }
    };

    syncIfOnline();
    const interval = setInterval(syncIfOnline, 60_000);

    const handleOnline = () => syncIfOnline();
    window.addEventListener('online', handleOnline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
    };
  }, [ready, syncWithCloud]);
}
