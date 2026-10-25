# Rekonstruksi visual alam — Nalar Hakim

## Tujuan
Membuat publikasi kritik hukum nyaman ditelusuri dan dibaca, dengan identitas alam yang tetap memiliki konteks hukum. Struktur Esai, Telaah Fenomena, dan Bedah Putusan atau Norma, isi artikel, serta alur kiriman Word lewat email tetap berlaku.

## Rencana pelaksanaan
1. Terapkan putih kabut #F5F6F2, arang alami #29312D, hutan #294D3E, langit #DFEAF0, dan batu #D9DCD5. Putih mendominasi; warna aksen tidak memenuhi layar secara bergantian.
2. Bangun landing dua kolom: judul dan tindakan utama di kiri, ilustrasi datar Justitia dengan mata tertutup, timbangan, pedang, dan akar pohon di kanan. Pada layar kecil, tindakan utama mendahului ilustrasi.
3. Tambahkan gerak burung, aliran air, dan daun hanya di ilustrasi desktop. Sediakan jeda; hentikan gerak di luar layar atau tab tersembunyi. Hormati prefers-reduced-motion; HP dan tanpa JavaScript menampilkan ilustrasi statis.
4. Tenangkan hierarki editorial: judul lebih proporsional, pembatas lebih lembut, metadata terbaca, kolom artikel tetap terbatas, tanpa animasi alam di badan bacaan.
5. Pertahankan pilihan terang/gelap; pengunjung baru mulai dengan tema terang, preferensi tersimpan tetap dihormati.
6. Bangun halaman dari sumber Python, periksa tautan dan anchor, sintaks JavaScript, tampilan desktop/HP, tema, pencarian serta pengendali gerak. Commit sumber dan halaman hasil bersama ke GitHub; verifikasi deployment.

## Batas ruang lingkup
Publikasi kali ini tetap GitHub Pages. Migrasi VPS, penghapusan jejak identitas, perubahan sistem pengiriman, dan pengindeksan Google bukan bagian perubahan visual ini. Tema WordPress adalah fondasi terpisah dan belum memuat keseluruhan ilustrasi landing statis.

## Prinsip gerak
Gerak hanya pendukung suasana. Tidak ada suara, video, neon, efek 3D, parallax kursor, atau animasi di belakang paragraf. Jika browser tidak mendukung enhancement, seluruh konten dan navigasi tetap tersedia.

## Penyempurnaan ilustrasi dan donasi
- Justitia menggunakan ilustrasi 2D baru bergaya ukiran klasik, dengan anatomi, lipatan jubah, timbangan, dan pedang yang lebih rinci. Aset `preview/justitia-engraving.webp` dibuat dengan image generation berdasarkan referensi pengguna, berlatar transparan, lalu dikodekan ke WebP (sekitar 273 KiB). Arahan visual: figur penuh bertutup mata, tinta hijau hutan dan batu gading, tanpa latar atau teks. Lingkungan tetap berupa lapisan SVG yang dapat digerakkan terpisah.
- Akar memiliki cabang meruncing dan guratan kulit. Sebelas daun berurat bergerak dari pangkal tangkai dengan fase angin berbeda. Tiga burung memiliki badan, ekor, dan sayap terpisah; dua kepakan singkat diikuti melayang. Jalur, warna, dan animasi sungai dipertahankan.
- Donasi hanya menampilkan alamat, tanpa gambar QR. ETH / Ethereum Mainnet, BSC, dan Robinhood masing-masing memiliki label, alamat persis yang diberikan pengguna, serta tombol dan status salin sendiri. Label Robinhood tidak diubah menjadi klaim jaringan tertentu.
- Pemeriksaan lokal mencakup 21 halaman, tautan/aset/anchor, build deterministik, sintaks JavaScript, dan 10 skenario siklus animasi. Tampilan diperiksa pada browser desktop; perilaku layar kecil dan reduced-motion diperiksa melalui CSS dan tes siklus, bukan pengujian perangkat fisik.
