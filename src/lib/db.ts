import { neon } from '@neondatabase/serverless';

// Real connection comes from DATABASE_URL (set on Vercel). The placeholder below
// only satisfies module evaluation during `next build` page-data collection.
export const sql = neon(
  process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/kas_negara'
);

export type Row = Record<string, unknown>;

/**
 * Run a parameterized query ($1, $2, ...). Returns array of rows.
 */
export async function query<T = Row>(text: string, values: unknown[] = []): Promise<T[]> {
  const res = await sql.query(text, values);
  return (Array.isArray(res) ? res : (res as { rows?: T[] }).rows ?? []) as T[];
}

/**
 * Run raw SQL (e.g. multi-statement schema). Use only with trusted input.
 */
export async function unsafe(text: string): Promise<unknown> {
  return sql.unsafe(text);
}
