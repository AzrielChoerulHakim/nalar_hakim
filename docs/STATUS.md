# Status pengembangan Nalar Hakim

Pratinjau statis dan fondasi tema WordPress tersedia. WordPress belum dipasang atau diuji dengan database hidup; konfigurasi dan deployment VPS sengaja ditunda.

## Versi landing dan ruang baca

- `index.html` menjadi halaman pembuka; `beranda.html` menjadi ruang baca. Pratinjau juga memuat lima kanal, enam tulisan contoh, pencarian, Tentang dan halaman 404.
- Tiga fitur bacaan telah diterapkan pada pratinjau statis: label jenis tulisan (Berita, Analisis, Opini, Panduan), penanda serta daftar rujukan, dan daftar isi untuk tulisan dengan sedikitnya tiga bagian.
- Identitas pratinjau diperbarui menjadi editorial datar dengan tipografi monumental, bidang violet/putih tulang/hijau limau, sampul SVG dua dimensi, serta tombol dan navigasi bersudut tegas. Tidak menggunakan 3D, WebGL, font eksternal, atau animasi terus-menerus.
- Generator menghasilkan 16 halaman. Pemeriksaan menemukan seluruh 539 tautan lokal, aset dan tujuan anchor yang diperiksa.
- Pemeriksaan browser berhasil untuk alur landing → ruang baca → artikel, pencarian jenis tulisan, loncatan daftar isi, rujukan dan tautan kembali. Landing diperiksa pada lebar 320/360/390/768 px dan desktop; ruang baca pada 320/360/390 px dan desktop. Halaman yang diperiksa tidak meluber horizontal. Mode terang/gelap, navigasi kanal, dan panel donasi juga diperiksa.
- HTML, CSS, dan JavaScript landing berjumlah sekitar 54 KB sebelum kompresi (perkiraan gzip sekitar 14 KB), tanpa unduhan font. Angka ini ukuran berkas, bukan hasil pengukuran Core Web Vitals.
- Identitas visual dan tiga fitur bacaan pada pratinjau belum dipindahkan seluruhnya ke tema WordPress.

Tulisan contoh selalu diberi label. Tautan rujukannya memperagakan navigasi ke portal resmi, bukan sumber pembuktian suatu peristiwa atau analisis hukum nyata. Pratinjau tidak memakai database atau panel admin dan tidak membuat artikel contoh di WordPress.

## Hasil pemeriksaan sebelumnya

- GitHub Actions **Theme checks** dan deployment **GitHub Pages** berhasil untuk commit `7fc5f84dfa38352202dc13d09c1c164f76b00760` sebelum pembaruan visual datar. Hasil pemeriksaan revisi berikutnya tersedia pada tab Actions.
- Lint PHP dijalankan dengan PHP nyata di CI dan berhasil; pemeriksaan JavaScript serta pembuatan ZIP tema juga berhasil. Ini belum membuktikan integrasi WordPress berfungsi.
- Pada pratinjau sebelumnya, pencarian berhasil/tanpa hasil, navigasi artikel dan kanal, mode terang/gelap, serta panel donasi telah diperiksa. Halaman yang diuji pada lebar 360/390 px tidak meluber horizontal.
- QR didekode dan cocok dengan alamat donasi. Saat clipboard tidak tersedia pada HTTP, tombol memberi petunjuk salin manual; penyalinan pada pratinjau HTTPS sebelumnya berhasil diuji.

## VPS dan pekerjaan tersisa

OS **OpenCloudOS 9.6** sudah dikonfirmasi, dengan paket **Nginx 1.29.8**, **PHP 8.3.36**, dan **MariaDB 10.11.19** terpasang. Instalasi paket belum berarti konfigurasi situs atau deployment WordPress telah selesai.

Status build dan deployment setiap revisi tersedia pada GitHub Actions. Saat pemasangan WordPress dilanjutkan, terapkan fitur bacaan yang belum setara dan jalankan `ACCEPTANCE.md`. Editor, publikasi, pagination, identitas publik di WordPress, dan metrik performa masih perlu diuji pada instalasi nyata.
