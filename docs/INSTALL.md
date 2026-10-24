# Pemasangan singkat

## Pratinjau GitHub Pages

Pratinjau statis tersedia langsung dari branch `main`, folder akar repository. `index.html` adalah halaman utama; `.nojekyll` menjaga berkas HTML disajikan sebagai situs statis. Tidak memerlukan VPS atau domain sendiri untuk melihat desain.

Setelah mengubah sumber pratinjau, jalankan `python3 scripts/build-preview.py` lalu commit sumber dan hasilnya. Pratinjau tidak menjalankan WordPress dan tidak memiliki panel admin; tulisan contoh tidak dimasukkan ke database.

## WordPress di VPS — tahap berikutnya

Pemasangan ini ditunda sementara. Paket dasar telah dipasang di OpenCloudOS 9.6 oleh pemilik: Nginx 1.29.8, PHP 8.3.36 dan MariaDB 10.11.19, sesuai log pemasangan yang diberikan. Konfigurasi situs dan pemasangan WordPress belum dilakukan.

## Yang masih diperlukan

1. Keputusan untuk melanjutkan pemasangan WordPress.
2. Domain yang dipakai ketika situs siap dipublikasikan dari VPS.

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
