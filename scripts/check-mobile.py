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
      const visible=e=>{const closed=e.closest('details:not([open])');if(closed&&!e.closest('summary'))return false;const b=e.getBoundingClientRect(),s=getComputedStyle(e);return b.width>0&&b.height>0&&s.visibility!=='hidden'&&s.display!=='none'};
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
        route=next(p for p in PAGES if p.startswith('artikel/'))
        for w,h in [(320,800),(390,844),(844,390)]:
            ctx=browser.new_context(viewport={'width':w,'height':h},has_touch=True,is_mobile=True,reduced_motion='no-preference')
            p=ctx.new_page()
            p.goto(url+route)
            p.evaluate('document.fonts.ready')
            rail=p.locator('.nh-reading-rail')
            assert rail.count()==1
            def move(fraction):
                p.evaluate("""f=>{const a=document.querySelector('main.single-main article.article-layout'),b=a.querySelector('.article-content');const start=a.getBoundingClientRect().top+scrollY,end=b.getBoundingClientRect().bottom+scrollY;scrollTo(0,start+Math.max(0,end-start-innerHeight)*f)}""",fraction)
                p.wait_for_timeout(180)
                return float(rail.evaluate("(e)=>e.style.getPropertyValue('--nh-reading-progress')"))
            first=move(.25); mid=move(.65); back=move(.30); end=move(1)
            assert 0.18<first<.32 and .58<mid<.72 and .23<back<.37 and end>.98,(w,first,mid,back,end)
            assert rail.is_visible()
            assert rail.evaluate("e=>getComputedStyle(e).pointerEvents")=='none'
            record(p,route,w,h,'motion-end')
            move(.5)
            shot(p,f'reading-rail-{w}x{h}.png')
            p.emulate_media(reduced_motion='reduce')
            assert not rail.is_visible()
            p.emulate_media(reduced_motion='no-preference')
            move(.5)
            assert rail.is_visible()
            p.set_viewport_size({'width':1440,'height':900})
            p.wait_for_timeout(120)
            assert not rail.is_visible()
            p.set_viewport_size({'width':w,'height':h})
            p.wait_for_timeout(120)
            move(.5)
            assert rail.is_visible()
            print('MOTION PASS',w,h,first,mid,back,end,flush=True)
            ctx.close()
        ctx=browser.new_context(viewport={'width':320,'height':800},java_script_enabled=False)
        p=ctx.new_page()
        p.goto(url+route)
        assert p.locator('main article h1').is_visible()
        assert p.locator('#sumber-rujukan').count()==1
        assert p.locator('.nh-reading-rail').count()==0
        ctx.close()
        for w,h in [(320,800),(390,844),(844,390)]:
            ctx=browser.new_context(viewport={'width':w,'height':h},has_touch=True,is_mobile=True,reduced_motion='no-preference')
            p=ctx.new_page()
            p.goto(url+'index.html')
            scene=p.locator('.scale-scene')
            scene.scroll_into_view_if_needed()
            p.wait_for_function("document.querySelector('.scale-scene').hasAttribute('data-mobile-settle')")
            beam=p.locator('.scale-balance')
            assert beam.evaluate("e=>getComputedStyle(e).animationName")=='nh-mobile-balance'
            p.wait_for_timeout(350)
            a=beam.evaluate("e=>getComputedStyle(e).transform")
            shot(p,f'balance-mid-{w}x{h}.png')
            p.wait_for_timeout(500)
            b=beam.evaluate("e=>getComputedStyle(e).transform")
            assert a!=b,(w,a,b)
            p.wait_for_timeout(1500)
            final=beam.evaluate("e=>getComputedStyle(e).transform")
            assert final in ('matrix(1, 0, 0, 1, 0, 0)','none'),final
            record(p,'index.html',w,h,'balance-settled')
            p.emulate_media(reduced_motion='reduce')
            assert beam.evaluate("e=>getComputedStyle(e).animationName")=='none'
            print('BALANCE MOTION PASS',w,h,a,b,final,flush=True)
            ctx.close()
        browser.close()
    server.shutdown()
(OUT/'geometry.json').write_text(json.dumps({'rows':rows,'flags':errors,'manualVisualReview':'required'},ensure_ascii=False,indent=2))
print('SUMMARY',len(rows),'states;',len(errors),'geometry flags; visual review required',flush=True)
if errors: raise SystemExit(1)
