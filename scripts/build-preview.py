#!/usr/bin/env python3
"""Build the custom Nalar Hakim publication without a frontend framework."""
from html import escape as e, unescape
from pathlib import Path
import json
import re
import unicodedata
from landing_page import render_landing
from flat_cover import render_cover
from articles import load_articles

ROOT = Path(__file__).resolve().parents[1]
CHANNELS = {
 'pidana': ('Pidana', 'Perbuatan, pertanggungjawaban, dan proses peradilan.'),
 'perdata': ('Perdata', 'Hubungan antarorang, hak, dan kepentingan sehari-hari.'),
 'agama-keluarga': ('Agama & Keluarga', 'Membaca persoalan keluarga dengan perhatian pada konteks.'),
 'filsafat-hukum': ('Filsafat Hukum', 'Gagasan, pertanyaan, dan cara kita memahami hukum.'),
 'hukum-teknologi': ('Hukum & Teknologi', 'Menimbang perubahan di ruang digital.'),
}
POSTS = load_articles(ROOT, CHANNELS)
SITE = 'https://azrielchoerulhakim.github.io/nalar_hakim/'
MONTHS = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']

def date_label(value):
 year,month,day=value.split('-')
 return f'{int(day)} {MONTHS[int(month)-1]} {year}'

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
 return f'<form class="search-form" action="{prefix}cari.html" method="get"{ident}><label><span class="screen-reader-text">Cari tulisan</span><input type="search" name="q" placeholder="Cari gagasan, pasal, atau topik…" maxlength="120"></label><button class="search-submit" type="submit">Cari</button></form>'

def header(prefix, selected=''):
 nav = f'<a href="{prefix}beranda.html"'+(' aria-current="page"' if selected=='home' else '')+'>Semua</a>'
 for slug, (label, _) in CHANNELS.items():
  nav += f'<a href="{channel_url(slug,prefix)}"'+(' aria-current="page"' if selected==slug else '')+f'>{e(label)}</a>'
 return f'''<a class="skip-link" href="#main-content">Langsung ke konten</a>
<header class="site-header"><div class="container header-inner"><a class="brand" href="{prefix}index.html" aria-label="Nalar Hakim — halaman awal"><span class="brand-mark" aria-hidden="true"></span><span><span class="brand-name">NALAR HAKIM<span class="brand-dot">.</span></span><span class="brand-caption">MEDIA HUKUM &amp; GAGASAN</span></span></a><div class="header-actions"><span class="header-note">INDEPENDEN DALAM BERPIKIR.</span><button class="theme-toggle" data-theme-toggle type="button" hidden>Terang</button><details><summary>Cari ↗</summary>{search_form(prefix)}</details></div></div><nav class="channel-nav" aria-label="Kanal hukum"><div class="container">{nav}</div></nav></header>'''

def donation(prefix):
 return f'''<details class="donation"><summary><span><span class="eyebrow">TETAP TERBUKA UNTUK SEMUA</span><span class="donation-title">Dukung Nalar Hakim</span></span></summary><div class="donation-content"><div><p>Bantu Nalar Hakim menghadirkan bacaan hukum yang terbuka untuk semua.</p><span class="network-label">ETH · Ethereum Mainnet</span><code class="wallet-address">{WALLET}</code><button class="copy-button" type="button" data-copy-address="{WALLET}" hidden>Salin alamat</button><span data-copy-status role="status" aria-live="polite"></span><p class="donation-note">Donasi sukarela. Semua tulisan tetap bebas dibaca.</p></div><figure class="donation-qr"><img src="{prefix}theme/nalar-hakim/assets/donation-qr.png" width="277" height="263" loading="lazy" decoding="async" alt="QR alamat donasi Ethereum Mainnet"><figcaption>Pindai alamat donasi</figcaption></figure></div></details>'''

