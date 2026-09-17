import { redirect } from 'next/navigation';
import { getSessionUserId } from '@/lib/auth';
import AppNav from '@/components/AppNav';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const userId = await getSessionUserId();
  if (!userId) redirect('/login');
  return (
    <div className="min-h-screen md:pl-60">
      <AppNav />
      <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6 md:px-8 md:pb-10 md:pt-8">
        {children}
      </main>
    </div>
  );
}
