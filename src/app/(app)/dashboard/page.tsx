import { redirect } from 'next/navigation';
import { getSessionUserId } from '@/lib/auth';
import { formatIDR, monthLabel, currentYM, validateYM } from '@/lib/format';
import { getCategoryBreakdown, getMonthlySummary, getMonthlyTrend } from '@/lib/queries';
import { TrendBars } from '@/components/TrendBars';
import MonthPicker from '@/components/MonthPicker';

function StatCard({
  label,
  value,
  tone,
  icon,
}: {
  label: string;
  value: string;
  tone: 'income' | 'expense' | 'net' | 'rate';
  icon: React.ReactNode;
}) {
  const tones = {
    income: { text: 'text-income', bg: 'bg-emerald-500/15' },
    expense: { text: 'text-expense', bg: 'bg-rose-500/15' },
    net: { text: 'text-secondary', bg: 'bg-blue-500/15' },
    rate: { text: 'text-accent', bg: 'bg-teal-500/15' },
  } as const;
  return (
    <div className="glass p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${tones[tone].bg} ${tones[tone].text}`}>
          {icon}
        </span>
      </div>
      <p className={`mt-2 font-sans text-xl font-bold sm:text-2xl ${tones[tone].text}`}>{value}</p>
    </div>
  );
}

const ICONS = {
  income: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m17 7-10 10" />
      <path d="M17 7v8" />
      <path d="M17 7H9" />
    </svg>
  ),
  expense: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 7h10" />
      <path d="M7 17 17 7" />
      <path d="M7 17V9" />
    </svg>
  ),
  net: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2v20" />
      <path d="m17 9-5-5-5 5" />
      <path d="M7 15h10" />
    </svg>
  ),
  rate: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="16.5" cy="19" r="2.5" />
      <circle cx="5" cy="8.5" r="2.5" />
      <path d="M11 11c1.5-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 8.5 0 5.5 5.5 0 0 0 5 1.5" />
      <path d="M5 1.5A5.5 5.5 0 0 0 1.5 5.5c0 1.3.41 2.42 1.06 3.42" />
      <path d="M8.5 8.5c-1.49 1.46-3 3.21-3 5.5A5.5 5.5 0 0 0 11 19.5a5.5 5.5 0 0 0 3.5-1.5" />
      <path d="m19 14-5 5" />
    </svg>
  ),
};

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
  const budgetPct = totalBudget > 0 ? Math.min((totalExpenseCats / totalBudget) * 100, 100) : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-sans text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Ringkasan {monthLabel(ym)}</p>
        </div>
        <MonthPicker currentYM={ym} basePath="/dashboard" />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Pemasukan" value={formatIDR(summary.income)} tone="income" icon={ICONS.income} />
        <StatCard label="Pengeluaran" value={formatIDR(summary.expense)} tone="expense" icon={ICONS.expense} />
        <StatCard
          label={summary.net >= 0 ? 'Surplus' : 'Defisit'}
          value={formatIDR(summary.net)}
          tone="net"
          icon={ICONS.net}
        />
        <StatCard
          label="Savings Rate"
          value={savingsRate === null ? '—' : `${savingsRate.toFixed(1)}%`}
          tone="rate"
          icon={ICONS.rate}
        />
      </div>

      <section className="glass p-5 sm:p-6">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Tren 6 Bulan
        </h2>
        <TrendBars data={trend} />
      </section>

      <section className="glass p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Pengeluaran per Kategori
          </h2>
          {totalBudget > 0 && (
            <p className="text-xs text-muted-foreground">
              <span className={`font-semibold ${budgetPct >= 100 ? 'text-expense' : 'text-foreground'}`}>
                {formatIDR(totalExpenseCats)}
              </span>{' '}
              dari {formatIDR(totalBudget)} budget
            </p>
          )}
        </div>

        {totalBudget > 0 && (
          <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-all ${
                budgetPct >= 100
                  ? 'bg-gradient-to-r from-rose-700 to-rose-400'
                  : 'bg-gradient-to-r from-primary to-secondary'
              }`}
              style={{ width: `${budgetPct}%` }}
            />
          </div>
        )}

        {expenseCats.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">Belum ada kategori.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {expenseCats.map((c) => {
              const pct = c.budget > 0 ? Math.min((c.total / c.budget) * 100, 100) : 0;
              const over = c.budget > 0 && c.total > c.budget;
              return (
                <li key={c.id}>
                  <div className="mb-1.5 flex items-baseline justify-between text-sm">
                    <span className="font-medium">{c.name}</span>
                    <span className={over ? 'font-semibold text-expense' : ''}>
                      {formatIDR(c.total)}
                      {c.budget > 0 && (
                        <span className="text-muted-foreground"> / {formatIDR(c.budget)}</span>
                      )}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        over
                          ? 'bg-gradient-to-r from-rose-700 to-rose-400'
                          : 'bg-gradient-to-r from-primary to-secondary'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