def footer(prefix):
 return f'''<footer class="site-footer"><div class="container"><div class="footer-top"><div><a class="footer-brand" href="{prefix}index.html">NALAR HAKIM<span class="brand-dot">.</span></a><p>Membaca peristiwa.<br>Menimbang hukum.</p></div><div class="footer-contact"><span class="eyebrow">RUANG UNTUK BERDIALOG</span><a href="mailto:{EMAIL}">{EMAIL} ↗</a><p>Catatan, masukan, dan koreksi selalu terbuka.</p><a class="footer-about" href="{prefix}tentang.html">Tentang Nalar Hakim ↗</a></div></div>{donation(prefix)}<div class="footer-bottom"><span>© 2026 Nalar Hakim</span><span>Ditulis oleh Lazarus.</span><a href="#main-content">Kembali ke atas ↑</a></div></div></footer>'''

def page(path, title, body, selected='', extra='', description='', post=None):
 depth=len(Path(path).parts)-1
 prefix='../'*depth
 description=description or 'Membaca peristiwa, memeriksa sumber, dan menimbang hukum. Artikel edukasi hukum dan gagasan oleh Lazarus.'
 canonical=SITE+(path.removesuffix('index.html') if path.endswith('/index.html') else path)
 robots='noindex,follow' if path in ('cari.html','404.html') else 'index,follow'
 schema=''
 if post:
  data={'@context':'https://schema.org','@type':'Article','headline':post['title'],'description':post['excerpt'],'author':{'@type':'Person','name':'Lazarus'},'publisher':{'@type':'Organization','name':'Nalar Hakim'},'datePublished':post['published'],'dateModified':post['updated'],'inLanguage':'id-ID','mainEntityOfPage':canonical}
  schema='<script type="application/ld+json">'+json.dumps(data,ensure_ascii=False).replace('<',r'\u003c')+'</script>'
 html=f'''<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="{robots}"><meta name="description" content="{e(description)}"><meta name="theme-color" content="#0b0b0b"><title>{e(title)} — Nalar Hakim</title><link rel="canonical" href="{canonical}"><meta property="og:title" content="{e(title)} — Nalar Hakim"><meta property="og:description" content="{e(description)}"><meta property="og:type" content="{'article' if post else 'website'}"><meta property="og:url" content="{canonical}"><link rel="icon" href="{prefix}preview/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="{prefix}theme/nalar-hakim/style.css"><link rel="stylesheet" href="{prefix}preview/identity.css"><link rel="stylesheet" href="{prefix}preview/preview.css"><link rel="stylesheet" href="{prefix}preview/editorial.css"><link rel="stylesheet" href="{prefix}preview/motion.css"><script src="{prefix}theme/nalar-hakim/assets/site.js" defer></script><script src="{prefix}preview/motion.js" defer></script>{schema}{extra}</head><body>{header(prefix,selected)}{body}{footer(prefix)}</body></html>'''
 dest=ROOT/path;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(html,encoding='utf-8');WRITTEN.append(path)

def meta(p,prefix='',article=False):
 date='' if article else f'<time datetime="{p["published"]}">{date_label(p["published"])}</time>'
 return f'<div class="story-meta"><a class="category-label" href="{channel_url(p["channel"],prefix)}">{e(CHANNELS[p["channel"]][0])}</a><span class="article-type">{e(p["type"])}</span>{date}<span>{p["minutes"]} menit baca</span></div>'


def publication_dates(p):
 result=f'<div class="article-dates"><span>Terbit <time datetime="{p["published"]}">{date_label(p["published"])}</time></span>'
 if p['updated']!=p['published']:
  result+=f'<span>Diperbarui <time datetime="{p["updated"]}">{date_label(p["updated"])}</time></span>'
 return result+'</div>'

def cover(p,prefix='',tag='a'):
 target=f'href="{article_url(p,prefix)}" aria-label="{e(p["title"])}"' if tag=='a' else 'aria-hidden="true"'
 return f'<{tag} class="story-image tone-{p["channel"]}" {target}><span class="cover-placeholder" aria-hidden="true">{render_cover(p["channel"])}<span class="cover-symbol">{p["symbol"]}</span><span class="cover-caption">NALAR HAKIM / {e(CHANNELS[p["channel"]][0].upper())}</span></span></{tag}>'

