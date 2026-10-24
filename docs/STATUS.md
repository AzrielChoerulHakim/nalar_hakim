# Status fondasi 0.1.0

Fondasi kode awal untuk repository Nalar Hakim. Belum dipasang di VPS atau diuji dengan WordPress/database hidup.

## Pratinjau GitHub Pages

Pratinjau statis memuat beranda, lima kanal, enam halaman tulisan contoh, pencarian, Tentang dan halaman 404. Pemasangan WordPress ditunda; pratinjau tidak memakai database atau panel admin.

- 15 halaman HTML dibuat dengan generator tanpa dependensi tambahan.
- 407 tautan lokal, aset dan tujuan formulir diperiksa dan ditemukan.
- Pencarian kata `teknologi` menampilkan satu tulisan yang sesuai; kueri tanpa kecocokan menampilkan nol hasil dengan pesan yang jelas.
- Navigasi beranda → artikel dan artikel → kanal Pidana berhasil diperiksa di browser.
- Pratinjau lebar 360/390 px tidak meluber horizontal pada halaman yang diperiksa; judul utama ditaruh sebelum sampul dekoratif.
- Halaman baca tetap berisi HTML statis. JavaScript hanya untuk pencarian, pilihan tema dan tombol salin.

## Pemeriksaan yang sudah dilakukan

- 13 berkas PHP lolos parser dengan tata bahasa PHP 8.3. Ini pemeriksaan statis, bukan eksekusi PHP/WordPress.
- JavaScript lolos `node --check`; skrip preflight lolos `bash -n`.
- ZIP tema berhasil dibuat dengan `scripts/package.py`.
- Pratinjau HTML internal dengan CSS/JS tema diperiksa di desktop dan frame selebar 360/390 px. Body tidak meluber: lebar isi/scroll 345/345 dan 375/375 px; selisih dari frame berasal dari scrollbar.
- Header dan pengantar dipadatkan agar judul utama terlihat lebih awal di HP.
- Mode terang, preferensi tema tersimpan, panel pencarian dan panel donasi diperiksa di pratinjau.
- Saat clipboard tidak tersedia pada pratinjau HTTP, tombol memberikan petunjuk salin manual. Penyalinan berhasil pada HTTPS masih perlu diuji.
- Gambar QR didekode dan tepat cocok dengan alamat donasi. Dimensi intrinsik gambar dicantumkan.
- Review sumber menambahkan penjagaan rute REST penulis tanpa membedakan huruf besar/kecil dan penyamaran respons pengguna publik.

## Tahap pemasangan berikutnya

Konfirmasi OS hasil reset dan domain, lalu pasang WordPress serta tema. Jalankan `ACCEPTANCE.md` pada instalasi nyata sebelum peluncuran. Pencarian, pagination, editor, publikasi, proteksi identitas di WordPress, dan metrik performa belum terverifikasi saat ini.

Pratinjau memakai tulisan contoh berlabel dan tidak dimasukkan sebagai artikel ke tema.
