# Memasang Nalar Hakim di nalarhakim.com

Panduan ini memasang website publik yang sudah dibangun ke VPS **Ubuntu 24.04 LTS**, memakai nginx dan HTTPS Let's Encrypt. Alamat utamanya `https://nalarhakim.com`; `www.nalarhakim.com` akan mengarah ke sana. VPS cukup menyajikan HTML, CSS, JavaScript, dan gambar. Tidak perlu memasang Node.js, Python, PHP, WordPress, atau database untuk website publik ini.

Panduan dan paket sudah disiapkan; pemasangan ke VPS belum dilakukan. IP VPS dan akses SSH belum diberikan. Ganti `IP_VPS` dan `USER_VPS` di contoh dengan IP publik dan akun SSH Anda. Jangan mengetik placeholder itu apa adanya.

## 1. Hubungkan domain ke VPS

Buka pengaturan DNS tempat Anda membeli atau mengelola domain, lalu buat:

| Jenis | Nama/host | Nilai |
| --- | --- | --- |
| A | `@` | IPv4 publik VPS |
| CNAME | `www` | `nalarhakim.com` |

Jika penyedia DNS meminta nama lengkap, gunakan `nalarhakim.com` untuk `@` dan `www.nalarhakim.com` untuk `www`. Jangan menambahkan `https://` atau nomor port. Jangan membuat CNAME dan A sekaligus pada nama `www`.

Record AAAA hanya diperlukan jika VPS benar-benar melayani IPv6. Bila ada AAAA lama yang mengarah ke server lain, perbaiki atau hapus record lama tersebut. Pengunjung dan validasi sertifikat bisa memakai IPv6 meskipun record A sudah benar. Jika memakai proxy DNS seperti Cloudflare, gunakan **DNS only** selama pemasangan awal agar pengujian langsung menuju VPS.

Izinkan koneksi masuk TCP **80 dan 443** di firewall panel VPS. Pertahankan port SSH yang sekarang dipakai; jangan mengubah aturan SSH ketika masih mengandalkan sesi jarak jauh. Port 80 tetap diperlukan untuk penerbitan dan perpanjangan sertifikat melalui metode HTTP yang dipakai paket ini.

Cek dari komputer Anda setelah DNS berubah:

```bash
nslookup nalarhakim.com
nslookup www.nalarhakim.com
ssh USER_VPS@IP_VPS
```

Kedua nama harus menuju VPS yang sama. Perubahan DNS dapat memerlukan waktu sesuai TTL dan cache penyedia DNS.

## 2. Siapkan nginx di VPS

Jalankan di sesi SSH VPS:

```bash
sudo apt-get update
sudo apt-get install -y nginx unzip ca-certificates curl
sudo nginx -t
sudo systemctl status nginx --no-pager
```

Jika UFW sudah aktif, izinkan kedua port web. Periksa status dahulu:

