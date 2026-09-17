import { query } from './db';

export interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
}

export interface CategoryRow {
  id: string;
  user_id: string;
  name: string;
  type: 'income' | 'expense';
  monthly_budget: string;
}

export interface TxRow {
  id: string;
  user_id: string;
  category_id: string | null;
  type: 'income' | 'expense';
  amount: string;
  note: string;
  tx_date: string;
}

export interface Summary {
  income: number;
  expense: number;
  net: number;
  txCount: number;
}

export interface CategorySpend {
  id: string;
  name: string;
  type: 'income' | 'expense';
  budget: number;
  total: number;
}

const USER_COLS = 'id, name, email, password_hash';

export async function getUserByEmail(email: string): Promise<UserRow | null> {
  const rows = await query<UserRow>(
    `SELECT ${USER_COLS} FROM users WHERE email = $1 LIMIT 1`,
    [email]
  );
  return rows[0] ?? null;
}

export async function getUserById(id: string): Promise<UserRow | null> {
  const rows = await query<UserRow>(
    `SELECT ${USER_COLS} FROM users WHERE id = $1 LIMIT 1`,
    [id]
  );
  return rows[0] ?? null;
}

export async function createUser(
  name: string,
  email: string,
  passwordHash: string
): Promise<string> {
  const rows = await query<{ id: string }>(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3) RETURNING id`,
    [name, email, passwordHash]
  );
  return rows[0].id;
}

export async function seedDefaultCategories(userId: string): Promise<void> {
  await query(
    `INSERT INTO categories (user_id, name, type, monthly_budget) VALUES
      ($1, 'Gaji', 'income', 0),
      ($1, 'Bonus', 'income', 0),
      ($1, 'Lainnya (masuk)', 'income', 0),
      ($1, 'Makanan', 'expense', 1500000),
      ($1, 'Transportasi', 'expense', 500000),
      ($1, 'Belanja', 'expense', 750000),
      ($1, 'Tagihan', 'expense', 1000000),
      ($1, 'Hiburan', 'expense', 400000),
      ($1, 'Kesehatan', 'expense', 300000),
      ($1, 'Lainnya (keluar)', 'expense', 300000)
     ON CONFLICT DO NOTHING`,
    [userId]
  );
}

export async function listCategories(userId: string): Promise<CategoryRow[]> {
  return query<CategoryRow>(
    `SELECT id, user_id, name, type, monthly_budget
     FROM categories WHERE user_id = $1
     ORDER BY type, name`,
    [userId]
  );
}

export async function listTransactions(
  userId: string,
  opts: { from?: string; to?: string; limit?: number } = {}
): Promise<(TxRow & { category_name: string | null })[]> {
  const from = opts.from ?? '0001-01-01';
  const to = opts.to ?? '9999-12-31';
  const limit = opts.limit ?? 500;
  return query<TxRow & { category_name: string | null }>(
    `SELECT t.id, t.user_id, t.category_id, t.type, t.amount, t.note,
            to_char(t.tx_date, 'YYYY-MM-DD') AS tx_date,
            c.name AS category_name
     FROM transactions t
     LEFT JOIN categories c ON c.id = t.category_id
     WHERE t.user_id = $1 AND t.tx_date >= $2 AND t.tx_date <= $3
     ORDER BY t.tx_date DESC, t.created_at DESC
     LIMIT $4`,
    [userId, from, to, limit]
  );
}

function monthRange(ym: string): [string, string] {
  // [first day, exclusive upper bound = first day of next month]
  const [y, m] = ym.split('-').map(Number);
  const nextYM = m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, '0')}`;
  return [`${ym}-01`, `${nextYM}-01`];
}

export async function getMonthlySummary(userId: string, ym: string): Promise<Summary> {
  const [from, to] = monthRange(ym);
  const rows = await query<{ income: string; expense: string; cnt: string }>(
    `SELECT
       COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS income,
       COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expense,
       COUNT(*) AS cnt
     FROM transactions
     WHERE user_id = $1 AND tx_date >= $2 AND tx_date < $3`,
    [userId, from, to]
  );
  const r = rows[0];
  const income = Number(r.income);
  const expense = Number(r.expense);
  return { income, expense, net: income - expense, txCount: Number(r.cnt) };
}

export async function getCategoryBreakdown(
  userId: string,
  ym: string
): Promise<CategorySpend[]> {
  const [from, to] = monthRange(ym);
  const rows = await query<{
    id: string;
    name: string;
    type: 'income' | 'expense';
    monthly_budget: string;
    total: string;
  }>(
    `SELECT c.id, c.name, c.type, c.monthly_budget,
            COALESCE(SUM(t.amount), 0) AS total
     FROM categories c
     LEFT JOIN transactions t
       ON t.category_id = c.id
       AND t.user_id = $1
       AND t.tx_date >= $2 AND t.tx_date < $3
     WHERE c.user_id = $1
     GROUP BY c.id, c.name, c.type, c.monthly_budget
     ORDER BY c.type, total DESC`,
    [userId, from, to]
  );
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    type: r.type,
    budget: Number(r.monthly_budget),
    total: Number(r.total),
  }));
}

export async function getMonthlyTrend(
  userId: string,
  months = 6
): Promise<{ ym: string; income: number; expense: number }[]> {
  const rows = await query<{ ym: string; income: string; expense: string }>(
    `SELECT to_char(tx_date, 'YYYY-MM') AS ym,
            SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
            SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense
     FROM transactions
     WHERE user_id = $1
       AND tx_date >= (date_trunc('month', now()) - ($2::int - 1) * interval '1 month')
     GROUP BY 1 ORDER BY 1`,
    [userId, months]
  );
  return rows.map((r) => ({ ym: r.ym, income: Number(r.income), expense: Number(r.expense) }));
}
