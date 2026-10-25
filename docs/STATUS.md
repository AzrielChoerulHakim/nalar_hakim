# Status Nalar Hakim — perombakan redaksi

## Implementasi

Situs statis telah diarahkan menjadi publikasi kritik hukum independen. Landing, ruang baca, navigasi, halaman bidang, artikel, pencarian, footer dan metadata mengikuti arah redaksi baru. Empat bentuk publikasi: Telaah, Bedah Putusan & Norma, Esai Pemikiran, Perdebatan. Lima bidang tetap dapat ditelusuri.

Halaman baru: `kirim-naskah.html`, `kebijakan-redaksi.html`, serta empat arsip `bentuk/`. `tentang.html` memuat posisi dan cara kerja redaksi. Total 27 HTML, termasuk enam pengalihan historis dengan tujuan tetap. Sitemap mencakup halaman publik baru.

Panduan pengiriman menggunakan email baru → lampiran Word → tinjauan Lazarus → keputusan atau revisi melalui email. Tombol mailto memuat penerima dan subjek; lampiran ditambahkan sendiri oleh pengirim. Tombol salin memiliki petunjuk manual bila API clipboard ditolak/tidak tersedia. Tidak ada formulir unggah, backend email, akun kontributor atau notifikasi otomatis. Korespondensi dilakukan manual oleh Lazarus.

Kelima artikel telah ditulis ulang dengan objek, tesis, lensa teori, sanggahan, batas analisis, rujukan dan catatan perubahan:

- Pidana: ukuran keberhasilan dalam publikasi kinerja KPK 22 Desember 2025.
- Perdata: pemulihan dan bentuk gugatan dalam SEMA 1/2022 B.1.a–b.
- Agama & Keluarga: Putusan MA 266 K/AG/2010 dan pengakuan kerja perawatan.
- Filsafat Hukum: MK 257/PUU-XXIII/2025, partisipasi publik dan kewajiban menjelaskan.
- Hukum & Teknologi: kuasa upgrade, oracle dan persetujuan dalam smart contract.

Dokumen lama dibaca ulang dengan tanggal objek yang jelas; tidak dipresentasikan sebagai kejadian baru. Sumber primer ditelusuri dan batas antara teks dokumen serta kritik penulis dijelaskan. Perdebatan belum memiliki tanggapan terbit dan menampilkan undangan yang jujur.

Pemuat JSON menerima lebih dari satu artikel per bidang serta nama samaran masing-masing penulis. Artikel terbaru tampil lebih dahulu. Tidak ada syarat panjang atau jumlah subjudul otomatis; panjang naskah diputuskan redaksi. Validasi tetap memeriksa teks tidak kosong, metadata, format, tanggal dan pasangan penanda/sumber. Identitas privat tidak menjadi field konten.

## Pemeriksaan

- Generator dan pemeriksaan tautan: **27 halaman, 871 tautan lokal/aset/anchor**.
- Sintaks JavaScript untuk tema, pencarian dan kedua animasi diperiksa.
- Tambahan naskah uji di direktori sementara berhasil dimuat sebagai artikel keenam, format Perdebatan dan alias Anonim; dua artikel dalam bidang sama tidak saling menggantikan. Naskah uji tidak masuk repository.
- Tinjauan sumber terhadap lima file PHP dan penyimpanan alias tidak menemukan masalah material. PHP tidak tersedia di runtime lokal; lint nyata dijalankan melalui workflow GitHub, bukan diklaim dari pemeriksaan lokal.
- Browser: 21 halaman utama pada dua lebar (320 dan 1366px), masing-masing tema terang/gelap, **84 keadaan halaman**. Tidak ditemukan teks isi/label terlihat di bawah 12px, luapan horizontal halaman, atau kontras teks dasar di bawah ambang yang diperiksa (4,5:1 teks biasa; 3:1 teks besar). Ini bukan audit aksesibilitas menyeluruh.
- Landing dan panduan juga diperiksa visual pada 320/390/768px. Alamat email didahulukan di layar kecil. Isi artikel tetap 19px desktop/18px HP.
- Alur navigasi landing → kiriman, ruang baca → artikel, daftar isi, penanda sumber → rujukan → kembali, pencarian “Fuller” (dua artikel), hasil nihil, dan ruang Perdebatan diperiksa.
- Alamat serta subjek mailto diperiksa tanpa mengirim pesan. Fallback clipboard diperiksa di preview HTTP; pengiriman dan penerimaan email nyata tidak diuji.

Build dan status publikasi setiap commit dapat diperiksa di GitHub Actions. Pembuatan ulang harus menghasilkan HTML/indeks yang identik. Tidak ada pengukuran performa lapangan/Core Web Vitals pada revisi ini.

## Desain

Palet arang/ivory/lavender/sage dan padanan tema terang dipertahankan. Jaringan SVG serta animasi masuk tetap terbatas pada desktop dengan pointer presisi, hover dan tanpa preferensi pengurangan gerak. Kartu bentuk tulisan memperoleh gerak ringan. HP memakai jaringan statis. Tidak ada tambahan library, font eksternal, 3D atau WebGL.

## Batas dan tahap berikutnya

Fondasi WordPress memiliki alias `_nh_author_alias`, byline/feed/oEmbed sesuai alias, serta tautan kondisional ke halaman redaksi yang diterbitkan manual. Kode tidak memakai nama tampilan akun sebagai byline publik. Situs statis tidak diimpor otomatis ke WordPress, dan seluruh fitur visual belum setara. WordPress belum diuji dengan instalasi serta database hidup.

Pemasangan VPS, pemindahan domain dan pembersihan jejak identitas pengelola **ditunda atas keputusan pemilik**. Canonical GitHub Pages dan akun repository dipertahankan. Tidak ada klaim anonimitas teknis mutlak atau bahwa Google telah mengindeks versi ini. Membuat email baru tidak dengan sendirinya menghapus metadata/jejak komunikasi.
