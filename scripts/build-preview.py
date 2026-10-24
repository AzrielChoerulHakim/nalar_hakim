#!/usr/bin/env python3
"""Build a dependency-free GitHub Pages preview from explicitly labelled samples."""
from html import escape as e
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
CHANNELS = {
 'pidana': ('Pidana', 'Perbuatan, pertanggungjawaban, dan proses peradilan.'),
 'perdata': ('Perdata', 'Hubungan antarorang, hak, dan kepentingan sehari-hari.'),
 'agama-keluarga': ('Agama & Keluarga', 'Membaca persoalan keluarga dengan perhatian pada konteks.'),
 'filsafat-hukum': ('Filsafat Hukum', 'Gagasan, pertanyaan, dan cara kita memahami hukum.'),
 'hukum-teknologi': ('Hukum & Teknologi', 'Menimbang perubahan di ruang digital.'),
}
POSTS = [
 {'slug':'lebih-dari-satu-sudut', 'channel':'filsafat-hukum', 'title':'Membaca sebuah persoalan dari lebih dari satu sudut.', 'excerpt':'Ruang untuk sebuah pertanyaan, beragam sudut pandang, dan argumen yang dapat diuji.', 'symbol':'∴'},
 {'slug':'pertanyaan-pertama', 'channel':'pidana', 'title':'Pertanyaan yang membuka sebuah pembahasan.', 'excerpt':'Sebuah contoh tata letak untuk mengikuti cerita dengan runtut, dari pembuka hingga catatan akhir.', 'symbol':'01'},
 {'slug':'menyusun-fakta', 'channel':'perdata', 'title':'Menyusun fakta, lalu menimbang argumentasi.', 'excerpt':'Bagaimana sebuah tulisan bisa memberi ruang yang sama untuk konteks, pertanyaan, dan pembahasan.', 'symbol':'02'},
 {'slug':'ruang-digital', 'channel':'hukum-teknologi', 'title':'Ruang digital, pertanyaan yang terus bergerak.', 'excerpt':'Pratinjau kanal yang mempertemukan hukum, teknologi, dan perubahan dalam kehidupan sehari-hari.', 'symbol':'0x'},
 {'slug':'ruang-untuk-mendengar', 'channel':'agama-keluarga', 'title':'Memberi ruang untuk mendengar lebih dahulu.', 'excerpt':'Sebuah ruang baca untuk persoalan yang dekat dengan kehidupan dan hubungan antarmanusia.', 'symbol':'03'},
 {'slug':'menguji-pemikiran', 'channel':'filsafat-hukum', 'title':'Sebuah ruang untuk menguji pemikiran.', 'excerpt':'Gagasan menjadi percakapan ketika pertanyaan tetap terbuka dan pembaca ikut menimbang.', 'symbol':'NH'},
]
WALLET = '0x39fbbC339D69ae2F8B671f7fE1D356086137e2bE'
EMAIL = 'nalar.hakim77@gmail.com'
WRITTEN = []

def link(prefix, path):
 return prefix + path

def article_url(p, prefix=''):
 return prefix + 'artikel/' + p['slug'] + '/'

def channel_url(slug, prefix=''):
 return prefix + 'kanal/' + slug + '/'

def search_form(prefix, ident=''):
 return f'<form class="search-form" action="{prefix}cari.html" method="get"{ident}><label><span class="screen-reader-text">Cari tulisan contoh</span><input type="search" name="q" placeholder="Cari gagasan…" maxlength="120"></label><button class="search-submit" type="submit">Cari</button></form>'

def header(prefix, selected=''):
 nav = f'<a href="{prefix}index.html"'+(' aria-current="page"' if selected=='home' else '')+'>Semua</a>'
 for slug, (label, _) in CHANNELS.items():
  nav += f'<a href="{channel_url(slug,prefix)}"'+(' aria-current="page"' if selected==slug else '')+f'>{e(label)}</a>'
 return f'''<a class="skip-link" href="#main-content">Langsung ke konten</a>
<div class="preview-note">Pratinjau desain <span aria-hidden="true">·</span> tulisan contoh</div>
<header class="site-header"><div class="container header-inner"><a class="brand" href="{prefix}index.html" aria-label="Nalar Hakim — beranda"><span class="brand-mark" aria-hidden="true"></span><span><span class="brand-name">NALAR HAKIM<span class="brand-dot">.</span></span><span class="brand-caption">MEDIA HUKUM &amp; GAGASAN</span></span></a><div class="header-actions"><span class="header-note">INDEPENDEN DALAM BERPIKIR.</span><button class="theme-toggle" data-theme-toggle type="button" hidden>Terang</button><details><summary>Cari ↗</summary>{search_form(prefix)}</details></div></div><nav class="channel-nav" aria-label="Kanal hukum"><div class="container">{nav}</div></nav></header>'''

