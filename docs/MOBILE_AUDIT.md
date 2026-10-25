# Audit mobile — 26 Oktober 2026

## Perubahan

- Pembuka memakai font sistem yang sama dengan antarmuka, judul lebih proporsional, dan jarak vertikal lebih ringkas. Navigasi landing 14px tidak lagi membelah label pada layar 320px.
- Judul artikel menyesuaikan 29–34px, pengantar 18px/1,65, subjudul 26px pada layar hingga 430px. Isi panjang tetap Georgia 19px/1,8. Ukuran desktop tidak diubah.
- Kerangka argumen menempatkan label di atas penjelasan pada HP kecil; padding dan indentasi ringkasan diperkecil agar kolom baca lebih luas.
- Kategori aktif yang berada di luar area navigasi horizontal kini ditampilkan sekali saat halaman baru dibuka. Posisi halaman, pemulihan riwayat, dan geseran pengguna tidak diganggu.
- Halaman 404 tidak lagi memakai `base` yang membuat tautan `#main-content` menuju homepage. Aset dan navigasi tetap memakai prefix deployment, sedangkan tautan lokal tetap pada alamat error, termasuk URL bertingkat.
- Spasi setelah “peristiwa,” dipertahankan ketika pemisah baris pada pengantar kategori disembunyikan di mobile.

## Verifikasi

- Browser pada viewport 320, 390, dan 430px: 15 halaman kanonis, termasuk lima artikel, diuji pada ketiga lebar (45 kombinasi). Tidak ditemukan overflow halaman atau teks utama yang terpotong. Skrip dan elemen animasi desktop tidak dimuat. Enam URL artikel lama tetap diperiksa oleh validator tautan/build.
- Interaksi: buka/tutup daftar isi, tautan subjudul, pencarian hasil/tanpa hasil, tema terang/gelap, buka donasi, salin alamat BSC. Navigasi kategori aktif terlihat; ilustrasi mobile statis dan proporsional.
- Pemeriksaan kode: 53 tes animasi/navigasi, 13 tes ekspor/aktivasi, 21 halaman dan 654 rute/aset/anchor. Ekspor domain dan GitHub Pages memeriksa URL bertingkat halaman 404 serta fingerprint asetnya.
- Pengujian menggunakan viewport browser, bukan perangkat fisik atau pengujian pembesaran teks tingkat sistem. Tidak mengklaim audit aksesibilitas menyeluruh.
