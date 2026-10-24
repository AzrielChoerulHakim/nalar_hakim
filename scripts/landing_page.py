"""Flat editorial entry page for Nalar Hakim's reading room."""


def render_landing():
    return '''<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,follow">
<meta name="description" content="Nalar Hakim. Membaca peristiwa, memeriksa sumber, dan menimbang hukum dari berbagai sudut.">
<meta name="theme-color" content="#0b0b0b">
<link rel="icon" href="preview/favicon.svg" type="image/svg+xml">
<title>Nalar Hakim — Ruang untuk Menimbang</title>
<link rel="stylesheet" href="theme/nalar-hakim/style.css">
<link rel="stylesheet" href="preview/identity.css">
<link rel="stylesheet" href="preview/landing.css">
<script src="theme/nalar-hakim/assets/site.js" defer></script>
</head>
<body class="nh-landing">
<a class="skip-link" href="#main-content">Langsung ke konten</a>
<header class="landing-header landing-shell">
  <a class="landing-brand" href="index.html" aria-label="Nalar Hakim — halaman awal"><span class="brand-mark" aria-hidden="true"></span><span>NALAR HAKIM<span class="landing-dot">.</span></span></a>
  <nav aria-label="Navigasi utama"><a class="landing-about-link" href="tentang.html">Tentang</a><a class="landing-nav-enter" href="beranda.html">Ruang baca <span aria-hidden="true">↗</span></a></nav>
</header>
<main id="main-content" class="landing-main">
  <section class="landing-hero landing-shell" aria-labelledby="landing-title">
    <div class="landing-running-head"><span>MEDIA HUKUM &amp; GAGASAN</span><span>OLEH LAZARUS <b aria-hidden="true">✳</b></span></div>
    <div class="landing-hero-stage">
      <h1 id="landing-title" aria-label="Nalar Hakim"><span>NALAR</span><span>HAKIM<span class="landing-title-stop">.</span></span></h1>
      <div class="landing-symbol-panel" aria-hidden="true">
        <span class="landing-symbol-index">[ NH — 01 ]</span>
        <svg class="landing-asterisk" viewBox="0 0 260 260" xmlns="http://www.w3.org/2000/svg"><path d="M113 0h34v79l56-56 24 24-56 56h79v34h-79l56 56-24 24-56-56v79h-34v-79l-56 56-24-24 56-56H10v-34h79L33 47l24-24 56 56Z" fill="currentColor"/></svg>
        <p>MEMBACA. <br>MEMIKIRKAN. <br>MENIMBANG.</p>
      </div>
    </div>
    <div class="landing-hero-support"><div><p class="landing-hero-statement">Hukum hadir di mana-mana. <br><span>Mari membacanya lebih dalam.</span></p><p class="landing-hero-caption">Peristiwa, pemikiran, dan pertanyaan. <br>Satu ruang. Berbagai sudut pandang.</p></div><div class="landing-hero-actions"><a class="landing-primary" href="beranda.html"><span>Masuk ruang baca</span><span class="landing-button-arrow" aria-hidden="true">↗</span></a><a class="landing-text-link" href="#kanal"><span>Jelajahi lima kanal</span><span aria-hidden="true">↓</span></a></div></div>
    <div class="landing-hero-base"><span>BERITA / ANALISIS / OPINI / PANDUAN</span><span>TERBUKA UNTUK PERTANYAAN <span aria-hidden="true">↓</span></span></div>
  </section>

  <section class="landing-manifest" aria-labelledby="landing-manifest-title"><div class="landing-shell">
    <div class="landing-section-top"><p>01 / CARA KAMI MEMBACA</p><span aria-hidden="true">+</span></div>
    <div class="landing-manifest-grid"><div class="landing-question" aria-hidden="true">[?]</div><div class="landing-manifest-copy"><h2 id="landing-manifest-title">Jangan berhenti <br>di <span>judul.</span></h2><p class="landing-manifest-lead">Di balik sebuah aturan, ada manusia, kepentingan, dan pertanyaan yang belum selesai.</p><div class="landing-manifest-notes"><p><span>01 — TELUSURI</span>Kenali konteks. <br>Periksa sumbernya.</p><p><span>02 — TIMBANG</span>Ikuti argumentasi. <br>Sisakan ruang untuk bertanya.</p></div></div></div>
  </div></section>

  <section id="kanal" class="landing-channels" aria-labelledby="landing-channels-title"><div class="landing-shell">
    <div class="landing-section-top"><p>02 / PILIH SUDUT PANDANG</p><span aria-hidden="true">↙</span></div>
    <div class="landing-channel-heading"><h2 id="landing-channels-title">BANYAK SISI. <br>SATU RUANG.</h2><p>Mulai dari yang <br>membuat Anda penasaran.</p></div>
    <div class="landing-channel-list">
      <a href="kanal/pidana/" class="landing-channel"><span class="landing-channel-no">01</span><span class="landing-channel-name">Pidana</span><span class="landing-channel-description">Perbuatan, pertanggungjawaban, <br>dan proses peradilan.</span><span class="landing-channel-arrow" aria-hidden="true">↗</span></a>
      <a href="kanal/perdata/" class="landing-channel"><span class="landing-channel-no">02</span><span class="landing-channel-name">Perdata</span><span class="landing-channel-description">Hak, hubungan antarorang, <br>dan kepentingan sehari-hari.</span><span class="landing-channel-arrow" aria-hidden="true">↗</span></a>
      <a href="kanal/agama-keluarga/" class="landing-channel"><span class="landing-channel-no">03</span><span class="landing-channel-name">Agama &amp; Keluarga</span><span class="landing-channel-description">Persoalan yang dekat dengan <br>kehidupan dan hubungan manusia.</span><span class="landing-channel-arrow" aria-hidden="true">↗</span></a>
      <a href="kanal/filsafat-hukum/" class="landing-channel"><span class="landing-channel-no">04</span><span class="landing-channel-name">Filsafat Hukum</span><span class="landing-channel-description">Gagasan, pemikiran, dan dasar <br>cara kita memahami hukum.</span><span class="landing-channel-arrow" aria-hidden="true">↗</span></a>
      <a href="kanal/hukum-teknologi/" class="landing-channel"><span class="landing-channel-no">05</span><span class="landing-channel-name">Hukum &amp; Teknologi</span><span class="landing-channel-description">Menimbang perubahan <br>di ruang digital.</span><span class="landing-channel-arrow" aria-hidden="true">↗</span></a>
    </div>
  </div></section>

  <section class="landing-invitation landing-shell" aria-labelledby="landing-invitation-title"><div class="landing-section-top"><p>03 / GILIRAN ANDA</p><span aria-hidden="true">✳</span></div><p class="landing-invitation-kicker">SEBUAH PERTANYAAN BISA MENJADI AWAL.</p><h2 id="landing-invitation-title">BUKA <br><span>PIKIRAN.</span></h2><a class="landing-final-link" href="beranda.html"><span>Masuk ruang baca</span><span aria-hidden="true">↗</span></a></section>
</main>
<footer class="landing-footer landing-shell"><div class="landing-footer-top"><div><a class="landing-footer-brand" href="index.html">NALAR HAKIM<span>.</span></a><p>Ditulis oleh Lazarus.</p></div><div class="landing-footer-links"><a href="tentang.html">Tentang Nalar Hakim</a><a href="mailto:nalar.hakim77@gmail.com">Hubungi redaksi ↗</a><button type="button" class="theme-toggle" data-theme-toggle hidden>Terang</button></div></div><div class="landing-footer-bottom"><span>© 2026 Nalar Hakim</span><span>Pratinjau desain · tulisan contoh di ruang baca</span><a href="#main-content">Kembali ke atas ↑</a></div></footer>
</body></html>'''
