'use client';

import { useActionState, useEffect, useState } from 'react';
import { updateTxAction } from '@/lib/actions/tx';
import type { CatOption } from '@/components/TxForm';

export interface TxEditData {
  id: string;
  type: 'income' | 'expense';
  amount: string;
  note: string;
  tx_date: string;
  categoryId: string;
}

const inputCls =
  'w-full rounded-xl border border-border bg-muted/60 px-4 py-2.5 text-base outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-secondary focus:bg-muted';

export default function TxEditForm({
  tx,
  cats,
}: {
  tx: TxEditData;
  cats: CatOption[];
}) {
  const [state, action, pending] = useActionState(updateTxAction, {});
  const [type, setType] = useState<'income' | 'expense'>(tx.type);
  const [categoryId, setCategoryId] = useState(tx.categoryId);

  const filtered = cats.filter((c) => c.type === type);

  useEffect(() => {
    setCategoryId('');
  }, [type]);

  return (
    <form action={action} className="glass flex flex-col gap-4 p-5 sm:p-6">
      {state.error && (
        <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-red-400">
          {state.error}
        </p>
      )}
      <input type="hidden" name="id" value={tx.id} />
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="redirectTo" value="/harian" />

      <div className="grid grid-cols-2 gap-1 rounded-2xl bg-muted p-1" role="group" aria-label="Jenis transaksi">
        <button
          type="button"
          onClick={() => setType('expense')}
          className={`cursor-pointer rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
            type === 'expense'
              ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-lg shadow-rose-500/25'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Pengeluaran
        </button>
        <button
          type="button"
          onClick={() => setType('income')}
          className={`cursor-pointer rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
            type === 'income'
              ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/25'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Pemasukan
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          Jumlah (Rp)
          <input name="amount" inputMode="numeric" required defaultValue={tx.amount} className={inputCls} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          Tanggal
          <input
            name="txDate"
            type="date"
            required
            defaultValue={tx.tx_date}
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
          <input name="note" type="text" defaultValue={tx.note} className={inputCls} />
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-1 cursor-pointer rounded-xl bg-primary px-4 py-3 font-sans font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? 'Menyimpan…' : 'Simpan Perubahan'}
      </button>
    </form>
  );
}
