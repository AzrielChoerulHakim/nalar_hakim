# Review hero dan gerak editorial

Status: implementasi di branch lokal `review/hero-editorial-motion`, berdasarkan `9374e76384adfba193ab09e6d1b65ee262c49797`. Tidak dipush, tidak dipasang ke VPS, dan tidak mengubah DNS atau produksi. Workflow yang terlihat hanya menjalankan pemeriksaan; konfigurasi publikasi eksternal belum diasumsikan aman untuk push.

## Perubahan

- Hero memakai SVG timbangan orisinal, tanpa figur Justitia, langit/burung, batu, akar, sungai atau dedaunan. Aset bitmap lama tidak dirujuk lagi oleh hero. File historisnya tetap ada untuk menghindari penghapusan aset yang tidak diperlukan.
- Reveal bertahap dan gerak total sekitar 3,55 detik. Tiang/alas stabil, balok berporos di tengah, dua gantungan memakai rotasi berlawanan sehingga piringan tetap mendatar. Gerak selesai, tidak berulang otomatis. Tombol ulang dinonaktifkan selama siklus; keyboard memakai tombol native. Ketika keluar viewport, tab tersembunyi atau preferensi berubah, animasi selesai ke keadaan utuh.
- Tiga batas bagian homepage diberi garis tinta yang terungkap sekali. Tinggi layout tidak berubah. NH dan aksen wordmark memakai mask/fade pada hover/fokus desktop; nama asli selalu tampak dan lebar header tetap.
- Satu portal SVG cover Esai ditempatkan di sebelah kutipan, dan setelah kutipan pada mobile. Kutipan adalah **seluruh tesis yang sudah tersedia** dari artikel `hukum-yang-sah-belum-tentu-adil`, dengan byline Lazarus serta tautan sumber; tidak ada kutipan/atribusi baru.
- Cover kartu ke halaman baca memakai Cross-document View Transitions native selama 360 ms. Tidak ada SPA, pencegatan navigasi, permintaan konten kedua, atau waktu tunggu buatan. Hanya cover yang diberi nama transisi. Gambar cocok berdasarkan URL dan posisi fokus, atau sidik SVG. Overlay dibatasi ke wilayah cover tujuan agar judul, isi dan catatan kaki tetap bebas. Cover di luar viewport atau belum siap dilewati dengan navigasi normal.
- Markup publisher admin yang sudah ada didukung tanpa perubahan kode admin. Artikel tanpa cover, gambar gagal/lambat, history/direct/reload, modified click, storage terblokir dan browser tanpa API mendapat fallback biasa.

## File yang disentuh

| Kelompok | File |
| --- | --- |
| Timbangan | `scripts/nature_scene.py`, `preview/nature-scene.css`, `preview/nature-scene.js` |
| Aksen editorial | `preview/editorial-motion.css`, `preview/editorial-motion.js` |
| Transisi cover | `preview/article-transitions.css`, `preview/article-transitions.js` |
| Integrasi generator | `scripts/landing_page.py`, `scripts/build-preview.py`, `scripts/styles.py` |
| Pengujian/CI | `scripts/check-nature-motion.cjs`, `scripts/check-editorial-motion.cjs`, `scripts/check-article-transitions.cjs`, `.github/workflows/check.yml` |
| Hasil generator | `index.html`, `beranda.html`, halaman pencarian/informasi, tiga arsip bentuk, lima halaman artikel, `preview/landing-bundle.css`, `preview/publication.css` |
| Dokumentasi | `README.md`, dokumen ini, `docs/hero-motion-evidence.json` |

Tidak ada perubahan pada `content/*.json`, font, ikon panah, `preview/butterfly.js`, `preview/butterfly.css`, loader companion, atau isi `theme/nalar-hakim/assets/site.js`. Pemeriksaan terhadap baseline memastikan 20 file terlindungi identik byte demi byte. Header/pengantar, isi, dan footer/rujukan lima artikel identik setelah parsing HTML (15 region); enam redirect artikel tetap utuh.

## Pemeriksaan kode

- Generator: 21 halaman HTML, lima artikel; build ulang deterministik tanpa selisih.
- 554 route/aset/anchor lokal lulus.
- 91 tes: timbangan 17, transisi cover 12, companion 21, scroll story 15, idea flow 8, release statis 14, ikon 4. Harness lifecycle editorial juga lulus.
- Syntax 11 berkas JavaScript, packaging tema, dan `git diff --check` lulus.
- 25 tes admin Python lulus. Fixture visual dibuat memakai fungsi publisher yang sebenarnya: cover terisi, tanpa cover, dan gambar gagal. Ini bukan klaim uji login/publish melalui browser admin produksi.
- PHP tidak tersedia, sehingga 13 file PHP yang tidak berubah tidak dilint. Tes release berjalan di direktori sementara; pergantian UID tidak tersedia di lingkungan ini.

