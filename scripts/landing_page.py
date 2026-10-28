"""Entry page for Nalar Hakim's independent legal criticism platform."""


from html import escape
from cubist_scale import nature_scene
from idea_flow import render_idea_flow
from flat_cover import render_cover


# Apply a saved reading preference before CSS paints, including when storage is blocked.
THEME_INIT = '''<script>document.documentElement.dataset.theme='light';try{if(localStorage.getItem('nalar-hakim-theme')==='dark')document.documentElement.dataset.theme='dark';}catch(_){}document.querySelector('meta[name="theme-color"]').content=document.documentElement.dataset.theme==='dark'?'#18231E':'#F5F6F2';</script>'''


def render_landing(site_url='https://azrielchoerulhakim.github.io/nalar_hakim/', featured_post=None):
    return '''<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="index,follow"><link rel="canonical" href="__SITE_URL__">
<meta name="description" content="Tulisan hukum dengan nama samaran, terbuka untuk dibaca siapa saja secara gratis. Kirim naskah tanpa biaya atau administrasi berbelit.">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Nalar Hakim">
<meta property="og:title" content="Nalar Hakim — Hukum Selalu Tidak Pernah Selesai">
<meta property="og:description" content="Tulisan hukum dengan nama samaran, terbuka untuk dibaca siapa saja secara gratis. Kirim naskah tanpa biaya atau administrasi berbelit.">
<meta property="og:url" content="__SITE_URL__">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#F5F6F2">
__THEME_INIT__
<link rel="icon" href="preview/favicon.svg" type="image/svg+xml">
<title>Nalar Hakim — Hukum Selalu Tidak Pernah Selesai</title>
<link rel="stylesheet" href="preview/landing-bundle.css">
<script src="theme/nalar-hakim/assets/site.js" defer></script><script src="preview/motion.js" defer></script><script src="preview/editorial-motion.js" defer></script><script src="preview/article-transitions.js" defer blocking="render"></script><script src="preview/nature-scene.js" defer></script><script src="preview/desktop-nature.js" data-butterfly-src="preview/butterfly.js" defer></script><script src="preview/desktop-nature.js" data-desktop-src="preview/scroll-story.js" defer></script>
<script src="preview/desktop-nature.js" data-desktop-src="preview/idea-flow.js" defer></script>
</head>
<body class="nh-landing">
<a class="skip-link" href="#main-content">Langsung ke konten</a>
<header class="landing-header landing-shell">
  <a class="landing-brand" data-brand-reveal href="index.html" aria-label="Nalar Hakim — halaman awal"><span class="brand-mark" aria-hidden="true"></span><span>NALAR HAKIM<span class="landing-dot">.</span></span></a>
  <nav aria-label="Navigasi utama"><a class="landing-about-link" href="tentang.html">Tentang</a><a class="landing-submit-link" href="kirim-naskah.html">Kirim naskah</a><a class="landing-nav-enter" href="beranda.html">Ruang baca <span aria-hidden="true">↗</span></a></nav>
</header>
<main id="main-content" class="landing-main">
  <section class="landing-hero landing-shell" aria-labelledby="landing-title">
    <div class="landing-running-head"><span>RUANG BACA SEMUA</span><span>RUANG TULIS MERDEKA <b aria-hidden="true">✳</b></span></div>
    <div class="landing-hero-stage">
      <div class="nature-hero-copy">
        <div class="nature-overline">Nama samaran. Tulisan terbuka.</div>
        <h1 id="landing-title" aria-label="Nalar Hakim"><span>NALAR</span><span>HAKIM<span class="landing-title-stop">.</span></span></h1>
        <h2 class="landing-hero-statement">Hukum selalu tidak pernah selesai.</h2>
        <p class="landing-hero-caption">Baca esai, telaah peristiwa, dan kritik atas putusan hukum tanpa biaya. Anda juga dapat mengirim tulisan tanpa nama, gelar, jabatan, dan instansi.</p>
        <div class="landing-hero-actions"><a class="landing-primary" href="beranda.html"><span>Masuk ruang baca</span><span class="landing-button-arrow" aria-hidden="true">↗</span></a><a class="landing-secondary" href="kirim-naskah.html"><span>Kirim naskah</span><span aria-hidden="true">↗</span></a></div>
      </div>
      __NATURE_SCENE__
    </div>
    <div class="landing-hero-base" data-ink-divider="bottom"><a class="landing-forms-link" href="#bentuk">TIGA BENTUK TULISAN <span aria-hidden="true">↓</span></a><span class="landing-base-end"><span>TANPA NAMA / TANPA BIAYA / TERBUKA</span></span></div>
  </section>

  __QUOTE_PORTAL__
  <section id="sikap" class="landing-manifest" data-ink-divider="bottom" aria-labelledby="landing-manifest-title"><div class="landing-shell">
    <div class="landing-section-top"><p>01 / SIKAP REDAKSI</p><span aria-hidden="true">+</span></div>
    <div class="landing-manifest-grid"><div class="landing-question" aria-hidden="true">[?]</div><div class="landing-manifest-copy"><h2 id="landing-manifest-title">Tanpa Nama.<br><span>Argumen Berkata.</span></h2><p class="landing-manifest-lead">Anda tidak perlu mencantumkan nama asli, gelar, atau tempat bekerja untuk mengirim tulisan. Redaksi membaca apa yang Anda ajukan: persoalannya, alasan di balik pendapatnya, dan sumber yang mendukungnya.</p><div class="landing-manifest-notes"><p><span>01 — ALASAN YANG JELAS</span>Jelaskan apa yang Anda persoalkan dan mengapa. Pakai teori jika membantu pembaca memahami argumen, bukan sekadar menambah nama tokoh.</p><p><span>02 — SUMBER YANG BISA DICEK</span>Tautkan aturan, putusan, data, atau bacaan yang Anda gunakan. Pembaca perlu tahu dari mana sebuah pernyataan berasal.</p></div></div></div>
  </div></section>

  <section id="bentuk" class="landing-channels" aria-labelledby="landing-channels-title"><div class="landing-shell">
    <div class="landing-section-top"><p>02 / TIGA BENTUK TULISAN</p><span aria-hidden="true">↙</span></div>
    <div class="landing-channel-heading"><h2 id="landing-channels-title">PILIH BENTUK<br>TULISAN ANDA.</h2><p>Mulai dari gagasan, peristiwa, <br>atau putusan yang ingin Anda bahas.</p></div>
    <div class="landing-channel-list">
      <a href="bentuk/esai/" class="landing-channel"><span class="landing-channel-no">01</span><span class="landing-channel-name">Esai</span><span class="landing-channel-description">Mengembangkan pendapat dan membahas pemikiran tentang hukum.</span><span class="landing-channel-arrow" aria-hidden="true">↗</span></a>
      <a href="bentuk/telaah/" class="landing-channel"><span class="landing-channel-no">02</span><span class="landing-channel-name">Telaah Fenomena</span><span class="landing-channel-description">Membahas peristiwa yang sedang terjadi beserta persoalan hukumnya.</span><span class="landing-channel-arrow" aria-hidden="true">↗</span></a>
      <a href="bentuk/bedah/" class="landing-channel"><span class="landing-channel-no">03</span><span class="landing-channel-name">Bedah Putusan atau Norma</span><span class="landing-channel-description">Memeriksa alasan dalam putusan atau aturan serta akibatnya.</span><span class="landing-channel-arrow" aria-hidden="true">↗</span></a>
    </div>
  </div></section>

  <section id="kirim" class="landing-invitation landing-shell" aria-labelledby="landing-invitation-title"><div class="landing-section-top"><p>03 / KIRIM NASKAH</p><span aria-hidden="true">✳</span></div><p class="landing-invitation-kicker">TANPA BIAYA. TANPA AKUN.</p><h2 id="landing-invitation-title">KIRIM<br><span>TULISAN.</span></h2><div class="landing-submission-grid"><p>Ada putusan yang mengusik Anda, aturan yang perlu dipertanyakan, atau pemikiran yang ingin dibahas? Tulis dan kirimkan. Anda tidak perlu CV, afiliasi kampus, atau format jurnal tertentu.</p><ol class="landing-submission-steps"><li><strong>Kirim Word lewat email.</strong><p>Lampirkan berkas .doc atau .docx ke <a href="mailto:nalar.hakim77@gmail.com">nalar.hakim77@gmail.com</a>. Sertakan nama samaran yang ingin dipakai.</p></li><li><strong>Dibaca oleh redaksi.</strong><p>Lazarus memeriksa isi, alasan, dan sumber tulisan. Jika perlu diperbaiki, revisinya dibicarakan lewat email.</p></li><li><strong>Keputusan melalui email.</strong><p>Anda menerima kabar apakah naskah diterima, perlu direvisi, atau belum bisa diterbitkan.</p></li></ol></div><a class="landing-final-link" href="kirim-naskah.html"><span>Panduan kirim naskah</span><span aria-hidden="true">↗</span></a></section>
__IDEA_FLOW__
</main>
<footer class="landing-footer landing-shell"><div class="landing-footer-top"><div><a class="landing-footer-brand" href="index.html">NALAR HAKIM<span>.</span></a><p>Disunting oleh Lazarus.</p></div><div class="landing-footer-links"><a href="tentang.html">Tentang Nalar Hakim</a><a href="kirim-naskah.html">Kirim naskah</a><a href="mailto:nalar.hakim77@gmail.com">Hubungi redaksi ↗</a><button type="button" class="theme-toggle" data-theme-toggle hidden>Terang</button></div></div><div class="landing-footer-bottom"><span>© 2026 Nalar Hakim</span><span>Nama samaran. Bebas dibaca.</span><a href="#main-content">Kembali ke atas ↑</a></div></footer>
</body></html>'''.replace('__QUOTE_PORTAL__', render_quote_portal(featured_post)).replace('__NATURE_SCENE__', nature_scene()).replace('__THEME_INIT__', THEME_INIT).replace('__IDEA_FLOW__', render_idea_flow()).replace('__SITE_URL__', escape(site_url, quote=True))


def render_quote_portal(post):
    """Quote the existing manuscript verbatim; never invent a public attribution."""
    if not post:
        return ''
    href = 'artikel/' + post['slug'] + '/'
    title = escape(post['title'])
    quote = escape(post['thesis'])
    author = escape(post.get('author', 'Lazarus'))
    cover = render_cover(post['format'])
    return f'''<section class="quote-portal landing-shell" data-quote-portal data-ink-divider="bottom" aria-labelledby="quote-portal-title">
  <div class="quote-portal-copy"><h2 class="eyebrow" id="quote-portal-title">DARI RUANG BACA</h2><blockquote cite="{href}"><p>{quote}</p></blockquote><p class="quote-portal-source">{author} · <a href="{href}">{title}</a></p></div>
  <a class="quote-portal-media story-image tone-{post['format']}" href="{href}" aria-label="Baca {escape(post['title'], quote=True)}"><span class="cover-placeholder" aria-hidden="true">{cover}</span></a>
</section>'''
