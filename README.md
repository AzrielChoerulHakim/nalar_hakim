# Nalar Hakim

Portal hukum beridentitas Web3 yang mengutamakan pembaca HP. Situs statis memuat lima artikel lengkap dengan sumber, satu untuk setiap kanal: Pidana, Perdata, Agama & Keluarga, Filsafat Hukum, serta Hukum & Teknologi.

**Alamat GitHub Pages:** https://azrielchoerulhakim.github.io/nalar_hakim/

Landing page mengantar pembaca ke ruang baca. Artikel memiliki label jenis tulisan, ringkasan, daftar isi, tanggal terbit/pembaruan, penanda rujukan dan daftar sumber. Pencarian mencakup judul, kanal, jenis tulisan dan isi artikel. Situs dapat dibaca tanpa akun; kontennya dikelola melalui berkas JSON di repository.

**Tema WordPress masih berupa fondasi pengembangan 0.1.0. Belum dipasang di VPS, belum diuji menyeluruh pada WordPress hidup, dan belum setara dengan seluruh fitur situs statis.** Status pemeriksaan serta publikasi revisi terbaru dicatat di [docs/STATUS.md](docs/STATUS.md) dan GitHub Actions.

## Ruang lingkup

- Semua byline publik menggunakan **Lazarus**.
- Kontak publik: **nalar.hakim77@gmail.com**.
- Donasi manual **Ethereum Mainnet**, tanpa koneksi wallet atau pengiriman transaksi.
- Alamat: `0x39fbbC339D69ae2F8B671f7fE1D356086137e2bE`.
- Tidak ada fitur AI, langganan, akun pembaca, forum, atau layanan backup otomatis.

## Isi repository

- `content/*.json`: lima artikel lengkap beserta metadata dan sumbernya.
- `index.html`: landing page; `beranda.html`: ruang baca.
- `artikel/`, `kanal/`, `cari.html`, `tentang.html`, `404.html`: halaman hasil generator. Enam alamat artikel lama mengarah ke artikel pengganti.
- `sitemap.xml`: daftar URL utama yang dihasilkan bersama halaman.
- `preview/`: aset lokal, indeks pencarian dan perilaku situs statis.
- `scripts/build-preview.py` dan `scripts/articles.py`: generator halaman dan validasi struktur artikel.
- `theme/nalar-hakim/`: fondasi tema WordPress; `scripts/package.py` membuat ZIP tema.
- `scripts/preflight.sh`: pemeriksaan server baca-saja.
- [docs/INSTALL.md](docs/INSTALL.md): pengelolaan situs statis dan tahap pemasangan WordPress.
- [docs/ACCEPTANCE.md](docs/ACCEPTANCE.md): pemeriksaan sebelum peluncuran WordPress.

## Menyunting artikel

Sunting berkas kanal yang sesuai di `content/`. Setiap artikel berisi `slug`, `channel`, `type`, `title`, `excerpt`, tiga butir `summary`, tanggal `published`/`updated` berformat `YYYY-MM-DD`, `body` berupa HTML, serta `sources` dengan `id`, `title`, `url` dan `note`. Gunakan subjudul `h2`; generator membuat daftar isi dan daftar rujukan. Pertahankan ID penanda yang unik dan tautan ke `#rujukan-N` sesuai sumbernya.

Buka sumber primer yang ditautkan, periksa bagian yang mendukung klaim, serta tinjau perubahan peraturan atau putusan sebelum menerbitkan pembaruan. Cantumkan tautan dokumen atau halaman spesifik dan catatan bagian yang dirujuk. Pemeriksaan otomatis mencocokkan penanda dengan sumber serta memeriksa struktur artikel dan tautan lokal; pemeriksaan itu tidak menilai kebenaran analisis hukum atau isi situs rujukan.

Jalankan dari akar repository:

```sh
python3 scripts/build-preview.py
python3 scripts/check-preview.py
node --check preview/search.js
node --check preview/motion.js
node --check preview/signals.js
```

