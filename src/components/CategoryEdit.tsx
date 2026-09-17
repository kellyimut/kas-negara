'use client';

import { useActionState, useState } from 'react';
import { deleteCategoryAction, updateCategoryAction } from '@/lib/actions/category';

export interface CatEditData {
  id: string;
  name: string;
  type: 'income' | 'expense';
  budget: string;
}

export default function CategoryEdit({ cat }: { cat: CatEditData }) {
  const [editing, setEditing] = useState(false);

  return editing ? (
    <EditRow cat={cat} onDone={() => setEditing(false)} />
  ) : (
    <div className="group flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
            cat.type === 'income' ? 'bg-emerald-500/15 text-income' : 'bg-rose-500/15 text-expense'
          }`}
        >
          {cat.type === 'income' ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m17 7-10 10" />
              <path d="M17 7v8" />
              <path d="M17 7H9" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 7h10" />
              <path d="M7 17 17 7" />
              <path d="M7 17V9" />
            </svg>
          )}
        </span>
        <div>
          <p className="text-sm font-medium">{cat.name}</p>
          {cat.type === 'expense' && (
            <p className="text-xs text-muted-foreground">
              Budget: Rp{Number(cat.budget).toLocaleString('id-ID')}
            </p>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
        >
          Edit
        </button>
        <form action={deleteCategoryAction}>
          <input type="hidden" name="id" value={cat.id} />
          <button
            type="submit"
            className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-destructive/50 hover:bg-destructive/10 hover:text-red-400"
          >
            Hapus
          </button>
        </form>
      </div>
    </div>
  );
}

function EditRow({ cat, onDone }: { cat: CatEditData; onDone: () => void }) {
  const [state, action, pending] = useActionState(updateCategoryAction, {});
  const input =
    'rounded-xl border border-border bg-muted/60 px-3 py-2 text-sm outline-none transition-colors focus:border-secondary';

  return (
    <form action={action} className="flex flex-wrap items-end gap-2">
      {state.error && <p className="w-full text-xs text-red-400">{state.error}</p>}
      <input type="hidden" name="id" value={cat.id} />
      <label className="flex flex-col gap-1 text-xs">
        Nama
        <input name="name" defaultValue={cat.name} required minLength={2} className={input} />
      </label>
      {cat.type === 'expense' && (
        <label className="flex flex-col gap-1 text-xs">
          Budget
          <input name="monthly_budget" inputMode="numeric" defaultValue={cat.budget} className={input} />
        </label>
      )}
      <button
        type="submit"
        disabled={pending}
        className="cursor-pointer rounded-xl bg-primary px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-secondary disabled:opacity-50"
      >
        {pending ? '…' : 'Simpan'}
      </button>
      <button
        type="button"
        onClick={onDone}
        className="cursor-pointer rounded-xl border border-border px-4 py-2 text-xs text-muted-foreground transition-colors hover:bg-white/5"
      >
        Batal
      </button>
    </form>
  );
}
