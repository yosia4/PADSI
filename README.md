# PADSI KEOS (Next.js 14 App Router)

Tanpa Prisma, tanpa NextAuth. Koneksi langsung ke Neon PostgreSQL (pg). Login manual + cookie session.
Role: OWNER/PEGAWAI. Semua modul dikelola Owner & Pegawai, **kecuali Laporan hanya Owner**.

## Setup
1. Install deps:
   ```bash
   npm i
   ```
2. Buat `.env` dari `.env.example` dan isi `DATABASE_URL` sesuai Neon kamu.
3. Inisialisasi DB:
   ```bash
   npm run db:init
   npm run db:seed
   ```
4. Jalankan dev:
   ```bash
   npm run dev
   ```

### Login akun contoh
- Owner: `owner@padsi.com` / `owner123`
- Pegawai: `pegawai@padsi.com` / `pegawai123`

### Halaman
- `/login` — tampilan merah (gambar `public/login-image.jpg` isi sendiri)
- `/dashboard`
- `/pelanggan`
- `/menu`
- `/riwayat`
- `/reward`
- `/laporan` (OWNER only)
# PADSI-KEOS
# PADSI