```bash
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

Tidak perlu menjalankan `ufw enable` dari panduan ini. Jika UFW belum terpasang, gunakan firewall panel VPS atau aturan firewall yang memang sudah Anda kelola.

Installer menambah satu vhost bernama `nalarhakim-public`. Konfigurasi default nginx, website lain, dan admin lama tetap dipertahankan. Jika `nalarhakim.com` sudah disebut dalam konfigurasi lain, installer akan berhenti dan menunjukkan file yang perlu diperiksa. Jangan menghapus vhost lain untuk melewati pemeriksaan ini. Jika port 80/443 dipakai Apache, Caddy, atau layanan lain, selesaikan pemetaan port terlebih dahulu; panduan ini mengasumsikan nginx sebagai server web.

## 3. Unggah paket website yang sudah dibangun

Gunakan paket **`nalarhakim-vps.zip`**, bukan ZIP seluruh repo atau paket tema WordPress lama. Isi paket yang benar:

```text
public/             Halaman dan aset yang boleh diakses pengunjung
deploy/             Installer dan konfigurasi nginx
SHA256SUMS          Pemeriksaan isi public/
release.json        Domain, ID rilis, dan jumlah file
PANDUAN_VPS.md       Panduan ini
```

Dari terminal komputer Anda, unggah paket:

```bash
scp nalarhakim-vps.zip USER_VPS@IP_VPS:~/nalarhakim-vps.zip
```

Lalu di VPS, ekstrak ke folder baru dan pasang:

```bash
mkdir -p ~/rilis-nalarhakim/pertama
unzip ~/nalarhakim-vps.zip -d ~/rilis-nalarhakim/pertama
cd ~/rilis-nalarhakim/pertama
sudo bash deploy/install.sh
```

ZIP yang disediakan meletakkan `public/` dan `deploy/` langsung pada akar arsip. Jika Anda membuat ZIP sendiri dengan folder pembungkus, masuk dahulu ke folder yang berisi `deploy/install.sh`.

Installer memeriksa checksum, menyalin file ke `/var/www/nalarhakim/releases/ID_RILIS/public`, lalu mengganti symlink `/var/www/nalarhakim/current` dalam satu operasi. Rilis yang belum selesai disalin tidak menjadi website aktif. Installer menolak symlink, file tambahan di luar manifest, dan tujuan yang sudah digunakan aplikasi lain.

Pergantian file publik dilakukan sebelum konfigurasi nginx diperiksa ulang dan dimuat. Jika tahap nginx kemudian gagal, konfigurasi vhost dipulihkan, tetapi rilis publik yang baru sudah aktif di `current`. Periksa pesan kegagalan; gunakan paket lama melalui langkah pemulihan di bawah jika Anda juga ingin mengembalikan isi website.

Periksa HTTP sebelum meminta sertifikat:

```bash
curl -I http://nalarhakim.com
curl -I http://www.nalarhakim.com
```

Keduanya harus memberikan respons website publik, biasanya `200 OK`. Pada tahap ini HTTPS belum diaktifkan. Sumber dan installer berada di luar direktori yang disajikan nginx.

## 4. Aktifkan HTTPS

Periksa apakah Certbot sudah ada:

```bash
command -v certbot
```

Jika sudah ada, gunakan instalasi tersebut. Jangan menumpuk instalasi apt dan snap. Pada VPS baru yang belum memiliki Certbot, instalasi snap mengikuti petunjuk Ubuntu dan Certbot:

```bash
sudo apt-get install -y snapd
sudo snap install --classic certbot
```

Masih dari folder paket, jalankan:

```bash
sudo bash deploy/enable-https.sh
```

Certbot akan meminta email dan persetujuan ketentuan layanan Let's Encrypt. Script meminta sertifikat untuk `nalarhakim.com` dan `www.nalarhakim.com` lewat direktori challenge khusus. Setelah sertifikat terbit, script memvalidasi konfigurasi HTTPS dan memuat ulang nginx. Jika validasi atau reload gagal, perubahan vhost dikembalikan. Tidak ada layanan admin atau database yang disentuh.

Uji hasilnya:

```bash
curl -I https://nalarhakim.com
curl -I http://nalarhakim.com
curl -I https://www.nalarhakim.com
curl -I https://nalarhakim.com/alamat-yang-tidak-ada
```

Hasil yang diharapkan: domain utama HTTPS `200`, HTTP dan `www` mengarah ke `https://nalarhakim.com` dengan `308`, dan alamat yang tidak ada tetap berstatus `404` dengan halaman bantuan Nalar Hakim.

Untuk instalasi snap, periksa perpanjangan sertifikat:

```bash
sudo /snap/bin/certbot renew --dry-run
systemctl list-timers --all | grep -i certbot
```

Jika menggunakan Certbot yang sudah terpasang sebelumnya, ganti `/snap/bin/certbot` dengan path yang ditampilkan `enable-https.sh`. Snap menyediakan penjadwalan pembaruan. Pada instalasi lain, pastikan timer atau cron perpanjangannya benar-benar tersedia. Hook milik Nalar Hakim memeriksa lalu memuat ulang nginx setelah sertifikat diperbarui. Biarkan DNS dan port 80 tetap benar agar pembaruan berikutnya berhasil.

## 5. Periksa tampilan dan tautan

Buka situs pada desktop dan ponsel, termasuk satu artikel. Pastikan tema terang/gelap, pencarian, tombol salin alamat donasi, dan tautan artikel bekerja. Animasi desktop tetap mengikuti ukuran layar serta pengaturan pengurangan gerak perangkat; ponsel tidak memuat gerak pendamping yang berat.

Paket domain memakai canonical, Open Graph, data artikel, tautan berbagi, sitemap, robots.txt, dan alamat pemulihan 404 dengan akar `https://nalarhakim.com/`. Tidak perlu menaruhnya dalam folder `/nalar_hakim/`.

```bash
curl -fsS https://nalarhakim.com/robots.txt
curl -fsS https://nalarhakim.com/sitemap.xml
sudo nginx -t
```

## Memperbarui website

Bangun paket baru dari versi repo yang ingin dipublikasikan. Unggah ZIP baru dan ekstrak ke **folder baru**, misalnya `~/rilis-nalarhakim/pembaruan-02`; jangan menimpa folder paket lama. Dari folder baru itu cukup jalankan:

```bash
sudo bash deploy/install.sh
```

Script memvalidasi rilis baru sebelum mengganti `current`. Konfigurasi HTTPS yang sudah ada dipertahankan; tidak perlu meminta sertifikat lagi. Jika checksum gagal, rilis aktif tidak diganti. Rilis lama tidak dihapus otomatis. File paket di home dapat dihapus setelah pemasangan dan pemeriksaan berhasil; file website aktif berada di `/var/www/nalarhakim`.

Jika perlu kembali ke rilis sebelumnya, lihat ID yang tersedia dan target saat ini:

```bash
ls /var/www/nalarhakim/releases
readlink /var/www/nalarhakim/current
```

