'use server';

import { redirect } from 'next/navigation';
import { createSession, destroySession, hashPassword, verifyPassword } from '@/lib/auth';
import { createUser, getUserByEmail, seedDefaultCategories } from '@/lib/queries';

export interface AuthState {
  error?: string;
}

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? '').trim();
}

export async function registerAction(_prev: AuthState, fd: FormData): Promise<AuthState> {
  const name = str(fd, 'name');
  const email = str(fd, 'email').toLowerCase();
  const password = String(fd.get('password') ?? '');

  if (name.length < 2) return { error: 'Nama minimal 2 karakter.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Format email tidak valid.' };
  if (password.length < 8) return { error: 'Password minimal 8 karakter.' };

  const existing = await getUserByEmail(email);
  if (existing) return { error: 'Email sudah terdaftar. Silakan login.' };

  const userId = await createUser(name, email, hashPassword(password));
  await seedDefaultCategories(userId);
  await createSession(userId);
  redirect('/dashboard');
}

export async function loginAction(_prev: AuthState, fd: FormData): Promise<AuthState> {
  const email = str(fd, 'email').toLowerCase();
  const password = String(fd.get('password') ?? '');

  if (!email || !password) return { error: 'Email dan password wajib diisi.' };

  const user = await getUserByEmail(email);
  if (!user || !verifyPassword(password, user.password_hash)) {
    return { error: 'Email atau password salah.' };
  }
  await createSession(user.id);
  redirect('/dashboard');
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect('/login');
}
