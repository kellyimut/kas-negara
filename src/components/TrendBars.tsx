import { monthLabel, formatShortIDR } from '@/lib/format';

export interface TrendPoint {
  ym: string;
  income: number;
  expense: number;
}

/** Fill months so the chart axis is continuous even with sparse data. */
function fillMonths(data: TrendPoint[], count = 6): TrendPoint[] {
  if (data.length === 0) return [];
  const [y0, m0] = data[data.length - 1].ym.split('-').map(Number);
  const out: TrendPoint[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(y0, m0 - 1 - i, 1));
    const ym = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
    out.push(data.find((x) => x.ym === ym) ?? { ym, income: 0, expense: 0 });
  }
  return out;
}

export function TrendBars({ data }: { data: TrendPoint[] }) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 3v18h18" />
            <path d="m19 9-5 5-4-4-3 3" />
          </svg>
        </span>
        <p className="text-sm text-muted-foreground">
          Belum ada data. Tambahkan transaksi pertamamu di halaman Harian!
        </p>
      </div>
    );
  }

  const filled = fillMonths(data);
  const max = Math.max(...filled.map((d) => Math.max(d.income, d.expense)), 1);

  return (
    <div>
      <div
        className="flex items-end justify-around gap-2 px-2 pt-8 sm:gap-4"
        style={{ height: 190 }}
        role="img"
        aria-label="Grafik batang pemasukan dan pengeluaran 6 bulan terakhir"
      >
        {filled.map((d) => (
          <div key={d.ym} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
            <div className="relative flex h-full w-full items-end justify-center gap-1.5">
              <div className="pointer-events-none absolute -top-2 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] shadow-xl group-hover:block">
                <p className="text-income">↑ {formatShortIDR(d.income)}</p>
                <p className="text-expense">↓ {formatShortIDR(d.expense)}</p>
              </div>
              <div
                className="w-full max-w-[26px] rounded-t-lg bg-gradient-to-t from-emerald-700 to-emerald-400 transition-all duration-300 group-hover:to-emerald-300"
                style={{ height: `${Math.max((d.income / max) * 100, d.income > 0 ? 3 : 0)}%` }}
              />
              <div
                className="w-full max-w-[26px] rounded-t-lg bg-gradient-to-t from-rose-800 to-rose-500 transition-all duration-300 group-hover:to-rose-400"
                style={{ height: `${Math.max((d.expense / max) * 100, d.expense > 0 ? 3 : 0)}%` }}
              />
            </div>
            <span className="text-[11px] text-muted-foreground">{monthLabel(d.ym)}</span>
          </div>
        ))}
      </div>
      <TrendLegend />
    </div>
  );
}

export function TrendLegend() {
  return (
    <div className="mt-4 flex justify-center gap-6 text-xs text-muted-foreground">
      <span className="flex items-center gap-2">
        <span className="inline-block h-2.5 w-2.5 rounded-sm bg-gradient-to-t from-emerald-700 to-emerald-400" />
        Pemasukan
      </span>
      <span className="flex items-center gap-2">
        <span className="inline-block h-2.5 w-2.5 rounded-sm bg-gradient-to-t from-rose-800 to-rose-500" />
        Pengeluaran
      </span>
    </div>
  );
}
