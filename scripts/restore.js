// Pulihkan database Kas Negara dari file backup JSON.
// Pakai: node scripts/restore.js [file-backup.json]
// Tanpa argumen: otomatis pakai backup TERBARU di folder backups/.
// PERINGATAN: menimpa seluruh data yang ada sekarang di database.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BACKUP_DIR = path.join(ROOT, 'backups');

function loadEnvLocal() {
  const lines = fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)="?(.*?)"?$/);
    if (m) process.env[m[1]] = m[2];
  }
}

(async () => {
  let file = process.argv[2];
  if (!file) {
    const all = fs
      .readdirSync(BACKUP_DIR)
      .filter((f) => /^kas-negara-\d{4}-\d{2}-\d{2}-.*\.json$/.test(f))
      .sort();
    if (!all.length) throw new Error('Tidak ada file backup di ' + BACKUP_DIR);
    file = path.join(BACKUP_DIR, all[all.length - 1]);
  }
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (data.app !== 'kas-negara' || !data.tables) throw new Error('File bukan backup Kas Negara yang valid: ' + file);

  loadEnvLocal();
  const { neon } = require('@neondatabase/serverless');
  const sql = neon(process.env.DATABASE_URL);

  await sql.query('TRUNCATE transactions, categories, users');

  const cols = {
    users: ['id', 'name', 'email', 'password_hash', 'created_at'],
    categories: ['id', 'user_id', 'name', 'type', 'monthly_budget', 'created_at'],
    transactions: ['id', 'user_id', 'category_id', 'type', 'amount', 'note', 'tx_date', 'created_at'],
  };
  const counts = {};
  for (const [table, c] of Object.entries(cols)) {
    const rows = data.tables[table] || [];
    counts[table] = rows.length;
    for (let i = 0; i < rows.length; i += 200) {
      const chunk = rows.slice(i, i + 200);
      const ph = chunk
        .map((_, r) => '(' + c.map((_, k) => `$${r * c.length + k + 1}`).join(',') + ')')
        .join(',');
      await sql.query(`INSERT INTO ${table} (${c.join(',')}) VALUES ${ph}`, chunk.flatMap((r) => c.map((k) => r[k])));
    }
  }
  console.log(
    `OK restore dari ${file}: users=${counts.users} kategori=${counts.categories} transaksi=${counts.transactions}`
  );
})().catch((e) => {
  console.error('RESTORE GAGAL:', e.message);
  process.exit(1);
});
