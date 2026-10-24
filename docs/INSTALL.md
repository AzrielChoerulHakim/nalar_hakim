# Pengelolaan situs dan pemasangan

## Situs statis di GitHub Pages

GitHub Pages menggunakan branch `main`, folder akar repository. `index.html` adalah landing page dan `beranda.html` adalah ruang baca. `.nojekyll` menjaga berkas HTML disajikan sebagai situs statis. Situs ini tidak menjalankan WordPress dan tidak memiliki panel admin.

Lima artikel lengkap disimpan dalam `content/*.json`, satu berkas per kanal. Sunting isi, metadata dan sumber pada berkas tersebut. Gunakan tiga butir ringkasan, tanggal berformat `YYYY-MM-DD`, subjudul `h2`, serta penanda rujukan yang cocok dengan ID di `sources`. Byline publik dihasilkan sebagai Lazarus.

Sebelum publikasi, buka setiap sumber primer dan pastikan bagian yang dirujuk mendukung klaim; periksa perubahan ketentuan serta tanggal pembaruan artikel. Pakai tautan ke dokumen atau halaman spesifik. Pemeriksaan otomatis memvalidasi struktur dan tautan lokal, bukan kebenaran kesimpulan hukum atau ketersediaan sumber eksternal.

Dari akar repository, jalankan:

```sh
python3 scripts/build-preview.py
python3 scripts/check-preview.py
node --check preview/search.js
node --check preview/motion.js
```

Generator membuat halaman, daftar isi, daftar rujukan, indeks pencarian isi artikel dan `sitemap.xml`. Commit sumber dan seluruh hasil generator bersama. Jangan menyunting HTML hasil generator secara langsung. Pertahankan pengalihan alamat lama dalam generator saat mengganti slug. Pemuat saat ini menggunakan satu artikel per kanal; menambah jumlah artikel memerlukan penyesuaian pemuat `scripts/articles.py`.

Sebelum menganggap perubahan sudah tayang, periksa hasil workflow **Theme checks** dan deployment GitHub Pages untuk commit tersebut. Cek alur landing → ruang baca → artikel, pencarian kata dalam isi artikel, daftar isi, rujukan, mode terang/gelap dan panel donasi. Periksa HP tanpa gerak, desktop dengan animasi terbatas, serta preferensi pengurangan gerak.

## WordPress di VPS — tahap berikutnya

Pemasangan sengaja ditunda. Paket dasar telah dipasang di **OpenCloudOS 9.6**: **Nginx 1.29.8**, **PHP 8.3.36** dan **MariaDB 10.11.19**, sesuai log pemasangan pemilik. Konfigurasi situs dan pemasangan WordPress belum dilakukan. Tema belum setara dengan seluruh fitur situs statis, dan artikel JSON tidak diimpor otomatis.

Server memiliki 2 vCPU, RAM 4 GB dan SSD 60 GB. Saat tahap VPS dilanjutkan, konfigurasi Nginx, PHP-FPM beserta ekstensi WordPress, database lokal, DNS dan HTTPS; kemudian instal WordPress dari sumber resmi. Kapasitas nyata perlu diuji sesuai trafik dan konten. Dokumen ini tidak menjalankan pemasangan otomatis.

Jangan mengirim password, private key atau isi `wp-config.php` melalui chat/GitHub.

## Pasang tema

1. Jalankan `python3 scripts/package.py` pada checkout kode.
2. Login WordPress → Tampilan → Tema → Tambah Tema → Unggah Tema.
3. Unggah `dist/nalar-hakim.zip`, lalu aktifkan **Nalar Hakim**.
4. Setel nama situs Nalar Hakim dan tagline Media Hukum & Gagasan.
5. Setel zona waktu Jakarta dan permalink Nama tulisan; simpan.
6. Setel nama tampilan/nickname penulis **Lazarus** dan slug publik yang tidak mengandung nama asli.
7. Periksa lima kategori yang dibuat pada aktivasi tema. Artikel lama tidak dipindah/dihapus otomatis.
8. Tulis atau pindahkan artikel melalui editor WordPress, pilih kanal, isi ringkasan, periksa rujukan, pratinjau, lalu terbitkan.

Beranda awal tema menampilkan artikel terbaru sebagai utama. Tema tidak membuat artikel secara otomatis. Fitur editor bawaan WordPress tetap digunakan.

## Memperbarui tema dan meluncurkan WordPress

Buat ZIP baru dari commit yang sudah ditinjau dan unggah dari dashboard. WordPress akan meminta konfirmasi penggantian versi tema yang sama. Pembaruan tema tidak perlu menyertakan database atau unggahan. Cadangan dikelola pemilik sendiri.

Selesaikan `ACCEPTANCE.md`, hapus konten bawaan WordPress yang tidak dipakai secara manual, isi informasi situs, dan pastikan indeks mesin pencari tidak diblokir setelah siap. Tidak ada kode yang mengubah firewall, kredensial atau server aktif dalam paket ini.
