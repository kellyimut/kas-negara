'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { loginAction } from '@/lib/actions/auth';
import AuthShell from '@/components/AuthShell';

const inputCls =
  'w-full rounded-xl border border-border bg-muted/60 px-4 py-3 text-base outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-secondary focus:bg-muted';

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, {});

  return (
    <AuthShell
      title="Selamat datang kembali"
      subtitle="Masuk untuk melanjutkan pencatatan keuanganmu"
      footer={
        <>
          Belum punya akun?{' '}
          <Link href="/register" className="font-medium text-secondary hover:underline">
            Daftar gratis
          </Link>
        </>
      }
    >
      <form action={action} className="flex flex-col gap-4">
        {state.error && (
          <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-red-400">
            {state.error}
          </p>
        )}
        <label className="flex flex-col gap-1.5 text-sm">
          Email atau Username
          <input name="email" type="text" required autoComplete="username" placeholder="email atau username" className={inputCls} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          Password
          <input name="password" type="password" required autoComplete="current-password" placeholder="••••••••" className={inputCls} />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="mt-2 cursor-pointer rounded-xl bg-primary px-4 py-3 font-sans font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-secondary hover:shadow-secondary/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? 'Memproses…' : 'Masuk'}
        </button>
      </form>
    </AuthShell>
  );
}
