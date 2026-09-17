'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

export default function MonthPicker({
  currentYM,
  basePath,
}: {
  currentYM: string;
  basePath: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function go(delta: number) {
    const [y, m] = currentYM.split('-').map(Number);
    const d = new Date(Date.UTC(y, m - 1 + delta, 1));
    const next = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
    startTransition(() => router.push(`${basePath}?ym=${next}`));
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => go(-1)}
        disabled={pending}
        className="rounded-md border border-black/15 px-2.5 py-1.5 text-sm transition hover:bg-black/5 disabled:opacity-40 dark:border-white/20 dark:hover:bg-white/10"
        aria-label="Bulan sebelumnya"
      >
        ‹
      </button>
      <input
        type="month"
        value={currentYM}
        onChange={(e) => {
          if (e.target.value) startTransition(() => router.push(`${basePath}?ym=${e.target.value}`));
        }}
        className="rounded-md border border-black/15 bg-transparent px-2 py-1.5 text-sm dark:border-white/20"
      />
      <button
        type="button"
        onClick={() => go(1)}
        disabled={pending}
        className="rounded-md border border-black/15 px-2.5 py-1.5 text-sm transition hover:bg-black/5 disabled:opacity-40 dark:border-white/20 dark:hover:bg-white/10"
        aria-label="Bulan berikutnya"
      >
        ›
      </button>
    </div>
  );
}
