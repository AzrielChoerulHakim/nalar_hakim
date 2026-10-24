# Pemasangan singkat

## Yang masih diperlukan

1. Nama/versi OS setelah reset VPS.
2. Domain yang dipakai, atau keputusan menunda domain hingga pratinjau selesai.

Jangan mengirim password, private key, atau isi `wp-config.php` melalui chat/GitHub.

## Fondasi server

Server: 2 vCPU, RAM 4 GB, SSD 60 GB. Tidak memerlukan pembelian VPS baru untuk tahap awal; kapasitas nyata perlu diuji sesuai trafik dan konten.

Setelah OS diketahui, pasang Nginx, PHP-FPM beserta ekstensi yang diperlukan WordPress, dan MariaDB. Database hanya lokal. Arahkan DNS ke server, aktifkan HTTPS, dan instal WordPress dari sumber resmi. Langkah perintah disesuaikan OS; dokumen ini tidak menjalankan pemasangan otomatis.

## Pasang tema

1. Jalankan `python3 scripts/package.py` pada checkout kode.
2. Login WordPress → Tampilan → Tema → Tambah Tema → Unggah Tema.
3. Unggah `dist/nalar-hakim.zip`, lalu aktifkan **Nalar Hakim**.
4. Setel nama situs Nalar Hakim dan tagline Media Hukum & Gagasan.
5. Setel zona waktu Jakarta dan permalink Nama tulisan; simpan.
6. Setel nama tampilan/nickname penulis **Lazarus** dan slug publik yang tidak mengandung nama asli.
7. Periksa lima kategori yang dibuat pada aktivasi tema. Artikel lama tidak dipindah/dihapus otomatis.
8. Tulis artikel, pilih satu kanal, unggah gambar bersih dari identitas pribadi, isi ringkasan, pratinjau, terbitkan.

Beranda awal menampilkan artikel terbaru sebagai utama. Tidak ada artikel contoh yang dibuat otomatis. Fitur editor bawaan WordPress tetap digunakan.

## Memperbarui tema

Buat ZIP baru dari commit yang sudah ditinjau dan unggah dari dashboard. WordPress akan meminta konfirmasi penggantian versi tema yang sama. Pembaruan tema tidak perlu menyertakan database atau unggahan. Cadangan sebelum perubahan dikelola pemilik sendiri.

## Sebelum publik

Selesaikan daftar `ACCEPTANCE.md`, hapus konten bawaan WordPress yang tidak dipakai secara manual, isi informasi situs, dan pastikan indeks mesin pencari tidak diblokir setelah siap. Tidak ada kode yang mengubah firewall, kredensial atau server aktif dalam paket ini.
