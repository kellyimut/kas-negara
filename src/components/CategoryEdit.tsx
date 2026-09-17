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
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-medium">{cat.name}</p>
        {cat.type === 'expense' && (
          <p className="text-xs opacity-50">
            Budget: Rp{Number(cat.budget).toLocaleString('id-ID')}
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded-md border border-black/15 px-2.5 py-1 text-xs transition hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
        >
          Edit
        </button>
        <form action={deleteCategoryAction}>
          <input type="hidden" name="id" value={cat.id} />
          <button
            type="submit"
            className="rounded-md border border-black/15 px-2.5 py-1 text-xs text-rose-600 transition hover:bg-rose-500/10 dark:border-white/20"
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

  return (
    <form action={action} className="flex flex-wrap items-end gap-2">
      {state.error && <p className="w-full text-xs text-red-500">{state.error}</p>}
      <input type="hidden" name="id" value={cat.id} />
      <label className="flex flex-col gap-1 text-xs">
        Nama
        <input
          name="name"
          defaultValue={cat.name}
          required
          minLength={2}
          className="rounded-md border border-black/15 bg-white px-2.5 py-1.5 text-sm dark:border-white/20 dark:bg-black"
        />
      </label>
      {cat.type === 'expense' && (
        <label className="flex flex-col gap-1 text-xs">
          Budget
          <input
            name="monthly_budget"
            inputMode="numeric"
            defaultValue={cat.budget}
            className="rounded-md border border-black/15 bg-white px-2.5 py-1.5 text-sm dark:border-white/20 dark:bg-black"
          />
        </label>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? '...' : 'Simpan'}
      </button>
      <button
        type="button"
        onClick={onDone}
        className="rounded-md border border-black/15 px-3 py-1.5 text-xs transition hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
      >
        Batal
      </button>
    </form>
  );
}
