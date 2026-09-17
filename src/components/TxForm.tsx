'use client';

import { useActionState, useEffect, useState } from 'react';
import { createTxAction } from '@/lib/actions/tx';
import { todayISO } from '@/lib/format';

export interface CatOption {
  id: string;
  name: string;
  type: 'income' | 'expense';
}

const inputCls =
  'w-full rounded-xl border border-border bg-muted/60 px-4 py-2.5 text-base outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-secondary focus:bg-muted';

export default function TxForm({ cats }: { cats: CatOption[] }) {
  const [state, action, pending] = useActionState(createTxAction, {});
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [txDate, setTxDate] = useState(todayISO());
  const [categoryId, setCategoryId] = useState('');

  const filtered = cats.filter((c) => c.type === type);

  // Reset pilihan kategori saat ganti tipe
  useEffect(() => {
    setCategoryId('');
  }, [type]);

  return (
    <form action={action} className="glass flex flex-col gap-4 p-5 sm:p-6">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Tambah Transaksi
      </h2>
      {state.error && (
        <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-red-400">
          {state.error}
        </p>
      )}

      {/* Toggle tipe — segmented control */}
      <div className="grid grid-cols-2 gap-1 rounded-2xl bg-muted p-1" role="group" aria-label="Jenis transaksi">
        <button
          type="button"
          onClick={() => setType('expense')}
          className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
            type === 'expense'
              ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-lg shadow-rose-500/25'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 7h10" />
            <path d="M7 17 17 7" />
            <path d="M7 17V9" />
          </svg>
          Pengeluaran
        </button>
        <button
          type="button"
          onClick={() => setType('income')}
          className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
            type === 'income'
              ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/25'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m17 7-10 10" />
            <path d="M17 7v8" />
            <path d="M17 7H9" />
          </svg>
          Pemasukan
        </button>
      </div>
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="redirectTo" value="/harian" />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          Jumlah (Rp)
          <input
            name="amount"
            inputMode="numeric"
            required
            placeholder="50000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={inputCls}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          Tanggal
          <input
            name="txDate"
            type="date"
            required
            value={txDate}
            onChange={(e) => setTxDate(e.target.value)}
            className={`${inputCls} [color-scheme:dark]`}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          Kategori
          <select
            name="categoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={inputCls}
          >
            <option value="">— Tanpa kategori —</option>
            {filtered.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          Catatan
          <input name="note" type="text" placeholder="mis. makan siang" className={inputCls} />
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-1 cursor-pointer rounded-xl bg-primary px-4 py-3 font-sans font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-secondary hover:shadow-secondary/30 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? 'Menyimpan…' : 'Simpan Transaksi'}
      </button>
    </form>
  );
}
