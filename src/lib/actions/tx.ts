'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getSessionUserId } from '@/lib/auth';
import { query } from '@/lib/db';

export interface TxState {
  error?: string;
}

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? '').trim();
}

function parseAmount(raw: string): number | null {
  const cleaned = raw.replace(/[Rp\s.]/g, '').replace(',', '.');
  const n = Number(cleaned);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round(n * 100) / 100;
}

async function ownCategory(userId: string, categoryId: string): Promise<boolean> {
  const rows = await query(`SELECT 1 FROM categories WHERE id = $1 AND user_id = $2`, [
    categoryId,
    userId,
  ]);
  return rows.length > 0;
}

export async function createTxAction(_prev: TxState, fd: FormData): Promise<TxState> {
  const userId = await getSessionUserId();
  if (!userId) redirect('/login');

  const type = str(fd, 'type') === 'income' ? 'income' : 'expense';
  const amount = parseAmount(str(fd, 'amount'));
  const categoryId = str(fd, 'categoryId') || null;
  const note = str(fd, 'note').slice(0, 200);
  const txDate = str(fd, 'txDate');
  const redirectTo = str(fd, 'redirectTo') || '/dashboard';

  if (amount === null) return { error: 'Jumlah harus angka lebih dari 0.' };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(txDate)) return { error: 'Tanggal tidak valid.' };

  if (categoryId && !(await ownCategory(userId, categoryId))) {
    return { error: 'Kategori tidak valid.' };
  }

  await query(
    `INSERT INTO transactions (user_id, category_id, type, amount, note, tx_date)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [userId, categoryId, type, amount, note, txDate]
  );

  revalidatePath('/dashboard');
  revalidatePath('/harian');
  revalidatePath('/kategori');
  redirect(redirectTo);
}

export async function deleteTxAction(fd: FormData): Promise<void> {
  const userId = await getSessionUserId();
  if (!userId) redirect('/login');
  const id = str(fd, 'id');
  const redirectTo = str(fd, 'redirectTo') || '/harian';

  if (id) {
    await query(`DELETE FROM transactions WHERE id = $1 AND user_id = $2`, [id, userId]);
  }
  revalidatePath('/dashboard');
  revalidatePath('/harian');
  revalidatePath('/kategori');
  redirect(redirectTo);
}

export async function updateTxAction(_prev: TxState, fd: FormData): Promise<TxState> {
  const userId = await getSessionUserId();
  if (!userId) redirect('/login');

  const id = str(fd, 'id');
  const type = str(fd, 'type') === 'income' ? 'income' : 'expense';
  const amount = parseAmount(str(fd, 'amount'));
  const categoryId = str(fd, 'categoryId') || null;
  const note = str(fd, 'note').slice(0, 200);
  const txDate = str(fd, 'txDate');
  const redirectTo = str(fd, 'redirectTo') || '/harian';

  if (!id) return { error: 'ID transaksi hilang.' };
  if (amount === null) return { error: 'Jumlah harus angka lebih dari 0.' };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(txDate)) return { error: 'Tanggal tidak valid.' };

  if (categoryId && !(await ownCategory(userId, categoryId))) {
    return { error: 'Kategori tidak valid.' };
  }

  const res = await query(
    `UPDATE transactions SET category_id = $1, type = $2, amount = $3,
       note = $4, tx_date = $5
     WHERE id = $6 AND user_id = $7 RETURNING id`,
    [categoryId, type, amount, note, txDate, id, userId]
  );
  if (res.length === 0) return { error: 'Transaksi tidak ditemukan.' };

  revalidatePath('/dashboard');
  revalidatePath('/harian');
  revalidatePath('/kategori');
  redirect(redirectTo);
}