Masuk ke folder **paket lama yang masih utuh**, lalu jalankan `sudo bash deploy/install.sh` dari paket tersebut. Checksumnya akan diperiksa kembali sebelum symlink diarahkan ke rilis lama. Ini hanya mengganti website publik, bukan data admin.

## Membuat paket sendiri dari GitHub

Langkah ini dilakukan di komputer build dengan **Python 3.12 atau lebih baru**, bukan keharusan di VPS. Checkout atau unduh versi repo `AzrielChoerulHakim/nalar_hakim` yang ingin diterbitkan, lalu dari akar repo:

```bash
python3 scripts/build-static-release.py --output dist/nalarhakim-vps
cd dist/nalarhakim-vps
zip -r ../nalarhakim-vps.zip .
```

Pilih nama output baru jika folder sudah ada. Exporter membangun di direktori sementara, memeriksa tautan, dan hanya memasukkan file publik ke `public/`. File sumber artikel JSON, skrip build, kode PHP, gambar QR donasi lama, database, dan aplikasi admin tidak disertakan di webroot. `SHA256SUMS` memeriksa file publik setelah unggahan; unduh paket melalui sumber tepercaya karena checksum dalam arsip yang sama bukan tanda tangan digital.

Build biasa `python3 scripts/build-preview.py` tetap memakai alamat GitHub Pages sebelumnya. Variabel `NH_SITE_URL=https://nalarhakim.com/` tersedia untuk build yang ditujukan ke domain, tetapi exporter di atas lebih aman karena tidak mengubah file Pages dalam checkout. Repo tidak otomatis dipublikasikan ke VPS setelah push. Setiap pembaruan VPS memerlukan paket baru dan langkah pemasangan di atas.

Jangan gunakan `scripts/package.py` atau `docs/INSTALL.md` lama untuk alur ini; keduanya merupakan jalur tema WordPress yang berbeda.

## Hubungannya dengan admin yang sudah ada

Paket admin **Nalar Hakim Admin** yang sebelumnya dibuat memakai Flask, SQLite, dan nginx pada `https://IP_VPS:8443`. Pemasangan website publik ini dapat memakai nginx yang sama, dengan vhost domain pada port 80/443. Installer ini tidak mengubah layanan `nalar-hakim-admin`, port 8443, password, sertifikat admin, atau `/var/lib/nalar-hakim/nalar.sqlite3`.

**Tombol Publish di admin lama belum memperbarui website desain ini.** Kode admin saat ini menerbitkan halaman tersendiri di `/baca/slug` dan data di `/api/articles`; belum ada proses yang mengimpor tulisan tersebut ke generator website publik. Jangan menyimpulkan bahwa memasang kedua paket pada VPS yang sama membuatnya terhubung. Untuk sementara, website publik diperbarui melalui isi repo dan paket rilis. Integrasi penerbitan dari admin memerlukan pekerjaan tambahan.

Alamat HTTPS domain publik juga tidak menggantikan sertifikat self-signed admin pada port 8443. Jangan menyalin direktori admin, file `.env`, kunci sesi, atau SQLite ke `public/` maupun `/var/www/nalarhakim/current`.

## Jika pemasangan tertahan

| Gejala | Yang perlu diperiksa |
| --- | --- |
| Domain masih membuka server lain | Record A/AAAA, `www`, proxy DNS, dan cache DNS. |
| HTTP tidak dapat dibuka | Firewall panel VPS/UFW, proses nginx, dan penggunaan port 80 oleh layanan lain. |
| Sertifikat gagal diterbitkan | Kedua nama domain harus mencapai VPS, HTTP port 80 terbuka, dan challenge tidak dialihkan oleh proxy lain. |
| nginx mengeluh IPv6 tidak tersedia | VPS mungkin mematikan IPv6 di kernel. Sesuaikan baris `listen [::]` pada kedua template sebelum menjalankan installer; jangan membuat record AAAA. |
| Installer menolak direktori atau vhost | Lokasi sudah dipakai konfigurasi lain. Periksa file yang disebut; jangan paksa menimpanya. |
| Artikel dari admin tidak muncul | Integrasi admin ke website publik belum tersedia, bukan kegagalan nginx. |
| Halaman gagal sesudah perubahan manual | Jalankan `sudo nginx -t` dan periksa `sudo journalctl -u nginx -n 50 --no-pager`. |

## Rujukan teknis

Petunjuk pemasangan sistem ditinjau pada 25 Oktober 2026. Konfigurasi rilis merupakan bagian dari repo ini.

- Ubuntu: [memasang nginx](https://ubuntu.com/server/docs/how-to/web-services/install-nginx/).
- Ubuntu: [mendapatkan sertifikat TLS](https://ubuntu.com/server/docs/how-to/security/obtain-tls-certificates/).
- Certbot: [validasi webroot](https://eff-certbot.readthedocs.io/en/stable/using.html#webroot) dan [perpanjangan sertifikat](https://eff-certbot.readthedocs.io/en/stable/using.html#renewing-certificates).
- nginx: [root, try_files, dan error_page](https://nginx.org/en/docs/http/ngx_http_core_module.html).
