'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { registerAction } from '@/lib/actions/auth';
import AuthShell from '@/components/AuthShell';

const inputCls =
  'w-full rounded-xl border border-border bg-muted/60 px-4 py-3 text-base outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-secondary focus:bg-muted';

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerAction, {});

  return (
    <AuthShell
      title="Buat akun Kas Negara"
      subtitle="Gratis, langsung dapat 10 kategori siap pakai dengan budget"
      footer={
        <>
          Sudah punya akun?{' '}
          <Link href="/login" className="font-medium text-secondary hover:underline">
            Masuk
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
          Nama
          <input name="name" type="text" required minLength={2} autoComplete="name" placeholder="Nama kamu" className={inputCls} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          Email
          <input name="email" type="email" required autoComplete="email" placeholder="nama@email.com" className={inputCls} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          Password
          <input name="password" type="password" required minLength={8} autoComplete="new-password" placeholder="Minimal 8 karakter" className={inputCls} />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="mt-2 cursor-pointer rounded-xl bg-primary px-4 py-3 font-sans font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-secondary hover:shadow-secondary/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? 'Mendaftarkan…' : 'Daftar Sekarang'}
        </button>
      </form>
    </AuthShell>
  );
}