def card(p,prefix='',lead=False):
 return f'<article class="story-card {"lead-story" if lead else ""}">{cover(p,prefix)}<div class="story-body">{meta(p,prefix)}<h{2 if lead else 3}><a href="{article_url(p,prefix)}">{e(p["title"])}</a></h{2 if lead else 3}><p>{e(p["excerpt"])}</p><a class="read-link" href="{article_url(p,prefix)}">Baca tulisan <span aria-hidden="true">↗</span></a></div></article>'

def channels(prefix=''):
 return '<section class="channel-section"><div class="section-heading"><h2>Lima sudut pandang</h2><span class="eyebrow">JELAJAHI KANAL</span></div><div class="channel-grid">'+''.join(f'<a class="channel-card" href="{channel_url(slug,prefix)}"><span class="channel-number">{i:02}</span><h3>{e(label)}</h3><span aria-hidden="true">↗</span></a>' for i,(slug,(label,_)) in enumerate(CHANNELS.items(),1))+'</div></section>'

def references(p):
 rows=''
 for source in p['sources']:
  number=str(source['id'])
  rows+=f'<li id="rujukan-{number}"><a href="{e(source["url"])}" target="_blank" rel="noopener noreferrer">{e(source["title"])} <span aria-hidden="true">↗</span></a><p>{e(source["note"])}</p><a class="reference-return" href="#penanda-{number}" aria-label="Kembali ke penanda rujukan {number}">Kembali ke penanda {number} ↑</a></li>'
 return '<section class="article-references" aria-labelledby="sumber-rujukan"><h2 id="sumber-rujukan">Sumber &amp; rujukan</h2><p class="reference-explainer">Telusuri teks peraturan dan bacaan yang menjadi dasar pembahasan. Nomor rujukan menghubungkan sumber dengan bagian artikel terkait.</p><ol>'+rows+'</ol></section>'

def with_toc(prose):
 """Add stable, unique anchors to this generator's known h2 markup; TOC starts at three sections."""
 headings = []
 counts = {}
 def anchored(match):
  title = unescape(re.sub(r'<[^>]+>', '', match.group(1))).strip()
  slug = unicodedata.normalize('NFKD', title).encode('ascii', 'ignore').decode().lower()
  slug = re.sub(r'[^a-z0-9]+', '-', slug).strip('-') or 'bagian'
  counts[slug] = counts.get(slug, 0) + 1
  ident = 'bagian-' + slug + (f'-{counts[slug]}' if counts[slug] > 1 else '')
  headings.append((ident,title))
  return f'<h2 id="{ident}">{match.group(1)}</h2>'
 prose = re.sub(r'<h2>(.*?)</h2>', anchored, prose, flags=re.S)
 if len(headings) < 3:
  return '', prose
 links = ''.join(f'<li><a href="#{ident}">{e(title)}</a></li>' for ident,title in headings)
 toc = '<details class="article-toc" open><summary>Daftar isi <span class="toc-summary-note">'+str(len(headings))+' bagian</span></summary><nav aria-label="Daftar isi artikel"><ol>'+links+'</ol></nav></details>'
 return toc, prose

def article_prose(p):
 toc,prose=with_toc(p['body'])
 summary='<aside class="article-summary" aria-labelledby="ringkasan-artikel"><h2 id="ringkasan-artikel">Pokok bacaan</h2><ul>'+''.join(f'<li>{e(item)}</li>' for item in p['summary'])+'</ul></aside>'
 return summary+toc+prose+references(p)

