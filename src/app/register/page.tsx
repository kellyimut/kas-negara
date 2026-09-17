'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { registerAction } from '@/lib/actions/auth';

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerAction, {});

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-center text-2xl font-bold">Daftar Kas Negara</h1>
        <p className="mb-6 text-center text-sm opacity-60">
          Buat akun, langsung dapat kategori default siap pakai
        </p>

        <form action={action} className="flex flex-col gap-4">
          {state.error && (
            <p className="rounded bg-red-500/10 p-3 text-sm text-red-500">{state.error}</p>
          )}
          <label className="flex flex-col gap-1 text-sm">
            Nama
            <input
              name="name"
              type="text"
              required
              minLength={2}
              autoComplete="name"
              className="rounded-md border border-black/15 bg-white px-3 py-2 text-base outline-none focus:border-blue-500 dark:border-white/20 dark:bg-black"
            />
          </label>
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
            Password (min. 8 karakter)
            <input
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="rounded-md border border-black/15 bg-white px-3 py-2 text-base outline-none focus:border-blue-500 dark:border-white/20 dark:bg-black"
            />
          </label>
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {pending ? 'Mendaftarkan...' : 'Daftar'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm opacity-70">
          Sudah punya akun?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:underline">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