## Pemeriksaan visual dan interaksi

Chrome cloud 155 digunakan dengan iframe pada lebar **320, 390, 768, 1440 px**; ini bukan emulasi perangkat fisik/touch. Homepage, ruang baca, artikel statis, artikel hasil publisher dengan cover, dan tanpa cover diuji pada keempat lebar (20 kombinasi). Tidak ditemukan overflow horizontal. Scrollbar browser memakai 15 px dari lebar konten.

Terang/gelap, keadaan final timbangan, tombol ulang via keyboard, fokus pencarian mobile, submit pencarian, portal yang berhenti utuh, dan navigasi artikel diperiksa. JavaScript benar-benar dimatikan melalui sandbox iframe: teks, navigasi dan SVG statis tetap tersedia. Reduced-motion diuji melalui simulasi API/CSS QA, bukan perubahan preferensi OS.

Native navigation artikel asli dan artikel hasil admin memunculkan `pagereveal` dengan transisi aktif, satu cover bernama, `ready=true` dan `finished=true`. Back/Forward, reload dan Ctrl-click tab baru berfungsi. Fixture gambar gagal tetap menampilkan isi serta tautan catatan kaki yang bekerja. Direct link dan tanpa cover tetap terbaca.

Rapid-click guard, scroll keluar/masuk tanpa autoplay ulang, BFCache cleanup, blocked storage, gambar belum selesai, serta API yang tidak tersedia diperiksa dalam harness deterministik. Browser Safari/Firefox, perangkat mobile fisik, dan throttling jaringan nyata belum diuji. Tidak ada klaim pengujian browser lama yang sebenarnya.

## Pengukuran lokal

Baseline dan hasil akhir disajikan dari server preview lokal yang sama. Pada 390 dan 1440 px dilakukan tiga pasangan sebelum/sesudah secara berselang-seling (12 observasi), masing-masing 5 detik, cache dikelola browser, tanpa throttle CPU/jaringan. Semua 12 mencatat CLS 0, long-task excess 0 ms, tanpa error JS dan tanpa overflow. Long-task excess bukan TBT Lighthouse. LCP tidak tersedia secara andal setelah interaksi wrapper, sehingga tidak dipakai untuk klaim peningkatan.

Di luar seri berpasangan tersebut, satu reload desktop mencatat CLS sekitar **0,004673**, dan reload lain sekitar **0,000013**. Atribusi terakhir menunjukkan pergeseran kecil pada bagian bawah viewport di awal kutipan. Pergantian font lokal pada kutipan merupakan kandidat penyebab; belum dibuktikan untuk observasi 0,004673. Jadi tidak ada klaim bahwa semua first load selalu CLS 0.

| Estimasi dependensi homepage (ukuran berkas, belum dikompresi HTTP) | Sebelum | Sesudah |
| --- | ---: | ---: |
| Mobile/non-capable | 305.179 B | 232.218 B |
| Desktop dengan companion | 332.506 B | 259.545 B |

Sesudah mencakup font Source Serif 4 regular sebesar 76.260 B yang digunakan portal. Penghapusan referensi bitmap Justitia 168.766 B mengimbangi pertambahan HTML/CSS/JS. Selisih bersih 72.961 B (23,91% mobile; 21,94% desktop). Ini inventaris aset, bukan pengukuran transfer jaringan. Skor PageSpeed produksi 93/97 milik pengukuran lama tidak diukur ulang dan tidak dibandingkan dengan localhost.

## Meninjau secara lokal

Paket preview berisi `public/` hasil exporter tanpa probe QA atau fixture artikel palsu, serta sumber dari commit review. Dari folder paket, jalankan:

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory public
```

Buka `http://127.0.0.1:8000/`. Reload untuk melihat reveal; tombol **Ulangi gerak timbangan** memainkan satu siklus. Scroll ke kutipan dan batas bagian; fokus/hover logo; masuk ruang baca lalu pilih cover artikel. Browser yang tidak mendukung transisi dokumen tetap membuka artikel biasa. Jangan mengaktifkan paket ini di produksi sebelum review.

Screenshot desktop/mobile tersedia terpisah. Capture video otomatis tidak cukup stabil untuk rekaman yang dapat diandalkan; paket preview menjadi cara meninjau gerak pada kecepatan aslinya.
