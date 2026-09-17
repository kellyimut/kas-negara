import { redirect } from 'next/navigation';
import { getSessionUserId } from '@/lib/auth';
import { formatIDR } from '@/lib/format';
import { listCategories } from '@/lib/queries';
import { deleteCategoryAction } from '@/lib/actions/category';
import CategoryForm from '@/components/CategoryForm';
import CategoryEdit from '@/components/CategoryEdit';

export default async function KategoriPage() {
  const userId = await getSessionUserId();
  if (!userId) redirect('/login');

  const cats = await listCategories(userId);
  const income = cats.filter((c) => c.type === 'income');
  const expense = cats.filter((c) => c.type === 'expense');
  const totalBudget = expense.reduce((s, c) => s + Number(c.monthly_budget), 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold">Kategori & Budget</h1>
        <p className="text-sm opacity-60">
          Total budget bulanan: {formatIDR(totalBudget)}
        </p>
      </div>

      <CategoryForm />

      {[
        { title: 'Pemasukan', data: income },
        { title: 'Pengeluaran', data: expense },
      ].map((group) => (
        <section
          key={group.title}
          className="rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-white/5"
        >
          <h2 className="border-b border-black/5 p-4 text-sm font-semibold uppercase tracking-wide opacity-60 dark:border-white/5">
            {group.title}
          </h2>
          <ul className="divide-y divide-black/5 px-4 dark:divide-white/5">
            {group.data.map((c) => (
              <li key={c.id} className="py-3">
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
              <li className="py-6 text-center text-sm opacity-50">Belum ada kategori.</li>
            )}
          </ul>
          {group.title === 'Pengeluaran' && (
            <div className="border-t border-black/5 p-4 text-sm opacity-60 dark:border-white/5">
              Budget bulanan: {formatIDR(totalBudget)}
            </div>
          )}
        </section>
      ))}

      <p className="text-xs opacity-50">
        Menghapus kategori tidak menghapus transaksi — transaksi terkait hanya kehilangan
        kategorinya.
      </p>
    </div>
  );
}

export const dynamic = 'force-dynamic';
