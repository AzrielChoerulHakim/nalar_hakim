# Pemeriksaan peluncuran

## Fungsional

- [ ] Aktivasi berhasil tanpa PHP error; lima kanal tersedia tanpa duplikasi.
- [ ] Situs kosong memberi tampilan yang rapi; tidak membuat berita palsu.
- [ ] Buat draf, pratinjau, terbitkan, edit, lalu gunakan revisi WordPress.
- [ ] Artikel utama dan tiga pendamping tidak berulang pada grid terbaru di halaman yang sama.
- [ ] Arsip kanal, pencarian berhasil/tanpa hasil dan pagination bekerja.
- [ ] Artikel panjang, gambar, kutipan, tabel, daftar dan artikel berpassword tampil benar.
- [ ] Jadwal terbit diuji dengan cron server sebelum diandalkan.
- [ ] Byline publik, feed, halaman penulis dan REST tidak menampilkan nama/login asli; wp-admin tetap bekerja.
- [ ] Salin alamat berhasil pada HTTPS dan memberi pesan jujur saat clipboard ditolak.
- [ ] Scan QR menghasilkan tepat `0x39fbbC339D69ae2F8B671f7fE1D356086137e2bE`; label Ethereum Mainnet terlihat.
- [ ] Kontak menuju nalar.hakim77@gmail.com.

## Tampilan dan performa

- [ ] Lebar 360/390/768/1280 px tidak membuat body meluber; kanal/tabel boleh digeser di wadahnya.
- [ ] Keyboard, fokus, skip-link, kontras dan pembesaran teks 200% diperiksa.
- [ ] Tema terang/gelap bekerja, termasuk jika penyimpanan browser ditolak.
- [ ] Reduced motion dihormati; tidak ada video otomatis/animasi terus-menerus.
- [ ] Ukuran gambar dan dimensi dicantumkan; gambar utama diprioritaskan.
- [ ] Uji Lighthouse mobile pada beranda dan artikel representatif, bukan halaman kosong saja.
- [ ] Target LCP ≤2,5 detik dan CLS ≤0,1 dicatat bersama konfigurasi uji; bukan jaminan sebelum diuji.

## Server

- [ ] HTTPS, pembaruan WordPress dan akses admin berfungsi.
- [ ] Cache publik tidak menyimpan login, admin, pratinjau privat atau respons pengguna masuk.
- [ ] Database, konfigurasi dan rahasia tidak ada di repo maupun direktori publik yang dapat diunduh.
- [ ] Pemilik menangani backup sendiri sesuai pilihannya.
