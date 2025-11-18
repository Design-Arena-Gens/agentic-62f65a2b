'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useDriverStore } from '@/state/useDriverStore';
import type { Expense } from '@/lib/repository';

const categories = ['Fuel', 'Toll', 'Food', 'Maintenance', 'Parking', 'Other'];
const paymentModes = ['Cash', 'UPI', 'Card', 'Wallet'];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
}

export default function ExpenseTracker() {
  const { expenses, addExpense } = useDriverStore((state) => ({
    expenses: state.expenses,
    addExpense: state.addExpense
  }));

  const [payload, setPayload] = useState<Omit<Expense, 'id' | 'synced'>>({
    category: 'Fuel',
    amount: 0,
    payment_mode: 'Cash',
    vendor: '',
    receipt_url: '',
    notes: '',
    occurred_on: new Date().toISOString().split('T')[0]
  });
  const [saving, setSaving] = useState(false);

  const totals = useMemo(() => {
    return categories.map((category) => ({
      category,
      amount: expenses
        .filter((expense) => expense.category === category)
        .reduce((sum, expense) => sum + (expense.amount || 0), 0)
    }));
  }, [expenses]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    await addExpense(payload);
    setPayload({
      ...payload,
      amount: 0,
      vendor: '',
      receipt_url: '',
      notes: ''
    });
    setSaving(false);
  };

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-[3fr_2fr]">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-700 bg-slate-800/60 p-6">
          <h2 className="text-xl font-semibold text-white">Log expense</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-slate-400">Category
              <select
                value={payload.category}
                onChange={(event) => setPayload((state) => ({ ...state, category: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-white focus:border-primary focus:outline-none"
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>
            <label className="text-sm text-slate-400">Amount
              <input
                type="number"
                min="0"
                required
                value={payload.amount}
                onChange={(event) => setPayload((state) => ({ ...state, amount: Number(event.target.value) }))}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-white focus:border-primary focus:outline-none"
              />
            </label>
            <label className="text-sm text-slate-400">Payment mode
              <select
                value={payload.payment_mode}
                onChange={(event) => setPayload((state) => ({ ...state, payment_mode: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-white focus:border-primary focus:outline-none"
              >
                {paymentModes.map((mode) => (
                  <option key={mode}>{mode}</option>
                ))}
              </select>
            </label>
            <label className="text-sm text-slate-400">Date
              <input
                type="date"
                value={payload.occurred_on}
                onChange={(event) => setPayload((state) => ({ ...state, occurred_on: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-white focus:border-primary focus:outline-none"
              />
            </label>
          </div>
          <input
            placeholder="Vendor or location"
            value={payload.vendor}
            onChange={(event) => setPayload((state) => ({ ...state, vendor: event.target.value }))}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-primary focus:outline-none"
          />
          <input
            placeholder="Receipt photo link (optional)"
            value={payload.receipt_url}
            onChange={(event) => setPayload((state) => ({ ...state, receipt_url: event.target.value }))}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-primary focus:outline-none"
          />
          <textarea
            placeholder="Notes"
            value={payload.notes}
            onChange={(event) => setPayload((state) => ({ ...state, notes: event.target.value }))}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-primary focus:outline-none"
          />
          <button
            type="submit"
            disabled={saving || payload.amount <= 0}
            className="w-full rounded-xl bg-primary py-3 font-semibold text-white hover:bg-primary/80 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save expense'}
          </button>
        </form>

        <div className="rounded-2xl border border-slate-700 bg-slate-800/40 p-6 text-white">
          <h3 className="font-semibold">Category totals</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {totals.map((item) => (
              <li key={item.category} className="flex justify-between text-slate-300">
                <span>{item.category}</span>
                <span>{formatCurrency(item.amount)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 text-xs text-slate-400">
            Recent expenses
            <div className="mt-2 space-y-2 max-h-60 overflow-y-auto pr-2">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2"
                >
                  <p className="text-sm text-white font-medium">
                    {expense.category} — {formatCurrency(expense.amount)}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {expense.vendor || 'Unnamed vendor'} · {expense.payment_mode} · {expense.occurred_on}
                  </p>
                  {expense.notes && (
                    <p className="text-[11px] text-slate-500 mt-1">{expense.notes}</p>
                  )}
                </div>
              ))}
              {expenses.length === 0 && <p className="text-slate-500 text-xs">No expenses yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
