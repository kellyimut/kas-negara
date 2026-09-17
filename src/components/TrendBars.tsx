import { monthLabel } from '@/lib/format';

export interface TrendPoint {
  ym: string;
  income: number;
  expense: number;
}

export function TrendBars({ data }: { data: TrendPoint[] }) {
  if (data.length === 0) {
    return <p className="py-8 text-center text-sm opacity-50">Belum ada data.</p>;
  }
  const max = Math.max(...data.map((d) => Math.max(d.income, d.expense)), 1);

  return (
    <div className="flex items-end justify-around gap-3 px-2 pt-6" style={{ height: 180 }}>
      {data.map((d) => (
        <div key={d.ym} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
          <div className="flex h-full w-full items-end justify-center gap-1">
            <div
              className="w-1/3 rounded-t bg-emerald-500/80"
              style={{ height: `${(d.income / max) * 100}%` }}
              title={`Masuk: ${d.income.toLocaleString('id-ID')}`}
            />
            <div
              className="w-1/3 rounded-t bg-rose-500/80"
              style={{ height: `${(d.expense / max) * 100}%` }}
              title={`Keluar: ${d.expense.toLocaleString('id-ID')}`}
            />
          </div>
          <span className="text-[11px] opacity-60">{monthLabel(d.ym)}</span>
        </div>
      ))}
    </div>
  );
}

export function TrendLegend() {
  return (
    <div className="mt-2 flex justify-center gap-4 text-xs opacity-70">
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-2.5 w-2.5 rounded-sm bg-emerald-500/80" /> Masuk
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-2.5 w-2.5 rounded-sm bg-rose-500/80" /> Keluar
      </span>
    </div>
  );
}
