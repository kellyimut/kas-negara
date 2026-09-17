import { redirect } from 'next/navigation';
import { getSessionUserId } from '@/lib/auth';
import { formatIDR, currentYM, validateYM, monthRange } from '@/lib/format';
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
  const [from, to] = monthRange(ym);

  const [cats, txs, summary] = await Promise.all([
    listCategories(userId),
    listTransactions(userId, { from, to }),
    getMonthlySummary(userId, ym),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-sans text-2xl font-bold">Catatan Harian</h1>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-income" />
              {formatIDR(summary.income)} masuk
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-expense" />
              {formatIDR(summary.expense)} keluar
            </span>
            <span>• {summary.txCount} transaksi</span>
          </p>
        </div>
        <MonthPicker currentYM={ym} basePath="/harian" />
      </div>

      <TxForm cats={cats.map((c) => ({ id: c.id, name: c.name, type: c.type }))} />

      <section className="glass p-5 sm:p-6">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Transaksi Bulan Ini
        </h2>
        <TxList items={txs} />
      </section>
    </div>
  );
}
