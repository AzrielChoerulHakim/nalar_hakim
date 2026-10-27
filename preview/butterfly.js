/* Letter-perching companions. One flight clock; layout reads only on input. */
(() => {
  'use strict';
  const media = matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  const root = document.documentElement;
  const scene = document.querySelector('[data-nature-scene]');
  const article = document.querySelector('.article-layout');
  if ((!article && !scene) || !window.MutationObserver) return;
  const headings = (article
    ? [...article.querySelectorAll('.article-header h1,.article-content h2,.article-content h3')]
    : ['#landing-title','#landing-manifest-title','#landing-channels-title','#landing-invitation-title','#idea-flow-title','.landing-footer-brand'].map(s => document.querySelector(s))
  ).filter(Boolean);
  if (!headings.length) return;
  const statue = scene?.querySelector('svg');
  let layer, themeWatcher, resizeObserver, frame = 0, restTimer = 0;
  let visitors = [], theme = '', desired = '', phase = 'idle', suspended = false;
  let dirty = true, clock = 0, last = 0, activeHeading, targets = [], statuePoint;
  let nextWander = 0, articleRect;
  let textContext;
  const glyphMetrics = new Map();
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const available = () => media.matches && !document.hidden && !suspended;
  const currentTheme = () => root.dataset.theme === 'dark' ? 'dark' : 'light';
  // A shared engraved wing is mirrored within separately hinged groups.
  // Glowing antenna tips use small radial paints, not costly blur filters.
  const wing = `<path d="M48 51C42 35 29 17 13 10C8 8 5 10 6 17C7 34 16 49 32 56C21 54 16 58 18 65C19 70 23 71 25 74C28 78 31 76 34 77C41 75 46 65 48 57Z" fill="url(#nh-butter-copper)" stroke="#71543C" stroke-width=".8" stroke-linejoin="round"/>
    <path d="M47 56C34 54 22 57 21 63C20 68 26 73 31 74C37 74 44 65 47 56Z" fill="url(#nh-butter-honey)"/>
    <path d="M45 48C35 30 22 18 10 13C12 28 19 41 30 47C36 50 41 52 46 53Z" fill="#E6C991" opacity=".24"/>
    <g fill="none" stroke="#785A3D" stroke-width=".72" stroke-linecap="round" stroke-linejoin="round" opacity=".72">
      <path d="M47 53C34 40 22 24 10 14M46 54Q25 46 13 29M34 39Q30 26 22 18M45 57Q32 59 22 64M45 58Q37 67 31 74"/>
    </g>
    <path d="M12 17C16 31 23 41 33 47M25 64Q26 68 30 70" fill="none" stroke="#F1DFC0" stroke-width=".65" opacity=".7" stroke-linecap="round"/>
    <g fill="#F0DDAD" opacity=".86">
      <ellipse cx="9.5" cy="18" rx=".8" ry="1.7" transform="rotate(-14 9.5 18)"/>
      <ellipse cx="13.5" cy="31" rx=".75" ry="1.6" transform="rotate(-24 13.5 31)"/>
      <ellipse cx="22.5" cy="46.5" rx="1.5" ry=".7" transform="rotate(32 22.5 46.5)"/>
      <ellipse cx="25.5" cy="71.3" rx="1.25" ry=".7" transform="rotate(30 25.5 71.3)"/>
    </g>`;
  const antenna = `<path d="M48 39C46 29 41 17 35 9" fill="none" stroke="#695239" stroke-width="1.25" stroke-linecap="round"/>
    <path d="M48 39C46 29 41 17 35 9" fill="none" stroke="#DBC395" stroke-width=".4"/>
    <g class="butterfly-glow"><circle cx="34.6" cy="8.5" r="3" fill="url(#nh-butter-glow)"/><ellipse cx="34.6" cy="8.5" rx="1.15" ry="2.25" transform="rotate(-30 34.6 8.5)" fill="#947044"/><ellipse cx="34.4" cy="8.3" rx=".55" ry="1.4" transform="rotate(-30 34.4 8.3)" fill="#EAD8AE"/></g>`;
  const art = `<svg viewBox="0 0 100 96" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="nh-butter-copper" x1="1" y1="1" x2="0" y2="0"><stop stop-color="#D6AF72"/><stop offset=".5" stop-color="#BF8A4E"/><stop offset="1" stop-color="#A36940"/></linearGradient>
      <linearGradient id="nh-butter-honey" x1="1" y1="0" x2="0" y2="1"><stop stop-color="#DCC18B"/><stop offset=".6" stop-color="#C59A61"/><stop offset="1" stop-color="#AF7947"/></linearGradient>
      <radialGradient id="nh-butter-glow"><stop stop-color="#E9D3A3" stop-opacity=".25"/><stop offset=".4" stop-color="#D8B573" stop-opacity=".12"/><stop offset="1" stop-color="#BA8B51" stop-opacity="0"/></radialGradient>
      <linearGradient id="nh-butter-body"><stop stop-color="#4B3C2F"/><stop offset=".42" stop-color="#A08252"/><stop offset=".62" stop-color="#735A3C"/><stop offset="1" stop-color="#44372B"/></linearGradient>
    </defs>
    <g class="butterfly-body">
      <g class="butterfly-wing butterfly-left">${wing}</g>
      <g class="butterfly-wing butterfly-right"><g transform="translate(100 0) scale(-1 1)">${wing}</g></g>
      <g fill="none" stroke="#765132" stroke-width=".8" stroke-linecap="round"><path d="M48 47L43 51L41 59M52 47L57 51L59 59M48 53L43 61L44 72M52 53L57 61L56 72M48 58L46 73L44 86M52 58L54 73L56 86"/></g>
      <g class="butterfly-antenna butterfly-antenna-left">${antenna}</g>
      <g class="butterfly-antenna butterfly-antenna-right"><g transform="translate(100 0) scale(-1 1)">${antenna}</g></g>
      <path d="M46.7 52C44.8 62 47 76 50 80C53 76 55.2 62 53.3 52Z" fill="url(#nh-butter-body)" stroke="#493D2E" stroke-width=".75"/>
      <path d="M47.2 61Q50 62.5 52.8 61M47.6 67Q50 68.5 52.4 67M48.5 73Q50 74 51.5 73" fill="none" stroke="#CCB37D" stroke-width=".65"/>
      <ellipse cx="50" cy="48" rx="4.4" ry="8" fill="url(#nh-butter-body)" stroke="#DCC797" stroke-width=".75"/>
      <path d="M49 42Q48 48 49 54" fill="none" stroke="#E6D6B0" stroke-width=".8" opacity=".8" stroke-linecap="round"/>
      <ellipse cx="50" cy="39" rx="3.2" ry="3.4" fill="#715638" stroke="#D2BC89" stroke-width=".55"/>
      <ellipse cx="47.7" cy="39" rx="1.15" ry="1.8" fill="#44392D"/><ellipse cx="52.3" cy="39" rx="1.15" ry="1.8" fill="#44392D"/>
      <path d="M48.1 37.8L47.8 38.5M52.1 37.8L51.8 38.5" stroke="#EBDABB" stroke-width=".6" stroke-linecap="round"/>
    </g>
  </svg>`;
  function fireflyArt(index) {
    const glow = `nh-firefly-glow-${index}`;
    return `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><defs>
      <radialGradient id="${glow}"><stop stop-color="#E9F5A4" stop-opacity=".7"/><stop offset=".25" stop-color="#D8E78A" stop-opacity=".3"/><stop offset=".55" stop-color="#CFD578" stop-opacity=".1"/><stop offset="1" stop-color="#D6E69B" stop-opacity="0"/></radialGradient>
      </defs><g class="firefly-body"><g class="firefly-lantern"><circle cx="32" cy="39" r="24" fill="url(#${glow})"/></g>
      <g class="firefly-wing firefly-wing-left"><path d="M30 29C22 21 14 23 17 31C19 36 25 39 30 37Z" fill="#C3DAB5" fill-opacity=".28" stroke="#E0E7BB" stroke-opacity=".45" stroke-width=".45"/><path d="M29 32L19 27M28 34L20 31" fill="none" stroke="#E7EAC1" stroke-opacity=".3" stroke-width=".5"/></g>
      <g class="firefly-wing firefly-wing-right"><path d="M34 29C42 21 50 23 47 31C45 36 39 39 34 37Z" fill="#C3DAB5" fill-opacity=".28" stroke="#E0E7BB" stroke-opacity=".45" stroke-width=".45"/><path d="M35 32L45 27M36 34L44 31" fill="none" stroke="#E7EAC1" stroke-opacity=".3" stroke-width=".5"/></g>
      <path d="M30 27Q25 20 25 17M34 27Q39 20 39 17M30 32L26 35L25 39M34 32L38 35L39 39M30 36L27 40M34 36L37 40" fill="none" stroke="#B7C08B" stroke-width=".65" stroke-linecap="round"/>
      <ellipse cx="32" cy="35" rx="3.3" ry="7" fill="#394A2D" stroke="#C2CB8D" stroke-width=".55"/>
      <path d="M29.4 34Q32 35 34.6 34M29.5 36Q32 37 34.5 36" stroke="#7C8C52" stroke-width=".65" fill="none"/>
      <g class="firefly-lantern"><path d="M29 37Q32 35.5 35 37C35 43 29 44 29 37Z" fill="#E1EB8C"/><ellipse cx="32" cy="39" rx="1.7" ry="2.2" fill="#FFF6B7"/></g>
      <ellipse cx="32" cy="29" rx="3.1" ry="3.5" fill="#7D6939" stroke="#D4BA72" stroke-width=".5"/>
      <ellipse cx="32" cy="25.6" rx="2.4" ry="2" fill="#29382A"/><circle cx="30.2" cy="25" r=".55" fill="#D3D9A6"/><circle cx="33.8" cy="25" r=".55" fill="#D3D9A6"/>
      </g></svg>`;
  }
  // Range boxes include the font's empty ascender space. Canvas ink bounds supply
  // that top bearing, so feet meet the visible letter rather than hover above it.
  function glyphTopBearing(char, style) {
    const font=`${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const ink=style.textTransform==='uppercase'?char.toUpperCase():style.textTransform==='lowercase'?char.toLowerCase():char;
    const key=`${font}|${ink}`;
    if(glyphMetrics.has(key))return glyphMetrics.get(key);
    if(textContext===undefined)textContext=document.createElement('canvas').getContext?.('2d') || null;
    const size=parseFloat(style.fontSize) || 16;
    let bearing=size*.14;
    if(textContext){
      textContext.font=font;
      const metrics=textContext.measureText(ink);
      const ascent=metrics.fontBoundingBoxAscent ?? metrics.emHeightAscent;
      if(Number.isFinite(ascent)&&Number.isFinite(metrics.actualBoundingBoxAscent))bearing=ascent-metrics.actualBoundingBoxAscent;
    }
    bearing=clamp(bearing,-size*.15,size*.6);
    if(glyphMetrics.size>512)glyphMetrics.clear();
    glyphMetrics.set(key,bearing);
    return bearing;
  }
  // Read actual glyphs across nested spans without inserting wrappers into headings.
  // Only the first line is used: a resting visitor cannot cover another line above it.
  function firstLineLetters(element, headingIndex) {
    const nodes = [];
    function walk(node) {
      if (node.nodeType === 3) { nodes.push(node); return; }
      if (node.nodeType === 1 && (node.hidden || node.getAttribute?.('aria-hidden') === 'true')) return;
      for (const child of node.childNodes || []) walk(child);
    }
    walk(element);
    const letters = [], range = document.createRange();
    let lineTop, scanned = 0, ordinal = 0;
    for (const node of nodes) {
      const style=getComputedStyle(node.parentElement || element);
      let offset = 0;
      for (const char of node.textContent) {
        const start = offset; offset += char.length;
        if (!/[\p{L}\p{N}]/u.test(char)) continue;
        if (++scanned > 160) return letters;
        range.setStart(node,start); range.setEnd(node,offset);
        const r = range.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        if (lineTop === undefined) lineTop = r.top;
        if (r.top > lineTop + r.height * .35) return letters;
        if (r.top < lineTop - r.height * .35) continue;
        if (r.left + r.width/2 < 30 || r.right > innerWidth-25) continue;
        letters.push({x:r.left+r.width/2,y:r.top+glyphTopBearing(char,style)-1,kind:'letter',key:`${headingIndex}:${ordinal++}`});
      }
    }
    return letters;
  }
  function measure() {
    dirty = false;
    articleRect = article?.getBoundingClientRect();
    const candidates = headings.map((element,index) => ({element,index,rect:element.getBoundingClientRect()}))
      .filter(h => h.rect.width > 0 && h.rect.height > 0 && h.rect.top >= 48 && h.rect.top < innerHeight-100);
    if (!candidates.some(h => h.element === activeHeading)) {
      activeHeading = candidates.reduce((a,b) => !a || Math.abs(b.rect.top-innerHeight*.35)<Math.abs(a.rect.top-innerHeight*.35) ? b : a, null)?.element;
    }
    candidates.sort((a,b) => (a.element===activeHeading?-1:0)-(b.element===activeHeading?-1:0));
    const groups = candidates.map(h=>firstLineLetters(h.element,h.index)).filter(g=>g.length);
    const chosen = [];
    if (groups.length) {
      const main = groups[0];
      for (const fraction of [.12,.5,.88]) {
        const wanted = main[Math.round((main.length-1)*fraction)];
        const possible = groups.flat().filter(p=>chosen.every(q=>Math.hypot(q.x-p.x,q.y-p.y)>48));
        const best = possible.reduce((a,b)=>!a||Math.hypot(b.x-wanted.x,b.y-wanted.y)<Math.hypot(a.x-wanted.x,a.y-wanted.y)?b:a,null);
        if (best) chosen.push(best);
      }
    }
    targets = chosen;
    statuePoint = undefined;
    if (statue) {
      // Crown point in the 560 × 500 scene, following the recentered portrait.
      const r=statue.getBoundingClientRect(), y=r.top+r.height*(82.36/500);
      if (y>=80 && y<innerHeight-100) statuePoint={x:r.left+r.width*(288.6/560),y,kind:'statue',key:'statue'};
    }
  }
  function marginTarget(index,size) {
    const gutter=articleRect ? Math.max(0,Math.min(articleRect.left,innerWidth-articleRect.right)) : 200;
    const fitted=Math.min(size,Math.max(12,gutter-12));
    const left=articleRect ? articleRect.left/2 : 72;
    const right=articleRect ? (articleRect.right+innerWidth)/2 : innerWidth-72;
    return {x:clamp(index===1?right:left,fitted/2+3,innerWidth-fitted/2-3),y:innerHeight*[.29,.47,.69][index],size:fitted,kind:'margin',key:`margin:${index}`};
  }
  function targetFor(v) {
    if (v.kind==='butterfly') return statuePoint || targets[targets.length>1?1:0] || marginTarget(0,v.baseSize);
    return targets[v.index] || marginTarget(v.index,v.baseSize);
  }
  function paint(v) {
    const foot = v.kind==='butterfly' ? .86 : .65625;
    v.node.style.transform=`translate3d(${(v.x-v.size/2).toFixed(2)}px,${(v.y-v.size*foot).toFixed(2)}px,0)`;
    v.body.style.rotate=`${clamp(v.vx*.07,-15,15).toFixed(2)}deg`;
  }
  function fly(v) {
    if (v.rest) {v.rest=false;v.started=clock;}
    v.node.dataset.flight='fly';
  }
  function wake() {
    if (!layer || !available() || frame) return;
    last=0; frame=requestAnimationFrame(tick);
  }
  function stop() {cancelAnimationFrame(frame);frame=0;clearTimeout(restTimer);restTimer=0;last=0;}
  function removeVisitors() { visitors.forEach(v=>v.node.remove());visitors=[]; }
  function enter() {
    removeVisitors(); theme=desired; phase='entering';
    const count=theme==='dark'?3:1;
    for(let i=0;i<count;i++) {
      const kind=theme==='dark'?'firefly':'butterfly';
      const size=kind==='butterfly'?(article?48:64):(article?42:48);
      const node=document.createElement('div');node.className=`nature-${kind}`;
      node.setAttribute('aria-hidden','true');node.style.setProperty('--visitor-size',`${size}px`);
      node.innerHTML=kind==='butterfly'?art:fireflyArt(i);
      node.style.setProperty('--firefly-delay',`${-i*1.7}s`);node.style.setProperty('--firefly-period',`${4.7+i*.9}s`);
      node.dataset.flight='fly';node.dataset.phase='entering';node.dataset.paused=String(!available());
      layer.append(node);
      const v={node,body:node.querySelector(`.${kind}-body`),kind,index:i,size,baseSize:size,x:i===1?innerWidth+size:-size,y:clamp(innerHeight*(.24+i*.17),70,innerHeight-90),vx:0,vy:0,rest:false,started:clock,ready:clock+i*.22,wanderUntil:0};
      visitors.push(v);paint(v);
    }
  }
  function beginExit() {
    if(phase==='exiting')return;
    phase='exiting';clearTimeout(restTimer);restTimer=0;
    visitors.forEach(v=>{fly(v);v.node.dataset.phase='exiting';v.exitRight=v.x>=innerWidth/2;v.exitY=clamp(v.y-45-v.index*18,65,innerHeight-90);v.started=clock;});
  }
  function themeChanged() {
    if(!layer)return;
    desired=currentTheme();
    if(!theme) {dirty=true;measure();enter();}
    else if(desired!==theme) beginExit();
    else if(phase==='exiting') {phase='entering';visitors.forEach(v=>{v.node.dataset.phase='entering';v.ready=clock;v.started=clock;});}
    sync();
  }
  function scheduleVisit() {
    clearTimeout(restTimer);
    // A single, bounded timer gives one visitor a short excursion while others rest.
    restTimer=setTimeout(()=>{
      restTimer=0;
      if(!available()||phase!=='settled')return;
      const v=visitors[nextWander++%visitors.length];
      v.wanderUntil=clock+1.8;fly(v);wake();
    },13000+nextWander%3*1700);
  }
  function tick(now) {
    frame=0;if(!available()||!layer)return;
    if(dirty)measure();
    const dt=Math.min((now-(last||now-16))/1000,.035);last=now;clock+=dt;
    if(phase==='exiting') {
      let gone=true;
      visitors.forEach(v=>{
        const tx=v.exitRight?innerWidth+v.size*1.8:-v.size*1.8;
        v.vx+=( (v.exitRight?430:-430)-v.vx)*Math.min(1,dt*2.6);
        v.vy+=((v.exitY-v.y)*3-v.vy*3.5)*dt;
        v.x+=v.vx*dt;v.y+=v.vy*dt;paint(v);
        if(v.exitRight?v.x<tx:v.x>tx)gone=false;
      });
      if(gone) {enter();sync();}
      if(!frame)frame=requestAnimationFrame(tick);
      return;
    }
    let moving=false;
    visitors.forEach(v=>{
      if(clock<v.ready) {moving=true;return;}
      const target=targetFor(v), distance=Math.hypot(target.x-v.x,target.y-v.y);
      const fitted=target.size || v.baseSize;
      if(v.size!==fitted){v.size=fitted;v.node.style.setProperty('--visitor-size',`${fitted}px`);}
      const wandering=clock<v.wanderUntil;
      if(distance>1.8||wandering)fly(v);
      v.node.dataset.perchKind=target.kind;v.node.dataset.perch=target.key;
      if(v.rest)return;
      moving=true;
      const breeze=Math.min(distance/125,1), elapsed=clock-v.started;
      const gx=target.x+Math.sin(elapsed*2.2+v.index*.8)*25*breeze+(wandering?Math.sin((v.wanderUntil-clock)*2)*17:0);
      const gy=target.y-Math.sin(Math.min(elapsed/2,1)*Math.PI)*35*breeze-(wandering?25:0);
      v.vx+=clamp((gx-v.x)*12-v.vx*6.5,-850,850)*dt;
      v.vy+=clamp((gy-v.y)*12-v.vy*6.5,-850,850)*dt;
      const speed=Math.hypot(v.vx,v.vy), maxSpeed=v.kind==='butterfly'?340:290;
      if(speed>maxSpeed){v.vx*=maxSpeed/speed;v.vy*=maxSpeed/speed;}
      v.x+=v.vx*dt;v.y+=v.vy*dt;paint(v);
      if(distance<1.5&&Math.hypot(v.vx,v.vy)<4&&!wandering){
        v.x=target.x;v.y=target.y;v.vx=v.vy=0;v.rest=true;
        v.node.dataset.flight='rest';v.node.dataset.phase='settled';paint(v);
      }
    });
    if(visitors.every(v=>v.rest)) {phase='settled';scheduleVisit();return;}
    if(moving)frame=requestAnimationFrame(tick);
  }
  function sync() {
    if(!layer)return;
    visitors.forEach(v=>v.node.dataset.paused=String(!available()));
    if(available()){dirty=true;wake();}else stop();
  }
  function onScroll(){dirty=true;wake();}
  function onHide(){suspended=true;sync();}
  function onShow(){suspended=false;sync();}
  function destroy(){
    stop();removeVisitors();themeWatcher?.disconnect();resizeObserver?.disconnect();
    window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll);
    window.removeEventListener('nh:layout-settled',onScroll);
    window.removeEventListener('pagehide',onHide);window.removeEventListener('pageshow',onShow);
    document.removeEventListener('visibilitychange',sync);
    layer?.remove();layer=undefined;theme='';desired='';phase='idle';suspended=false;activeHeading=undefined;
  }
  function setup(){
    if(!media.matches){destroy();return;}
    if(layer){themeChanged();return;}
    layer=document.createElement('div');layer.className='nature-companions';layer.setAttribute('aria-hidden','true');
    document.body.append(layer);
    themeWatcher=new MutationObserver(themeChanged);themeWatcher.observe(root,{attributes:true,attributeFilter:['data-theme']});
    if(window.ResizeObserver){resizeObserver=new ResizeObserver(onScroll);headings.forEach(h=>resizeObserver.observe(h));}
    window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);
    window.addEventListener('nh:layout-settled',onScroll);
    document.addEventListener('visibilitychange',sync);window.addEventListener('pagehide',onHide);window.addEventListener('pageshow',onShow);
    themeChanged();
  }
  media.addEventListener('change',setup);
  document.fonts?.ready.then(()=>{glyphMetrics.clear();onScroll();});
  setup();
})();