Commit sumber dan hasil generator bersama, termasuk halaman HTML, indeks pencarian dan `sitemap.xml`. Jangan menyunting halaman hasil generator secara langsung. Jika slug berubah, perbarui pengalihan alamat lama di generator agar tautan masuk tetap berfungsi. Saat ini pemuat konten menggunakan satu berkas untuk setiap kanal; penambahan jumlah artikel memerlukan penyesuaian pemuat tersebut.

## Desain

Struktur editorial terinspirasi Solana News, garis dan ruang dari Monad, serta keterbacaan dari Ethereum. Implementasi, wordmark dan komponen ditulis khusus untuk Nalar Hakim. Tidak menyertakan logo, ilustrasi atau kode situs referensi.

Desain memakai tipografi monumental, komposisi asimetris, garis tegas, bidang warna solid dan ilustrasi SVG dua dimensi. Palet gelap: arang `#181A20`, putih tulang `#ECE8E1`, lavender `#AD9BD9` dan sage `#A8BDA0`. Mode terang memakai krem `#F4F1EB`, teks `#22242A`, ungu `#65508F` dan zaitun `#465C40`. Pilihan tema pembaca disimpan dan diterapkan sebelum CSS tampil.

Metadata serta label minimal 12px, navigasi 13px desktop/12px HP, keterangan 14–16px, dan isi artikel 19px desktop/18px HP. Kontras teks dasar diperiksa pada kedua tema. Ukuran tombol utama minimal 44px. Generator memberi fingerprint otomatis pada CSS, JavaScript dan favicon agar revisi aset terbaca oleh pengunjung lama.

Animasi judul singkat dan jaringan sinyal 2D hanya aktif pada layar minimal 1000 px dengan hover, penunjuk presisi, dan tanpa preferensi pengurangan gerak. Sembilan sinyal berulang di jalur SVG selama hero terlihat; gerak berhenti ketika keluar layar, tab disembunyikan, atau tombol Jeda animasi dipilih. HP menampilkan jaringan statis. Konten terlihat tanpa JavaScript. Tidak ada 3D, WebGL, video latar, library frontend atau unduhan font eksternal.

Identitas bersama ada di `preview/identity.css`, halaman pembuka di `scripts/landing_page.py` dan `preview/landing.css`, sampul datar di `scripts/flat_cover.py`, serta animasi pembuka di `preview/motion.js` dan `preview/motion.css`. Jaringan sinyal ditulis khusus di `scripts/signal_field.py`, `preview/signals.js` dan `preview/signals.css`; pola lengkung dan sinyalnya terinspirasi pengamatan visual landing Monad, tanpa mengambil kode atau asetnya.

## WordPress dan identitas

Untuk membuat paket tema, jalankan `python3 scripts/package.py`, lalu unggah `dist/nalar-hakim.zip` melalui **Tampilan → Tema → Tambah Tema → Unggah Tema** pada instalasi WordPress yang sudah siap. Artikel JSON tidak diimpor otomatis ke WordPress.

Gunakan nama tampilan akun **Lazarus**, nickname dan slug penulis yang tidak mengandung nama asli. Tema menyamarkan byline dan membatasi beberapa jalur publik penulis, tetapi metadata unggahan, teks dan plugin tetap perlu diperiksa sebelum publikasi. Email kontak memang dimaksudkan untuk tampil publik.

QR donasi sudah didekode dan cocok persis dengan alamat di atas. QR menyimpan alamat mentah; pemilihan jaringan tetap dilakukan pengirim. Label Ethereum Mainnet ditampilkan bersama QR.

## Penyimpanan dan server

Repository memuat kode, dokumentasi, artikel publik dan hasil generator. Akun, database WordPress, unggahan privat, `wp-config.php`, kredensial dan kunci privat tetap di luar Git. Backup dikelola pemilik sendiri.

VPS memakai **OpenCloudOS 9.6** dengan paket **Nginx 1.29.8**, **PHP 8.3.36** dan **MariaDB 10.11.19** terpasang. Konfigurasi situs dan deployment WordPress sengaja ditunda.

Acuan WordPress: [persyaratan sistem](https://wordpress.org/about/requirements/), [pengembangan tema](https://developer.wordpress.org/themes/) dan [pemasangan tema melalui WP-CLI](https://developer.wordpress.org/cli/commands/theme/install/).
