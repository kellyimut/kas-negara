import Link from 'next/link';
import { deleteTxAction } from '@/lib/actions/tx';
import { formatIDR, formatDateString } from '@/lib/format';

export interface TxItem {
  id: string;
  type: 'income' | 'expense';
  amount: string;
  note: string;
  tx_date: string;
  category_name: string | null;
}

export default function TxList({ items }: { items: TxItem[] }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <path d="M3 10h18" />
          </svg>
        </span>
        <p className="text-sm text-muted-foreground">Belum ada transaksi di periode ini.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border/50">
      {items.map((t) => (
        <li key={t.id} className="group flex items-center justify-between gap-3 py-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                t.type === 'income' ? 'bg-emerald-500/15 text-income' : 'bg-rose-500/15 text-expense'
              }`}
            >
              {t.type === 'income' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m17 7-10 10" />
                  <path d="M17 7v8" />
                  <path d="M17 7H9" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 7h10" />
                  <path d="M7 17 17 7" />
                  <path d="M7 17V9" />
                </svg>
              )}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {t.note || t.category_name || (t.type === 'income' ? 'Pemasukan' : 'Pengeluaran')}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDateString(t.tx_date)}
                {t.category_name ? ` • ${t.category_name}` : ''}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span
              className={`font-sans text-sm font-semibold ${
                t.type === 'income' ? 'text-income' : 'text-expense'
              }`}
            >
              {t.type === 'income' ? '+' : '−'}
              {formatIDR(Number(t.amount))}
            </span>
            <Link
              href={`/harian/${t.id}`}
              aria-label={`Edit transaksi ${t.note || t.category_name || ''}`}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground opacity-100 transition-colors hover:bg-black/5 hover:text-foreground sm:opacity-0 sm:group-hover:opacity-100"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              </svg>
            </Link>
            <form action={deleteTxAction}>
              <input type="hidden" name="id" value={t.id} />
              <input type="hidden" name="redirectTo" value="/harian" />
              <button
                type="submit"
                aria-label={`Hapus transaksi ${t.note || t.category_name || ''}`}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-destructive/50 hover:bg-destructive/10 hover:text-red-400"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 6h18" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </form>
          </div>
        </li>
      ))}
    </ul>
  );
}
