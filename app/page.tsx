'use client';

import { useEffect, useMemo, useState } from 'react';
import SplashLogin from '@/components/SplashLogin';
import OfflineStatusBadge from '@/components/OfflineStatusBadge';
import OverviewCards from '@/components/OverviewCards';
import TripPlanner from '@/components/TripPlanner';
import ExpenseTracker from '@/components/ExpenseTracker';
import AICopilot from '@/components/AICopilot';
import VehicleChecklist from '@/components/VehicleChecklist';
import SyncPanel from '@/components/SyncPanel';
import { useDriverStore } from '@/state/useDriverStore';
import { useAutoSync } from '@/hooks/useAutoSync';

const sections = [
  { id: 'overview', label: 'Dashboard' },
  { id: 'trips', label: 'Trips & Routing' },
  { id: 'expenses', label: 'Expenses' },
  { id: 'copilot', label: 'AI Copilot' },
  { id: 'maintenance', label: 'Maintenance' }
] as const;

export default function Home() {
  const initialize = useDriverStore((state) => state.initialize);
  const ready = useDriverStore((state) => state.ready);
  const driverName = useDriverStore((state) => state.driverName);
  const [active, setActive] = useState<(typeof sections)[number]['id']>('overview');

  useEffect(() => {
    void initialize();
  }, [initialize]);

  useAutoSync();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'सुप्रभात';
    if (hour < 18) return 'नमस्ते';
    return 'शुभ संध्या';
  }, []);

  return (
    <main className="flex flex-1 flex-col gap-6 p-6 md:flex-row">
      <aside className="md:sticky md:top-6 md:h-[calc(100vh-3rem)] md:w-72 flex-shrink-0">
        <div className="space-y-4">
          <OfflineStatusBadge />
          <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 text-sm text-slate-200">
            <p className="text-xs text-slate-400 uppercase">Welcome</p>
            <p className="mt-2 text-lg font-semibold text-white">
              {driverName ? `${greeting}, ${driverName}!` : 'नमस्ते चालक साथी'}
            </p>
            <p className="mt-4 text-xs text-slate-400">
              Flow: Splash → Dashboard → Trips → Expenses → AI Copilot → Maintenance. Syncs all data when online.
            </p>
          </div>
          <nav className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActive(section.id)}
                className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                  active === section.id
                    ? 'bg-primary/30 text-white border border-primary'
                    : 'border border-slate-700 bg-slate-800/40 text-slate-300 hover:border-primary'
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
          <SyncPanel />
        </div>
      </aside>

      <section className="flex-1 space-y-6 overflow-y-auto pb-12 md:pr-4">
        <div className="rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 shadow-xl">
          <SplashLogin />
        </div>

        {ready && active === 'overview' && (
          <div className="space-y-6">
            <OverviewCards />
            <p className="text-sm text-slate-300">
              Dashboard summarizes logged trips, total expenses, and compliance reminders pulled from the offline SQLite database.
            </p>
          </div>
        )}

        {ready && active === 'trips' && <TripPlanner />}

        {ready && active === 'expenses' && <ExpenseTracker />}

        {ready && active === 'copilot' && <AICopilot />}

        {ready && active === 'maintenance' && <VehicleChecklist />}
      </section>
    </main>
  );
}
