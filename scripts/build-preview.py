#!/usr/bin/env python3
"""Build the custom Nalar Hakim publication without a frontend framework."""
from html import escape as e, unescape
from pathlib import Path
import json
import re
import unicodedata
from hashlib import sha256
from landing_page import render_landing, THEME_INIT
from flat_cover import render_cover
from articles import load_articles
from editorial_pages import FORMATS, form_links, invitation, about_page, submission_page, policy_page

ROOT = Path(__file__).resolve().parents[1]
CHANNELS = {
 'pidana': ('Pidana', 'Menguji kuasa penghukuman, pembuktian, dan cara kesalahan diproduksi dalam ruang publik.'),
 'perdata': ('Perdata', 'Membaca kebebasan, ketimpangan, dan pemulihan dalam hubungan hukum privat.'),
 'agama-keluarga': ('Agama & Keluarga', 'Menguji pengakuan, kerja perawatan, serta distribusi hak dan beban dalam keluarga.'),
 'filsafat-hukum': ('Filsafat Hukum', 'Menguji dasar pembenaran hukum dan batas teori melalui persoalan konkret.'),
 'hukum-teknologi': ('Hukum & Teknologi', 'Membaca kekuasaan, persetujuan, dan pertanggungjawaban yang dibentuk oleh teknologi.'),
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
 items=[('home','Ruang baca',prefix+'beranda.html'),('telaah','Telaah',prefix+'bentuk/telaah/'),('bedah','Bedah',prefix+'bentuk/bedah/'),('esai','Esai',prefix+'bentuk/esai/'),('perdebatan','Perdebatan',prefix+'bentuk/perdebatan/'),('submit','Kirim naskah',prefix+'kirim-naskah.html')]
 nav=''.join(f'<a href="{url}"'+(' aria-current="page"' if selected==key else '')+f'>{label}</a>' for key,label,url in items)
 return f'''<a class="skip-link" href="#main-content">Langsung ke konten</a>
<header class="site-header"><div class="container header-inner"><a class="brand" href="{prefix}index.html" aria-label="Nalar Hakim — halaman awal"><span class="brand-mark" aria-hidden="true"></span><span><span class="brand-name">NALAR HAKIM<span class="brand-dot">.</span></span><span class="brand-caption">KRITIK HUKUM INDEPENDEN</span></span></a><div class="header-actions"><a class="header-note" href="{prefix}tentang.html">ARAH REDAKSI ↗</a><button class="theme-toggle" data-theme-toggle type="button" hidden>Terang</button><details><summary>Cari ↗</summary>{search_form(prefix)}</details></div></div><nav class="channel-nav" aria-label="Navigasi redaksi"><div class="container">{nav}</div></nav></header>'''

def donation(prefix):
 return f'''<details class="donation"><summary><span><span class="eyebrow">TETAP TERBUKA UNTUK SEMUA</span><span class="donation-title">Dukung Nalar Hakim</span></span></summary><div class="donation-content"><div><p>Bantu menjaga ruang kritik hukum yang independen dan terbuka untuk semua.</p><span class="network-label">ETH · Ethereum Mainnet</span><code class="wallet-address">{WALLET}</code><button class="copy-button" type="button" data-copy-address="{WALLET}" hidden>Salin alamat</button><span data-copy-status role="status" aria-live="polite"></span><p class="donation-note">Donasi sukarela. Semua tulisan tetap bebas dibaca.</p></div><figure class="donation-qr"><img src="{prefix}theme/nalar-hakim/assets/donation-qr.png" width="277" height="263" loading="lazy" decoding="async" alt="QR alamat donasi Ethereum Mainnet"><figcaption>Pindai alamat donasi</figcaption></figure></div></details>'''

def footer(prefix):
 return f'''<footer class="site-footer"><div class="container"><div class="footer-top"><div><a class="footer-brand" href="{prefix}index.html">NALAR HAKIM<span class="brand-dot">.</span></a><p>Identitas disamarkan.<br>Argumen diperiksa.</p></div><div class="footer-contact"><span class="eyebrow">MEJA REDAKSI / LAZARUS</span><a href="mailto:{EMAIL}">{EMAIL} ↗</a><p>Naskah, sanggahan, dan koreksi melalui email.</p><nav class="footer-editorial-links" aria-label="Informasi redaksi"><a href="{prefix}kirim-naskah.html">Kirim naskah ↗</a><a href="{prefix}tentang.html">Tentang</a><a href="{prefix}kebijakan-redaksi.html">Kebijakan Lazarus</a></nav></div></div>{donation(prefix)}<div class="footer-bottom"><span>© 2026 Nalar Hakim</span><span>Disunting oleh Lazarus.</span><a href="#main-content">Kembali ke atas ↑</a></div></div></footer>'''

def page(path, title, body, selected='', extra='', description='', post=None):
 depth=len(Path(path).parts)-1
 prefix='../'*depth
 description=description or 'Kritik hukum independen: fenomena aktual, teori, dan argumen yang dapat diperiksa. Terbuka untuk naskah dengan nama samaran, disunting oleh Lazarus.'
 canonical=SITE+(path.removesuffix('index.html') if path.endswith('/index.html') else path)
 robots='noindex,follow' if path in ('cari.html','404.html') else 'index,follow'
 schema=''
 if post:
  data={'@context':'https://schema.org','@type':'Article','headline':post['title'],'description':post['excerpt'],'author':{'@type':'Person','name':post.get('author','Lazarus')},'articleSection':post['type'],'publisher':{'@type':'Organization','name':'Nalar Hakim'},'datePublished':post['published'],'dateModified':post['updated'],'inLanguage':'id-ID','mainEntityOfPage':canonical}
  schema='<script type="application/ld+json">'+json.dumps(data,ensure_ascii=False).replace('<',r'\u003c')+'</script>'
 html=f'''<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="{robots}"><meta name="description" content="{e(description)}"><meta name="theme-color" content="#181a20">{THEME_INIT}<title>{e(title)} — Nalar Hakim</title><link rel="canonical" href="{canonical}"><meta property="og:title" content="{e(title)} — Nalar Hakim"><meta property="og:description" content="{e(description)}"><meta property="og:type" content="{'article' if post else 'website'}"><meta property="og:url" content="{canonical}"><link rel="icon" href="{prefix}preview/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="{prefix}theme/nalar-hakim/style.css"><link rel="stylesheet" href="{prefix}preview/identity.css"><link rel="stylesheet" href="{prefix}preview/preview.css"><link rel="stylesheet" href="{prefix}preview/editorial.css"><link rel="stylesheet" href="{prefix}preview/redaksi.css"><link rel="stylesheet" href="{prefix}preview/motion.css"><script src="{prefix}theme/nalar-hakim/assets/site.js" defer></script><script src="{prefix}preview/motion.js" defer></script>{schema}{extra}</head><body>{header(prefix,selected)}{body}{footer(prefix)}</body></html>'''
 dest=ROOT/path;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(html,encoding='utf-8');WRITTEN.append(path)

def meta(p,prefix='',article=False):
 date='' if article else f'<time datetime="{p["published"]}">{date_label(p["published"])}</time>'
 return f'<div class="story-meta"><a class="category-label" href="{channel_url(p["channel"],prefix)}">{e(CHANNELS[p["channel"]][0])}</a><a class="article-type" href="{prefix}bentuk/{p.get('format','telaah')}/">{e(p["type"])}</a>{date}<span>{p["minutes"]} menit baca</span></div>'


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
 return '<section class="channel-section"><div class="section-heading"><h2>Lintas bidang</h2><span class="eyebrow">TELUSURI PERSOALAN</span></div><div class="channel-grid">'+''.join(f'<a class="channel-card" href="{channel_url(slug,prefix)}"><span class="channel-number">{i:02}</span><h3>{e(label)}</h3><span aria-hidden="true">↗</span></a>' for i,(slug,(label,_)) in enumerate(CHANNELS.items(),1))+'</div></section>'

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
 summary='<aside class="article-summary" aria-labelledby="ringkasan-artikel"><h2 id="ringkasan-artikel">Jalur argumentasi</h2><ul>'+''.join(f'<li>{e(item)}</li>' for item in p['summary'])+'</ul></aside>'
 return summary+toc+prose+references(p)

home='''<main id="main-content" class="container home-main"><div class="home-intro"><div><span class="eyebrow">KRITIK HUKUM INDEPENDEN</span><h1>Hukum,<span>diuji.</span></h1></div><div class="home-position"><p>Menelusuri peristiwa sampai ke asumsi. Mempertemukan hukum dengan teori, bukti, dan keberatan.</p><a class="read-link" href="tentang.html">Baca arah redaksi</a></div></div><div class="section-heading"><h2>Telaah utama</h2><span class="eyebrow">ARGUMEN UNTUK DIPERIKSA ↘</span></div><div class="hero-grid">'''+card(POSTS[0],lead=True)+'<aside class="top-stories"><div class="section-heading"><h2>Persoalan lain</h2></div>'+''.join(f'<article class="rail-story">{meta(p)}<h3><a href="{article_url(p)}">{e(p["title"])}</a></h3><span class="rail-arrow" aria-hidden="true">↗</span></article>' for p in POSTS[1:3])+'''<div class="rail-note"><span class="eyebrow">SIKAP REDAKSI</span><p>Identitas disamarkan.<br>Argumen diperiksa.</p><a href="kebijakan-redaksi.html">Kebijakan Lazarus ↗</a></div></aside></div><section class="latest-section"><div class="section-heading"><h2>Lintas pemikiran</h2><a href="cari.html">Telusuri semua tulisan ↗</a></div><div class="article-grid">'''+''.join(card(p) for p in POSTS[3:])+f'''</div></section>{form_links()}<section class="debate-invitation"><span class="eyebrow">RUANG PERDEBATAN</span><h2>Kesimpulan kami<br>boleh dipersoalkan.</h2><p>Ajukan sanggahan dengan menunjukkan bagian yang diperdebatkan, dasar penalaran, dan sumbernya. Tulisan Lazarus terbuka untuk ditanggapi.</p><a class="read-link" href="bentuk/perdebatan/">Buka ruang perdebatan</a></section>{channels()}{invitation()}</main>'''
page('beranda.html','Ruang Baca',home,'home')

for slug,(label,desc) in FORMATS.items():
 prefix='../../'
 matches=[p for p in POSTS if p.get('format','telaah')==slug]
 body=f'<main id="main-content" class="container"><header class="archive-header"><a class="back-link" href="{prefix}beranda.html">← Kembali ke ruang baca</a><span class="eyebrow">BENTUK TULISAN / NALAR HAKIM</span><h1>{e(label)}</h1><p class="section-intro">{e(desc)}</p></header>'
 if matches:
  body+='<div class="article-grid">'+''.join(card(p,prefix) for p in matches)+'</div>'
 else:
  body+=f'<section class="debate-empty"><span class="eyebrow">TERBUKA UNTUK TANGGAPAN</span><h2>Perdebatan dimulai<br>dari sebuah keberatan.</h2><p>Belum ada tanggapan yang diterbitkan. Anda dapat menyanggah tulisan di Nalar Hakim, termasuk tulisan Lazarus. Sebutkan argumen yang diuji dan sertakan sumber yang menopang pembacaan Anda.</p><a class="editorial-button" href="{prefix}kirim-naskah.html">Kirim tanggapan ↗</a><a class="read-link" href="{prefix}beranda.html">Pilih tulisan untuk ditanggapi</a></section>'
 body+=form_links(prefix)+'</main>'
 page(f'bentuk/{slug}/index.html',label,body,slug,description=desc)

for slug,(label,desc) in CHANNELS.items():
 prefix='../../'
 body=f'<main id="main-content" class="container"><header class="archive-header"><a class="back-link" href="{prefix}beranda.html">← Kembali ke ruang baca</a><div class="eyebrow">BIDANG KAJIAN</div><h1>{e(label)}</h1><p class="section-intro">{e(desc)}</p></header><div class="article-grid">'+''.join(card(p,prefix) for p in POSTS if p['channel']==slug)+f'</div>{channels(prefix)}</main>'
 page(f'kanal/{slug}/index.html',label,body,slug)

for p in POSTS:
 prefix='../../'
 body=f'''<main id="main-content" class="container single-main"><article class="article-layout"><header class="article-header"><a class="back-link" href="{channel_url(p['channel'],prefix)}">← Kembali ke {e(CHANNELS[p['channel']][0])}</a>{meta(p,prefix,article=True)}<h1>{e(p['title'])}</h1><p class="article-deck">{e(p['excerpt'])}</p><div class="article-byline"><span class="author-avatar" aria-hidden="true">{e(p.get("author","Lazarus")[:1].upper())}</span><span>Oleh <strong>{e(p.get("author","Lazarus"))}</strong></span>{publication_dates(p)}</div></header><figure class="article-cover">{cover(p,prefix,'div')}<figcaption>Ilustrasi: Nalar Hakim.</figcaption></figure><div class="article-content"><aside class="argument-frame" aria-labelledby="tesis-artikel"><span class="eyebrow" id="tesis-artikel">TESIS UTAMA</span><p>{e(p.get('thesis',p['excerpt']))}</p><dl><div><dt>Objek</dt><dd>{e(p.get('object',CHANNELS[p['channel']][0]))}</dd></div><div><dt>Lensa</dt><dd>{e(p.get('lens','Kritik hukum'))}</dd></div></dl></aside>{article_prose(p)}</div><footer class="article-footer"><p class="editorial-note">Analisis dan kesimpulan dalam tulisan ini terbuka untuk diuji. Sumber disertakan agar dasar pembacaannya dapat diperiksa.</p><div class="share-row"><span class="eyebrow">TERUSKAN GAGASANNYA</span><button type="button" data-copy-url="{SITE}{article_url(p)}" hidden>Salin tautan</button><span data-share-status role="status" aria-live="polite"></span></div><p class="revision-note"><strong>Catatan redaksi · {date_label(p['updated'])}</strong><br>{e(p.get('editorial_revision','Diterbitkan setelah peninjauan redaksi.'))}</p><div class="article-response"><h2>Punya pembacaan lain?</h2><p>Ajukan sanggahan beserta dasar argumentasinya atau laporkan kekeliruan sumber.</p><a class="read-link" href="{prefix}kirim-naskah.html">Kirim tanggapan</a><a class="read-link" href="mailto:{EMAIL}">Sampaikan koreksi</a></div></footer></article><section class="related-section"><div class="section-heading"><h2>Lanjutkan membaca</h2></div><div class="article-grid">'''
 body += ''.join(card(other,prefix) for other in [other for other in POSTS if other['slug']!=p['slug']][:3])+'</div></section></main>'
 page(f'artikel/{p["slug"]}/index.html',p['title'],body,p.get('format','telaah'),description=p['excerpt'],post=p)

page('tentang.html','Tentang Nalar Hakim',about_page(),description='Arah Nalar Hakim: kritik hukum independen, teori yang bekerja, penulis dengan nama samaran, dan argumen yang terbuka untuk diuji.')
page('kirim-naskah.html','Kirim Naskah',submission_page(),'submit',description='Kirim naskah Word melalui email baru ke redaksi Nalar Hakim. Lazarus meninjau karya; keputusan penerbitan, penyuntingan, atau penolakan dikabarkan melalui email.')
page('kebijakan-redaksi.html','Kebijakan Lazarus',policy_page(),description='Pertimbangan Lazarus dalam meninjau dan menyunting naskah: arah kritik, teori, sumber, nama samaran, koreksi, dan kebebasan berpendapat.')

def search_card(p):
 return f'<article class="story-card search-result">{meta(p)}<h2><a href="{article_url(p)}">{e(p["title"])}</a></h2><p>{e(p["excerpt"])}</p><a class="read-link" href="{article_url(p)}">Baca tulisan <span aria-hidden="true">↗</span></a></article>'

search=f'''<main id="main-content" class="container"><header class="archive-header"><span class="eyebrow">JELAJAHI GAGASAN</span><h1>Cari tulisan.</h1><p class="section-intro">Telusuri persoalan, teori, bidang kajian, atau kata dalam argumentasi.</p>{search_form('', ' id="preview-search"')}</header><p id="search-status" class="section-intro" role="status" aria-live="polite">{len(POSTS)} tulisan tersedia.</p><div id="search-results" class="article-grid">{''.join(search_card(p) for p in POSTS)}</div><noscript><p>Pencarian membutuhkan JavaScript. Semua tulisan tersedia di daftar di atas.</p></noscript></main>'''
page('cari.html','Cari Tulisan',search,extra='<script src="preview/search.js" defer></script>')

# Use a site-relative root for an error page whose unknown URL depth cannot be inferred.
missing='''<main id="main-content" class="container"><section class="empty-state"><span class="eyebrow">404 / HALAMAN TIDAK DITEMUKAN</span><h1>Jalan ini belum ada.</h1><p>Kembali ke beranda untuk menjelajahi tulisan dan kanal Nalar Hakim.</p><a class="read-link" href="/nalar_hakim/beranda.html">Kembali ke ruang baca</a></section></main>'''
page('404.html','Halaman tidak ditemukan',missing)
notfound=(ROOT/'404.html').read_text().replace('<head>','<head><base href="/nalar_hakim/">',1)
(ROOT/'404.html').write_text(notfound)

index=[{'text':p['text'],'minutes':p['minutes'],'date':p['published'],'dateLabel':date_label(p['published']),'title':p['title'],'channel':CHANNELS[p['channel']][0],'type':p['type'],'formatUrl':'bentuk/'+p.get('format','telaah')+'/','lens':p.get('lens',''),'object':p.get('object',''),'excerpt':p['excerpt'],'url':article_url(p),'channelUrl':channel_url(p['channel'])} for p in POSTS]
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
  const matches = entries.filter(entry => terms.every(term => normalize(entry.title+' '+entry.channel+' '+entry.type+' '+entry.excerpt+' '+entry.lens+' '+entry.object+' '+entry.text).includes(term)));
  results.replaceChildren();
  status.textContent = query.trim() ? `${matches.length} tulisan untuk “${query.trim()}”.` : `${matches.length} tulisan tersedia.`;
  for (const entry of matches) {
   const card = document.createElement('article'); card.className = 'story-card search-result';
   const meta = document.createElement('div'); meta.className = 'story-meta';
   const channel = document.createElement('a'); channel.href=entry.channelUrl; channel.textContent=entry.channel; channel.className='category-label';
   const kind = document.createElement('a'); kind.className='article-type'; kind.href=entry.formatUrl; kind.textContent=entry.type;
   const date = document.createElement('time'); date.dateTime=entry.date; date.textContent=entry.dateLabel;
   const duration = document.createElement('span'); duration.textContent=entry.minutes+' menit baca';
   meta.append(channel,kind,date,duration);
   const heading = document.createElement('h2'); const anchor=document.createElement('a'); anchor.href=entry.url; anchor.textContent=entry.title; heading.append(anchor);
   const excerpt=document.createElement('p'); excerpt.textContent=entry.excerpt;
   const read=document.createElement('a'); read.href=entry.url; read.className='read-link'; read.textContent='Baca tulisan';
   card.append(meta,heading,excerpt,read); results.append(card);
  }
  if (!matches.length) { const empty=document.createElement('p'); empty.className='search-empty'; empty.textContent='Belum ada tulisan yang cocok. Coba kata “kekuasaan”, “peradilan”, atau “persetujuan”.'; results.append(empty); }
 }
 const initial = (new URLSearchParams(location.search).get('q') || '').slice(0,120);
 input.value=initial; render(initial);
 form.addEventListener('submit', event => { event.preventDefault(); const query=input.value.slice(0,120); const url=new URL(location.href); query.trim()?url.searchParams.set('q',query.trim()):url.searchParams.delete('q'); history.replaceState(null,'',url); render(query); });
})();
'''.replace('__DATA__',json.dumps(index,ensure_ascii=False))
(ROOT/'preview').mkdir(exist_ok=True)
(ROOT/'preview/search.js').write_text(search_js)
# Preserve old incoming links without retaining demonstration content.
legacy={'lebih-dari-satu-sudut':'hukum-yang-sah-belum-tentu-adil','menguji-pemikiran':'hukum-yang-sah-belum-tentu-adil','pertanyaan-pertama':'praduga-tak-bersalah','menyusun-fakta':'wanprestasi-atau-perbuatan-melawan-hukum','ruang-untuk-mendengar':'harta-bersama-bukan-seluruhnya-warisan','ruang-digital':'smart-contract-kode-dan-perjanjian'}
by_slug={post['slug']:post for post in POSTS}
for old_slug,target_slug in legacy.items():
 if old_slug in by_slug:
  raise ValueError(f'Article slug collides with legacy redirect: {old_slug}')
 if target_slug not in by_slug:
  raise ValueError(f'Legacy redirect target missing: {target_slug}')
 post=by_slug[target_slug]
 target='../'+post['slug']+'/'
 html=f'<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><meta http-equiv="refresh" content="0;url={target}"><link rel="canonical" href="{SITE}{article_url(post)}"><title>Artikel telah berpindah — Nalar Hakim</title></head><body><p>Artikel tersedia di alamat baru: <a href="{target}">{e(post["title"])}</a>.</p></body></html>'
 dest=ROOT/'artikel'/old_slug/'index.html';dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(html,encoding='utf-8');WRITTEN.append(str(dest.relative_to(ROOT)))
urls=[SITE,SITE+'beranda.html',SITE+'tentang.html',SITE+'kirim-naskah.html',SITE+'kebijakan-redaksi.html']+[SITE+'bentuk/'+slug+'/' for slug in FORMATS]+[SITE+channel_url(slug) for slug in CHANNELS]+[SITE+article_url(post) for post in POSTS]
(ROOT/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join(f'<url><loc>{e(url)}</loc></url>' for url in urls)+'</urlset>\n',encoding='utf-8')
(ROOT/'index.html').write_text(render_landing(), encoding='utf-8')
WRITTEN.append('index.html')
# Fingerprint local assets only after the search index and all pages are final.
# Existing readers receive the new palette and type styles on the next visit.
for written in WRITTEN:
 dest=ROOT/written
 def version_asset(match):
  url=match.group(2)
  if '://' in url or url.startswith('//'): return match.group(0)
  asset=(dest.parent/url).resolve()
  if not asset.is_relative_to(ROOT) or not asset.is_file(): return match.group(0)
  return match.group(1)+url+'?v='+sha256(asset.read_bytes()).hexdigest()[:10]+match.group(3)
 html=re.sub(r'((?:href|src)=")([^"?]+\.(?:css|js|svg))(")',version_asset,dest.read_text(encoding='utf-8'))
 dest.write_text(html,encoding='utf-8')
print(f'Built {len(WRITTEN)} HTML pages, {len(POSTS)} articles, search index and sitemap')
