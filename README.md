# Nalar Hakim

Website publik untuk domain `nalarhakim.com`: ikuti [panduan VPS](docs/VPS_NALARHAKIM.md). Exporter menyediakan paket statis siap pasang dengan nginx dan HTTPS; jalur tema WordPress di bawah tetap terpisah.

Ruang publikasi kritik hukum independen: fenomena aktual dibaca melalui teori, dokumen, dan argumentasi yang terbuka untuk diuji. Identitas penulis ditampilkan sebagai nama samaran; Lazarus mengelola dan menyunting publikasi.

**GitHub Pages:** https://azrielchoerulhakim.github.io/nalar_hakim/

## Arah redaksi

Tiga bentuk tulisan menjadi navigasi utama: **Esai**, **Telaah Fenomena**, dan **Bedah Putusan atau Norma**. Semua tulisan dikelompokkan hanya menurut tiga bentuk tersebut.

Tulisan memiliki objek yang jelas, tesis, lensa teori, sumber dan analisis mendalam. Lima tulisan pembuka telah ditulis ulang sesuai arah ini. Platform berfokus pada penerbitan karya kritis dengan nama samaran dan peninjauan Lazarus.

## Pengiriman dan keputusan

1. Penulis membuat email baru dan menyiapkan berkas Word `.doc` atau `.docx`.
2. Naskah dikirim ke **nalar.hakim77@gmail.com**, dengan nama samaran atau Anonim dan sumber rujukan.
3. Lazarus meninjau: naskah layak diterbitkan, naskah potensial disunting, dan naskah yang jauh dari arah redaksi ditolak.
4. Keputusan serta pembicaraan revisi disampaikan lewat email pengirim.

`kirim-naskah.html` memuat panduan, tautan `mailto:` dengan subjek siap pakai, dan tombol salin alamat dengan petunjuk manual bila clipboard tidak tersedia. Lampiran ditambahkan oleh pengirim di layanan email. Website tidak mengunggah Word, tidak mengirim email sendiri, dan tidak menyediakan peninjauan/notifikasi otomatis.

Email baru tidak menjamin anonimitas teknis. Website menjelaskan batas tersebut secara ringkas. Naskah mentah, korespondensi dan data pribadi tidak dimasukkan ke repository; hanya karya final yang telah disiapkan untuk publikasi.

**Pembersihan jejak identitas pengelola dan migrasi VPS ditunda sesuai keputusan pemilik.** Canonical, akun repository dan alamat GitHub Pages belum dipindah. Tidak ada klaim bahwa situs sudah dipasang di VPS atau terindeks Google.

## Isi repository

- `content/*.json`: naskah publik beserta metadata dan sumber.
- `index.html`: landing; `beranda.html`: ruang baca.
- `bentuk/`: tiga arsip bentuk tulisan.
- `artikel/`: artikel dan enam pengalihan alamat lama dengan tujuan tetap.
- `kirim-naskah.html`, `kebijakan-redaksi.html`, `tentang.html`: pengiriman, pertimbangan Lazarus dan identitas publikasi.
- `cari.html`, `404.html`, `sitemap.xml`: pencarian lokal, halaman kesalahan dan peta URL.
- `scripts/build-preview.py`, `articles.py`, `editorial_pages.py`, `landing_page.py`: generator, validasi dan sumber halaman.
- `preview/`: gaya, ilustrasi SVG dan JavaScript lokal.
- `theme/nalar-hakim/`: fondasi WordPress; `scripts/package.py` membuat ZIP.
- [docs/INSTALL.md](docs/INSTALL.md): pengelolaan konten dan pemasangan WordPress.
- [docs/STATUS.md](docs/STATUS.md): status serta batas pemeriksaan.

## Menambahkan tulisan yang telah disetujui

Tambahkan satu berkas JSON di `content/` dengan nama unik. Setiap bentuk dapat memuat banyak tulisan. Pemuat mengurutkan artikel berdasarkan tanggal terbit terbaru; untuk tanggal sama digunakan urutan slug yang stabil.

