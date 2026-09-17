'use client';

import { useActionState, useState } from 'react';
import { createCategoryAction } from '@/lib/actions/category';

export default function CategoryForm() {
  const [state, action, pending] = useActionState(createCategoryAction, {});
  const [name, setName] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [budget, setBudget] = useState('');

  return (
    <form
      action={action}
      className="flex flex-col gap-3 rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-white/5"
    >
      <h2 className="text-sm font-semibold uppercase tracking-wide opacity-60">
        Tambah Kategori
      </h2>
      {state.error && (
        <p className="rounded bg-red-500/10 p-2.5 text-sm text-red-500">{state.error}</p>
      )}
      <div className="grid gap-3 sm:grid-cols-4">
        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          Nama
          <input
            name="name"
            required
            minLength={2}
            placeholder="mis. Pendidikan"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-md border border-black/15 bg-white px-3 py-2 text-base outline-none focus:border-blue-500 dark:border-white/20 dark:bg-black"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Tipe
          <select
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value as 'income' | 'expense')}
            className="rounded-md border border-black/15 bg-white px-3 py-2 text-base outline-none focus:border-blue-500 dark:border-white/20 dark:bg-black"
          >
            <option value="expense">Pengeluaran</option>
            <option value="income">Pemasukan</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Budget bulanan
          <input
            name="monthly_budget"
            inputMode="numeric"
            placeholder="0"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="rounded-md border border-black/15 bg-white px-3 py-2 text-base outline-none focus:border-blue-500 dark:border-white/20 dark:bg-black"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? 'Menyimpan...' : 'Tambah Kategori'}
      </button>
    </form>
  );
}
