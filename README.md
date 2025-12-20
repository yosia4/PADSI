# PADSI – Sistem Manajemen Jambar Jabu

Repositori frontend Next.js untuk panel internal SMJJ. Seluruh test case otomatis ditempatkan di `cypress/e2e`.

## SKPL-SMJ-001 — Autentikasi

| TC ID | Jenis | Tujuan | Alur Singkat | Hasil yang Diharapkan |
| ----- | ----- | ------ | ------------ | --------------------- |
| TC_login-owner_positif | Positif | Owner berhasil login | Pilih peran Owner → masukkan email/password Owner valid → klik Masuk | Dialihkan ke `/dashboard` tanpa pesan error |
| TC_login-pegawai_positif | Positif | Pegawai berhasil login sesuai hak akses | Pilih peran Pegawai → masukkan kredensial Pegawai valid → klik Masuk | Dialihkan ke `/dashboard` tanpa pesan error |
| TC_login-email-tidak-terdaftar_negatif | Negatif | Menolak email yang tidak terdaftar | Pilih peran Owner → masukkan email tidak terdaftar + password valid → klik Masuk | Tetap di `/login` dengan query `error=email_invalid` dan pesan “Akun tidak ditemukan.” |
| TC_login-password-salah_negatif | Negatif | Menolak password salah | Pilih peran Pegawai → masukkan email Pegawai valid + password salah → klik Masuk | Tetap di `/login` dengan query `error=password_invalid` dan pesan “Password yang dimasukkan salah.” |
| TC_login-email-kosong_negatif | Negatif | Validasi kolom email wajib isi | Pilih peran Owner → biarkan email kosong → isi password valid → klik Masuk | Tetap di `/login` dengan query `error=email_empty` dan pesan “Email wajib diisi.” |
| TC_login-password-kosong_negatif | Negatif | Validasi kolom password wajib isi | Pilih peran Owner → isi email valid → biarkan password kosong → klik Masuk | Tetap di `/login` dengan query `error=password_empty` dan pesan “Password wajib diisi.” |
| TC_login-email-dan-password-kosong_negatif | Negatif | Validasi peringatan SKPL saat form kosong | Pilih peran Owner → biarkan email dan password kosong → klik Masuk | Tetap di `/login` dengan query `error=credentials_empty` dan pesan “Email dan password belum diisi.” |

## SKPL-SMJ-002 — Kelola Pelanggan

| TC ID | Jenis | Tujuan | Alur Singkat | Hasil yang Diharapkan |
| ----- | ----- | ------ | ------------ | --------------------- |
| TC_kelola-pelanggan-lihat-daftar_positif | Positif | Menampilkan menu kelola pelanggan lengkap | Login Owner → buka menu Pelanggan → lihat form tambah dan tabel aksi | Form tambah + tabel daftar pelanggan tampil dengan aksi Edit/Tukar/Hapus |
| TC_kelola-pelanggan-tambah-berhasil_positif | Positif | Menambah pelanggan baru | Isi form nama/email/telepon valid → klik Tambah | Status “Pelanggan berhasil ditambahkan.” dan data muncul di tabel |
| TC_kelola-pelanggan-ubah-berhasil_positif | Positif | Mengubah data pelanggan | Pilih pelanggan → klik Edit → ubah data → Simpan | Kembali ke daftar dengan data pelanggan terbaru |
| TC_kelola-pelanggan-hapus-berhasil_positif | Positif | Menghapus pelanggan | Pilih pelanggan → klik Hapus → konfirmasi dialog | Pesan “Data pelanggan terhapus.” dan baris hilang dari tabel |
| TC_kelola-pelanggan-tambah-data-kosong_negatif | Negatif | Error Flow E-1: data belum diisi | Isi form dengan nama kosong → klik Tambah | Pesan merah “Nama pelanggan wajib diisi.” muncul dan data tidak tersimpan |
| TC_kelola-pelanggan-tambah-telepon-duplikat_negatif | Negatif | Alternative Flow A-1: data sudah ada | Tambah pelanggan dengan telepon yang sudah terdaftar | Pesan merah “Nomor telepon sudah terdaftar.”, data baru tidak ditampilkan |

## SKPL-SMJJ-001 — Kelola Menu Favorit

| TC ID | Jenis | Tujuan | Alur Singkat | Hasil yang Diharapkan |
| ----- | ----- | ------ | ------------ | --------------------- |
| TC_menu-favorit-lihat-daftar_positif | Positif | Menampilkan form dan daftar menu favorit | Login Owner → buka menu → lihat form tambah & kartu menu | Form tambah aktif, kartu menu menampilkan aksi Edit/Hapus |
| TC_menu-favorit-tambah-berhasil_positif | Positif | Menambah menu favorit baru | Isi nama/harga/rating/gambar → klik Tambah | Status “Menu berhasil ditambahkan.” dan kartu muncul |
| TC_menu-favorit-ubah-berhasil_positif | Positif | Memperbarui menu | Pilih menu → Edit → ubah data → Simpan | Kembali ke daftar dengan nama/harga terbaru |
| TC_menu-favorit-hapus-berhasil_positif | Positif | Menghapus menu favorit | Pilih menu → klik Hapus → konfirmasi | Status “Menu berhasil dihapus.” dan kartu hilang |
| TC_menu-favorit-hapus-batal_alternatif | Alternatif | Membatalkan penghapusan | Klik Hapus → dialog → pilih Batal | Menu tetap ada, tidak ada status hapus |
| TC_menu-favorit-cari-tidak-ditemukan_alternatif | Alternatif | Menangani pencarian kosong | Isi kotak cari dengan teks acak | Pesan “Menu favorit tidak ditemukan.” tampil |
| TC_menu-favorit-tambah-data-kosong_negatif | Negatif | Error Flow E-1 (data tidak lengkap) | Isi nama spasi dan harga 0 → klik Tambah | Pesan merah “Data belum lengkap.”, menu tidak tersimpan |

