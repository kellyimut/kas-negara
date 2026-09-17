// One-off: buat akun utama "kelly" (login: kelly / Bismillah) + seed kategori,
// lalu hapus akun test e2e_* beserta datanya.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function loadEnvLocal() {
  const lines = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)="?(.*?)"?$/);
    if (m) process.env[m[1]] = m[2];
  }
}

loadEnvLocal();

const { neon } = require('@neondatabase/serverless');

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

(async () => {
  const sql = neon(process.env.DATABASE_URL);

  // 1. Hapus akun test lama (cascade: transaksi + kategori ikut terhapus)
  const del = await sql`DELETE FROM users WHERE email IN ('e2e_ayah@test.local', 'e2e_ibu@test.local') RETURNING email`;
  console.log('Akun test dihapus:', del.map((r) => r.email).join(', ') || '(tidak ada)');

  // 2. Buat akun kelly (idempoten: hapus dulu jika sudah ada)
  await sql`DELETE FROM users WHERE email = 'kelly'`;
  const hash = hashPassword('Bismillah');
  const u = await sql`INSERT INTO users (name, email, password_hash) VALUES ('Kelly', 'kelly', ${hash}) RETURNING id`;
  const userId = u[0].id;
  console.log('Akun kelly dibuat, id:', userId);

  // 3. Seed kategori default (sama dengan registerAction)
  await sql`
    INSERT INTO categories (user_id, name, type, monthly_budget) VALUES
      (${userId}, 'Gaji', 'income', 0),
      (${userId}, 'Bonus', 'income', 0),
      (${userId}, 'Lainnya (masuk)', 'income', 0),
      (${userId}, 'Makanan', 'expense', 1500000),
      (${userId}, 'Transportasi', 'expense', 500000),
      (${userId}, 'Belanja', 'expense', 750000),
      (${userId}, 'Tagihan', 'expense', 1000000),
      (${userId}, 'Hiburan', 'expense', 400000),
      (${userId}, 'Kesehatan', 'expense', 300000),
      (${userId}, 'Lainnya (keluar)', 'expense', 300000)`;
  console.log('Kategori default ter-seed (10 kategori)');

  // 4. Verifikasi
  const users = await sql`SELECT email, name FROM users`;
  console.log('User sekarang:', JSON.stringify(users));
})().catch((e) => {
  console.error('ERROR:', e.message);
  process.exit(1);
});
