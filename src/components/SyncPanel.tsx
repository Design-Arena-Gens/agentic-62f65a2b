'use client';

import { useDriverStore } from '@/state/useDriverStore';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export default function SyncPanel() {
  const online = useOnlineStatus();
  const syncStatus = useDriverStore((state) => state.syncStatus);
  const syncWithCloud = useDriverStore((state) => state.syncWithCloud);
  const lastSync = useDriverStore((state) => state.lastSync);
  const error = useDriverStore((state) => state.error);

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 text-sm text-slate-200">
      <div className="flex items-center gap-3">
        <span className={`h-2.5 w-2.5 rounded-full ${online ? 'bg-emerald-400' : 'bg-amber-400'}`} />
        <div>
          <p className="font-semibold text-white">Cloud sync</p>
          <p className="text-xs text-slate-400">
            {lastSync ? `Last sync ${new Date(lastSync).toLocaleString()}` : 'Not synced yet'}
          </p>
        </div>
        <button
          type="button"
          disabled={syncStatus === 'pending' || !online}
          onClick={() => syncWithCloud()}
          className="ml-auto rounded-full bg-accent px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-orange-500 disabled:opacity-40"
        >
          {syncStatus === 'pending' ? 'Syncing…' : 'Sync now'}
        </button>
      </div>
      {error && <p className="mt-3 text-xs text-amber-400">{error}</p>}
      <p className="mt-4 text-xs text-slate-400">
        Works offline using SQLite. When you go online, data auto-syncs to the cloud endpoint.
      </p>
    </div>
  );
}
