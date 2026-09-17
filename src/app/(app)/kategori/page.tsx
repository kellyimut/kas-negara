import { redirect } from 'next/navigation';
import { getSessionUserId } from '@/lib/auth';
import { formatIDR } from '@/lib/format';
import { listCategories } from '@/lib/queries';
import CategoryForm from '@/components/CategoryForm';
import CategoryEdit from '@/components/CategoryEdit';

export default async function KategoriPage() {
  const userId = await getSessionUserId();
  if (!userId) redirect('/login');

  const cats = await listCategories(userId);
  const income = cats.filter((c) => c.type === 'income');
  const expense = cats.filter((c) => c.type === 'expense');
  const totalBudget = expense.reduce((s, c) => s + Number(c.monthly_budget), 0);

  const groups = [
    {
      title: 'Pemasukan',
      type: 'income' as const,
      data: income,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m17 7-10 10" />
          <path d="M17 7v8" />
          <path d="M17 7H9" />
        </svg>
      ),
    },
    {
      title: 'Pengeluaran',
      type: 'expense' as const,
      data: expense,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M7 7h10" />
          <path d="M7 17 17 7" />
          <path d="M7 17V9" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-sans text-2xl font-bold">Kategori & Budget</h1>
          <p className="text-sm text-muted-foreground">Atur kategori dan budget bulananmu</p>
        </div>
        <div className="glass px-4 py-2.5">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Total Budget</p>
          <p className="font-sans text-lg font-bold text-secondary">{formatIDR(totalBudget)}</p>
        </div>
      </div>

      <CategoryForm />

      {groups.map((group) => (
        <section key={group.title} className="glass p-5 sm:p-6">
          <h2 className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                group.type === 'income'
                  ? 'bg-emerald-500/15 text-income'
                  : 'bg-rose-500/15 text-expense'
              }`}
            >
              {group.icon}
            </span>
            {group.title}
            <span className="ml-auto font-normal normal-case">
              {group.data.length} kategori
            </span>
          </h2>
          <ul className="mt-2 divide-y divide-border/50">
            {group.data.map((c) => (
              <li key={c.id} className="py-3.5">
                <CategoryEdit
                  cat={{
                    id: c.id,
                    name: c.name,
                    type: c.type,
                    budget: String(Number(c.monthly_budget)),
                  }}
                />
              </li>
            ))}
            {group.data.length === 0 && (
              <li className="py-8 text-center text-sm text-muted-foreground">
                Belum ada kategori.
              </li>
            )}
          </ul>
          {group.type === 'expense' && totalBudget > 0 && (
            <p className="mt-4 border-t border-border/50 pt-4 text-sm text-muted-foreground">
              Total budget pengeluaran:{' '}
              <span className="font-semibold text-foreground">{formatIDR(totalBudget)}</span> / bulan
            </p>
          )}
        </section>
      ))}

      <p className="flex items-start gap-2 text-xs text-muted-foreground">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
        Menghapus kategori tidak menghapus transaksi — transaksi terkait hanya kehilangan
        kategorinya.
      </p>
    </div>
  );
}

export const dynamic = 'force-dynamic';
