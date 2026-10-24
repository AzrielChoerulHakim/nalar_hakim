# Nalar Hakim

Tema WordPress khusus untuk portal hukum beridentitas Web3 yang mengutamakan pembaca HP.

**Status: fondasi pengembangan 0.1.0. Belum dipasang di VPS dan belum diuji menyeluruh pada WordPress hidup.**

## Ruang lingkup

- Beranda editorial, lima kanal, halaman artikel, pencarian dan halaman biasa.
- Semua byline publik menggunakan **Lazarus**.
- Kontak publik: **nalar.hakim77@gmail.com**.
- Donasi manual **Ethereum Mainnet**, tanpa koneksi wallet atau pengiriman transaksi.
- Alamat: `0x39fbbC339D69ae2F8B671f7fE1D356086137e2bE`.
- Konten dikelola sendiri di editor WordPress. Tidak ada AI, langganan, akun pembaca, forum, atau layanan backup otomatis.

## Isi repository

- `theme/nalar-hakim/`: tema yang dipasang ke WordPress.
- `scripts/package.py`: menghasilkan ZIP tema untuk unggah dari dashboard.
- `scripts/preflight.sh`: pemeriksaan server baca-saja, tidak memasang atau menghapus apa pun.
- `docs/INSTALL.md`: panduan singkat pemasangan.
- `docs/ACCEPTANCE.md`: pemeriksaan sebelum peluncuran.

## Membuat ZIP tema

Jalankan dari akar repo dengan Python 3:

```sh
python3 scripts/package.py
```

Unggah `dist/nalar-hakim.zip` melalui **Tampilan → Tema → Tambah Tema → Unggah Tema**.

## Desain

Struktur editorial terinspirasi Solana News, garis dan ruang dari Monad, keterbacaan dari Ethereum. Implementasi, wordmark dan komponen ditulis khusus untuk Nalar Hakim. Tidak menyertakan logo, ilustrasi atau kode situs referensi.

Palet: arang `#0D0D12`, permukaan `#181821`, putih tulang `#F4F1EA`, violet `#A594FF`, mint `#86E8CB`. Sistem font lokal perangkat; tidak mengunduh webfont. CSS dan JavaScript lokal; tidak ada library frontend eksternal.

## Konten dan identitas

Gunakan nama tampilan akun **Lazarus**, nickname dan slug penulis yang tidak mengandung nama asli. Tema menyamarkan byline dan membatasi beberapa jalur publik penulis, tetapi tidak dapat menjamin anonimitas di plugin pihak ketiga, metadata gambar/PDF, nama berkas, atau teks yang diunggah. Periksa hasil sebelum publikasi. Email kontak memang dimaksudkan untuk tampil publik.

QR dari pengguna sudah didekode dan cocok persis dengan alamat di atas. QR menyimpan alamat mentah; pemilihan jaringan tetap dilakukan pengirim. Karena itu label Ethereum Mainnet selalu ditampilkan bersama QR.

## Penyimpanan

Repository hanya memuat kode tema dan dokumentasi. Artikel, akun, database, gambar unggahan, `wp-config.php`, kredensial, dan kunci privat tetap di luar Git. Backup dikelola sendiri oleh pemilik.

## Acuan teknis

- https://wordpress.org/about/requirements/
- https://developer.wordpress.org/themes/
- https://developer.wordpress.org/cli/commands/theme/install/

Versi layanan server ditentukan setelah OS hasil reset dikonfirmasi. Target lingkungan: PHP 8.3+, MariaDB 10.11+ atau MySQL 8.0+, HTTPS, sesuai rekomendasi WordPress yang ditinjau saat persiapan.
