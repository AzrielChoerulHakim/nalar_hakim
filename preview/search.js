/* Tiny search over the six explicitly labelled preview entries. */
(() => {
 'use strict';
 const entries = [{"title": "Membaca sebuah persoalan dari lebih dari satu sudut.", "channel": "Filsafat Hukum", "type": "Analisis", "excerpt": "Ruang untuk sebuah pertanyaan, beragam sudut pandang, dan argumen yang dapat diuji.", "url": "artikel/lebih-dari-satu-sudut/", "channelUrl": "kanal/filsafat-hukum/"}, {"title": "Pertanyaan yang membuka sebuah pembahasan.", "channel": "Pidana", "type": "Berita", "excerpt": "Sebuah contoh tata letak untuk mengikuti cerita dengan runtut, dari pembuka hingga catatan akhir.", "url": "artikel/pertanyaan-pertama/", "channelUrl": "kanal/pidana/"}, {"title": "Menyusun fakta, lalu menimbang argumentasi.", "channel": "Perdata", "type": "Analisis", "excerpt": "Bagaimana sebuah tulisan bisa memberi ruang yang sama untuk konteks, pertanyaan, dan pembahasan.", "url": "artikel/menyusun-fakta/", "channelUrl": "kanal/perdata/"}, {"title": "Ruang digital, pertanyaan yang terus bergerak.", "channel": "Hukum & Teknologi", "type": "Panduan", "excerpt": "Pratinjau kanal yang mempertemukan hukum, teknologi, dan perubahan dalam kehidupan sehari-hari.", "url": "artikel/ruang-digital/", "channelUrl": "kanal/hukum-teknologi/"}, {"title": "Memberi ruang untuk mendengar lebih dahulu.", "channel": "Agama & Keluarga", "type": "Panduan", "excerpt": "Sebuah ruang baca untuk persoalan yang dekat dengan kehidupan dan hubungan antarmanusia.", "url": "artikel/ruang-untuk-mendengar/", "channelUrl": "kanal/agama-keluarga/"}, {"title": "Sebuah ruang untuk menguji pemikiran.", "channel": "Filsafat Hukum", "type": "Opini", "excerpt": "Gagasan menjadi percakapan ketika pertanyaan tetap terbuka dan pembaca ikut menimbang.", "url": "artikel/menguji-pemikiran/", "channelUrl": "kanal/filsafat-hukum/"}];
 const form = document.querySelector('#preview-search');
 const results = document.querySelector('#search-results');
 const status = document.querySelector('#search-status');
 if (!form || !results || !status) return;
 const input = form.querySelector('input[name="q"]');
 const normalize = value => value.toLocaleLowerCase('id').normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
 function render(query) {
  const terms = normalize(query.trim()).split(/\s+/).filter(Boolean);
  const matches = entries.filter(entry => terms.every(term => normalize(entry.title+' '+entry.channel+' '+entry.type+' '+entry.excerpt).includes(term)));
  results.replaceChildren();
  status.textContent = query.trim() ? `${matches.length} tulisan contoh untuk “${query.trim()}”.` : `${matches.length} tulisan contoh tersedia.`;
  for (const entry of matches) {
   const card = document.createElement('article'); card.className = 'story-card search-result';
   const meta = document.createElement('div'); meta.className = 'story-meta';
   const channel = document.createElement('a'); channel.href=entry.channelUrl; channel.textContent=entry.channel; channel.className='category-label';
   const kind = document.createElement('span'); kind.className='article-type'; kind.textContent=entry.type;
   const sample = document.createElement('span'); sample.textContent='Tulisan contoh';
   meta.append(channel,kind,sample);
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
