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
    return <p className="py-8 text-center text-sm opacity-50">Belum ada transaksi di periode ini.</p>;
  }

  return (
    <ul className="divide-y divide-black/5 dark:divide-white/5">
      {items.map((t) => (
        <li key={t.id} className="flex items-center justify-between gap-3 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {t.note || t.category_name || (t.type === 'income' ? 'Pemasukan' : 'Pengeluaran')}
            </p>
            <p className="text-xs opacity-50">
              {formatDateString(t.tx_date)}
              {t.category_name ? ` • ${t.category_name}` : ''}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span
              className={`text-sm font-semibold ${
                t.type === 'income'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {t.type === 'income' ? '+' : '−'}
              {formatIDR(Number(t.amount))}
            </span>
            <Link
              href={`/harian/${t.id}`}
              className="rounded-md border border-black/15 px-2 py-1 text-xs transition hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
            >
              Edit
            </Link>
            <form action={deleteTxAction}>
              <input type="hidden" name="id" value={t.id} />
              <input type="hidden" name="redirectTo" value="/harian" />
              <button
                type="submit"
                className="rounded-md border border-black/15 px-2 py-1 text-xs text-rose-600 transition hover:bg-rose-500/10 dark:border-white/20"
              >
                Hapus
              </button>
            </form>
          </div>
        </li>
      ))}
    </ul>
  );
}
