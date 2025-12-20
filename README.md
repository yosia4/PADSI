# PADSI – Sistem Manajemen Jambar Jabu

Repositori frontend Next.js untuk panel internal SMJJ.

## SKPL-SMJ-001 — Autentikasi
Test case berikut dirancang berdasarkan SKPL Bab 4.1.1 Use Case Spesification (Autentikasi). Setiap skenario juga tersedia sebagai skrip Cypress (lihat folder `../cypress/e2e`).

| TC ID | Jenis | Tujuan | Alur Singkat | Hasil yang Diharapkan |
| ----- | ----- | ------ | ------------ | --------------------- |
| TC_login-owner_positif | Positif | Owner berhasil login | Pilih peran Owner → masukkan email/password Owner valid → klik Masuk | Dialihkan ke `/dashboard` tanpa pesan error |
| TC_login-pegawai_positif | Positif | Pegawai berhasil login sesuai hak akses | Pilih peran Pegawai → masukkan kredensial Pegawai valid → klik Masuk | Dialihkan ke `/dashboard` tanpa pesan error |
| TC_login-email-tidak-terdaftar_negatif | Negatif | Menolak email yang tidak terdaftar | Pilih peran Owner → masukkan email tidak terdaftar + password valid → klik Masuk | Tetap di `/login` dengan query `error=email_invalid` dan pesan “Email tidak ditemukan.” |
| TC_login-password-salah_negatif | Negatif | Menolak password salah | Pilih peran Pegawai → masukkan email Pegawai valid + password salah → klik Masuk | Tetap di `/login` dengan query `error=password_invalid` dan pesan “Password tidak sesuai.” |
| TC_login-email-kosong_negatif | Negatif | Validasi kolom email wajib isi | Pilih peran Owner → biarkan email kosong → isi password valid → klik Masuk | Tetap di `/login` dengan query `error=email_empty` dan pesan “Email wajib diisi.” |
| TC_login-password-kosong_negatif | Negatif | Validasi kolom password wajib isi | Pilih peran Owner → isi email valid → biarkan password kosong → klik Masuk | Tetap di `/login` dengan query `error=password_empty` dan pesan “Password wajib diisi.” |

## Menjalankan Test Otomatis
Di root proyek utama:

```bash
npm install
npm run cypress:open -- --env VERCEL_BYPASS_TOKEN=<token dari Vercel>
```

Cypress akan mengeksekusi setiap file TC di `cypress/e2e/` sesuai tabel di atas.
