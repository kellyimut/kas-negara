import Link from 'next/link';
import { logoutAction } from '@/lib/actions/auth';
import { getUserById } from '@/lib/queries';
import { getSessionUserId } from '@/lib/auth';

const NAV = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/harian', label: 'Harian' },
  { href: '/kategori', label: 'Kategori' },
];

export default async function AppNav() {
  const userId = await getSessionUserId();
  const user = userId ? await getUserById(userId) : null;

  return (
    <header className="sticky top-0 z-10 border-b border-black/10 bg-background/90 backdrop-blur dark:border-white/10">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="font-bold tracking-tight">
            💰 Kas Negara
          </Link>
          <nav className="flex gap-4 text-sm">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="opacity-70 transition hover:opacity-100">
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden opacity-60 sm:inline">{user?.name ?? ''}</span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-md border border-black/15 px-3 py-1.5 transition hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
            >
              Keluar
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
