# Status pengembangan Nalar Hakim

Pratinjau statis dan fondasi tema WordPress tersedia. WordPress belum dipasang atau diuji dengan database hidup; konfigurasi dan deployment VPS sengaja ditunda.

## Versi landing dan ruang baca

- `index.html` menjadi halaman pembuka; `beranda.html` menjadi ruang baca. Pratinjau juga memuat lima kanal, enam tulisan contoh, pencarian, Tentang dan halaman 404.
- Tiga fitur bacaan telah diterapkan pada pratinjau statis: label jenis tulisan (Berita, Analisis, Opini, Panduan), penanda serta daftar rujukan, dan daftar isi untuk tulisan dengan sedikitnya tiga bagian.
- Generator menghasilkan 16 halaman. Pemeriksaan menemukan seluruh 506 tautan lokal, aset dan tujuan anchor yang diperiksa.
- Pemeriksaan browser berhasil untuk alur landing → ruang baca → artikel, pencarian jenis tulisan, loncatan daftar isi, rujukan dan tautan kembali. Landing dan halaman baca yang diuji pada lebar 360/390 px tidak meluber horizontal; mode terang/gelap landing juga diperiksa. Kesetaraan tiga fitur tersebut pada tema WordPress belum diterapkan.

Tulisan contoh selalu diberi label. Tautan rujukannya memperagakan navigasi ke portal resmi, bukan sumber pembuktian suatu peristiwa atau analisis hukum nyata. Pratinjau tidak memakai database atau panel admin dan tidak membuat artikel contoh di WordPress.

## Hasil pemeriksaan sebelumnya

- GitHub Actions **Theme checks** dan deployment **GitHub Pages** berhasil untuk commit `0b46f6574e2197669fe0bfab002fa5b0509428de`. Keberhasilan ini berlaku untuk revisi tersebut, bukan perubahan lokal terbaru.
- Lint PHP dijalankan dengan PHP nyata di CI dan berhasil; pemeriksaan JavaScript serta pembuatan ZIP tema juga berhasil. Ini belum membuktikan integrasi WordPress berfungsi.
- Pada pratinjau sebelumnya, pencarian berhasil/tanpa hasil, navigasi artikel dan kanal, mode terang/gelap, serta panel donasi telah diperiksa. Halaman yang diuji pada lebar 360/390 px tidak meluber horizontal.
- QR didekode dan cocok dengan alamat donasi. Saat clipboard tidak tersedia pada HTTP, tombol memberi petunjuk salin manual; penyalinan pada pratinjau HTTPS sebelumnya berhasil diuji.

## VPS dan pekerjaan tersisa

OS **OpenCloudOS 9.6** sudah dikonfirmasi, dengan paket **Nginx 1.29.8**, **PHP 8.3.36**, dan **MariaDB 10.11.19** terpasang. Instalasi paket belum berarti konfigurasi situs atau deployment WordPress telah selesai.

Status build dan deployment setiap revisi tersedia pada GitHub Actions. Saat pemasangan WordPress dilanjutkan, terapkan fitur bacaan yang belum setara dan jalankan `ACCEPTANCE.md`. Editor, publikasi, pagination, identitas publik di WordPress, dan metrik performa masih perlu diuji pada instalasi nyata.
