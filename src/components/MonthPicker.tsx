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

  const btn =
    'flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <div className="glass flex items-center gap-1 p-1">
      <button type="button" onClick={() => go(-1)} disabled={pending} className={btn} aria-label="Bulan sebelumnya">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <input
        type="month"
        value={currentYM}
        onChange={(e) => {
          if (e.target.value) startTransition(() => router.push(`${basePath}?ym=${e.target.value}`));
        }}
        className="cursor-pointer rounded-lg bg-transparent px-2 py-1.5 text-sm font-medium outline-none [color-scheme:light]"
        aria-label="Pilih bulan"
      />
      <button type="button" onClick={() => go(1)} disabled={pending} className={btn} aria-label="Bulan berikutnya">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
