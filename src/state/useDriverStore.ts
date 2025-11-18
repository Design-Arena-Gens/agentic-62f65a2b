'use client';

import { create } from 'zustand';
import {
  addExpense as insertExpense,
  addTrip as insertTrip,
  addVoiceNote as insertVoiceNote,
  exportAllData,
  fetchExpenses,
  fetchProfile,
  fetchReminders,
  fetchTrips,
  fetchVoiceNotes,
  markEntitiesSynced,
  toggleReminder as updateReminderStatus,
  upsertProfile,
  upsertReminder,
  updateTripStatus,
  type Expense,
  type Reminder,
  type Trip,
  type VoiceNote
} from '@/lib/repository';

interface DriverStore {
  ready: boolean;
  driverName: string;
  preferredLanguage: 'en' | 'hi';
  trips: Trip[];
  expenses: Expense[];
  reminders: Reminder[];
  voiceNotes: VoiceNote[];
  lastSync?: string;
  syncStatus: 'idle' | 'pending' | 'success' | 'error';
  error?: string;
  initialize: () => Promise<void>;
  setDriverProfile: (name: string, language: 'en' | 'hi') => Promise<void>;
  scheduleTrip: (payload: Omit<Trip, 'id' | 'synced'>) => Promise<void>;
  changeTripStatus: (id: number, status: string) => Promise<void>;
  addExpense: (payload: Omit<Expense, 'id' | 'synced'>) => Promise<void>;
  addReminder: (payload: Omit<Reminder, 'id' | 'synced'>) => Promise<void>;
  toggleReminder: (id: number, completed: boolean) => Promise<void>;
  addVoiceNote: (payload: Omit<VoiceNote, 'id' | 'synced'>) => Promise<void>;
  syncWithCloud: () => Promise<void>;
  setSyncStatus: (status: DriverStore['syncStatus']) => void;
}

export const useDriverStore = create<DriverStore>((set, get) => ({
  ready: false,
  driverName: '',
  preferredLanguage: 'hi',
  trips: [],
  expenses: [],
  reminders: [],
  voiceNotes: [],
  syncStatus: 'idle',
  async initialize() {
    if (get().ready) return;
    const [profile, trips, expenses, reminders, voiceNotes] = await Promise.all([
      fetchProfile(),
      fetchTrips(),
      fetchExpenses(),
      fetchReminders(),
      fetchVoiceNotes()
    ]);

    set({
      ready: true,
      driverName: profile?.name ?? '',
      preferredLanguage: (profile?.preferred_language as 'en' | 'hi') ?? 'hi',
      trips,
      expenses,
      reminders,
      voiceNotes
    });
  },
  async setDriverProfile(name, language) {
    await upsertProfile(name, language);
    set({ driverName: name, preferredLanguage: language });
  },
  async scheduleTrip(payload) {
    await insertTrip(payload);
    const trips = await fetchTrips();
    set({ trips });
  },
  async changeTripStatus(id, status) {
    await updateTripStatus(id, status);
    const trips = await fetchTrips();
    set({ trips });
  },
  async addExpense(payload) {
    await insertExpense(payload);
    const expenses = await fetchExpenses();
    set({ expenses });
  },
  async addReminder(payload) {
    await upsertReminder(payload);
    const reminders = await fetchReminders();
    set({ reminders });
  },
  async toggleReminder(id, completed) {
    await updateReminderStatus(id, completed);
    const reminders = await fetchReminders();
    set({ reminders });
  },
  async addVoiceNote(payload) {
    await insertVoiceNote(payload);
    const voiceNotes = await fetchVoiceNotes();
    set({ voiceNotes });
  },
  setSyncStatus(status) {
    set({ syncStatus: status, error: status === 'error' ? 'Sync failed' : undefined });
  },
  async syncWithCloud() {
    try {
      set({ syncStatus: 'pending', error: undefined });
      const data = await exportAllData();
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          payload: data,
          timestamp: new Date().toISOString()
        })
      });
      if (!response.ok) {
        throw new Error('Sync failed');
      }
      const result = await response.json();
      await Promise.all([
        markEntitiesSynced('trips', data.trips.filter((t) => !t.synced).map((t) => t.id)),
        markEntitiesSynced('expenses', data.expenses.filter((e) => !e.synced).map((e) => e.id)),
        markEntitiesSynced('reminders', data.reminders.filter((r) => !r.synced).map((r) => r.id)),
        markEntitiesSynced('voice_notes', data.voiceNotes.filter((v) => !v.synced).map((v) => v.id))
      ]);
      const [trips, expenses, reminders, voiceNotes] = await Promise.all([
        fetchTrips(),
        fetchExpenses(),
        fetchReminders(),
        fetchVoiceNotes()
      ]);
      set({
        lastSync: result.receivedAt ?? new Date().toISOString(),
        syncStatus: 'success',
        trips,
        expenses,
        reminders,
        voiceNotes
      });
    } catch (error) {
      set({ syncStatus: 'error', error: (error as Error).message });
    }
  }
}));