Field naskah: `slug`, `format`, `author`, `title`, `excerpt`, `thesis`, `lens`, `object`, tiga butir `summary`, `published`, `updated`, `editorial_revision`, HTML `body`, dan daftar `sources`. Tanggal menggunakan `YYYY-MM-DD`. `author` adalah nama samaran publik; jangan mengisinya dengan identitas privat.

`format` menggunakan `esai`, `telaah`, atau `bedah`. Label tampilan diturunkan otomatis dari definisi tiga bentuk tersebut. Setiap sumber memiliki `id`, `title`, `url`, `note`, tautan `#rujukan-N` dan penanda unik `id="penanda-N"` di dalam naskah. Subjudul `h2` membentuk daftar isi bila terdapat sedikitnya tiga bagian. Panjang tulisan diputuskan redaksi, bukan dipaksakan oleh generator.

Buka sumber yang dirujuk, cocokkan bagian yang mendukung klaim, dan bedakan teks primer dari komentar. Validasi otomatis hanya memeriksa struktur dan hubungan rujukan; tidak membuktikan kebenaran analisis hukum.

```sh
python3 scripts/build-preview.py
python3 scripts/check-preview.py
node --check theme/nalar-hakim/assets/site.js
node --check preview/search.js
node --check preview/motion.js
node --check preview/signals.js
python3 scripts/package.py
```

Commit sumber bersama seluruh hasil generator. Jangan menyunting HTML hasil secara langsung. Slug yang sudah terbit dipertahankan; pengalihan historis tidak berubah saat artikel baru ditambahkan.

## Desain dan pembacaan

Identitas alam memakai warna putih kabut, hutan, langit dan batu. Judul memakai font sistem; isi artikel memakai Georgia 20px desktop/19px HP dengan jarak baris 1,8. Pilihan tema diterapkan sebelum CSS tampil. Aset lokal diberi fingerprint otomatis.

Animasi berjalan otomatis pada desktop dengan hover, pointer presisi, serta tanpa preferensi pengurangan gerak. Tidak ada tombol jeda. Ilustrasi dan aliran gagasan berhenti saat keluar viewport; semua gerak berhenti saat tab tersembunyi. Mode terang memakai satu kupu-kupu, mode gelap tiga kunang-kunang, dengan pergantian keluar–masuk berurutan dan titik hinggap pada judul. HP tetap statis. Tidak ada library frontend, font eksternal, WebGL, 3D atau video latar.

## Donasi

- Label Ethereum Mainnet, BSC, dan Robinhood; tanpa koneksi dompet atau pengiriman transaksi oleh website.
- Alamat: `0x39fbbC339D69ae2F8B671f7fE1D356086137e2bE`.
- Alamat teks dan tombol salin terpisah untuk setiap label; tidak ada gambar QR.
- Membaca dan mengirim naskah tidak dipungut biaya; donasi tidak menentukan keputusan redaksi.

## Fondasi WordPress

Tema WordPress **belum dipasang di VPS dan belum setara seluruhnya dengan situs statis**. Field `_nh_author_alias` tersedia untuk nama samaran per artikel; byline, feed dan oEmbed memakai alias, default Lazarus. Halaman pengiriman, Tentang dan kebijakan dibuat manual dan ditautkan bila telah terbit. JSON tidak diimpor otomatis.

Jalankan `python3 scripts/package.py` untuk membuat paket. Kredensial, database, unggahan privat, korespondensi dan konfigurasi server tetap di luar Git. Backup dikelola pemilik sendiri.

## Identitas visual alam

Rencana dan batas implementasi: [docs/NATURAL_REDESIGN.md](docs/NATURAL_REDESIGN.md). Palet putih kabut, hutan, langit dan batu diterapkan pada seluruh halaman statis. Landing memuat ilustrasi Justitia berakar dengan burung, air, dan daun bergerak pada desktop; HP/reduced-motion tetap statis. Pengunjung baru memakai tema terang.

Sumber ilustrasi: `scripts/nature_scene.py`; gaya: `preview/natural.css`, `preview/natural-landing.css`, `preview/nature-scene.css`; kendali gerak: `preview/nature-scene.js`. Uji siklus gerak: `node scripts/check-nature-motion.cjs`.
