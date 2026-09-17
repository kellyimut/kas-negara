'use client';

import { useActionState, useEffect, useState } from 'react';
import { createTxAction } from '@/lib/actions/tx';
import { todayISO } from '@/lib/format';

export interface CatOption {
  id: string;
  name: string;
  type: 'income' | 'expense';
}

export default function TxForm({ cats }: { cats: CatOption[] }) {
  const [state, action, pending] = useActionState(createTxAction, {});
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [txDate, setTxDate] = useState(todayISO());
  const [categoryId, setCategoryId] = useState('');

  const filtered = cats.filter((c) => c.type === type);

  // Reset pilihan kategori saat ganti tipe
  useEffect(() => {
    setCategoryId('');
  }, [type]);

  return (
    <form
      action={action}
      className="flex flex-col gap-3 rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-white/5"
    >
      <h2 className="text-sm font-semibold uppercase tracking-wide opacity-60">
        Tambah Transaksi
      </h2>
      {state.error && (
        <p className="rounded bg-red-500/10 p-2.5 text-sm text-red-500">{state.error}</p>
      )}

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setType('expense')}
          className={`rounded-md px-3 py-2 text-sm font-medium transition ${
            type === 'expense'
              ? 'bg-rose-600 text-white'
              : 'border border-black/15 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10'
          }`}
        >
          Pengeluaran
        </button>
        <button
          type="button"
          onClick={() => setType('income')}
          className={`rounded-md px-3 py-2 text-sm font-medium transition ${
            type === 'income'
              ? 'bg-emerald-600 text-white'
              : 'border border-black/15 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10'
          }`}
        >
          Pemasukan
        </button>
      </div>
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="redirectTo" value="/harian" />

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          Jumlah (Rp)
          <input
            name="amount"
            inputMode="numeric"
            required
            placeholder="50000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="rounded-md border border-black/15 bg-white px-3 py-2 text-base outline-none focus:border-blue-500 dark:border-white/20 dark:bg-black"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Tanggal
          <input
            name="txDate"
            type="date"
            required
            value={txDate}
            onChange={(e) => setTxDate(e.target.value)}
            className="rounded-md border border-black/15 bg-white px-3 py-2 text-base outline-none focus:border-blue-500 dark:border-white/20 dark:bg-black"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Kategori
          <select
            name="categoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="rounded-md border border-black/15 bg-white px-3 py-2 text-base outline-none focus:border-blue-500 dark:border-white/20 dark:bg-black"
          >
            <option value="">— Tanpa kategori —</option>
            {filtered.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Catatan
          <input
            name="note"
            type="text"
            placeholder="mis. makan siang"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="rounded-md border border-black/15 bg-white px-3 py-2 text-base outline-none focus:border-blue-500 dark:border-white/20 dark:bg-black"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? 'Menyimpan...' : 'Simpan'}
      </button>
    </form>
  );
}
