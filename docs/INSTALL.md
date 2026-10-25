# Pengelolaan situs dan pemasangan

## Situs statis di GitHub Pages

GitHub Pages menggunakan branch `main`, folder akar repository. `index.html` adalah landing page dan `beranda.html` adalah ruang baca. `.nojekyll` menjaga berkas HTML disajikan sebagai situs statis. Situs ini tidak menjalankan WordPress dan tidak memiliki panel admin.

Artikel disimpan dalam `content/*.json`. Sunting isi, metadata dan sumber pada berkas tersebut. Gunakan tiga butir ringkasan, tanggal berformat `YYYY-MM-DD`, subjudul `h2`, serta penanda rujukan yang cocok dengan ID di `sources`. Isikan `author` dengan nama samaran yang disepakati penulis; gunakan Lazarus hanya untuk tulisan Lazarus. Metadata editorial juga mencakup `format`, `thesis`, `lens`, `object` dan `editorial_revision` sesuai pemuat konten.

Halaman `kirim-naskah.html`, `kebijakan-redaksi.html` dan `tentang.html` menjelaskan pengiriman serta penilaian naskah. Hanya ada tiga bentuk tulisan: **Esai** (`bentuk/esai/`), **Telaah Fenomena** (`bentuk/telaah/`), dan **Bedah Putusan atau Norma** (`bentuk/bedah/`). Pengiriman naskah Word dilakukan melalui email untuk ditinjau Lazarus; situs statis tidak menyediakan akun kontributor atau formulir unggah. Koreksi faktual dikirim ke email redaksi dengan menyertakan sumber.

Sebelum publikasi, buka setiap sumber primer dan pastikan bagian yang dirujuk mendukung klaim; periksa perubahan ketentuan serta tanggal pembaruan artikel. Pakai tautan ke dokumen atau halaman spesifik. Pemeriksaan otomatis memvalidasi struktur dan tautan lokal, bukan kebenaran kesimpulan hukum atau ketersediaan sumber eksternal.

Dari akar repository, jalankan:

```sh
python3 scripts/build-preview.py
python3 scripts/check-preview.py
node --check preview/search.js
node --check preview/motion.js
node --check preview/signals.js
```

Generator membuat halaman, daftar isi, daftar rujukan, indeks pencarian isi artikel dan `sitemap.xml`. Commit sumber dan seluruh hasil generator bersama. Jangan menyunting HTML hasil generator secara langsung. Pertahankan pengalihan alamat lama dalam generator saat mengganti slug. Periksa `scripts/articles.py` saat menambah berkas agar artikel baru terbaca oleh pemuat.

Sebelum menganggap perubahan sudah tayang, periksa hasil workflow **Theme checks** dan deployment GitHub Pages untuk commit tersebut. Cek alur landing → ruang baca → artikel, pencarian kata dalam isi artikel, daftar isi, rujukan, mode terang/gelap dan panel donasi. Periksa HP tanpa gerak, desktop dengan animasi terbatas, serta preferensi pengurangan gerak.

## WordPress di VPS — tahap berikutnya

Pemasangan sengaja ditunda. Paket dasar telah dipasang di **OpenCloudOS 9.6**: **Nginx 1.29.8**, **PHP 8.3.36** dan **MariaDB 10.11.19**, sesuai log pemasangan pemilik. Konfigurasi situs dan pemasangan WordPress belum dilakukan. Tema belum setara dengan seluruh fitur situs statis, dan artikel JSON tidak diimpor otomatis.

Server memiliki 2 vCPU, RAM 4 GB dan SSD 60 GB. Saat tahap VPS dilanjutkan, konfigurasi Nginx, PHP-FPM beserta ekstensi WordPress, database lokal, DNS dan HTTPS; kemudian instal WordPress dari sumber resmi. Kapasitas nyata perlu diuji sesuai trafik dan konten. Dokumen ini tidak menjalankan pemasangan otomatis.