home='''<main id="main-content" class="container home-main"><div class="home-intro"><div><span class="eyebrow">HUKUM, DARI BERBAGAI SUDUT.</span><h1>Ruang untuk <span>menimbang.</span></h1></div><p>Peristiwa, pemikiran, dan pertanyaan. Membaca hukum dengan nalar yang terbuka.</p></div><div class="section-heading"><h2>Sorotan</h2><span class="eyebrow">CATATAN LAZARUS ↘</span></div><div class="hero-grid">'''+card(POSTS[0],lead=True)+'<aside class="top-stories"><div class="section-heading"><h2>Juga untuk dibaca</h2></div>'+''.join(f'<article class="rail-story">{meta(p)}<h3><a href="{article_url(p)}">{e(p["title"])}</a></h3><span class="rail-arrow" aria-hidden="true">↗</span></article>' for p in POSTS[1:3])+'''<div class="rail-note"><span class="eyebrow">CATATAN REDAKSI</span><p>Setiap persoalan layak dibaca dari lebih dari satu sudut.</p><span>Lazarus / Nalar Hakim</span></div></aside></div><section class="latest-section"><div class="section-heading"><h2>Lintas gagasan</h2><a href="cari.html">Jelajahi semua tulisan ↗</a></div><div class="article-grid">'''+''.join(card(p) for p in POSTS[3:])+f'''</div></section>{channels()}</main>'''
page('beranda.html','Ruang Baca',home,'home')

for slug,(label,desc) in CHANNELS.items():
 prefix='../../'
 body=f'<main id="main-content" class="container"><header class="archive-header"><a class="back-link" href="{prefix}beranda.html">← Kembali ke ruang baca</a><div class="eyebrow">KANAL NALAR HAKIM</div><h1>{e(label)}</h1><p class="section-intro">{e(desc)}</p></header><div class="article-grid">'+''.join(card(p,prefix) for p in POSTS if p['channel']==slug)+f'</div>{channels(prefix)}</main>'
 page(f'kanal/{slug}/index.html',label,body,slug)

for p in POSTS:
 prefix='../../'
 body=f'''<main id="main-content" class="container single-main"><article class="article-layout"><header class="article-header"><a class="back-link" href="{channel_url(p['channel'],prefix)}">← Kembali ke {e(CHANNELS[p['channel']][0])}</a>{meta(p,prefix,article=True)}<h1>{e(p['title'])}</h1><p class="article-deck">{e(p['excerpt'])}</p><div class="article-byline"><span class="author-avatar" aria-hidden="true">L</span><span>Ditulis oleh <strong>Lazarus</strong></span>{publication_dates(p)}</div></header><figure class="article-cover">{cover(p,prefix,'div')}<figcaption>Ilustrasi: Nalar Hakim.</figcaption></figure><div class="article-content">{article_prose(p)}</div><footer class="article-footer"><p class="editorial-note">Tulisan ini merupakan bacaan edukasi. Penerapan hukum pada perkara tertentu bergantung pada fakta, bukti, dan ketentuan yang berlaku.</p><div class="share-row"><span class="eyebrow">TERUSKAN GAGASANNYA</span><button type="button" data-copy-url="{SITE}{article_url(p)}" hidden>Salin tautan</button><span data-share-status role="status" aria-live="polite"></span></div><p class="correction-note">Catatan untuk redaksi? <a href="mailto:{EMAIL}">Kirim masukan.</a></p></footer></article><section class="related-section"><div class="section-heading"><h2>Lanjutkan membaca</h2></div><div class="article-grid">'''
 body += ''.join(card(other,prefix) for other in [other for other in POSTS if other['slug']!=p['slug']][:3])+'</div></section></main>'
 page(f'artikel/{p["slug"]}/index.html',p['title'],body,p['channel'],description=p['excerpt'],post=p)

