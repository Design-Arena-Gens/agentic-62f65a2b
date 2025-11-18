'use client';

import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useDriverStore } from '@/state/useDriverStore';

export default function OfflineStatusBadge() {
  const online = useOnlineStatus();
  const syncStatus = useDriverStore((state) => state.syncStatus);
  const lastSync = useDriverStore((state) => state.lastSync);

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-800/70 px-4 py-3 text-sm text-slate-200">
      <span
        className={`h-2.5 w-2.5 rounded-full ${
          online ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
        }`}
      />
      <div>
        <p className="font-semibold">{online ? 'Online' : 'Offline mode'}</p>
        <p className="text-xs text-slate-400">
          Sync status: {syncStatus}{' '}
          {lastSync ? `· Last synced ${new Date(lastSync).toLocaleTimeString()}` : '· not yet synced'}
        </p>
      </div>
    </div>
  );
}
