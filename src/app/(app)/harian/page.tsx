import { redirect } from 'next/navigation';
import { getSessionUserId } from '@/lib/auth';
import { formatIDR, currentYM, validateYM } from '@/lib/format';
import { listCategories, listTransactions, getMonthlySummary } from '@/lib/queries';
import TxForm from '@/components/TxForm';
import TxList from '@/components/TxList';
import MonthPicker from '@/components/MonthPicker';

export default async function HarianPage({
  searchParams,
}: {
  searchParams: Promise<{ ym?: string }>;
}) {
  const userId = await getSessionUserId();
  if (!userId) redirect('/login');

  const sp = await searchParams;
  const ym = validateYM(sp.ym) ?? currentYM();
  const from = `${ym}-01`;
  const to = `${ym}-31`;

  const [cats, txs, summary] = await Promise.all([
    listCategories(userId),
    listTransactions(userId, { from, to }),
    getMonthlySummary(userId, ym),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Catatan Harian</h1>
          <p className="text-sm opacity-60">
            {formatIDR(summary.income)} masuk • {formatIDR(summary.expense)} keluar •{' '}
            {summary.txCount} transaksi
          </p>
        </div>
        <MonthPicker currentYM={ym} basePath="/harian" />
      </div>

      <TxForm cats={cats.map((c) => ({ id: c.id, name: c.name, type: c.type }))} />

      <section className="rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-white/5">
        <h2 className="border-b border-black/5 p-4 text-sm font-semibold uppercase tracking-wide opacity-60 dark:border-white/5">
          Transaksi Bulan Ini
        </h2>
        <div className="px-4">
          <TxList items={txs} />
        </div>
      </section>
    </div>
  );
}