def donation(prefix):
 return f'''<details class="donation"><summary><span><span class="eyebrow">TETAP TERBUKA UNTUK SEMUA</span><span class="donation-title">Dukung Nalar Hakim</span></span></summary><div class="donation-content"><div><p>Bantu Nalar Hakim menghadirkan bacaan hukum yang terbuka untuk semua.</p><span class="network-label">ETH · Ethereum Mainnet</span><code class="wallet-address">{WALLET}</code><button class="copy-button" type="button" data-copy-address="{WALLET}" hidden>Salin alamat</button><span data-copy-status role="status" aria-live="polite"></span><p class="donation-note">Donasi sukarela. Semua tulisan tetap bebas dibaca.</p></div><figure class="donation-qr"><img src="{prefix}theme/nalar-hakim/assets/donation-qr.png" width="277" height="263" loading="lazy" decoding="async" alt="QR alamat donasi Ethereum Mainnet"><figcaption>Pindai alamat donasi</figcaption></figure></div></details>'''

def footer(prefix):
 return f'''<footer class="site-footer"><div class="container"><div class="footer-top"><div><a class="footer-brand" href="{prefix}index.html">NALAR HAKIM<span class="brand-dot">.</span></a><p>Membaca peristiwa.<br>Menimbang hukum.</p></div><div class="footer-contact"><span class="eyebrow">RUANG UNTUK BERDIALOG</span><a href="mailto:{EMAIL}">{EMAIL} ↗</a><p>Catatan, masukan, dan koreksi selalu terbuka.</p><a class="footer-about" href="{prefix}tentang.html">Tentang Nalar Hakim ↗</a></div></div>{donation(prefix)}<div class="footer-bottom"><span>© 2026 Nalar Hakim</span><span>Ditulis oleh Lazarus.</span><a href="#main-content">Kembali ke atas ↑</a></div></div></footer>'''

def page(path, title, body, selected='', extra=''):
 depth=len(Path(path).parts)-1
 prefix='../'*depth
 html=f'''<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><meta name="description" content="Pratinjau desain Nalar Hakim, media hukum dan gagasan. Semua tulisan pada pratinjau adalah contoh tampilan."><meta name="theme-color" content="#0d0d12"><title>{e(title)} — Nalar Hakim</title><link rel="stylesheet" href="{prefix}theme/nalar-hakim/style.css"><link rel="stylesheet" href="{prefix}preview/preview.css"><script src="{prefix}theme/nalar-hakim/assets/site.js" defer></script>{extra}</head><body>{header(prefix,selected)}{body}{footer(prefix)}</body></html>'''
 dest=ROOT/path;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(html,encoding='utf-8');WRITTEN.append(path)

def meta(p,prefix=''):
 return f'<div class="story-meta"><a class="category-label" href="{channel_url(p["channel"],prefix)}">{e(CHANNELS[p["channel"]][0])}</a><span>Tulisan contoh</span><span>3 menit baca</span></div>'

def cover(p,prefix='',tag='a'):
 target=f'href="{article_url(p,prefix)}" aria-label="{e(p["title"])}"' if tag=='a' else 'aria-hidden="true"'
 return f'<{tag} class="story-image tone-{p["channel"]}" {target}><span class="cover-placeholder" aria-hidden="true"><span class="cover-orbit"></span><span class="cover-monogram">{p["symbol"]}</span><span class="cover-caption">NALAR HAKIM / {e(CHANNELS[p["channel"]][0].upper())}</span></span></{tag}>'

def card(p,prefix='',lead=False):
 return f'<article class="story-card {"lead-story" if lead else ""}">{cover(p,prefix)}<div class="story-body">{meta(p,prefix)}<h{2 if lead else 3}><a href="{article_url(p,prefix)}">{e(p["title"])}</a></h{2 if lead else 3}><p>{e(p["excerpt"])}</p><a class="read-link" href="{article_url(p,prefix)}">Baca tulisan <span aria-hidden="true">↗</span></a></div></article>'

