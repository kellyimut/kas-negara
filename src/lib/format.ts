export const IDR = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

export function formatIDR(n: number | string): string {
  return IDR.format(Number(n));
}

export function formatShortIDR(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) return `Rp${(n / 1_000_000_000).toFixed(1)}M`;
  if (abs >= 1_000_000) return `Rp${(n / 1_000_000).toFixed(1)}jt`;
  if (abs >= 1_000) return `Rp${(n / 1_000).toFixed(0)}rb`;
  return `Rp${n}`;
}

const MONTHS_ID = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
];

export function monthLabel(ym: string): string {
  const [y, m] = ym.split('-').map(Number);
  return `${MONTHS_ID[m - 1]} ${y}`;
}

export function formatDateString(d: string): string {
  const [y, m, day] = d.split('-').map(Number);
  return `${day} ${MONTHS_ID[m - 1]} ${y}`;
}

export function todayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function currentYM(): string {
  return todayISO().slice(0, 7);
}

export function validateYM(ym: string | undefined | null): string | undefined {
  if (ym && /^\d{4}-\d{2}$/.test(ym) && ym >= '2000-01' && ym <= '2999-12') return ym;
  return undefined;
}

/**
 * Month range for DB queries: [first day, exclusive first day of next month].
 * Avoids the invalid `${ym}-31` date for short months (Feb, Apr, Jun, Sep, Nov).
 */
export function monthRange(ym: string): [string, string] {
  const [y, m] = ym.split('-').map(Number);
  const nextYM = m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, '0')}`;
  return [`${ym}-01`, `${nextYM}-01`];
}