about=f'''<main id="main-content" class="container"><article class="article-layout"><header class="article-header"><span class="eyebrow">TENTANG NALAR HAKIM</span><h1>Membaca peristiwa.<br>Menimbang hukum.</h1><p>Sebuah ruang untuk hukum, gagasan, dan pertanyaan yang terus hidup.</p></header><div class="article-content"><p>Hukum hadir dalam keputusan sehari-hari, hubungan antarmanusia, serta perubahan yang berlangsung di ruang digital. Nalar Hakim membuka ruang untuk membacanya secara jernih: mengenali persoalan, menelusuri sumber, dan menimbang argumentasi.</p><p>Lima kanal menjadi titik berangkat: Pidana, Perdata, Agama &amp; Keluarga, Filsafat Hukum, serta Hukum &amp; Teknologi. Seluruh tulisan diterbitkan dengan nama <strong>Lazarus</strong>.</p><h2>Konteks sebelum kesimpulan</h2><p>Istilah hukum sering terdengar akrab sebelum maknanya dipahami. Tulisan di sini bergerak dari pertanyaan yang konkret menuju dasar aturan dan alasan di baliknya. Perbedaan pendapat diberi ruang; kesimpulan perlu dapat ditelusuri.</p><h2>Sumber yang dapat diperiksa</h2><p>Nomor rujukan di dalam artikel mengarah ke daftar sumber. Peraturan, putusan, dokumentasi teknis, dan karya pemikir dirujuk sesuai topiknya. Tanggal terbit dan pembaruan membantu pembaca menempatkan tulisan dalam waktu. Ilustrasi hipotetis diberi penjelasan agar tidak terbaca sebagai laporan peristiwa nyata.</p><h2>Terbuka untuk koreksi</h2><p>Pengetahuan berkembang, begitu pula hukum. Jika ada bagian yang perlu diperbaiki, kirim judul tulisan, bagian yang dimaksud, dan sumber pembanding melalui <a href="mailto:{EMAIL}">{EMAIL}</a>. Koreksi substantif akan dicatat pada pembaruan artikel.</p><h2>Bacaan yang tetap terbuka</h2><p>Artikel dapat dibaca tanpa akun atau langganan. Dukungan sukarela tersedia melalui panel donasi. Situs tidak meminta koneksi dompet; alamat dan jaringan ditampilkan agar dapat diperiksa sendiri oleh pengirim.</p><a class="read-link" href="beranda.html">Jelajahi ruang baca</a></div></article>{channels()}</main>'''

page('tentang.html','Tentang',about)

def search_card(p):
 return f'<article class="story-card search-result">{meta(p)}<h2><a href="{article_url(p)}">{e(p["title"])}</a></h2><p>{e(p["excerpt"])}</p><a class="read-link" href="{article_url(p)}">Baca tulisan <span aria-hidden="true">↗</span></a></article>'

search=f'''<main id="main-content" class="container"><header class="archive-header"><span class="eyebrow">JELAJAHI GAGASAN</span><h1>Cari tulisan.</h1><p class="section-intro">Telusuri judul, kanal, jenis tulisan, atau kata dalam pembahasan.</p>{search_form('', ' id="preview-search"')}</header><p id="search-status" class="section-intro" role="status" aria-live="polite">{len(POSTS)} tulisan tersedia.</p><div id="search-results" class="article-grid">{''.join(search_card(p) for p in POSTS)}</div><noscript><p>Pencarian membutuhkan JavaScript. Semua tulisan tersedia di daftar di atas.</p></noscript></main>'''
page('cari.html','Cari Tulisan',search,extra='<script src="preview/search.js" defer></script>')

# Use a site-relative root for an error page whose unknown URL depth cannot be inferred.
missing='''<main id="main-content" class="container"><section class="empty-state"><span class="eyebrow">404 / HALAMAN TIDAK DITEMUKAN</span><h1>Jalan ini belum ada.</h1><p>Kembali ke beranda untuk menjelajahi tulisan dan kanal Nalar Hakim.</p><a class="read-link" href="/nalar_hakim/beranda.html">Kembali ke ruang baca</a></section></main>'''
page('404.html','Halaman tidak ditemukan',missing)
notfound=(ROOT/'404.html').read_text().replace('<head>','<head><base href="/nalar_hakim/">',1)
(ROOT/'404.html').write_text(notfound)

