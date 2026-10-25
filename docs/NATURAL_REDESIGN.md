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


## Atmosfer desktop dan kupu-kupu
- Awan transparan bergerak 82–89 detik per siklus. Cahaya dan bayangan dedaunan dibatasi ke siluet Justitia serta batu; sungai tetap sama. Lapisan baru disembunyikan pada HP, perangkat sentuh, dan reduced-motion.
- Satu kupu-kupu SVG berwarna oker berpindah sepanjang halaman pembuka. Tempat hinggapnya: bagian atas Justitia, huruf awal judul sikap redaksi, bentuk tulisan, kiriman naskah, dan merek footer. Ia mempertahankan arah serta kecepatan saat tujuan berubah, melambat sebelum mendarat, dan sesekali terbang pendek setelah istirahat.
- Posisi huruf diukur dengan Range tanpa mengubah susunan teks. Pembacaan layout dilakukan saat scroll/resize; transform menggerakkan kupu-kupu. Perhitungan frame berhenti saat hinggap, jeda, tab tersembunyi, atau halaman ditinggalkan. Tombol jeda bersama tetap tersedia ketika ilustrasi utama keluar layar.
- Loader sekitar 0,7 KB memeriksa layar >=1024px, hover, pointer halus, dan no-preference sebelum memuat pengendali kupu-kupu. HP tidak memuat pengendali tersebut dan tidak membuat elemen kupu-kupu. Jika kemampuan berubah, elemen dan listener scroll dibersihkan.
- Validasi tambahan: `node scripts/check-butterfly.cjs`, termasuk transisi tujuan scroll, jeda, tab tersembunyi, penghentian frame saat hinggap, dan pergantian kemampuan perangkat. Pemeriksaan visual dilakukan di browser desktop; batas HP diverifikasi lewat kode dan tes, tanpa klaim pengujian perangkat fisik.


## Scroll editorial desktop
Referensi yang diamati:
- Figma, “Add interactions to an element”: https://help.figma.com/hc/en-us/articles/31242843431575-Add-interactions-to-an-element — pola scroll parallax, transform, dan reveal.
- Figma, “Prototype scroll and overflow behavior”: https://help.figma.com/hc/en-us/articles/360039818734-Prototype-scroll-and-overflow-behavior — elemen sticky dibatasi induknya.
- Superdesign, “Animated Dark Landing Page: Geometric Display Type With a Scroll-Traced Data Curve and Ember Glow”: https://superdesign.dev/library/animated-dark-landing-page-geometric-display-type-with-a-scroll-traced-data-curve-and-ember-glow — demo publik Cullet diamati saat scroll: panggung menetap, penanda kemajuan, dan sapuan pernyataan. Implementasi Nalar Hakim mengadaptasi pola interaksi, mempertahankan warna alam dan isi redaksi; tidak menyalin aset, kode, atau merek demo.

Penerapan:
- Bagian tiga bentuk tulisan menjadi judul kiri yang menetap dan tiga kartu kertas berlapis di kanan. Tetap memakai scroll native, tanpa scroll-jacking atau library animasi tambahan. Fokus keyboard membuka susunan biasa agar tautan di bawah lapisan tetap dapat diakses. Layar pendek di bawah 650px menonaktifkan sticky.
- Navigasi tiga bagian muncul setelah hero dan menandai bagian aktif; tautan hash asli tetap digunakan. Garis kemajuan menunjukkan posisi dalam halaman.
- Langit bergeser maksimum 28px; patung dan titik hinggap kupu-kupu tetap. Garis bawah “Argumen diuji” terisi mengikuti kemajuan bagian tanpa menyembunyikan teks.
- Loader yang sudah ada memuat pengendali scroll hanya pada desktop >=1024px, fine pointer/hover, no-preference. HP menerima susunan awal. Kode menghentikan pekerjaan saat tab tersembunyi/pagehide, membersihkan listener ketika kemampuan berubah, dan meminta paling banyak satu frame per rangkaian event scroll. Tidak ada render loop saat diam.
- Jeda alam membekukan perubahan dekoratif; navigasi dan scroll native tetap berfungsi. Body artikel tidak diberi efek ini. Tampilan desktop terang/gelap dan keyboard diuji pada browser. Viewport HP diuji melalui iframe 390px (lebar konten 375px setelah scrollbar): tidak ada overflow horizontal, kartu tetap static, dan script kupu-kupu serta scroll-story tidak dimuat. Reduced-motion diperiksa melalui batas CSS dan tes lifecycle; bukan pengujian perangkat fisik.
- Tes: `node scripts/check-scroll-story.cjs` (11 skenario), bersama tes kupu-kupu dan ilustrasi alam serta pemeriksaan aset/tautan.

