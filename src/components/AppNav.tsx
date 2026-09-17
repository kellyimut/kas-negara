import Link from 'next/link';
import { logoutAction } from '@/lib/actions/auth';
import { getUserById } from '@/lib/queries';
import { getSessionUserId } from '@/lib/auth';

const NAV = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
      </svg>
    ),
  },
  {
    href: '/harian',
    label: 'Harian',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M3 10h18" />
      </svg>
    ),
  },
  {
    href: '/kategori',
    label: 'Kategori',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10.6 3.7a2 2 0 0 0-2.829 0L3.7 7.771a2 2 0 0 0 0 2.829l4.05 4.05a2 2 0 0 0 2.83 0l4.05-4.05a2 2 0 0 0 0-2.829z" />
        <path d="m16 12 4.5 4.5a2.12 2.12 0 0 1-3 3L13 15" />
      </svg>
    ),
  },
];

export default async function AppNav() {
  const userId = await getSessionUserId();
  const user = userId ? await getUserById(userId) : null;
  const initials = (user?.name ?? '?')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-border bg-card/60 backdrop-blur-xl md:flex">
        <div className="flex items-center gap-3 px-5 py-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/30">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 21h18" />
              <path d="M3 10h18" />
              <path d="M5 6l14 4" />
              <path d="M5 10v11" />
              <path d="M19 10v11" />
            </svg>
          </span>
          <div>
            <p className="font-sans font-semibold leading-tight">Kas Negara</p>
            <p className="text-[11px] text-muted-foreground">Dashboard Keuangan</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground"
            >
              {n.icon}
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-border p-4">
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/20 text-sm font-semibold text-secondary">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user?.name ?? ''}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.email ?? ''}</p>
            </div>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-red-400"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="m16 17 5-5-5-5" />
                <path d="M21 12H9" />
              </svg>
              Keluar
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-card/70 px-4 py-3 backdrop-blur-xl md:hidden">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 21h18" />
              <path d="M3 10h18" />
              <path d="M5 6l14 4" />
              <path d="M5 10v11" />
              <path d="M19 10v11" />
            </svg>
          </span>
          <span className="font-sans font-semibold">Kas Negara</span>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-red-400"
          >
            Keluar
          </button>
        </form>
      </header>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t border-border bg-card/80 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className="flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] text-muted-foreground transition-colors active:text-secondary"
          >
            {n.icon}
            {n.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