index=[{'text':p['text'],'minutes':p['minutes'],'date':p['published'],'dateLabel':date_label(p['published']),'title':p['title'],'channel':CHANNELS[p['channel']][0],'type':p['type'],'excerpt':p['excerpt'],'url':article_url(p),'channelUrl':channel_url(p['channel'])} for p in POSTS]
search_js='''/* Search the published articles locally, without tracking or external services. */
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
  const matches = entries.filter(entry => terms.every(term => normalize(entry.title+' '+entry.channel+' '+entry.type+' '+entry.excerpt+' '+entry.text).includes(term)));
  results.replaceChildren();
  status.textContent = query.trim() ? `${matches.length} tulisan untuk “${query.trim()}”.` : `${matches.length} tulisan tersedia.`;
  for (const entry of matches) {
   const card = document.createElement('article'); card.className = 'story-card search-result';
   const meta = document.createElement('div'); meta.className = 'story-meta';
   const channel = document.createElement('a'); channel.href=entry.channelUrl; channel.textContent=entry.channel; channel.className='category-label';
   const kind = document.createElement('span'); kind.className='article-type'; kind.textContent=entry.type;
   const date = document.createElement('time'); date.dateTime=entry.date; date.textContent=entry.dateLabel;
   const duration = document.createElement('span'); duration.textContent=entry.minutes+' menit baca';
   meta.append(channel,kind,date,duration);
   const heading = document.createElement('h2'); const anchor=document.createElement('a'); anchor.href=entry.url; anchor.textContent=entry.title; heading.append(anchor);
   const excerpt=document.createElement('p'); excerpt.textContent=entry.excerpt;
   const read=document.createElement('a'); read.href=entry.url; read.className='read-link'; read.textContent='Baca tulisan';
   card.append(meta,heading,excerpt,read); results.append(card);
  }
  if (!matches.length) { const empty=document.createElement('p'); empty.className='search-empty'; empty.textContent='Belum ada tulisan yang cocok. Coba kata “waris”, “perjanjian”, atau “keadilan”.'; results.append(empty); }
 }
 const initial = (new URLSearchParams(location.search).get('q') || '').slice(0,120);
 input.value=initial; render(initial);
 form.addEventListener('submit', event => { event.preventDefault(); const query=input.value.slice(0,120); const url=new URL(location.href); query.trim()?url.searchParams.set('q',query.trim()):url.searchParams.delete('q'); history.replaceState(null,'',url); render(query); });
})();
'''.replace('__DATA__',json.dumps(index,ensure_ascii=False))
(ROOT/'preview').mkdir(exist_ok=True)
(ROOT/'preview/search.js').write_text(search_js)
# Preserve old incoming links without retaining demonstration content.
legacy={'lebih-dari-satu-sudut':'filsafat-hukum','menguji-pemikiran':'filsafat-hukum','pertanyaan-pertama':'pidana','menyusun-fakta':'perdata','ruang-untuk-mendengar':'agama-keluarga','ruang-digital':'hukum-teknologi'}
for old_slug,channel in legacy.items():
 post=next(item for item in POSTS if item['channel']==channel)
 if old_slug==post['slug']: continue
 target='../'+post['slug']+'/'
 html=f'<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><meta http-equiv="refresh" content="0;url={target}"><link rel="canonical" href="{SITE}{article_url(post)}"><title>Artikel telah berpindah — Nalar Hakim</title></head><body><p>Artikel tersedia di alamat baru: <a href="{target}">{e(post["title"])}</a>.</p></body></html>'
 dest=ROOT/'artikel'/old_slug/'index.html';dest.write_text(html,encoding='utf-8');WRITTEN.append(str(dest.relative_to(ROOT)))
urls=[SITE,SITE+'beranda.html',SITE+'tentang.html']+[SITE+channel_url(slug) for slug in CHANNELS]+[SITE+article_url(post) for post in POSTS]
(ROOT/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join(f'<url><loc>{e(url)}</loc></url>' for url in urls)+'</urlset>\n',encoding='utf-8')
(ROOT/'index.html').write_text(render_landing(), encoding='utf-8')
WRITTEN.append('index.html')
print(f'Built {len(WRITTEN)} HTML pages, {len(POSTS)} articles, search index and sitemap')
