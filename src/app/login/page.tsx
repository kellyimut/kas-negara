'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { loginAction } from '@/lib/actions/auth';

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, {});

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-center text-2xl font-bold">Kas Negara</h1>
        <p className="mb-6 text-center text-sm opacity-60">Masuk ke dashboard keuanganmu</p>

        <form action={action} className="flex flex-col gap-4">
          {state.error && (
            <p className="rounded bg-red-500/10 p-3 text-sm text-red-500">{state.error}</p>
          )}
          <label className="flex flex-col gap-1 text-sm">
            Email
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="rounded-md border border-black/15 bg-white px-3 py-2 text-base outline-none focus:border-blue-500 dark:border-white/20 dark:bg-black"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Password
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="rounded-md border border-black/15 bg-white px-3 py-2 text-base outline-none focus:border-blue-500 dark:border-white/20 dark:bg-black"
            />
          </label>
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {pending ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm opacity-70">
          Belum punya akun?{' '}
          <Link href="/register" className="font-medium text-blue-600 hover:underline">
            Daftar
          </Link>
        </p>
      </div>
    </div>
  );
}
