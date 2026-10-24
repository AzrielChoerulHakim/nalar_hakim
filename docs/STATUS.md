# Status pengembangan Nalar Hakim

Situs statis dan fondasi tema WordPress tersedia. WordPress belum dipasang atau diuji dengan database hidup; konfigurasi dan deployment VPS sengaja ditunda.

## Implementasi saat ini

- `index.html` menjadi landing page; `beranda.html` menjadi ruang baca dengan lima kanal.
- Lima artikel lengkap dengan sumber primer disimpan di `content/*.json`. Artikel menampilkan byline Lazarus, label jenis tulisan, ringkasan, tanggal, daftar isi, penanda rujukan dan daftar sumber.
- Generator menghasilkan 21 halaman HTML, termasuk enam pengalihan alamat artikel lama, serta indeks pencarian dan `sitemap.xml`. Pencarian mencakup isi artikel.
- Desain editorial datar memakai tipografi besar, bidang warna solid dan sampul SVG dua dimensi. Tidak memakai library frontend, font eksternal, 3D atau WebGL.
- Animasi pembuka singkat dan jaringan sinyal SVG 2D hanya aktif pada layar minimal 1000 px dengan hover dan penunjuk presisi, ketika pengguna tidak meminta pengurangan gerak. Sembilan sinyal bergerak di belakang wordmark; tombol jeda, visibilitas halaman, dan posisi hero mengendalikan geraknya. HP menampilkan garis statis.
- Masthead desktop diringkas menjadi 80 px dengan enam kanal dalam kolom seimbang setinggi minimal 46 px. Di layar kecil, tab dapat digeser dan tombol tetap minimal 44 px.
- Penyuntingan situs statis melalui JSON dan generator, tanpa database atau panel admin. Artikel tidak diimpor otomatis ke WordPress.
- Identitas visual dan fitur situs statis belum dipindahkan seluruhnya ke tema WordPress.

## Pemeriksaan dan publikasi

Generator memvalidasi kelengkapan struktur artikel, tanggal, ID dan kecocokan penanda dengan daftar sumber. Pemeriksa halaman memeriksa tautan lokal, aset serta tujuan anchor. Kesesuaian sumber dengan klaim hukum tetap memerlukan tinjauan editorial terhadap dokumen aslinya.

CI mencakup lint PHP, pemeriksaan sintaks JavaScript termasuk animasi, pembuatan ZIP tema, pembuatan ulang halaman, pemeriksaan tautan dan perbandingan hasil generator termasuk sitemap. Lint PHP dengan PHP nyata, Theme checks dan deployment GitHub Pages telah berhasil pada revisi sebelumnya; itu belum membuktikan integrasi WordPress berfungsi.

Pemeriksaan browser revisi ini mencakup landing, ruang baca, pembuka dan isi artikel, pencarian isi/hasil kosong, daftar isi, rujukan/tautan kembali, mode terang/gelap, dan pengalihan alamat lama. Landing serta ruang baca diperiksa pada lebar 320/360/390/768 px; artikel dengan judul terpanjang diperiksa pada 320/360/390 px, tanpa luapan horizontal halaman. Animasi aktif di desktop dan selesai tanpa sisa pemotongan judul; layar kecil tetap statis. Pemeriksaan lokal lulus untuk 21 halaman dan 574 tautan lokal/aset/anchor.

Revisi jaringan dan navigasi diperiksa pada lebar 320/390/768/960/1366/1920 px; tidak ada luapan horizontal halaman. Panel pencarian tetap berada dalam layar 320/390 px. Jeda/lanjutkan dan jeda saat hero keluar layar diperiksa pada browser. Empat belas pemeriksaan siklus animasi juga lulus untuk preferensi gerak, pointer, visibilitas, pergantian observer, dan bfcache.

Landing beserta seluruh CSS dan JavaScript yang dimuat berjumlah sekitar 74 KB sebelum kompresi (perkiraan gzip sekitar 20 KB), tanpa font eksternal. Ini ukuran berkas, bukan hasil pengukuran Core Web Vitals. Hasil CI serta deployment commit ini tersedia di tab Actions; metrik performa lapangan belum diukur.

QR telah didekode dan cocok dengan alamat donasi. Penyalinan pada HTTPS pernah diperiksa pada revisi sebelumnya; tersedia petunjuk salin manual bila clipboard tidak tersedia.

## VPS dan pekerjaan tersisa

OS **OpenCloudOS 9.6** sudah dikonfirmasi, dengan paket **Nginx 1.29.8**, **PHP 8.3.36** dan **MariaDB 10.11.19** terpasang. Konfigurasi situs dan pemasangan WordPress belum selesai.

Saat pemasangan WordPress dilanjutkan, terapkan fitur yang belum setara dan jalankan `ACCEPTANCE.md`. Editor, publikasi, pagination, identitas publik dan performa WordPress masih perlu diuji pada instalasi nyata. Hasil build dan deployment setiap revisi tersedia pada GitHub Actions.
