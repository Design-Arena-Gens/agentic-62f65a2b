'use client';

import { FormEvent, useState } from 'react';
import { useDriverStore } from '@/state/useDriverStore';

export default function SplashLogin() {
  const { driverName, preferredLanguage, setDriverProfile } = useDriverStore((state) => ({
    driverName: state.driverName,
    preferredLanguage: state.preferredLanguage,
    setDriverProfile: state.setDriverProfile
  }));
  const [name, setName] = useState(driverName);
  const [language, setLanguage] = useState(preferredLanguage);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    await setDriverProfile(name.trim(), language);
    setSaving(false);
  };

  return (
    <section className="bg-slate-800/70 border border-slate-700 rounded-3xl p-8 backdrop-blur-md shadow-xl">
      <h1 className="text-3xl font-bold mb-4 text-white">Driver Helper</h1>
      <p className="text-slate-300 mb-6">
        Your offline-first co-pilot with AI, trip planner, expense manager, and smart voice assistant.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">Enter your name</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Altaf"
            className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">Preferred language</label>
          <div className="flex gap-4">
            {[
              { id: 'hi', label: 'हिन्दी' },
              { id: 'en', label: 'English' }
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setLanguage(option.id as 'hi' | 'en')}
                className={`flex-1 rounded-xl px-4 py-3 border transition ${
                  language === option.id
                    ? 'border-primary bg-primary/20 text-white'
                    : 'border-slate-700 bg-slate-900 text-slate-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <button
          type="submit"
          disabled={saving || !name.trim()}
          className="w-full rounded-xl bg-primary hover:bg-primary/80 transition py-3 font-semibold disabled:opacity-50"
        >
          {saving ? 'Saving…' : driverName ? 'Update profile' : 'Save and start'}
        </button>
      </form>
    </section>
  );
}