def channels(prefix=''):
 return '<section class="channel-section"><div class="section-heading"><h2>Lima sudut pandang</h2><span class="eyebrow">JELAJAHI KANAL</span></div><div class="channel-grid">'+''.join(f'<a class="channel-card" href="{channel_url(slug,prefix)}"><span class="channel-number">{i:02}</span><h3>{e(label)}</h3><span aria-hidden="true">↗</span></a>' for i,(slug,(label,_)) in enumerate(CHANNELS.items(),1))+'</div></section>'

home='''<main id="main-content" class="container home-main"><div class="home-intro"><div><span class="eyebrow">HUKUM, DARI BERBAGAI SUDUT.</span><h1>Ruang untuk <span>menimbang.</span></h1></div><p>Peristiwa hari ini. Gagasan lintas zaman. <br>Membaca hukum dengan nalar yang terbuka.</p></div><div class="section-heading"><h2>Sorotan</h2><span class="eyebrow">CATATAN LAZARUS ↘</span></div><div class="hero-grid">'''+card(POSTS[0],lead=True)+'<aside class="top-stories"><div class="section-heading"><h2>Juga untuk dibaca</h2></div>'+''.join(f'<article class="rail-story">{meta(p)}<h3><a href="{article_url(p)}">{e(p["title"])}</a></h3><span class="rail-arrow" aria-hidden="true">↗</span></article>' for p in POSTS[1:4])+'''<div class="rail-note"><span class="eyebrow">CATATAN REDAKSI</span><p>Setiap persoalan layak dibaca dari lebih dari satu sudut.</p><span>Lazarus / Nalar Hakim</span></div></aside></div><section class="latest-section"><div class="section-heading"><h2>Catatan lainnya</h2><a href="cari.html">Jelajahi semua tulisan ↗</a></div><div class="article-grid">'''+''.join(card(p) for p in POSTS[4:])+f'''<a class="preview-invite" href="tentang.html"><span class="eyebrow">SEBUAH RUANG BARU</span><h3>Dimulai dengan<br>sebuah pertanyaan.</h3><p>Kenali gagasan di balik Nalar Hakim.</p><span aria-hidden="true">↗</span></a></div></section>{channels()}</main>'''
page('index.html','Media Hukum & Gagasan',home,'home')

for slug,(label,desc) in CHANNELS.items():
 prefix='../../'
 body=f'<main id="main-content" class="container"><header class="archive-header"><a class="back-link" href="{prefix}index.html">← Kembali ke beranda</a><div class="eyebrow">KANAL NALAR HAKIM</div><h1>{e(label)}</h1><p class="section-intro">{e(desc)}</p></header><div class="article-grid">'+''.join(card(p,prefix) for p in POSTS if p['channel']==slug)+f'</div>{channels(prefix)}</main>'
 page(f'kanal/{slug}/index.html',label,body,slug)

