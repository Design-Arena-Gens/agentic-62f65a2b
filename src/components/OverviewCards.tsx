'use client';

import { useMemo } from 'react';
import { useDriverStore } from '@/state/useDriverStore';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
}

export default function OverviewCards() {
  const trips = useDriverStore((state) => state.trips);
  const expenses = useDriverStore((state) => state.expenses);
  const reminders = useDriverStore((state) => state.reminders);

  const stats = useMemo(() => {
    const upcomingTrips = trips.filter((trip) => trip.status !== 'Completed');
    const totalExpense = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
    const pendingReminders = reminders.filter((item) => !item.is_completed).length;

    return [
      {
        title: 'Active trips',
        value: upcomingTrips.length,
        subtitle: `${trips.length} total trips`
      },
      {
        title: 'Expenses this month',
        value: formatCurrency(totalExpense),
        subtitle: `${expenses.length} logged expenses`
      },
      {
        title: 'Vehicle reminders',
        value: pendingReminders,
        subtitle: `${reminders.length} total tasks`
      }
    ];
  }, [trips, expenses, reminders]);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((item) => (
        <article
          key={item.title}
          className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 shadow-lg"
        >
          <h3 className="text-sm uppercase tracking-wide text-slate-400">{item.title}</h3>
          <p className="mt-2 text-3xl font-semibold text-white">{item.value}</p>
          <p className="mt-2 text-xs text-slate-400">{item.subtitle}</p>
        </article>
      ))}
    </div>
  );
}
