# Review penyempurnaan timbangan dan kontinuitas cover

Dasar perbandingan: `main` pada [`01f6b06155f8fbd38504fb08276a70129d220fea`](https://github.com/AzrielChoerulHakim/nalar_hakim/commit/01f6b06155f8fbd38504fb08276a70129d220fea). Implementasi dan pengujian lokal revisi ini selesai; target publikasinya `main` dan GitHub Pages. Saat catatan ini disusun, revisi berada di branch lokal `fix/scales-cover-continuity`; push, SHA remote, dan CI/Pages untuk revisi ini belum diverifikasi. Dua batch sebelumnya sudah ada di `main`/GitHub Pages. VPS, DNS, dan server `nalarhakim.com` tidak disentuh.

## Perbaikan

- Timbangan menjadi SVG editorial dengan bentuk balok, bantalan poros, sambungan, rantai, piringan berprofil, dan variasi garis/material. Tidak ada Justitia atau pemandangan yang dikembalikan.
- Ilustrasi utuh dan diam saat halaman dibuka. Ilustrasi itu sendiri merupakan tombol native dengan nama aksesibel dan indikator fokus; tombol teks ulang dihapus. Klik, tap, Enter, atau Space menjalankan satu ayunan mereda. Tiang/alas tidak ikut berputar; gantungan mengimbangi sudut balok. Aktivasi cepat tidak menumpuk animasi. Keluar viewport, halaman tersembunyi, atau perubahan reduced-motion mengembalikan keadaan tenang.
- Transisi cover memakai snapshot gambar/SVG yang sama, bukan seluruh kotak kartu. Area gambar SVG dinormalisasi ke proporsi lukisan yang sebenarnya, sehingga perbedaan rasio bingkai kartu dan artikel tidak meregangkan ilustrasi.
- Batas pemotongan overlay kini melindungi caption dan area baca; batas atas tujuan tidak lagi menyembunyikan seluruh perjalanan dari thumbnail. Header artikel menjadi snapshot masuk yang statis, dengan keyline sementara pada teks kecil agar tetap terbaca saat gambar lewat di belakangnya. Properti sementara dibersihkan setelah selesai.
- Navigasi tetap berpindah dokumen biasa. Tidak ada router, penundaan buatan, atau penantian decode gambar. Cover tidak siap/gagal, di luar viewport, berbeda identitas/posisi fokus, reduced-motion, dan browser tanpa API memakai navigasi biasa. Direct link, reload, traversal Back/Forward, dan buka tab baru tidak dipaksa bertransisi.

File implementasi utama: `scripts/nature_scene.py`, `preview/nature-scene.js`, `preview/nature-scene.css`, `preview/article-transitions.js`, dan `preview/article-transitions.css`. Harness yang disesuaikan: `scripts/check-nature-motion.cjs` dan `scripts/check-article-transitions.cjs`. Build memperbarui `index.html`, dua bundle CSS, serta fingerprint aset di halaman HTML terkait. Catatan historis `HERO_MOTION_REVIEW.md` dan `ARTICLE_VISUAL_REVIEW.md` diperbaiki agar tidak lagi menyebut batch lama belum dipush.

## Hasil pemeriksaan kode dan build

| Pemeriksaan | Hasil |
| --- | --- |
| Sintaks JavaScript | 11 file lolos |
| Cover transition | 16 pemeriksaan lolos |
| Timbangan | 20 pemeriksaan lolos |
| Companion kupu-kupu/kunang-kunang | 21 pemeriksaan lolos |
| Scroll story | 15 pemeriksaan lolos |
| Idea flow | 8 pemeriksaan lolos |
| Artwork kupu-kupu dan lifecycle editorial | Kedua harness lolos |
| Static release | 14 tes lolos |
| Ikon/panah | 4 tes lolos |
| Suite admin terpisah yang tersedia di workspace | 32 tes lolos |
| Preview | 21 halaman; 648 route, aset, dan anchor lolos |
| Pengemasan dan whitespace diff | Lolos |

Total tes bernomor: **130**, ditambah dua harness tambahan, pemeriksaan sintaks, preview, dan integritas. Hasil admin adalah suite proyek admin yang tersedia untuk menghasilkan fixture lokal; revisi ini tidak mengubah atau memublikasikan artikel melalui admin produksi.

Static release dibangun dua kali di direktori sementara dan menghasilkan ID identik `0c5665a42358618110d1`, masing-masing 68 berkas publik. Tes tidak membangun ulang salinan yang sedang dipakai untuk uji browser. Lingkungan tidak menyediakan perpindahan UID, sehingga tes installer dibatasi pada direktori sementara. PHP tidak tersedia untuk lint; seluruh 13 berkas sumber PHP sama dengan baseline.

Setelah penambahan keyline sementara terakhir, pemeriksaan sintaks dan 16 kasus transisi, 14 tes static release, checker preview, integritas, dan `git diff --check` dijalankan ulang dan tetap lolos.

## Integritas bagian yang dipertahankan

Verifier read-only membandingkan dengan baseline `01f6b06`:

- **36 berkas terlindungi identik byte demi byte**, termasuk seluruh JavaScript/CSS kupu-kupu dan kunang-kunang, loader desktop, tema, font, ikon/panah, editorial artikel, tiga SVG akar, konten sumber, serta modul animasi editorial/scroll/idea flow yang tidak direvisi.
- **20 region dari lima artikel**—header, cover, isi, footer—identik setelah fingerprint URL aset dinormalisasi. Pengantar, kutipan, daftar isi, sumber, dan catatan kaki tidak diedit.
- Enam halaman redirect artikel dan sembilan halaman lain tetap identik di luar fingerprint aset. Homepage di luar komposisi timbangan juga identik.
- SHA-256 `preview/butterfly.js`: `c20ed791c3a210a9c69c92a425d09bc7e00aaf6bf5ffdae044332b26959c997b`.
- SHA-256 `preview/butterfly.css`: `0f638439257856fb2c4b54854fc28297b989ccfff7f8e5c7802c99a9c6b2cd9a`.

## Matriks browser lokal

Matriks akhir mencakup **74 kasus**: 72 kombinasi sembilan halaman × lebar 320, 390, 768, dan 1440 px × tema terang/gelap, ditambah artikel unggulan pada 1239 dan 1240 px untuk mengapit breakpoint akar. Tinggi viewport 900 px. Halaman yang dicakup: homepage, Ruang Baca, kategori Bedah, tiga artikel repository, serta tiga fixture dari renderer admin (pendek tanpa cover, panjang dengan cover, dan metadata opsional). Fixture hanya ada di salinan QA lokal. Semua hasil akhir diambil setelah `window.load`, `document.fonts.ready`, dan tambahan minimal satu detik; status font seluruhnya `loaded`.

Pada seluruh 74 kasus akhir tidak ada error JavaScript, overflow horizontal, irisan bounding box akar dengan teks header/kontrol/cover/area baca, atau target catatan kaki yang hilang. CLS teramati nol sepanjang jendela pengamatan itu. Kasus 1239 px memakai akar ringkas; 1240 dan 1440 px memakai akar luar. Ini pengamatan browser lokal tanpa throttle dengan cache dikelola browser, bukan skor lab PageSpeed atau jaminan CLS untuk setiap jaringan/perangkat.

Matriks awal disimpan hanya sebagai jejak diagnosis: 71 snapshot terlalu dini, pada callback `DOMContentLoaded`. Satu sampel awal fixture admin pendek, 768 px, tema terang mencatat `0.0160040950` sekitar 156 ms. Kasus itu tidak berulang pada pengujian akhir setelah load/font stabil. Tidak ada perubahan font/layout yang dilakukan berdasarkan sampel awal tersebut, dan tidak disimpulkan adanya regresi atau penyebab font swap yang belum terbukti.

## Interaksi timbangan yang teramati di browser

Trace pada lebar 1440 dan 390 px mencatat klik pointer, aktivasi keyboard, serta klik cepat berulang. Semua frame yang dicatat menjaga geometri, opacity, dan transform alas/tiang tetap; kedua gantungan berputar berlawanan dengan balok, dengan selisih sudut gabungan nol pada matriks transform yang direkam. Jumlah animasi aktif tidak pernah melampaui tiga (balok dan dua gantungan), termasuk setelah dua klik dengan selang sekitar 10–15 ms.

Trace desktop berakhir pada keadaan `static`, tanpa animasi aktif. Trace 390 px merekam satu siklus pointer dan satu siklus keyboard kembali `static` sebelum aktivasi keyboard berikutnya; snapshot terakhir diambil saat siklus berikutnya baru dimulai. Fokus keyboard tetap pada ilustrasi, dengan nama “Gerakkan timbangan Nalar Hakim” dan outline solid 2 px. Pengujian lebar mobile ini menggunakan pointer dan keyboard pada viewport kecil, bukan perangkat layar sentuh fisik.

Pada 320 px, klik ilustrasi lalu scroll dua halaman membatalkan gerak: keadaan menjadi `static` dengan nol animasi saat ilustrasi di luar layar (y≈−1633). Kembali ke atas mempertahankan keadaan diam; tidak ada replay otomatis saat masuk viewport lagi.

Urutan visual timbangan juga diambil dengan menjeda animasi WAAPI yang benar-benar berjalan pada 0, 506, dan 1056 ms, kemudian menyelesaikannya sampai diam. Ini frame pemeriksaan asli dari animasi situs, bukan video real-time atau gerak pengganti yang dibuat oleh alat QA.

## Kontinuitas cover dan fallback yang teramati

Jalur yang diuji adalah kartu utama Ruang Baca menuju “Kerja yang tidak masuk rekening: menguji pembagian harta bersama” (`artikel/harta-bersama-bukan-seluruhnya-warisan/`). Pada baseline, snapshot sumber 752,5 × 376,25 px (2:1) berubah menuju kotak tujuan 940 × 293,75 px (3,2:1), sementara overlay dipotong mulai y≈732. Browser juga menjalankan fade-in/fade-out. Perjalanan dari thumbnail di atas batas tersebut menjadi tidak terlihat; ini reproduksi masalah kontinuitas, bukan dugaan berdasarkan kode saja.

Pada revisi, trace navigasi native di viewport aktual 1363 × 988 px menunjukkan satu animasi grup cover berdurasi 420 ms: dari x=48, y=320, ukuran 752,5 × 376,25 menuju x=380, y=732, ukuran 587,5 × 293,75. Proporsi gambar tetap 2:1. Tidak ada pasangan animasi fade-in/fade-out cover; trace mencapai `pagereveal-finished` dan tidak menyisakan animasi. Pengamatan normal ini terpisah dari screenshot berurutan yang membekukan animasi native asli pada 0, 90, 180, dan 350 ms. Screenshot beku tidak diklaim sebagai rekaman real-time.

Pada uji 1180 × 757 px di lingkungan ini, cover tujuan justru mulai pada y=784,234, di luar viewport; navigasi biasa dipilih dengan sengaja. Posisi itu berbeda dari y≈672 pada audit pengguna. Pengantar/judul tidak dipindahkan untuk memaksa transisi. Perbedaan geometri lingkungan dilaporkan, bukan dianggap sebagai bukti efek harus selalu muncul pada viewport tersebut.

Dengan lebar tetap 1180 px dan tinggi 900 px, posisi cover tetap y=784,234 sehingga sekitar 115,8 px terlihat. Trace merekam rangkaian frame transisi native hingga `pagereveal-finished`, lalu nol animasi aktif. Pasangan uji ini membedakan fallback cover di luar layar dari efek yang berfungsi ketika cover terlihat.

| Skenario browser | Hasil yang diamati |
| --- | --- |
| Back, Forward, reload | URL tujuan benar; traversal/reload tidak menjalankan animasi cover |
| Cover admin IMG sudah dimuat | Animasi cover native terinisiasi dan selesai; rasio foto dipertahankan |
| Cover benar-benar gagal (URL tidak ada, natural size 0) | Navigasi artikel tetap berjalan tanpa transisi cover |
| IMG belum siap | Cabang `complete=false` disimulasikan pada fixture; navigasi berjalan tanpa menunggu |
| Dukungan transisi tidak tersedia | Pemeriksaan kemampuan aplikasi disimulasikan false; aplikasi transisi tidak terinisialisasi, navigasi tetap berjalan |
| Reduced-motion | API preferensi dan CSS disimulasikan di harness; timbangan tetap utuh/diam, tidak ada animasi cover |

Simulasi IMG belum siap bukan pengukuran jaringan lambat, dan simulasi dukungan API bukan pengujian langsung Safari/Firefox. URL artikel juga dibuka langsung pada matriks layout. Perilaku modifier click/tab baru dan artikel tanpa cover dicakup harness serta fixture; tidak diklaim seluruh kombinasi browser/perangkat sudah diuji fisik.

## Interaksi lain dan bukti visual

- Scroll pertama memicu divider dan satu portal kutipan. Setelah scroll keluar/masuk, portal serta divider yang sudah terlihat tetap `shown`; jumlah event mulainya tidak bertambah. Divider lain yang belum terlihat tetap menunggu viewport.
- Hover/fokus wordmark membuka mask hingga opacity 1. Bounding box logo dan navigasi sama sebelum/sesudah; tidak ada pergeseran menu.
- Pada viewport mobile, tautan daftar isi menuju hash bagian yang benar, catatan kaki menuju `#rujukan-1` yang terlihat, dan navigasi kembali mencapai Ruang Baca.
- Pergantian tema dua putaran selesai dengan mode gelap: 0 kupu-kupu/3 kunang-kunang, lalu mode terang: 1 kupu-kupu/0 kunang-kunang. Ini sesuai mekanisme handoff yang dipertahankan; kode companion tetap identik.

Screenshot desktop/mobile, perbandingan baseline/revisi, dan urutan frame tersedia di [indeks bukti visual](review-v3/README.md). Pemeriksaan visual juga mencakup artikel 320 px, tablet 768 px tema terang, dan fixture admin pendek 390 px tema gelap. Alat/probe QA serta artikel fixture tetap di luar source publik. Bukti interaksi browser di atas melengkapi tes unit; keberadaan berkas atau kelulusan harness tidak dipakai sebagai satu-satunya bukti gerak.

## Inventaris ukuran aset

Metode yang sama diterapkan pada baseline Git dan hasil lokal: jumlah byte mentah HTML serta stylesheet/script lokal unik yang dideklarasikan halaman; sumber JavaScript kondisional dari loader desktop ditambahkan terpisah lalu dijumlahkan. Query fingerprint tidak mengubah identitas berkas. SVG inline sudah termasuk HTML. Font, gambar terpisah, resource eksternal, dan dependensi `url()` CSS tidak dihitung. Ini **bukan ukuran transfer jaringan terkompresi atau skor PageSpeed/Lighthouse**.

| Halaman dan dependensi yang dihitung | Baseline (byte) | Revisi (byte) | Selisih |
| --- | ---: | ---: | ---: |
| Homepage, termasuk script desktop kondisional | 182.072 | 196.749 | +14.677 (+8,061%) |
| Ruang Baca | 147.960 | 151.371 | +3.411 (+2,305%) |
| Artikel unggulan “Kerja yang tidak masuk rekening…”, termasuk companion kondisional | 186.527 | 189.938 | +3.411 (+1,829%) |

Kenaikan homepage terutama berasal dari SVG editorial inline (+11.730 byte). Script gerak timbangan sendiri berkurang 634 byte. Tidak ada library animasi baru. Angka PageSpeed produksi terdahulu tidak diukur ulang dan tidak dibandingkan dengan localhost seolah lingkungannya setara.

## Status dan batas verifikasi

Publikasi revisi ini dibatasi pada `main` dan GitHub Pages. [GitHub Actions](https://github.com/AzrielChoerulHakim/nalar_hakim/actions) menyimpan status CI dan publikasi untuk setiap commit. Commit sumber yang memuat revisi tercatat dalam riwayat Git; publikasi Pages tidak berarti website VPS ikut berubah. Pemeriksaan browser native dilakukan pada browser yang tersedia; simulasi fallback tanpa API, reduced-motion, dan IMG belum siap dibedakan dari pengujian browser/perangkat/jaringan nyata. PHP lint, perangkat sentuh fisik, dan seluruh versi Safari/Firefox tidak diverifikasi. Tidak ada deployment ke VPS atau perubahan DNS/server.
