# Status Nalar Hakim — tiga bentuk tulisan

## Struktur publikasi

Website berfokus pada penerbitan karya kritis dengan nama samaran, melalui peninjauan Lazarus. Seluruh tulisan dikelompokkan hanya menjadi:

1. **Esai** — `bentuk/esai/`.
2. **Telaah Fenomena** — `bentuk/telaah/`.
3. **Bedah Putusan atau Norma** — `bentuk/bedah/`.

Navigasi, landing, ruang baca, arsip, sampul, label, metadata, pencarian dan halaman redaksi menggunakan struktur tersebut. Klasifikasi bidang sudah dihapus dari data konten dan generator. Lima arsip bidang serta arsip Perdebatan dicabut dari situs dan sitemap. Tautan koreksi faktual tetap mengarah ke email redaksi.

Lima artikel yang telah ditulis dan diperiksa tetap tersedia pada URL masing-masing. Berkas sumber dinamai menurut slug artikel, tanpa field klasifikasi bidang. Label bentuk diturunkan dari satu definisi bersama agar tidak berbeda antara artikel, pencarian dan arsip.

## Alur pengiriman

Email baru → lampiran Word `.doc`/`.docx` → peninjauan Lazarus → keputusan atau penyuntingan lewat email. Alamat: `nalar.hakim77@gmail.com`. Naskah yang layak diterbitkan; naskah potensial disunting; naskah yang tidak sesuai ditolak. Halaman panduan memuat tautan email dan tombol salin alamat.

Pengiriman, lampiran dan korespondensi tetap berlangsung di email. Website tidak mengirim notifikasi sendiri. Nama samaran tidak disamakan dengan jaminan anonimitas teknis. Penghapusan jejak identitas pengelola ditunda sesuai keputusan pemilik.

## Pemeriksaan

Generator menghasilkan 21 HTML: 15 halaman utama dan enam pengalihan historis artikel. Pemeriksa tautan mencakup 588 tautan lokal, aset dan anchor. Pemeriksa juga menolak arsip atau tautan klasifikasi yang telah dicabut. Indeks pencarian dan sitemap dibangun dari tiga bentuk yang tersedia.

Sintaks JavaScript, struktur naskah, kecocokan sumber/penanda, determinisme generator dan paket tema diperiksa sebelum publikasi. Isi argumentasi serta sumber kelima artikel tidak diubah pada penyederhanaan struktur ini.

Pemeriksaan tampilan revisi sebelumnya mencakup HP/desktop dalam kedua tema. Revisi tiga bentuk menjalani pemeriksaan tambahan atas navigasi, landing, daftar bentuk, arsip, label artikel dan pencarian. Pemeriksaan kontras dasar/ukuran teks bukan audit aksesibilitas menyeluruh. Status lint PHP serta deployment tersedia pada GitHub Actions.

## Desain dan fondasi WordPress

Palet alam, ilustrasi Justitia, serta animasi ringan dipertahankan. Teks artikel 20px desktop/19px HP; judul memakai font sistem dengan bobot yang lebih terukur. Animasi berjalan otomatis tanpa tombol jeda pada desktop yang mendukungnya; HP dan reduced-motion tetap statis. Tidak ada penambahan library, 3D, font eksternal atau video latar.

Fondasi WordPress mengikuti tiga bentuk yang sama dan nama samaran per artikel. Aktivasi tidak menghapus data pengguna; penataan kategori pada instalasi nyata dijelaskan di INSTALL. WordPress belum dipasang atau diuji dengan database hidup dan belum sepenuhnya setara dengan situs statis.

Migrasi VPS, domain dan penataan jejak identitas tetap menjadi tahap berikutnya. Canonical GitHub Pages dipertahankan. Tidak ada klaim bahwa versi ini sudah dipasang di VPS atau terindeks Google.
