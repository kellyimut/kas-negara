// Backup harian database Kas Negara (Neon Postgres) ke file JSON lokal.
// Pakai: node scripts/backup.js
// Dipanggil otomatis tiap hari oleh cron Hermes (lihat kas-negara-backup.sh).
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BACKUP_DIR = path.join(ROOT, 'backups');
const KEEP = 30; // retensi: simpan 30 backup terbaru

function loadEnvLocal() {
  const lines = fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)="?(.*?)"?$/);
    if (m) process.env[m[1]] = m[2];
  }
}

// Timestamp waktu lokal (WIB) agar nama file mudah dibaca: 2026-09-19-21-00-00
function stampLocal(d = new Date()) {
  const t = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return t.toISOString().replace(/[:T]/g, '-').slice(0, 19);
}

(async () => {
  loadEnvLocal();
  const { neon } = require('@neondatabase/serverless');
  const sql = neon(process.env.DATABASE_URL);

  const users = await sql`SELECT id, name, email, password_hash, created_at FROM users ORDER BY created_at`;
  const categories = await sql`SELECT id, user_id, name, type, monthly_budget, created_at FROM categories ORDER BY created_at`;
  const transactions = await sql`SELECT id, user_id, category_id, type, amount, note, to_char(tx_date,'YYYY-MM-DD') AS tx_date, created_at FROM transactions ORDER BY created_at`;

  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const file = path.join(BACKUP_DIR, `kas-negara-${stampLocal()}.json`);
  fs.writeFileSync(
    file,
    JSON.stringify(
      { app: 'kas-negara', generated_at: new Date().toISOString(), tables: { users, categories, transactions } },
      null,
      1
    ),
    'utf8'
  );

  // Rotasi: hapus backup paling lama melebihi KEEP
  const all = fs
    .readdirSync(BACKUP_DIR)
    .filter((f) => /^kas-negara-\d{4}-\d{2}-\d{2}-.*\.json$/.test(f))
    .sort();
  let removed = 0;
  while (all.length > KEEP) {
    fs.unlinkSync(path.join(BACKUP_DIR, all.shift()));
    removed++;
  }

  console.log(
    `OK backup Kas Negara: users=${users.length} kategori=${categories.length} transaksi=${transactions.length} file=${file}` +
      (removed ? ` (rotasi: hapus ${removed} backup lama)` : '')
  );
})().catch((e) => {
  console.error('BACKUP GAGAL:', e.message);
  process.exit(1);
});