for p in POSTS:
 prefix='../../'
 body=f'''<main id="main-content" class="container single-main"><article class="article-layout"><header class="article-header"><a class="back-link" href="{channel_url(p['channel'],prefix)}">← Kembali ke {e(CHANNELS[p['channel']][0])}</a>{meta(p,prefix)}<h1>{e(p['title'])}</h1><p class="article-deck">{e(p['excerpt'])}</p><div class="article-byline"><span class="author-avatar" aria-hidden="true">L</span><span>Ditulis oleh <strong>Lazarus</strong></span></div></header><figure class="article-cover">{cover(p,prefix,'div')}<figcaption>Ilustrasi geometris untuk pratinjau desain.</figcaption></figure><div class="article-content"><p class="sample-notice"><strong>Tulisan contoh.</strong> Halaman ini memperlihatkan pengalaman membaca Nalar Hakim. Naskah redaksi akan ditulis dan diterbitkan kemudian oleh Lazarus.</p><p>Sebuah bacaan dapat dimulai dari pertanyaan yang sederhana. Dari sana, pembaca diajak mengenali konteks, mengikuti alur pembahasan, lalu memberi ruang bagi pertanyaan berikutnya.</p><p>Paragraf ini adalah contoh panjang teks untuk menguji keterbacaan. Jarak antarkalimat dan lebar kolom disusun agar tulisan tetap nyaman diikuti dari layar ponsel maupun desktop.</p><h2>Ruang untuk memahami konteks</h2><p>Di bagian ini nantinya tersedia uraian pembuka. Judul bagian membantu pembaca menemukan arah pembahasan tanpa harus kehilangan hubungan dengan bagian sebelumnya.</p><blockquote><p>“Setiap persoalan layak dibaca dari lebih dari satu sudut.”</p><cite>Catatan redaksi Nalar Hakim</cite></blockquote><h2>Mengikuti alur pembahasan</h2><p>Daftar pendek dapat dipakai untuk memperjelas urutan pembacaan:</p><ol><li>Mengenali pertanyaan yang ingin dibahas.</li><li>Membaca konteks dan bahan yang disajikan penulis.</li><li>Menimbang argumentasi, lalu merumuskan pertanyaan lanjutan.</li></ol><h2>Melihat hubungan antarbagiannya</h2><p>Berikut contoh penyajian tabel. Isinya menjelaskan susunan tulisan, bukan kesimpulan atas suatu perkara.</p><figure class="wp-block-table"><table><caption>Contoh susunan artikel</caption><thead><tr><th scope="col">Bagian</th><th scope="col">Ruang yang disediakan</th></tr></thead><tbody><tr><th scope="row">Pembuka</th><td>Pertanyaan dan konteks awal.</td></tr><tr><th scope="row">Pembahasan</th><td>Uraian, bahan bacaan, dan argumentasi penulis.</td></tr><tr><th scope="row">Catatan akhir</th><td>Refleksi dan pertanyaan untuk pembacaan berikutnya.</td></tr></tbody></table></figure><h2>Percakapan tetap terbuka</h2><p>Bagian akhir memberikan tempat bagi refleksi. Pada artikel yang diterbitkan nanti, rujukan dan catatan akan dicantumkan sesuai kebutuhan tulisan.</p><p>Terima kasih sudah menjelajahi pratinjau Nalar Hakim. Pilih kanal lain untuk melihat susunan bacaan berikutnya.</p></div><footer class="article-footer"><div class="share-row"><span class="eyebrow">TERUSKAN GAGASANNYA</span><button type="button" data-copy-url="" hidden>Salin tautan</button><span data-share-status role="status" aria-live="polite"></span></div><p class="correction-note">Catatan untuk redaksi? <a href="mailto:{EMAIL}">Kirim masukan.</a></p></footer></article><section class="related-section"><div class="section-heading"><h2>Lanjutkan membaca</h2></div><div class="article-grid">'''
 # Keep a bounded, genuine set of related links.
 body += ''.join(card(other,prefix) for other in [other for other in POSTS if other['slug']!=p['slug']][:3])+'</div></section></main>'
 page(f'artikel/{p["slug"]}/index.html',p['title'],body,p['channel'])

about=f'''<main id="main-content" class="container"><article class="article-layout"><header class="article-header"><span class="eyebrow">TENTANG NALAR HAKIM</span><h1>Membaca peristiwa.<br>Menimbang hukum.</h1><p>Sebuah ruang untuk hukum, gagasan, dan pertanyaan yang terus hidup.</p></header><div class="article-content"><p>Nalar Hakim disiapkan sebagai media edukasi hukum dengan lima ruang pembahasan: Pidana, Perdata, Agama &amp; Keluarga, Filsafat Hukum, serta Hukum &amp; Teknologi.</p><p>Tulisan akan diterbitkan dengan nama <strong>Lazarus</strong>. Pembaca dapat mengikuti pembahasan peristiwa, penjelasan, maupun pemikiran melalui kanal yang sesuai.</p><h2>Ruang ini sedang dipersiapkan</h2><p>Yang sedang Anda jelajahi adalah pratinjau desain. Seluruh tulisan di dalamnya adalah contoh tampilan dan belum merupakan publikasi redaksi. Tautan antarhalaman, pencarian, mode terang/gelap, serta panel donasi dapat dicoba.</p><h2>Terbuka untuk percakapan</h2><p>Untuk catatan, masukan, atau koreksi, hubungi <a href="mailto:{EMAIL}">{EMAIL}</a>.</p><a class="read-link" href="index.html">Jelajahi beranda ↗</a></div></article>{channels()}</main>'''
page('tentang.html','Tentang',about)

