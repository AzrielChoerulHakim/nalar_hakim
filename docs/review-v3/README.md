# Bukti visual revisi gerak, 28 Oktober 2026

Empat lembar ini berasal dari screenshot browser pada build pengembangan lokal. Baseline memakai `01f6b06155f8fbd38504fb08276a70129d220fea`; keadaan sesudah memakai kode revisi yang menyertai dokumen ini. Gambar bukan bukti deployment VPS. Lihat [laporan pengujian](../MOTION_REFINEMENT_REVIEW.md) untuk metode, hasil matriks, dan batas verifikasi.

| Bukti | Dimensi lembar | Isi |
| --- | --- | --- |
| [Urutan cover](cover-native-sequence.jpg) | 2000 × 1133 | Baseline 0 ms; sesudah 0, 90, 180 ms; keadaan akhir. |
| [Gerak timbangan](scales-motion.jpg) | 1700 × 590 | Ayunan pertama 506 ms, kedua 1056 ms, dan keadaan diam. |
| [Homepage mobile](mobile-390.jpg) | 840 × 1615 | Hero 390 px serta fokus keyboard pada target timbangan. |
| [Halaman artikel](articles-layout.jpg) | 1558 × 1736 | Artikel 320/768 px terang, fixture admin pendek 390 px gelap, dan pembuka artikel 1440 px gelap. |

## Metode perekaman

- Urutan cover berasal dari navigasi lintas dokumen asli melalui kartu utama Ruang Baca ke **“Kerja yang tidak masuk rekening: menguji pembagian harta bersama”**. Kontrol QA menghentikan animasi pseudo-element native yang benar-benar dibuat browser, lalu menetapkan `currentTime` untuk inspeksi frame. Ini **bukan rekaman real-time** dan bukan transisi buatan dalam satu dokumen. Capture sumber 1348 × 977 px diperkecil seragam menjadi lebar 640 px per panel. Durasi produksi tidak diubah.
- Ayunan pertama dan kedua menghentikan tiga animasi WAAPI asli timbangan pada waktunya; frame akhir menunjukkan keadaan diam. Viewport CSS tetap 1440 × 900 px. Wrapper QA menampilkan viewport tersebut pada skala 92,22% agar muat dalam browser perekaman. Ketiga panel memakai crop yang sama: `(710, 230)` sampai `(1250, 700)`, tanpa peregangan.
- Hero mobile memakai capture 390 × 1500 px. Panel fokus merupakan crop kiri `(0, 0, 390, 900)` dari screenshot browser yang lebih lebar. Piksel screenshot tidak diubah ukurannya pada lembar mobile.
- Artikel 320 dan admin 390 memakai capture setinggi 900 px. Artikel 768 memakai 900 px pertama dari capture 768 × 1500 px. Panel desktop berasal dari 1363 × 900 px yang terlihat dari iframe selebar 1440 px, diperkecil seragam menjadi lebar 900 px; tepi kanan viewport tidak seluruhnya termuat pada screenshot sumber. Label panel menyatakan viewport CSS, bukan lebar berkas gambar.
- Fixture admin berisi naskah uji lokal dan tidak dipublikasikan sebagai artikel. Panel kontrol QA dan penanda pointer browser hanya berasal dari lingkungan pengujian.

Pillow hanya dipakai untuk crop, resize dengan rasio tetap, pengaturan lembar, label di luar screenshot, dan kompresi JPEG. Tidak ada penghapusan, penggambaran ulang, atau pemindahan objek di dalam screenshot. Empat JPEG berjumlah 853.110 byte. Frame diam membantu meninjau bentuk dan kontinuitas; bukti waktu berjalan, fallback, dan interaksi normal dijelaskan terpisah dalam laporan pengujian.
