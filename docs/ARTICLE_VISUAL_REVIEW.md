# Review halaman artikel dan aset kupu-kupu

Batch artikel dan kupu-kupu ini sudah digabung ke `main` melalui commit [`01f6b06155f8fbd38504fb08276a70129d220fea`](https://github.com/AzrielChoerulHakim/nalar_hakim/commit/01f6b06155f8fbd38504fb08276a70129d220fea), dengan isi yang identik dengan commit review lokal `0ced9e9`. Pemeriksaan GitHub dan publikasi GitHub Pages berhasil. Dasar perbandingannya adalah `f8eec8a4b0357a32d56ab1bd00ed7130832cf2da`. Tidak ada deployment ke VPS, perubahan DNS/server, atau publikasi artikel percobaan; status GitHub Pages ini tidak berarti `nalarhakim.com` sudah diperbarui.

Dokumen ini merekam implementasi dan hasil uji batch tersebut. Angka pengujian serta perbandingan sebelum/sesudah di bawah merupakan bukti historis batch ini, bukan hasil pengujian ulang setiap revisi berikutnya.

## Implementasi

Halaman artikel mendapat pembuka bergaya jurnal: kategori kecil dengan garis tipis, jarak judul/pengantar yang lebih teratur, byline yang tenang, dan tanggal pada baris tersendiri. Keluarga font, ukuran dasar judul, kolom baca, teks, dan metadata yang tersedia tetap dipertahankan. Selector yang dipakai cocok dengan hasil generator situs maupun renderer publisher admin; tidak diperlukan perubahan kode publisher.

Bingkai terbuka menggunakan tiga SVG akar orisinal berupa path kode, bukan salinan gambar referensi. Akar utama meruncing, cabang sekunder dan tersier lebih tipis, dengan bentuk kiri atas dan kanan bawah yang berbeda. Keduanya membingkai **area pembuka artikel**, tidak memanjang mengikuti tinggi tulisan dan tidak menjadi ilustrasi penutup artikel.

Pada lebar mulai 1240 px, kotak ornamen berada di luar header selebar 940 px dengan jarak bersih 18 px. Pada ukuran lebih kecil, varian ringkas berada dalam ruang atas/bawah header yang sudah dicadangkan; kolom bacaan tidak dipersempit. Ornamen statis berupa pseudo-element bermask, tidak masuk accessibility tree, tidak menerima klik atau seleksi, dan disembunyikan saat mencetak. Warna mengikuti token tema yang ada. Tidak ada tekstur kertas, grain, akar di homepage, atau animasi latar baru.

Kupu-kupu hanya berubah pada tiga string template SVG untuk sayap, antena, dan badan. Sayap atas lebih tegas, sayap bawah lebih kecil, pola urat dan bintik lebih sedikit, serta tubuh/antena lebih terbaca. Warna tetap hangat dengan amber/tembaga lebih tenang dan sorotan krem. ViewBox, kelompok sayap, titik sambungan, pencerminan, class, dan CSS kepakan tetap utuh. SVG setelah ekspansi template berkurang dari **7.798 B menjadi 5.741 B**; angka ini ukuran markup, bukan transfer HTTP atau hasil benchmark.

## File yang berubah

| Peran | File |
| --- | --- |
| Tata letak artikel | `preview/article-editorial.css` |
| Akar orisinal | `preview/article-root-start.svg`, `preview/article-root-end.svg`, `preview/article-root-compact.svg` |
| Aset kupu-kupu | `preview/butterfly.js` — hanya template SVG |
| Integrasi CSS | `scripts/styles.py` |
| Pemeriksaan batas perubahan | `scripts/check-butterfly-art.cjs`, `.github/workflows/check.yml` |
| CSS hasil generator | `preview/publication.css` |
| HTML hasil generator: halaman umum | `index.html`, `beranda.html`, `404.html`, `cari.html`, `kebijakan-redaksi.html`, `kirim-naskah.html`, `tentang.html` |
| HTML hasil generator: arsip | `bentuk/bedah/index.html`, `bentuk/esai/index.html`, `bentuk/telaah/index.html` |
| HTML hasil generator: artikel | `artikel/harta-bersama-bukan-seluruhnya-warisan/index.html`, `artikel/hukum-yang-sah-belum-tentu-adil/index.html`, `artikel/praduga-tak-bersalah/index.html`, `artikel/smart-contract-kode-dan-perjanjian/index.html`, `artikel/wanprestasi-atau-perbuatan-melawan-hukum/index.html` |
| Dokumentasi | `docs/ARTICLE_VISUAL_REVIEW.md` |

Perubahan HTML hasil generator hanya memperbarui fingerprint URL aset. Isi artikel tidak disunting. Fixture dan probe pemeriksaan berada di direktori QA terpisah, bukan paket publik.

## Integritas dan pemeriksaan kode

Perbandingan terhadap baseline memastikan **31 file terlindungi identik byte demi byte**, termasuk sumber hero timbangan, animasi editorial/transisi, font, panah, theme handler, loader companion, dan stylesheet kupu-kupu/kunang-kunang. Dalam `preview/butterfly.js`, seluruh kode sebelum template sayap dan seluruh kode mulai `fireflyArt` sampai akhir file tetap identik. Karena itu pola terbang, lintasan, kecepatan, jumlah, pemicu, penempatan, interaksi, pergantian spesies menurut tema, dan perilaku kunang-kunang tidak diubah.

Pemeriksa HTML memastikan **20 region pada lima artikel**—header/pengantar, cover, isi, dan footer—identik setelah parsing; enam halaman redirect artikel juga identik. Homepage identik setelah mengabaikan fingerprint URL aset. Seluruh data artikel JSON tetap sama. Verifier yang dapat diulang tersedia dalam workspace QA sebagai `article-qa/verify_integrity.py`; hasil lengkap berada di `article-qa/test-results.txt`.

| Pemeriksaan | Hasil |
| --- | ---: |
| Companion/kupu-kupu/kunang-kunang | 21 lulus |
| Gerak timbangan | 17 lulus |
| Transisi cover artikel | 12 lulus |
| Scroll story | 15 lulus |
| Idea flow | 8 lulus |
| Release statis | 14 lulus |
| Ikon/panah | 4 lulus |
| **Total tes situs bernomor** | **91 lulus** |
| Harness tambahan: batas aset kupu-kupu dan lifecycle editorial | 2 lulus |
| Suite admin Python | 25 lulus |

Syntax JavaScript kupu-kupu lulus. Harness aset memeriksa batas perubahan SVG, fingerprint kode perilaku/CSS, sambungan sayap, semantik dekoratif, dan tidak adanya resource eksternal atau elemen berat dalam SVG. Ketiga SVG akar valid dan tersedia dalam bundle; URL mask relatif dari `publication.css` dapat diresolusikan. Ukuran akar awal/akhir/ringkas masing-masing 979/744/539 B.

Release `004da428446afc5b7eba` berisi 68 file publik. Dua build pada harness release menghasilkan output deterministik: 21 halaman, lima artikel, dan 554 route/aset/anchor lokal lulus. Harness menggunakan direktori sementara dan tidak menyentuh VPS. Pergantian UID tidak tersedia di lingkungan ini, sehingga bagian itu bukan pengujian hak akses lintas pengguna yang sesungguhnya.

## Pemeriksaan browser dan visual

Matriks browser lokal dalam `article-qa/browser-matrix.json` mencatat **40 kombinasi**: empat lebar viewport (**320, 390, 768, dan 1440 px**) × lima kasus artikel × dua tema (terang/gelap). Tinggi viewport pada pengukuran ini 1000 px.

| Kasus | Cakupan |
| --- | --- |
| `hukum-yang-sah-belum-tentu-adil` | Artikel terbit dengan judul panjang, cover, isi panjang, dan rujukan |
| `praduga-tak-bersalah` | Judul lebih pendek, cover, isi panjang, dan rujukan |
| `qa-admin-long` | Fixture lokal dari renderer publisher admin, artikel panjang |
| `qa-admin-short` | Fixture lokal dari renderer publisher admin, artikel pendek |
| `qa-admin-optional` | Fixture lokal tanpa cover atau metadata tambahan |

Ke-40 snapshot tidak menunjukkan overflow horizontal, perpotongan kotak ornamen dengan konten yang diperiksa, atau error JavaScript yang tertangkap probe. Target tautan rujukan pada fixture dan artikel ikut diperiksa. Pemeriksaan screenshot manual mencakup 320 px gelap/artikel pendek, 390 px terang/artikel panjang, 768 px terang/artikel panjang, serta 1440 px pada kedua tema. Ini pemeriksaan browser berukuran viewport tertentu, bukan pengujian perangkat mobile fisik.

Pemeriksaan tambahan yang dilakukan:

- Perbandingan lebar kolom baca sebelum/sesudah: tetap 288 px pada viewport 320, 350 px pada 390, dan sekitar 680 px pada 768/1440. Header juga tidak menyempit.
- Galeri aset sebelum/sesudah diperiksa pada 32, 48, 64, dan 180 px; kepakan dijalankan dengan CSS produksi yang tidak berubah. Di halaman artikel, probe mencatat ukuran 48 px, durasi kepakan 0,22 s, serta poros kiri 48/51 dan kanan 52/51. Homepage diperiksa secara visual: timbangan tetap utuh dan kupu-kupu tetap 64 px.
- Tombol tema situs diklik bolak-balik, termasuk lima pembalikan cepat dan aktivasi dengan Enter. Snapshot handoff mencatat satu kupu-kupu di jalur terang dan tiga kunang-kunang di jalur gelap, tanpa duplikasi atau error. Frame keluar/masuk spesies lama selama transisi tetap diperbolehkan seperti baseline; screenshot sesaat tidak digunakan untuk menyimpulkan perubahan spesies permanen.
- Navigasi daftar isi, rujukan pertama, dan tautan kembali dijalankan dengan Enter. Fokus rujukan terlihat, isi tetap dapat dibaca, dan akar ikut keluar layar saat artikel digulir. Akar tidak mengikuti viewport.
- Delapan kombinasi tambahan (empat lebar × dua tema) dengan reduced-motion disimulasikan lewat harness menampilkan artikel lengkap tanpa companion, overflow, atau perpotongan akar. Simulasi ini bukan perubahan pengaturan OS.

Snapshot browser, bukti interaksi tema, pengukuran baseline, dan screenshot tersimpan dalam direktori QA/deliverable lokal serta paket review. Pengujian riwayat/direct link/reload/fallback transisi pada revisi ini dibuktikan oleh harness 12 tes yang ada; tidak diklaim sebagai pengujian ulang manual seluruh kombinasi browser.

## Pengukuran dan batas verifikasi

Probe Performance API lokal mencatat **CLS 0 pada 40 snapshot yang diambil**. Cache dikelola browser, tanpa throttle CPU/jaringan. Snapshot ini bukan sesi benchmark Lighthouse, bukan pembuktian bahwa seluruh first load selalu CLS 0, dan tidak memberikan perbandingan sebelum/sesudah yang terkontrol untuk LCP atau TBT. Skor PageSpeed produksi terdahulu tidak diukur ulang dan tidak dibandingkan dengan preview lokal.

Perangkat fisik, Safari, Firefox, dan pengubahan preferensi reduced-motion pada sistem operasi belum diuji. Jalur reduced-motion dalam harness deterministik dan delapan snapshot simulasi browser lulus. Tidak ada klaim pengujian OS atau browser lain berdasarkan simulasi tersebut.

Fixture admin memakai renderer publisher yang sebenarnya dan suite 25 tes admin lulus. Ini tidak membuktikan alur login/upload/publish melalui browser admin produksi: alur tersebut tidak dijalankan, dan tidak ada artikel percobaan yang diterbitkan. Seluruh hasil pada dokumen ini merupakan hasil pengembangan lokal.