search=f'''<main id="main-content" class="container"><header class="archive-header"><span class="eyebrow">JELAJAHI GAGASAN</span><h1>Cari tulisan.</h1><p class="section-intro">Telusuri judul, kanal, atau kata yang ingin Anda baca dalam tulisan contoh.</p>{search_form('', ' id="preview-search"')}</header><p id="search-status" class="section-intro" role="status" aria-live="polite">{len(POSTS)} tulisan contoh tersedia.</p><div id="search-results" class="article-grid">{''.join(card(p) for p in POSTS)}</div><noscript><p>Pencarian membutuhkan JavaScript. Semua tulisan contoh tersedia di daftar di atas.</p></noscript></main>'''
page('cari.html','Cari Tulisan',search,extra='<script src="preview/search.js" defer></script>')

# Use a site-relative root for an error page whose unknown URL depth cannot be inferred.
missing='''<main id="main-content" class="container"><section class="empty-state"><span class="eyebrow">404 / HALAMAN TIDAK DITEMUKAN</span><h1>Jalan ini belum ada.</h1><p>Kembali ke beranda untuk menjelajahi tulisan dan kanal Nalar Hakim.</p><a class="read-link" href="/nalar_hakim/">Kembali ke beranda ↗</a></section></main>'''
page('404.html','Halaman tidak ditemukan',missing)
notfound=(ROOT/'404.html').read_text().replace('<head>','<head><base href="/nalar_hakim/">',1)
(ROOT/'404.html').write_text(notfound)

index=[{'title':p['title'],'channel':CHANNELS[p['channel']][0],'excerpt':p['excerpt'],'url':article_url(p),'channelUrl':channel_url(p['channel'])} for p in POSTS]
search_js='''/* Tiny search over the six explicitly labelled preview entries. */
(() => {
 'use strict';
 const entries = __DATA__;
 const form = document.querySelector('#preview-search');
 const results = document.querySelector('#search-results');
 const status = document.querySelector('#search-status');
 if (!form || !results || !status) return;
 const input = form.querySelector('input[name="q"]');
 const normalize = value => value.toLocaleLowerCase('id').normalize('NFKD').replace(/[\\u0300-\\u036f]/g, '');
 function render(query) {
  const terms = normalize(query.trim()).split(/\\s+/).filter(Boolean);
  const matches = entries.filter(entry => terms.every(term => normalize(entry.title+' '+entry.channel+' '+entry.excerpt).includes(term)));
  results.replaceChildren();
  status.textContent = query.trim() ? `${matches.length} tulisan contoh untuk “${query.trim()}”.` : `${matches.length} tulisan contoh tersedia.`;
  for (const entry of matches) {
   const card = document.createElement('article'); card.className = 'story-card search-result';
   const meta = document.createElement('div'); meta.className = 'story-meta';
   const channel = document.createElement('a'); channel.href=entry.channelUrl; channel.textContent=entry.channel; channel.className='category-label';
   const sample = document.createElement('span'); sample.textContent='Tulisan contoh';
   meta.append(channel,sample);
   const heading = document.createElement('h2'); const anchor=document.createElement('a'); anchor.href=entry.url; anchor.textContent=entry.title; heading.append(anchor);
   const excerpt=document.createElement('p'); excerpt.textContent=entry.excerpt;
   const read=document.createElement('a'); read.href=entry.url; read.className='read-link'; read.textContent='Baca tulisan ↗';
   card.append(meta,heading,excerpt,read); results.append(card);
  }
  if (!matches.length) { const empty=document.createElement('p'); empty.className='search-empty'; empty.textContent='Belum ada tulisan contoh yang cocok. Coba kata “hukum”, “ruang”, atau nama kanal.'; results.append(empty); }
 }
 const initial = (new URLSearchParams(location.search).get('q') || '').slice(0,120);
 input.value=initial; render(initial);
 form.addEventListener('submit', event => { event.preventDefault(); const query=input.value.slice(0,120); const url=new URL(location.href); query.trim()?url.searchParams.set('q',query.trim()):url.searchParams.delete('q'); history.replaceState(null,'',url); render(query); });
})();
'''.replace('__DATA__',json.dumps(index,ensure_ascii=False))
(ROOT/'preview').mkdir(exist_ok=True)
(ROOT/'preview/search.js').write_text(search_js)
print(f'Built {len(WRITTEN)} HTML pages and preview/search.js')
