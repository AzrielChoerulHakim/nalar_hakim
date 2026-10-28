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
  const wing = `<path d="M48 51L40 31L27 15Q17 8 8 11L7 26L17 43L31 54L48 57Z" fill="#B28A47" stroke="#263F35" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M8 11L27 15L34 29L18 25L7 26Z" fill="#E9DFC9" stroke="#263F35" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M18 25L34 29L48 51L31 54L17 43Z" fill="#A6533D" stroke="#263F35" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M48 54L32 53L20 58Q15 62 19 68L30 77L40 72L47 60Z" fill="#E9DFC9" stroke="#263F35" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M32 53L31 65L40 72L47 60L48 54Z" fill="#263F35"/>
    <path d="M20 58L31 65L30 77L19 68Q15 62 20 58Z" fill="#B28A47" stroke="#263F35" stroke-width="1.2" stroke-linejoin="round"/>`;
  const antenna = `<path d="M48 39L44 24L35 9" fill="none" stroke="#263F35" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    <g class="butterfly-glow"><path d="M34 6.5L37 8.5L35.5 12L32.5 10Z" fill="#B28A47" stroke="#263F35" stroke-width=".8" stroke-linejoin="round"/></g>`;
  const art = `<svg viewBox="0 0 100 96" aria-hidden="true" focusable="false">
    <g class="butterfly-body">
      <g class="butterfly-wing butterfly-left">${wing}</g>
      <g class="butterfly-wing butterfly-right"><g transform="translate(100 0) scale(-1 1)">${wing}</g></g>
      <g fill="none" stroke="#263F35" stroke-width="1" stroke-linecap="round"><path d="M48 47L43 51L41 59M52 47L57 51L59 59M48 53L43 61L44 72M52 53L57 61L56 72M48 58L46 73L44 86M52 58L54 73L56 86"/></g>
      <g class="butterfly-antenna butterfly-antenna-left">${antenna}</g>
      <g class="butterfly-antenna butterfly-antenna-right"><g transform="translate(100 0) scale(-1 1)">${antenna}</g></g>
      <path d="M46.7 52L46 66L50 80L54 66L53.3 52Z" fill="#252B28" stroke="#E9DFC9" stroke-width=".7" stroke-linejoin="round"/>
      <path d="M50 54L53.3 52L54 66L50 80Z" fill="#B28A47"/>
      <path d="M47 40L53 40L54.4 49L50 56L45.6 49Z" fill="#263F35" stroke="#E9DFC9" stroke-width=".8" stroke-linejoin="round"/>
      <path d="M50 42L52 48L50 52" fill="none" stroke="#B28A47" stroke-width="1.3"/>
      <path d="M47 37L50 35.6L53 37L53 40L50 42.4L47 40Z" fill="#252B28" stroke="#E9DFC9" stroke-width=".65" stroke-linejoin="round"/>
    </g>
  </svg>`;
  function fireflyArt(index) {
    const glow = `nh-firefly-glow-${index}`;
    return `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><defs>
      <radialGradient id="${glow}"><stop stop-color="#E9F5A4" stop-opacity=".7"/><stop offset=".25" stop-color="#D8E78A" stop-opacity=".3"/><stop offset=".55" stop-color="#CFD578" stop-opacity=".1"/><stop offset="1" stop-color="#D6E69B" stop-opacity="0"/></radialGradient>
      </defs><g class="firefly-body"><g class="firefly-lantern"><circle cx="32" cy="39" r="24" fill="url(#${glow})"/></g>
      <g class="firefly-wing firefly-wing-left"><path d="M30 29L22 23L16 25L18 32L25 37L30 37Z" fill="#E9DFC9" fill-opacity=".38" stroke="#E9DFC9" stroke-opacity=".6" stroke-width=".65" stroke-linejoin="round"/><path d="M16 25L25 29L30 37L25 37L18 32Z" fill="#B28A47" fill-opacity=".4"/></g>
      <g class="firefly-wing firefly-wing-right"><path d="M34 29L42 23L48 25L46 32L39 37L34 37Z" fill="#E9DFC9" fill-opacity=".38" stroke="#E9DFC9" stroke-opacity=".6" stroke-width=".65" stroke-linejoin="round"/><path d="M48 25L39 29L34 37L39 37L46 32Z" fill="#B28A47" fill-opacity=".4"/></g>
      <path d="M30 27L27 22L25 17M34 27L37 22L39 17M30 32L26 35L25 39M34 32L38 35L39 39M30 36L27 40M34 36L37 40" fill="none" stroke="#B28A47" stroke-width=".75" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M30 28L34 28L35.3 35L33 42L30 41L28.7 35Z" fill="#263F35" stroke="#E9DFC9" stroke-width=".55" stroke-linejoin="round"/>
      <path d="M32 29L34 28L35.3 35L32 38Z" fill="#B28A47"/>
      <g class="firefly-lantern"><path d="M29 37L32 36L35 37L34.5 40.5Q32 43 29.5 40.5Z" fill="#E1EB8C"/><path d="M30.3 38L32 37.5L33.7 38.5L33 40.5L31 41L30.3 39.5Z" fill="#FFF6B7"/></g>
      <path d="M29 27L32 25.5L35 27L34.5 31L32 32.5L29.5 31Z" fill="#A6533D" stroke="#E9DFC9" stroke-width=".55" stroke-linejoin="round"/>
      <path d="M29.6 25.6L30.4 23.6L33.6 23.6L34.4 25.6L32 27.6Z" fill="#252B28" stroke="#E9DFC9" stroke-width=".45" stroke-linejoin="round"/>
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
