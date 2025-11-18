'use client';

import { FormEvent, useState } from 'react';
import { useDriverStore } from '@/state/useDriverStore';
import type { Trip } from '@/lib/repository';

const statuses = ['Planned', 'In Progress', 'Completed'] as const;

export default function TripPlanner() {
  const { trips, scheduleTrip, changeTripStatus } = useDriverStore((state) => ({
    trips: state.trips,
    scheduleTrip: state.scheduleTrip,
    changeTripStatus: state.changeTripStatus
  }));

  const [formState, setFormState] = useState({
    title: '',
    origin: '',
    destination: '',
    departure_time: new Date().toISOString().slice(0, 16),
    arrival_time: new Date().toISOString().slice(0, 16),
    notes: '',
    status: 'Planned'
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    await scheduleTrip({ ...formState } as unknown as Omit<Trip, 'id' | 'synced'>);
    setFormState((state) => ({
      ...state,
      title: '',
      origin: '',
      destination: '',
      notes: ''
    }));
    setSaving(false);
  };

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-white">Plan a trip</h2>
        <form onSubmit={handleSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
          <input
            required
            placeholder="Trip title"
            value={formState.title}
            onChange={(event) => setFormState((state) => ({ ...state, title: event.target.value }))}
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-primary focus:outline-none"
          />
          <input
            required
            placeholder="Origin"
            value={formState.origin}
            onChange={(event) => setFormState((state) => ({ ...state, origin: event.target.value }))}
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-primary focus:outline-none"
          />
          <input
            required
            placeholder="Destination"
            value={formState.destination}
            onChange={(event) => setFormState((state) => ({ ...state, destination: event.target.value }))}
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-primary focus:outline-none"
          />
          <textarea
            placeholder="Notes (load type, client, checkpoints)"
            value={formState.notes}
            onChange={(event) => setFormState((state) => ({ ...state, notes: event.target.value }))}
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-primary focus:outline-none md:col-span-2"
          />
          <label className="text-sm text-slate-400">Departure
            <input
              type="datetime-local"
              value={formState.departure_time}
              onChange={(event) => setFormState((state) => ({ ...state, departure_time: event.target.value }))}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-white focus:border-primary focus:outline-none"
            />
          </label>
          <label className="text-sm text-slate-400">Expected arrival
            <input
              type="datetime-local"
              value={formState.arrival_time}
              onChange={(event) => setFormState((state) => ({ ...state, arrival_time: event.target.value }))}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-white focus:border-primary focus:outline-none"
            />
          </label>
          <div className="md:col-span-2 flex flex-wrap items-center gap-3">
            {statuses.map((status) => (
              <button
                type="button"
                key={status}
                onClick={() => setFormState((state) => ({ ...state, status }))}
                className={`rounded-full px-4 py-2 text-sm ${
                  formState.status === status
                    ? 'bg-primary text-white'
                    : 'bg-slate-900 text-slate-300 border border-slate-700'
                }`}
              >
                {status}
              </button>
            ))}
            <button
              type="submit"
              disabled={saving || !formState.title || !formState.origin || !formState.destination}
              className="ml-auto rounded-xl bg-accent px-4 py-2 font-semibold text-slate-900 hover:bg-orange-500 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save trip'}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-2xl border border-slate-700 bg-slate-800/40 p-6 shadow-inner">
        <h3 className="text-lg font-semibold text-white">Trip timeline</h3>
        <div className="mt-4 space-y-3">
          {trips.length === 0 && <p className="text-slate-400 text-sm">No trips logged yet.</p>}
          {trips.map((trip) => (
            <article
              key={trip.id}
              className="flex flex-col gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 md:flex-row md:items-center"
            >
              <div className="flex-1">
                <p className="text-white font-semibold">{trip.title}</p>
                <p className="text-xs text-slate-400">
                  {trip.origin} ➜ {trip.destination}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(trip.departure_time).toLocaleString()} · ETA {new Date(trip.arrival_time).toLocaleString()}
                </p>
                {trip.notes && <p className="text-xs text-slate-400 mt-1">{trip.notes}</p>}
              </div>
              <div className="flex items-center gap-2">
                {statuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => changeTripStatus(trip.id, status)}
                    className={`rounded-full px-3 py-1 text-xs border transition ${
                      trip.status === status
                        ? 'border-emerald-400 text-emerald-300'
                        : 'border-slate-700 text-slate-400'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
