"""Lazarus Design OS geometry and screenshot probe. Does not certify visual QA."""
from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
from threading import Thread
from playwright.sync_api import sync_playwright
import json, os, subprocess, tempfile
from urllib.parse import urlparse

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'mobile-proof'
OUT.mkdir(exist_ok=True)
PAGES=['index.html','beranda.html','tentang.html','kirim-naskah.html','kebijakan-redaksi.html','cari.html','404.html']
PAGES+= [str(p.relative_to(ROOT)) for p in sorted((ROOT/'bentuk').glob('*/index.html'))]
PAGES+= [str(p.relative_to(ROOT)) for p in sorted((ROOT/'artikel').glob('*/index.html')) if 'http-equiv="refresh"' not in p.read_text()]
WIDTHS=[(320,800),(390,844),(640,900),(768,1024),(1024,768),(1440,900),(844,390)]
STYLE='*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}'
rows=[]
errors=[]
def measure(page):
    return page.evaluate("""() => {
      const w=document.documentElement.clientWidth;
      const overflow=document.documentElement.scrollWidth-w;
      const visible=e=>{const b=e.getBoundingClientRect(),s=getComputedStyle(e);return b.width>0&&b.height>0&&s.visibility!=='hidden'&&s.display!=='none'};
      const clipping=[...document.querySelectorAll('main h1,main h2,main h3,main p,nav a,header a,header button,header summary,footer a,main button,main input')].filter(visible).filter(e=>{const b=e.getBoundingClientRect();return b.left < -2 || b.right > w+2 || ((getComputedStyle(e).overflowX==='hidden'||getComputedStyle(e).overflowX==='clip')&&e.scrollWidth>e.clientWidth+2)}).map(e=>({tag:e.tagName,text:e.textContent.trim().slice(0,90),left:Math.round(e.getBoundingClientRect().left),right:Math.round(e.getBoundingClientRect().right)}));
      const broken=[...document.images].filter(e=>e.complete&&!e.naturalWidth).map(e=>e.getAttribute('src'));
      return {overflow,clipping,broken,bodyFont:getComputedStyle(document.querySelector('.article-content')||document.body).fontSize,fonts:document.fonts.status};
    }""")
def record(page,route,w,h,state):
    m=measure(page)
    row={'page':route,'width':w,'height':h,'state':state,**m}
    rows.append(row)
    if m['overflow']>2 or m['clipping'] or m['broken']: errors.append(row)
    print(json.dumps(row,ensure_ascii=False),flush=True)
def shot(page,name):
    page.screenshot(path=str(OUT/name),animations='disabled',timeout=30000)
with tempfile.TemporaryDirectory() as tmp:
    path=Path(tmp)/'nalar_hakim'
    path.symlink_to(ROOT,target_is_directory=True)
    server=ThreadingHTTPServer(('127.0.0.1',0),partial(SimpleHTTPRequestHandler,directory=tmp))
    Thread(target=server.serve_forever,daemon=True).start()
    url=f'http://127.0.0.1:{server.server_port}/nalar_hakim/'
    with sync_playwright() as pw:
        browser=pw.chromium.launch()
        print('Browser:',browser.version,'Commit:',subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),flush=True)
        for w,h in WIDTHS:
            context=browser.new_context(viewport={'width':w,'height':h},device_scale_factor=1,has_touch=w<768,is_mobile=w<768,reduced_motion='reduce')
            page=context.new_page()
            for route in PAGES:
                page.goto(url+route,wait_until='load')
                page.evaluate('document.fonts.ready')
                page.locator('img').evaluate_all("(imgs)=>imgs.forEach(i=>i.loading='eager')")
                page.evaluate("Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))")
                name=route.replace('/index.html','').replace('/','-').replace('.html','')
                record(page,route,w,h,'light')
                if w in (320,390):
                    page.screenshot(path=str(OUT/f'{name}-{w}-full.png'),full_page=True,animations='disabled',timeout=30000)
                    sections=page.locator('header.landing-header,main > section,main > .home-intro,main > .hero-grid,main > .article-grid,main > .submission-layout,main > article > header,main > article > figure,main > article > .article-content > aside,main > article > .article-content > details,main > article > .article-content > section,main > article > footer,main > .related-section,body > footer')
                    for i in range(sections.count()):
                        section=sections.nth(i)
                        if section.is_visible():
                            section.screenshot(path=str(OUT/f'{name}-{w}-section-{i}.png'),animations='disabled',timeout=30000)
                    if page.locator('.header-actions details > summary').count():
                        page.locator('.header-actions details > summary').click()
                        record(page,route,w,h,'search-open')
                        page.locator('.header-actions details > summary').click()
                    donation=page.locator('details.donation > summary')
                    if donation.count():
                        donation.click()
                        record(page,route,w,h,'donation-open')
                        donation.click()
                    toggle=page.locator('[data-theme-toggle]')
                    if toggle.count() and toggle.first.is_visible():
                        toggle.first.click()
                        record(page,route,w,h,'dark')
                        toggle.first.click()
                    page.add_style_tag(content=STYLE)
                    record(page,route,w,h,'text-spacing')
                elif route in ('index.html','beranda.html'):
                    shot(page,f'{name}-{w}x{h}.png')
            context.close()
        browser.close()
    server.shutdown()
(OUT/'geometry.json').write_text(json.dumps({'rows':rows,'flags':errors,'manualVisualReview':'required'},ensure_ascii=False,indent=2))
print('SUMMARY',len(rows),'states;',len(errors),'geometry flags; visual review required',flush=True)
if errors: raise SystemExit(1)
