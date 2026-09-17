'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getSessionUserId } from '@/lib/auth';
import { query } from '@/lib/db';

export interface CatState {
  error?: string;
}

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? '').trim();
}

export async function createCategoryAction(_prev: CatState, fd: FormData): Promise<CatState> {
  const userId = await getSessionUserId();
  if (!userId) redirect('/login');

  const name = str(fd, 'name').slice(0, 50);
  const type = str(fd, 'type') === 'income' ? 'income' : 'expense';
  const budgetRaw = str(fd, 'monthly_budget');
  const budget = budgetRaw ? Number(budgetRaw.replace(/[^\d.]/g, '')) : 0;

  if (name.length < 2) return { error: 'Nama kategori minimal 2 karakter.' };
  if (!Number.isFinite(budget) || budget < 0) return { error: 'Budget tidak valid.' };

  const dup = await query(
    `SELECT 1 FROM categories WHERE user_id = $1 AND name = $2`,
    [userId, name]
  );
  if (dup.length > 0) return { error: 'Kategori dengan nama itu sudah ada.' };

  await query(
    `INSERT INTO categories (user_id, name, type, monthly_budget)
     VALUES ($1, $2, $3, $4)`,
    [userId, name, type, budget]
  );

  revalidatePath('/kategori');
  revalidatePath('/dashboard');
  redirect('/kategori');
}

export async function updateCategoryAction(_prev: CatState, fd: FormData): Promise<CatState> {
  const userId = await getSessionUserId();
  if (!userId) redirect('/login');

  const id = str(fd, 'id');
  const name = str(fd, 'name').slice(0, 50);
  const budgetRaw = str(fd, 'monthly_budget');
  const budget = budgetRaw ? Number(budgetRaw.replace(/[^\d.]/g, '')) : 0;

  if (!id) return { error: 'ID kategori hilang.' };
  if (name.length < 2) return { error: 'Nama kategori minimal 2 karakter.' };
  if (!Number.isFinite(budget) || budget < 0) return { error: 'Budget tidak valid.' };

  const dup = await query(
    `SELECT 1 FROM categories WHERE user_id = $1 AND name = $2 AND id <> $3`,
    [userId, name, id]
  );
  if (dup.length > 0) return { error: 'Kategori dengan nama itu sudah ada.' };

  const res = await query(
    `UPDATE categories SET name = $1, monthly_budget = $2
     WHERE id = $3 AND user_id = $4 RETURNING id`,
    [name, budget, id, userId]
  );
  if (res.length === 0) return { error: 'Kategori tidak ditemukan.' };

  revalidatePath('/kategori');
  revalidatePath('/dashboard');
  redirect('/kategori');
}

export async function deleteCategoryAction(fd: FormData): Promise<void> {
  const userId = await getSessionUserId();
  if (!userId) redirect('/login');
  const id = str(fd, 'id');

  if (id) {
    await query(`DELETE FROM categories WHERE id = $1 AND user_id = $2`, [id, userId]);
  }
  revalidatePath('/kategori');
  revalidatePath('/dashboard');
  redirect('/kategori');
}
