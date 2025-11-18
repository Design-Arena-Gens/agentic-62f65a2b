'use client';

import { useState } from 'react';
import { useDriverStore } from '@/state/useDriverStore';
import type { Reminder } from '@/lib/repository';

const checklistTemplates: Array<{ label: string; dueDays: number }> = [
  { label: 'Tyre pressure check', dueDays: 2 },
  { label: 'Engine oil level', dueDays: 7 },
  { label: 'Insurance renewal', dueDays: 30 },
  { label: 'PUC renewal', dueDays: 10 }
];

function futureDate(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

export default function VehicleChecklist() {
  const { reminders, addReminder, toggleReminder } = useDriverStore((state) => ({
    reminders: state.reminders,
    addReminder: state.addReminder,
    toggleReminder: state.toggleReminder
  }));

  const [formState, setFormState] = useState<Omit<Reminder, 'id' | 'synced'>>({
    reminder_type: 'Tyre pressure check',
    due_on: futureDate(2),
    is_completed: 0
  });

  const handleCreate = async () => {
    await addReminder(formState);
  };

  return (
    <section className="grid gap-6 md:grid-cols-[2fr_3fr]">
      <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6">
        <h2 className="text-xl font-semibold text-white">Vehicle checklist</h2>
        <p className="mt-2 text-sm text-slate-300">
          Generate reminders for compliance, maintenance, and daily checks. Completed items stay stored offline.
        </p>
        <div className="mt-4 space-y-4">
          <label className="text-xs text-slate-400">Reminder type
            <select
              value={formState.reminder_type}
              onChange={(event) =>
                setFormState((state) => ({ ...state, reminder_type: event.target.value }))
              }
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-white focus:border-primary focus:outline-none"
            >
              {checklistTemplates.map((entry) => (
                <option key={entry.label}>{entry.label}</option>
              ))}
            </select>
          </label>
          <label className="text-xs text-slate-400">Due on
            <input
              type="date"
              value={formState.due_on}
              onChange={(event) => setFormState((state) => ({ ...state, due_on: event.target.value }))}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-white focus:border-primary focus:outline-none"
            />
          </label>
          <button
            type="button"
            onClick={handleCreate}
            className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary/80"
          >
            Save reminder
          </button>
        </div>
        <div className="mt-6 space-y-2 text-xs text-slate-400">
          Quick presets
          <div className="flex flex-wrap gap-2">
            {checklistTemplates.map((entry) => (
              <button
                type="button"
                key={entry.label}
                onClick={() =>
                  setFormState({
                    reminder_type: entry.label,
                    due_on: futureDate(entry.dueDays),
                    is_completed: 0
                  })
                }
                className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-primary"
              >
                {entry.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-700 bg-slate-800/40 p-6 text-sm text-slate-200">
        <h3 className="font-semibold text-white">Upcoming tasks</h3>
        <div className="mt-4 space-y-2 max-h-[360px] overflow-y-auto pr-2">
          {reminders.map((item) => (
            <label
              key={item.id}
              className="flex items-start gap-3 rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3"
            >
              <input
                type="checkbox"
                checked={!!item.is_completed}
                onChange={(event) => toggleReminder(item.id, event.target.checked)}
                className="mt-1 h-4 w-4"
              />
              <div>
                <p className="font-medium text-white">{item.reminder_type}</p>
                <p className="text-xs text-slate-400">Due {item.due_on}</p>
              </div>
            </label>
          ))}
          {reminders.length === 0 && <p className="text-xs text-slate-500">No reminders created yet.</p>}
        </div>
      </div>
    </section>
  );
}
