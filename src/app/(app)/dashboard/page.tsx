import { redirect } from 'next/navigation';
import { getSessionUserId } from '@/lib/auth';
import { formatIDR, monthLabel, currentYM, validateYM } from '@/lib/format';
import { getCategoryBreakdown, getMonthlySummary, getMonthlyTrend } from '@/lib/queries';
import { TrendBars, TrendLegend } from '@/components/TrendBars';
import MonthPicker from '@/components/MonthPicker';

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'neutral' | 'green' | 'red' | 'blue';
}) {
  const tones = {
    neutral: '',
    green: 'text-emerald-600 dark:text-emerald-400',
    red: 'text-rose-600 dark:text-rose-400',
    blue: 'text-blue-600 dark:text-blue-400',
  } as const;
  return (
    <div className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-white/5">
      <p className="text-xs uppercase tracking-wide opacity-50">{label}</p>
      <p className={`mt-1 text-xl font-semibold ${tones[tone]}`}>{value}</p>
    </div>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ ym?: string }>;
}) {
  const userId = await getSessionUserId();
  if (!userId) redirect('/login');

  const sp = await searchParams;
  const ym = validateYM(sp.ym) ?? currentYM();

  const [summary, trend, breakdown] = await Promise.all([
    getMonthlySummary(userId, ym),
    getMonthlyTrend(userId, 6),
    getCategoryBreakdown(userId, ym),
  ]);

  const savingsRate = summary.income > 0 ? (summary.net / summary.income) * 100 : null;
  const expenseCats = breakdown.filter((c) => c.type === 'expense');
  const totalBudget = expenseCats.reduce((s, c) => s + c.budget, 0);
  const totalExpenseCats = expenseCats.reduce((s, c) => s + c.total, 0);
  const maxSpend = Math.max(...expenseCats.map((c) => c.total), 1);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Dashboard</h1>
          <p className="text-sm opacity-60">Ringkasan {monthLabel(ym)}</p>
        </div>
        <MonthPicker currentYM={ym} basePath="/dashboard" />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Pemasukan" value={formatIDR(summary.income)} tone="green" />
        <StatCard label="Pengeluaran" value={formatIDR(summary.expense)} tone="red" />
        <StatCard
          label={summary.net >= 0 ? 'Surplus' : 'Defisit'}
          value={formatIDR(summary.net)}
          tone={summary.net >= 0 ? 'blue' : 'red'}
        />
        <StatCard
          label="Savings Rate"
          value={savingsRate === null ? '—' : `${savingsRate.toFixed(1)}%`}
          tone={savingsRate !== null && savingsRate < 0 ? 'red' : 'blue'}
        />
      </div>

      <section className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-white/5">
        <h2 className="text-sm font-semibold uppercase tracking-wide opacity-60">
          Tren 6 Bulan
        </h2>
        <TrendBars data={trend} />
        <TrendLegend />
      </section>

      <section className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-white/5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide opacity-60">
            Pengeluaran per Kategori
          </h2>
          {totalBudget > 0 && (
            <p className="text-xs opacity-60">
              Budget terpakai: {formatIDR(totalExpenseCats)} / {formatIDR(totalBudget)}
            </p>
          )}
        </div>
        {expenseCats.length === 0 ? (
          <p className="py-6 text-center text-sm opacity-50">Belum ada kategori.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {expenseCats.map((c) => {
              const pct = c.budget > 0 ? Math.min((c.total / c.budget) * 100, 100) : 0;
              const over = c.budget > 0 && c.total > c.budget;
              return (
                <li key={c.id}>
                  <div className="mb-1 flex items-baseline justify-between text-sm">
                    <span>{c.name}</span>
                    <span className={over ? 'font-semibold text-rose-600' : ''}>
                      {formatIDR(c.total)}
                      {c.budget > 0 && (
                        <span className="opacity-50"> / {formatIDR(c.budget)}</span>
                      )}
                    </span>
                  </div>
                  {c.budget > 0 ? (
                    <div className="h-2 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                      <div
                        className={`h-full rounded-full ${over ? 'bg-rose-500' : 'bg-blue-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  ) : (
                    <div className="h-2 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                      <div
                        className="h-full rounded-full bg-black/25 dark:bg-white/25"
                        style={{ width: `${Math.min((c.total / maxSpend) * 100, 100)}%` }}
                      />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