Jangan mengirim password, private key atau isi `wp-config.php` melalui chat/GitHub.

## Pasang tema

1. Jalankan `python3 scripts/package.py` pada checkout kode.
2. Login WordPress → Tampilan → Tema → Tambah Tema → Unggah Tema.
3. Unggah `dist/nalar-hakim.zip`, lalu aktifkan **Nalar Hakim**.
4. Setel nama situs Nalar Hakim dan tagline Ruang Kritik Hukum.
5. Setel zona waktu Jakarta dan permalink Nama tulisan; simpan.
6. Setel identitas akun editor secara terpisah dari nama penulis publik. Lazarus adalah editor dan penulis untuk tulisannya sendiri, bukan nama kolektif semua kontributor.
7. Periksa tiga kategori bentuk tulisan: **Esai** (`esai`), **Telaah Fenomena** (`telaah`), dan **Bedah Putusan atau Norma** (`bedah`). Aktivasi tema membuat kategori yang belum ada, tanpa menghapus kategori atau mengubah penempatan artikel lama.
8. Tulis atau pindahkan artikel melalui editor WordPress, pilih satu dari tiga bentuk tulisan, isi ringkasan dan **Nama penulis publik**, periksa rujukan, pratinjau, lalu terbitkan.
9. Buat halaman dengan slug `kirim-naskah`, `tentang` dan `kebijakan-redaksi`; salin isi redaksional dari versi statis yang sudah ditinjau. Tautan navigasi muncul setelah halaman diterbitkan tanpa password. Tema tidak membuat atau menerbitkan halaman tersebut otomatis.

Beranda awal tema menampilkan artikel terbaru sebagai utama. Tema tidak membuat artikel secara otomatis. Fitur editor bawaan WordPress tetap digunakan.

Pada pembaruan tema yang sudah aktif, periksa atau buat tiga kategori tersebut melalui dashboard karena hook aktivasi tidak berjalan pada setiap pembaruan ZIP. Penempatan artikel lama ke bentuk yang sesuai dilakukan manual. Tema hanya menampilkan tiga bentuk tersebut pada navigasi dan label artikel; arsip kategori lain dan arsip tag diarahkan ke beranda tanpa menghapus datanya. Artikel tanpa bentuk yang sesuai tidak menampilkan bagian bacaan terkait. Kategori lama yang masih tersimpan perlu ditinjau pemilik sebelum WordPress diluncurkan.

Kotak **Nama penulis publik** menyimpan nama samaran pada post meta `_nh_author_alias`. Nilai kosong memakai Lazarus; naskah kontributor harus diisi alias yang disepakati sebelum terbit. Byline artikel, nama penulis pada feed dan respons oEmbed memakai alias tersebut, bukan nama login atau nama tampilan akun WordPress. Akun pengunggah tetap dipakai untuk izin penyuntingan internal.

Periksa penyimpanan alias pada editor, pratinjau, feed dan oEmbed saat WordPress tersedia. Tiga bentuk tulisan menggunakan kategori bawaan WordPress; integrasi plugin, metadata pihak ketiga, tampilan dan alur redaksi belum diuji menyeluruh atau setara dengan situs statis. Pengiriman Word melalui email dan peninjauan Lazarus tetap dikelola manual; tidak ada backend penerimaan naskah, akun kontributor publik atau jaminan anonimitas teknis dari tema.

## Memperbarui tema dan meluncurkan WordPress

Buat ZIP baru dari commit yang sudah ditinjau dan unggah dari dashboard. WordPress akan meminta konfirmasi penggantian versi tema yang sama. Pembaruan tema tidak perlu menyertakan database atau unggahan. Cadangan dikelola pemilik sendiri.

Selesaikan `ACCEPTANCE.md`, hapus konten bawaan WordPress yang tidak dipakai secara manual, isi informasi situs, dan pastikan indeks mesin pencari tidak diblokir setelah siap. Tidak ada kode yang mengubah firewall, kredensial atau server aktif dalam paket ini.