## Penyempurnaan lingkungan desktop
- Pohon mendapat batang meruncing, guratan kulit, dan 17 daun tambahan dengan bentuk asimetris serta urat halus. Setiap daun memakai gerak dari pangkal dan fase angin yang sudah tersedia; tidak menambah jenis animasi atau pengendali baru.
- Batu menjadi bentuk organik bergradasi dengan guratan dan lumut. Tepian sungai mendapat kerikil, tanaman kecil, kedalaman warna, dan pantulan yang lembut. Bentuk serta durasi aliran asli tetap dipakai. Langit bergradasi dan garis awan tipis menambah kedalaman; sayap burung mendapat ujung bulu yang lebih jelas.
- Seluruh detail tambahan dibatasi ke desktop yang memenuhi kemampuan gerak. Versi HP dan reduced-motion mempertahankan geometri serta warna awal. Tidak ada filter SVG, video, pustaka baru, atau aset raster lingkungan.
- Node gambar dan aset Justitia tidak berubah. Kode serta desain kupu-kupu yang aktif tetap; tiga konsep kupu-kupu disiapkan untuk dipilih pengguna sebelum penerapan berikutnya.
- Validasi: build 21 halaman, 627 rute/aset/anchor lokal, 32 tes siklus gerak, kesetaraan tampilan SVG compact dengan versi sebelumnya, dan pemeriksaan visual desktop terang/gelap. Pemeriksaan HP memakai viewport browser, bukan perangkat fisik.

## Kupu-kupu tembaga dan perjalanan gagasan
- Desain yang dipilih pengguna diterjemahkan menjadi SVG berlapis: empat sayap tembaga/madu, urat cokelat, bintik gading, badan beruas, kaki, serta dua antena dengan ujung keemasan bercahaya. Ukuran desktop 64px. Sayap mengepak serempak, antena mengayun, dan cahaya berdenyut pelan menggunakan gradasi radial tanpa filter blur. Gerak terbang, jeda, dan hinggap mengikuti scroll tetap dipertahankan, termasuk titik hinggap baru pada judul perjalanan gagasan.
- Setelah bagian kirim naskah terdapat bagian “Dari gagasan, menjadi percakapan.” Alurnya Ide Anda → Nalar Hakim → Masyarakat. Garis melengkung dan sinyal yang berkumpul lalu menyebar mengadaptasi konsep Monad yang sebelumnya diterapkan dalam `scripts/signal_field.py`, dengan geometri, palet alam, dan narasi redaksi sendiri. Tidak ada kode, logo, atau aset Monad yang ditambahkan.
- Bagian tambahan hanya tampil pada desktop >=1024px dengan hover/pointer halus; HP mempertahankan halaman sebelumnya. Desktop reduced-motion dan tanpa JavaScript menampilkan diagram statis. Pengendali tambahan dimuat oleh loader kemampuan yang sudah ada, tanpa pustaka animasi. Sinyal berhenti di luar viewport, saat tab tersembunyi, pagehide, atau saat pengguna menjeda gerak.
- Pemeriksaan mencakup lifecycle kupu-kupu dan aliran gagasan, tautan/aset hasil build, tampilan browser desktop terang/gelap serta viewport HP. Tidak mengklaim pengujian perangkat fisik.

## Pendamping siang dan malam pada artikel
- Mode terang menampilkan satu kupu-kupu tembaga. Mode gelap menggantikannya dengan tepat tiga kunang-kunang; pergantian mengikuti tema yang tersimpan maupun tombol tema saat halaman terbuka.
- Kunang-kunang memiliki badan kecil, antena, sayap tipis, dan cahaya perut keemasan. Lintasan melengkung serta fase cahaya masing-masing berbeda. Posisi pada artikel dibatasi ke sisi kolom untuk menjaga keterbacaan.
- Semua halaman artikel hasil generator memuat loader desktop yang sama. Artikel mendapat kontrol jeda sendiri; landing tetap menggunakan jeda bersama untuk ilustrasi dan aliran gagasan. Artikel lama yang berupa redirect langsung membuka halaman artikel tujuan.
- HP, perangkat sentuh, dan reduced-motion tidak memuat pengendali pendamping. Jeda, tab tersembunyi, dan pagehide menghentikan gerak. Isi artikel, referensi, Justitia, serta struktur publikasi tidak diubah.
