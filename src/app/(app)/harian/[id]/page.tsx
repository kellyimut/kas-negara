import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getSessionUserId } from '@/lib/auth';
import { listCategories } from '@/lib/queries';
import { query as q } from '@/lib/db';
import TxEditForm from '@/components/TxEditForm';

export default async function EditTxPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const userId = await getSessionUserId();
  if (!userId) redirect('/login');

  const { id } = await params;
  const rows = await q(
    `SELECT id, user_id, category_id, type, amount, note,
            to_char(tx_date, 'YYYY-MM-DD') AS tx_date
     FROM transactions WHERE id = $1 AND user_id = $2 LIMIT 1`,
    [id, userId]
  );
  const tx = rows[0];
  if (!tx) notFound();

  const cats = await listCategories(userId);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/harian"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Kembali ke Harian
        </Link>
        <h1 className="font-sans text-2xl font-bold">Edit Transaksi</h1>
        <p className="text-sm text-muted-foreground">Perbarui detail transaksi</p>
      </div>
      <TxEditForm
        tx={{
          id: String(tx.id),
          type: tx.type as 'income' | 'expense',
          amount: String(tx.amount),
          note: String(tx.note ?? ''),
          tx_date: String(tx.tx_date),
          categoryId: tx.category_id ? String(tx.category_id) : '',
        }}
        cats={cats.map((c) => ({ id: c.id, name: c.name, type: c.type }))}
      />
    </div>
  );
}

export const dynamic = 'force-dynamic';
