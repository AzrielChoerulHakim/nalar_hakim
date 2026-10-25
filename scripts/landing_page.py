"""Entry page for Nalar Hakim's independent legal criticism platform."""


from signal_field import render_signal_field


# Apply a saved reading preference before CSS paints, including when storage is blocked.
THEME_INIT = '''<script>try{if(localStorage.getItem('nalar-hakim-theme')==='light'){document.documentElement.dataset.theme='light';document.querySelector('meta[name="theme-color"]').content='#f4f1eb';}}catch(_){}</script>'''


def render_landing():
    return '''<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="index,follow"><link rel="canonical" href="https://azrielchoerulhakim.github.io/nalar_hakim/">
<meta name="description" content="Kritik hukum independen atas fenomena aktual. Menguji hukum dengan teori, argumentasi, dan rujukan. Terbuka untuk naskah dengan pseudonim.">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Nalar Hakim">
<meta property="og:title" content="Nalar Hakim — Hukum Layak Dipertanyakan">
<meta property="og:description" content="Kritik hukum independen atas fenomena aktual. Menguji hukum dengan teori, argumentasi, dan rujukan. Terbuka untuk naskah dengan pseudonim.">
<meta property="og:url" content="https://azrielchoerulhakim.github.io/nalar_hakim/">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#181a20">
__THEME_INIT__
<link rel="icon" href="preview/favicon.svg" type="image/svg+xml">
<title>Nalar Hakim — Hukum Layak Dipertanyakan</title>
<link rel="stylesheet" href="theme/nalar-hakim/style.css">
<link rel="stylesheet" href="preview/identity.css">
<link rel="stylesheet" href="preview/landing.css"><link rel="stylesheet" href="preview/motion.css"><link rel="stylesheet" href="preview/signals.css">
<script src="theme/nalar-hakim/assets/site.js" defer></script><script src="preview/motion.js" defer></script><script src="preview/signals.js" defer></script>
</head>
<body class="nh-landing">
<a class="skip-link" href="#main-content">Langsung ke konten</a>
<header class="landing-header landing-shell">
  <a class="landing-brand" href="index.html" aria-label="Nalar Hakim — halaman awal"><span class="brand-mark" aria-hidden="true"></span><span>NALAR HAKIM<span class="landing-dot">.</span></span></a>
  <nav aria-label="Navigasi utama"><a class="landing-about-link" href="tentang.html">Tentang</a><a class="landing-submit-link" href="kirim-naskah.html">Kirim naskah</a><a class="landing-nav-enter" href="beranda.html">Ruang baca <span aria-hidden="true">↗</span></a></nav>
</header>
<main id="main-content" class="landing-main">
  <section class="landing-hero landing-shell" aria-labelledby="landing-title">
    <div class="landing-running-head"><span>KRITIK HUKUM INDEPENDEN</span><span>TERBUKA UNTUK NASKAH <b aria-hidden="true">✳</b></span></div>
    <div class="landing-hero-stage">
      __SIGNAL_FIELD__
      <h1 id="landing-title" aria-label="Nalar Hakim"><span>NALAR</span><span>HAKIM<span class="landing-title-stop">.</span></span></h1>
      <div class="landing-symbol-panel" aria-hidden="true">
        <span class="landing-symbol-index">[ NH — 01 ]</span>
        <svg class="landing-asterisk" viewBox="0 0 260 260" xmlns="http://www.w3.org/2000/svg"><path d="M113 0h34v79l56-56 24 24-56 56h79v34h-79l56 56-24 24-56-56v79h-34v-79l-56 56-24-24 56-56H10v-34h79L33 47l24-24 56 56Z" fill="currentColor"/></svg>
        <p>FENOMENA. <br>TEORI. <br>KRITIK.</p>
      </div>
    </div>
    <div class="landing-hero-support"><div><h2 class="landing-hero-statement">Hukum layak dipertanyakan.</h2><p class="landing-hero-caption">Fenomena aktual, diuji dengan teori dan argumentasi hukum.</p></div><div class="landing-hero-actions"><a class="landing-primary" href="beranda.html"><span>Baca telaah</span><span class="landing-button-arrow" aria-hidden="true">↗</span></a><a class="landing-secondary" href="kirim-naskah.html"><span>Kirim naskah</span><span aria-hidden="true">↗</span></a></div></div>
    <div class="landing-hero-base"><a class="landing-forms-link" href="#bentuk">EMPAT BENTUK TULISAN <span aria-hidden="true">↓</span></a><span class="landing-base-end"><button class="signal-toggle" type="button" data-signal-toggle data-paused="false" hidden><span>Jeda animasi</span></button><span>PSEUDONIM / ARGUMENTASI / RUJUKAN</span></span></div>
  </section>

  <section class="landing-manifest" aria-labelledby="landing-manifest-title"><div class="landing-shell">
    <div class="landing-section-top"><p>01 / SIKAP REDAKSI</p><span aria-hidden="true">+</span></div>
    <div class="landing-manifest-grid"><div class="landing-question" aria-hidden="true">[?]</div><div class="landing-manifest-copy"><h2 id="landing-manifest-title">Nama disamarkan.<br><span>Argumen diuji.</span></h2><p class="landing-manifest-lead">Tulisan diterbitkan dengan pseudonim. Yang diperiksa ialah argumentasi: ketepatan teori, konteks peristiwa, dan rujukan yang dapat ditelusuri.</p><div class="landing-manifest-notes"><p><span>01 — ALAT UJI</span>Teori menjadi alat untuk menguji asumsi, penalaran, dan akibat suatu posisi hukum.</p><p><span>02 — TERBUKA</span>Kritik dapat dikritik. Sanggahan dinilai dari alasan dan rujukan yang dibawanya.</p></div></div></div>
  </div></section>

  <section id="bentuk" class="landing-channels" aria-labelledby="landing-channels-title"><div class="landing-shell">
    <div class="landing-section-top"><p>02 / EMPAT BENTUK TULISAN</p><span aria-hidden="true">↙</span></div>
    <div class="landing-channel-heading"><h2 id="landing-channels-title">EMPAT BENTUK.<br>SATU SIKAP.</h2><p>Mempertanyakan hukum.<br>Menjelaskan alasannya.</p></div>
    <div class="landing-channel-list">
      <a href="bentuk/telaah/" class="landing-channel"><span class="landing-channel-no">01</span><span class="landing-channel-name">Telaah</span><span class="landing-channel-description">Fenomena aktual dibaca melalui teori dan argumentasi hukum.</span><span class="landing-channel-arrow" aria-hidden="true">↗</span></a>
      <a href="bentuk/bedah/" class="landing-channel"><span class="landing-channel-no">02</span><span class="landing-channel-name">Bedah Putusan &amp; Norma</span><span class="landing-channel-description">Menguji penalaran putusan, susunan norma, dan akibat hukumnya.</span><span class="landing-channel-arrow" aria-hidden="true">↗</span></a>
      <a href="bentuk/esai/" class="landing-channel"><span class="landing-channel-no">03</span><span class="landing-channel-name">Esai Pemikiran</span><span class="landing-channel-description">Gagasan dan tradisi pemikiran untuk menguji cara hukum bekerja.</span><span class="landing-channel-arrow" aria-hidden="true">↗</span></a>
      <a href="bentuk/perdebatan/" class="landing-channel"><span class="landing-channel-no">04</span><span class="landing-channel-name">Perdebatan</span><span class="landing-channel-description">Tanggapan dan sanggahan yang mempertemukan argumen beserta rujukannya.</span><span class="landing-channel-arrow" aria-hidden="true">↗</span></a>
    </div>
    <div id="kanal" class="landing-topics"><p>TELUSURI JUGA MENURUT BIDANG</p><nav aria-label="Bidang kajian"><a href="kanal/pidana/">Pidana</a><a href="kanal/perdata/">Perdata</a><a href="kanal/agama-keluarga/">Agama &amp; Keluarga</a><a href="kanal/filsafat-hukum/">Filsafat Hukum</a><a href="kanal/hukum-teknologi/">Hukum &amp; Teknologi</a></nav></div>
  </div></section>

  <section class="landing-invitation landing-shell" aria-labelledby="landing-invitation-title"><div class="landing-section-top"><p>03 / KIRIM NASKAH</p><span aria-hidden="true">✳</span></div><p class="landing-invitation-kicker">REDAKSI MENERIMA NASKAH.</p><h2 id="landing-invitation-title">AJUKAN<br><span>ARGUMEN.</span></h2><div class="landing-submission-grid"><p>Punya pembacaan lain atas fenomena hukum? Tawarkan telaah, bedah putusan atau norma, esai pemikiran, atau tanggapan dengan rujukan yang jelas.</p><ol class="landing-submission-steps"><li><strong>Kirim Word lewat email.</strong><p>Lampirkan berkas .doc atau .docx ke <a href="mailto:nalar.hakim77@gmail.com">nalar.hakim77@gmail.com</a>. Sertakan pseudonim yang ingin dipakai.</p></li><li><strong>Ditinjau oleh Lazarus.</strong><p>Naskah dibaca untuk memeriksa argumentasi, penggunaan teori, dan rujukan.</p></li><li><strong>Keputusan melalui email.</strong><p>Redaksi menyampaikan keputusan atau permintaan revisi melalui email.</p></li></ol></div><a class="landing-final-link" href="kirim-naskah.html"><span>Panduan kirim naskah</span><span aria-hidden="true">↗</span></a></section>
</main>
<footer class="landing-footer landing-shell"><div class="landing-footer-top"><div><a class="landing-footer-brand" href="index.html">NALAR HAKIM<span>.</span></a><p>Disunting oleh Lazarus.</p></div><div class="landing-footer-links"><a href="tentang.html">Tentang Nalar Hakim</a><a href="kirim-naskah.html">Kirim naskah</a><a href="mailto:nalar.hakim77@gmail.com">Hubungi redaksi ↗</a><button type="button" class="theme-toggle" data-theme-toggle hidden>Terang</button></div></div><div class="landing-footer-bottom"><span>© 2026 Nalar Hakim</span><span>Fenomena. Teori. Kritik.</span><a href="#main-content">Kembali ke atas ↑</a></div></footer>
</body></html>'''.replace('__SIGNAL_FIELD__', render_signal_field()).replace('__THEME_INIT__', THEME_INIT)