## SKPL-SMJJ-001 — Kelola Riwayat Kunjungan

| TC ID | Jenis | Tujuan | Alur Singkat | Hasil yang Diharapkan |
| ----- | ----- | ------ | ------------ | --------------------- |
| TC_riwayat-lihat-daftar_positif | Positif | Menampilkan daftar riwayat aktif | Login Owner → buka menu Riwayat → lihat tabel | Tabel riwayat dan tombol Cari/Hapus tersedia |
| TC_riwayat-tambah-otomatis_positif | Positif | Sistem mencatat transaksi baru | Simulasikan transaksi pelanggan → buka Riwayat | Baris baru (ID kunjungan) muncul di tabel |
| TC_riwayat-hapus-berhasil_positif | Positif | Menghapus riwayat tertentu | Klik Hapus pada baris kunjungan → konfirmasi | Pesan “Riwayat kunjungan terhapus.” dan baris hilang |
| TC_riwayat-hapus-batal_alternatif | Alternatif | Pembatalan hapus | Klik Hapus → pilih Batal | Data tetap ada, tidak ada toast terhapus |
| TC_riwayat-cari-tidak-ditemukan_alternatif | Alternatif | Penanganan pencarian kosong | Isi kata kunci random → klik Cari | Tabel menampilkan pesan “Belum ada riwayat kunjungan.” |
| TC_riwayat-tambah-data-invalid_negatif | Negatif | Error Flow (data tidak valid/pelanggan tidak ada) | Kirim API dengan customer_id salah atau total 0 | Respon JSON error “Data pelanggan tidak ditemukan.” / “Data kunjungan tidak valid.” |

## SKPL-SMJJ-001 — Kelola Poin Reward

| TC ID | Jenis | Tujuan | Alur Singkat | Hasil yang Diharapkan |
| ----- | ----- | ------ | ------------ | --------------------- |
| TC_reward-lihat-total-poin_positif | Positif | Menampilkan total poin pelanggan | Login Owner → buka `/reward?customer_id=...` | Kartu pelanggan tampil dengan total poin |
| TC_reward-tambah-poin-otomatis_positif | Positif | Menambah poin melalui transaksi | Panggil API tambah poin → buka halaman reward | Baris transaksi baru muncul di tabel |
| TC_reward-redeem-berhasil_positif | Positif | Proses penukaran berhasil | Pilih preset tukar → konfirmasi | Pesan sukses dan poin berkurang |
| TC_reward-belum-punya-poin_alternatif | Alternatif | Menangani pelanggan tanpa poin | Set poin 0 → buka halaman reward | Muncul pesan “Belum ada poin yang dimiliki.” |
| TC_reward-redeem-batal_alternatif | Alternatif | Pembatalan penukaran | Klik Tukar → dialog → pilih Batal | Tidak ada pengurangan poin/pesan sukses |
| TC_reward-redeem-poin-tidak-cukup_negatif | Negatif | Poin tidak mencukupi | Set poin < paket → coba tukar | Pesan “Poin tidak cukup untuk reward ini.” |
| TC_reward-customer-tidak-ditemukan_negatif | Negatif | Data pelanggan tak ditemukan | Panggil API `/api/rewards` dengan ID salah | Respon 404 “Data pelanggan tidak ditemukan.” |

## SKPL-SPRJJ-001 — Kelola Laporan

| TC ID | Jenis | Tujuan | Alur Singkat | Hasil yang Diharapkan |
| ----- | ----- | ------ | ------------ | --------------------- |
| TC_laporan-tampilkan-ringkasan_positif | Positif | Menampilkan KPI laporan | Login Owner → buka `/laporan` | Kartu KPI, grafik, dan tombol ekspor terlihat |
| TC_laporan-data-kosong_alternatif | Alternatif | Tampilkan pesan tidak ada data | Buka `/laporan?mock=empty` | Pesan “Belum ada data yang tersedia.” muncul |
| TC_laporan-data-gagal_dimuat_negatif | Negatif | Menangani koneksi gagal | Buka `/laporan?mock=error` | Pesan “Data laporan gagal dimuat.” tampil |

## Contoh Detail Test Case

**Test Case 1: Login Owner Berhasil**

- **ID Test Case:** TC_login-owner_positif  
- **Deskripsi:** Memastikan Owner dapat mengisi dan mengirim form login untuk mengakses dashboard SMJJ.
- **Langkah-langkah:**
  1. Kunjungi halaman utama aplikasi (otomatis diarahkan ke `/login`).
  2. Klik tombol role `Owner`.
  3. Isi field `Email` dengan `owner@padsi.com`.
  4. Isi field `Password` dengan `owner123`.
  5. Klik tombol `Masuk`.
  6. Verifikasi halaman dialihkan ke `/dashboard` dan kartu ringkasan KPI tampil.
- **Hasil yang Diharapkan:** Pengguna berhasil masuk tanpa pesan error, dan dapat melihat dashboard utama dengan menu navigasi SMJJ.

## Menjalankan Test Otomatis

```bash
npm install
npm run cypress:open -- --env VERCEL_BYPASS_TOKEN=<token vercel>
```

Cypress akan mengeksekusi setiap file TC di `cypress/e2e/` sesuai tabel di atas.
