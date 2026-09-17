// One-off script: apply db/schema.sql to the Neon database statement-by-statement.
// Reads DATABASE_URL from .env.local (downloaded from Vercel).
// NOTE: neon's .unsafe() only works as a tagged template; with paren-call syntax it
// silently builds a query object without executing. Use sql.query(text) instead.
const fs = require('fs');
const path = require('path');

function loadEnvLocal() {
  const lines = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)="?(.*?)"?$/);
    if (m) process.env[m[1]] = m[2];
  }
}

loadEnvLocal();

const { neon } = require('@neondatabase/serverless');

(async () => {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL missing');
  const sql = neon(process.env.DATABASE_URL);

  const schema = fs.readFileSync(path.join(__dirname, '..', 'db', 'schema.sql'), 'utf8');
  const statements = schema
    .split(/;\s*(?:\r?\n|$)/)
    .map((s) => s.replace(/--[^\n]*/g, '').trim())
    .filter((s) => s.length > 0);
  console.log(`Applying ${statements.length} statements...`);

  for (const stmt of statements) {
    await sql.query(stmt);
    console.log('  ok:', stmt.split(/\s+/).slice(0, 4).join(' '), '...');
  }

  const tables = await sql`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`;
  console.log('Schema applied. Tables:', tables.map((t) => t.tablename).join(', '));
})().catch((e) => {
  console.error('ERROR:', e.message);
  process.exit(1);
});
