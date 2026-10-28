# Pemeriksaan peluncuran

## Fungsional

- [ ] Aktivasi berhasil tanpa PHP error; Esai (`esai`), Telaah Fenomena (`telaah`) dan Bedah Putusan atau Norma (`bedah`) tersedia tanpa duplikasi.
- [ ] Aktivasi tidak menghapus kategori atau memindahkan artikel lama. Pada pembaruan tema aktif, tiga kategori diperiksa atau dibuat manual.
- [ ] Navigasi dan label artikel hanya menampilkan tiga bentuk tulisan. Arsip kategori lain dan arsip tag menuju beranda; artikel lama tetap dapat dibuka dan dapat diberi bentuk yang sesuai secara manual.
- [ ] Bacaan terkait menggunakan bentuk tulisan yang sama; artikel tanpa bentuk yang sesuai tidak memunculkan bagian tersebut.
- [ ] Situs kosong memberi tampilan yang rapi; tidak membuat berita palsu.
- [ ] Buat draf, pratinjau, terbitkan, edit, lalu gunakan revisi WordPress.
- [ ] Artikel utama dan tiga pendamping tidak berulang pada grid terbaru di halaman yang sama.
- [ ] Arsip tiga bentuk tulisan, pencarian berhasil/tanpa hasil dan pagination bekerja.
- [ ] Artikel panjang, gambar, kutipan, tabel, daftar dan artikel berpassword tampil benar.
- [ ] Jadwal terbit diuji dengan cron server sebelum diandalkan.
- [ ] Nama samaran yang disepakati tersimpan melalui **Nama penulis publik**, tampil pada byline, feed dan oEmbed; nilai kosong hanya digunakan untuk tulisan Lazarus. Nama/login akun tidak muncul pada jalur publik yang diperiksa; wp-admin tetap bekerja.
- [ ] Tautan Kirim Naskah, Tentang dan Kebijakan Redaksi muncul hanya untuk halaman yang diterbitkan tanpa password.
- [ ] Panduan kiriman menjelaskan file Word melalui email dan peninjauan Lazarus; tidak mengesankan naskah terkirim hanya dengan membuka aplikasi email.
- [ ] Kontak koreksi faktual meminta bagian yang keliru dan sumber pembanding.
- [ ] Salin alamat berhasil pada HTTPS dan memberi pesan jujur saat clipboard ditolak.
- [ ] Tiga alamat donasi sesuai README: Bitcoin Taproot, EVM (ETH / BNB / Robinhood / Hyper EVM / Polygon / Morph / Arbitrum), dan Solana. Teks alamat sama persis dengan hasil tombol salin masing-masing; tidak ada gambar QR.
- [ ] Kontak menuju nalar.hakim77@gmail.com.

## Tampilan dan performa

- [ ] Lebar 360/390/768/1280 px tidak membuat body meluber; navigasi/tabel boleh digeser di wadahnya.
- [ ] Keyboard, fokus, skip-link, kontras dan pembesaran teks 200% diperiksa.
- [ ] Tema terang/gelap bekerja, termasuk jika penyimpanan browser ditolak.
- [ ] Animasi desktop berjalan otomatis tanpa tombol jeda; reduced motion dan HP tetap statis. Tab tersembunyi menghentikan gerak; ilustrasi dan aliran gagasan berhenti di luar viewport.
- [ ] Ukuran gambar dan dimensi dicantumkan; gambar utama diprioritaskan.
- [ ] Uji Lighthouse mobile pada beranda dan artikel representatif, bukan halaman kosong saja.
- [ ] Target LCP ≤2,5 detik dan CLS ≤0,1 dicatat bersama konfigurasi uji; bukan jaminan sebelum diuji.

## Server

- [ ] HTTPS, pembaruan WordPress dan akses admin berfungsi.
- [ ] Cache publik tidak menyimpan login, admin, pratinjau privat atau respons pengguna masuk.
- [ ] Database, konfigurasi dan rahasia tidak ada di repo maupun direktori publik yang dapat diunduh.
- [ ] Pemilik menangani backup sendiri sesuai pilihannya.
