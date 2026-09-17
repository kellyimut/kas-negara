'use client';

import { useActionState, useState } from 'react';
import { createCategoryAction } from '@/lib/actions/category';

const inputCls =
  'w-full rounded-xl border border-border bg-muted/60 px-4 py-2.5 text-base outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-secondary focus:bg-muted';

export default function CategoryForm() {
  const [state, action, pending] = useActionState(createCategoryAction, {});

  return (
    <form action={action} className="glass flex flex-col gap-4 p-5 sm:p-6">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Tambah Kategori
      </h2>
      {state.error && (
        <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-red-400">
          {state.error}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-4">
        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          Nama
          <input name="name" required minLength={2} placeholder="mis. Pendidikan" className={inputCls} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          Tipe
          <select name="type" className={inputCls} defaultValue="expense">
            <option value="expense">Pengeluaran</option>
            <option value="income">Pemasukan</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          Budget bulanan
          <input name="monthly_budget" inputMode="numeric" placeholder="0" className={inputCls} />
        </label>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="self-start cursor-pointer rounded-xl bg-primary px-5 py-2.5 font-sans font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? 'Menyimpan…' : 'Tambah Kategori'}
      </button>
    </form>
  );
}
