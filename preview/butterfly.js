/* Day/night companions. Geometry is read only on scroll/resize, never each frame. */
(() => {
  'use strict';
  const media = matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  const root = document.documentElement;
  const scene = document.querySelector('[data-nature-scene]');
  const article = document.querySelector('.article-layout');
  const toggle = scene?.querySelector('[data-nature-toggle]');
  if ((!article && (!scene || !toggle)) || !window.MutationObserver) return;
  const anchors = (article
    ? [...article.querySelectorAll('.article-header h1,.article-content h2,.article-content h3,.article-footer')].map(element => ({element}))
    : [{element: scene.querySelector('svg'), statue: true},
       ...['#landing-manifest-title', '#landing-channels-title', '#landing-invitation-title', '#idea-flow-title', '.landing-footer-brand'].map(s => ({element: document.querySelector(s)}))]
  ).filter(a => a.element);
  if (!anchors.length) return;
  let butterfly, body, control, watcher, themeWatcher, frame = 0, restTimer = 0;
  let fireflies = [], theme = '', localPaused = false;
  let points = [], active = 0, dirty = true, flying = false, suspended = false;
  let x = 0, y = 0, vx = 0, vy = 0, last = 0, lastScroll = -1000, wanderEnd = 0, started = 0, nightTime = 0;
  let butterflySize = 64, fireflySize = 52;
  let leftLane = [36,110], rightLane = [innerWidth-110,innerWidth-36], perchX = 50;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const paused = () => toggle ? toggle.getAttribute('aria-pressed') === 'true' : localPaused;
  const available = () => media.matches && !document.hidden && !suspended && !paused();
  const currentTheme = () => root.dataset.theme === 'dark' ? 'dark' : 'light';
  // A shared engraved wing is mirrored within separately hinged groups.
  // Glowing antenna tips use small radial paints, not costly blur filters.
  const wing = `<path d="M48 51C39 33 23 17 9 17C3 17 5 30 8 38C11 48 21 54 30 57C17 54 11 59 13 68C14 72 17 73 18 76C20 79 23 78 25 81C28 83 31 81 34 82C40 81 45 68 48 57Z" fill="#392B24" stroke="#C38843" stroke-width=".65"/>
    <path d="M47 51C36 32 21 22 10 21C8 28 13 43 22 48C30 53 37 55 47 55Z" fill="url(#nh-butter-copper)"/>
    <path d="M47 57C33 53 18 57 17 63C17 69 23 76 29 77C36 79 44 68 47 57Z" fill="url(#nh-butter-honey)"/>
    <g fill="none" stroke="#493024" stroke-width=".95" stroke-linecap="round" stroke-linejoin="round">
      <path d="M47 53Q29 37 10 23M46 53Q26 43 13 34M46 54L20 46M44 51Q30 34 24 26M35 42L34 36M26 38L23 30M24 43L20 39M19 32L14 32M43 56Q30 61 18 62M44 57Q31 66 24 74M45 57Q39 69 32 77M46 57Q44 70 39 73M32 61L28 57M32 65L30 71M23 61L21 66"/>
    </g>
    <g fill="none" stroke="#FFD58C" stroke-width=".4" opacity=".7">
      <path d="M44 50L13 24M43 52L16 35M41 53L23 46M42 58L20 63M42 59L27 72M44 59L34 74"/>
      <path d="M17 27L18 30M20 28L22 32M26 33L28 37M31 35L33 38M20 37L22 40M27 43L30 45M34 46L36 47M23 58L26 59M21 66L24 65M28 66L30 64M32 71L34 68M36 64L38 62" opacity=".65"/>
    </g>
    <g fill="#FFF3D6">
      <ellipse cx="10" cy="19" rx="1.8" ry=".8" transform="rotate(12 10 19)"/>
      <ellipse cx="17" cy="21" rx="1.8" ry=".9" transform="rotate(28 17 21)"/>
      <ellipse cx="24" cy="25" rx="1.6" ry=".8" transform="rotate(38 24 25)"/>
      <ellipse cx="7.5" cy="26" rx=".8" ry="1.4"/>
      <ellipse cx="9.2" cy="32" rx=".8" ry="1.5" transform="rotate(-20 9.2 32)"/>
      <ellipse cx="12" cy="39" rx=".9" ry="1.5" transform="rotate(-30 12 39)"/>
      <ellipse cx="16.5" cy="45" rx=".9" ry="1.4" transform="rotate(-42 16.5 45)"/>
      <ellipse cx="23" cy="50.3" rx="1.4" ry=".8" transform="rotate(27 23 50.3)"/>
      <ellipse cx="15.2" cy="62" rx=".8" ry="1.3"/>
      <ellipse cx="17.2" cy="68" rx=".9" ry="1.4" transform="rotate(-32 17.2 68)"/>
      <ellipse cx="21.6" cy="73.4" rx="1.5" ry=".9" transform="rotate(38 21.6 73.4)"/>
      <ellipse cx="27.4" cy="78.2" rx="1.5" ry=".8" transform="rotate(17 27.4 78.2)"/>
      <ellipse cx="33.6" cy="78.6" rx="1.4" ry=".8" transform="rotate(-20 33.6 78.6)"/>
      <ellipse cx="39" cy="74.2" rx=".8" ry="1.3" transform="rotate(34 39 74.2)"/>
    </g>`;
  const antenna = `<path d="M48 39C46 29 41 17 35 9" fill="none" stroke="#67482D" stroke-width="1.1"/>
    <path d="M48 39C46 29 41 17 35 9" fill="none" stroke="#F6BF65" stroke-width=".45"/>
    <g class="butterfly-glow"><circle cx="34.6" cy="8.5" r="6.8" fill="url(#nh-butter-glow)"/><ellipse cx="34.6" cy="8.5" rx="1.3" ry="2.5" transform="rotate(-30 34.6 8.5)" fill="#FFC96B"/><ellipse cx="34.4" cy="8.3" rx=".65" ry="1.6" transform="rotate(-30 34.4 8.3)" fill="#FFF8DC"/></g>`;
  const art = `<svg viewBox="0 0 100 96" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="nh-butter-copper" x1="1" y1="1" x2="0" y2="0"><stop stop-color="#F9C66A"/><stop offset=".45" stop-color="#F19830"/><stop offset=".8" stop-color="#D66A20"/><stop offset="1" stop-color="#B94E1C"/></linearGradient>
      <linearGradient id="nh-butter-honey" x1="1" y1="0" x2="0" y2="1"><stop stop-color="#FBD47A"/><stop offset=".5" stop-color="#EB8C2B"/><stop offset="1" stop-color="#BD541F"/></linearGradient>
      <radialGradient id="nh-butter-glow"><stop stop-color="#FFE4A0" stop-opacity=".85"/><stop offset=".28" stop-color="#FFCA63" stop-opacity=".45"/><stop offset="1" stop-color="#F2A63F" stop-opacity="0"/></radialGradient>
      <linearGradient id="nh-butter-body"><stop stop-color="#211B18"/><stop offset=".45" stop-color="#89603A"/><stop offset=".65" stop-color="#503322"/><stop offset="1" stop-color="#241C18"/></linearGradient>
    </defs>
    <g class="butterfly-body">
      <g class="butterfly-wing butterfly-left">${wing}</g>
      <g class="butterfly-wing butterfly-right"><g transform="translate(100 0) scale(-1 1)">${wing}</g></g>
      <g fill="none" stroke="#765132" stroke-width=".8" stroke-linecap="round"><path d="M48 47L43 51L41 59M52 47L57 51L59 59M48 53L43 61L44 72M52 53L57 61L56 72M48 58L46 73L44 86M52 58L54 73L56 86"/></g>
      <g class="butterfly-antenna butterfly-antenna-left">${antenna}</g>
      <g class="butterfly-antenna butterfly-antenna-right"><g transform="translate(100 0) scale(-1 1)">${antenna}</g></g>
      <path d="M47 52C44 62 47 76 50 80C53 76 56 62 53 52Z" fill="url(#nh-butter-body)" stroke="#2F251C" stroke-width=".6"/>
      <path d="M46.7 59Q50 61 53.3 59M46.8 64Q50 66 53.2 64M47.4 69Q50 71 52.6 69M48.2 74Q50 75.5 51.8 74" fill="none" stroke="#D69A50" stroke-width=".75"/>
      <ellipse cx="50" cy="48" rx="4.3" ry="8" fill="url(#nh-butter-body)" stroke="#C3914E" stroke-width=".7"/>
      <path d="M47 42L45.6 45M47 46L45.3 48M47 50L45.5 53M53 42L54.4 45M53 46L54.7 48M53 50L54.5 53" stroke="#C3914E" stroke-width=".55"/>
      <ellipse cx="50" cy="39" rx="3.1" ry="3.3" fill="#68462C"/>
      <ellipse cx="47.7" cy="39" rx="1.4" ry="2" fill="#241E19"/><ellipse cx="52.3" cy="39" rx="1.4" ry="2" fill="#241E19"/>
      <path d="M48.1 37.8L47.8 38.5M52.1 37.8L51.8 38.5" stroke="#EBD1A2" stroke-width=".6" stroke-linecap="round"/>
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
  function measure() {
    dirty = false;
    if (article) {
      const r = article.getBoundingClientRect();
      // Fit even the 1024px layout gutter; never spill into the title or prose.
      const gutter = Math.min(r.left, innerWidth-r.right);
      butterflySize = clamp(gutter-12, 18, 64);
      fireflySize = Math.min(52,butterflySize);
      const pad = butterflySize/2 + 5;
      leftLane = [pad, Math.max(pad, Math.min(180, r.left-pad))];
      rightLane = [Math.min(innerWidth-pad, Math.max(innerWidth-180, r.right+pad)), innerWidth-pad];
      perchX = (leftLane[0] + leftLane[1]) / 2;
      butterfly?.style.setProperty('--visitor-size', `${butterflySize}px`);
      fireflies.forEach(f => f.node.style.setProperty('--visitor-size', `${fireflySize}px`));
    } else {
      leftLane = [36, Math.max(36, Math.min(130, innerWidth * .09))];
      rightLane = [innerWidth - Math.min(150, innerWidth * .11), innerWidth - 36];
    }
    points = anchors.map(({element, statue}) => {
      const rect = element.getBoundingClientRect();
      if (statue) return {x: rect.left + rect.width * .46, y: rect.top + rect.height * .142};
      if (article) return {x: perchX, y: rect.top + 18};
      let node = element;
      while (node.firstChild) node = node.firstChild;
      let r = rect;
      if (node.nodeType === 3 && node.textContent.trim()) {
        const range = document.createRange();
        const offset = node.textContent.search(/\S/);
        range.setStart(node, offset); range.setEnd(node, offset + 1);
        r = range.getBoundingClientRect();
      }
      return {x: r.left + r.width * .52, y: r.top + r.height * .16};
    });
    const visible = p => p.y > 110 && p.y < innerHeight - 110;
    if (!points[active] || !visible(points[active])) {
      const candidates = points.map((p, i) => ({p, i})).filter(({p}) => visible(p));
      if (candidates.length) active = candidates.reduce((a, b) => Math.abs(a.p.y - innerHeight * .4) < Math.abs(b.p.y - innerHeight * .4) ? a : b).i;
    }
    if (toggle) {
      const r = toggle.getBoundingClientRect();
      control.hidden = r.bottom > 0 && r.top < innerHeight;
    } else control.hidden = false;
  }
  function paint(bank = 0) {
    if (article) x = clamp(x, leftLane[0], leftLane[1]);
    butterfly.style.transform = `translate3d(${(x - butterflySize/2).toFixed(2)}px,${(y - butterflySize*.86).toFixed(2)}px,0)`;
    body.style.rotate = `${bank.toFixed(2)}deg`;
  }
  function wake() {
    if (!control || !available() || frame) return;
    last = 0;
    frame = requestAnimationFrame(tick);
  }
  function scheduleRest() {
    clearTimeout(restTimer);
    restTimer = setTimeout(() => { wanderEnd = performance.now() + 1800; wake(); }, 11000);
  }
  function nightTarget(index) {
    const phase = [0.4,2.7,4.9][index], rate = [.19,.145,.173][index];
    const t = nightTime * rate;
    const lane = index === 1 ? rightLane : leftLane;
    const u = .5 + .31 * Math.sin(t + phase) + .13 * Math.sin(t * 1.73 + phase * 2);
    const v = .5 + .3 * Math.sin(t * .71 + phase) + .1 * Math.sin(t * 1.31 + phase * 1.6);
    return {x: lane[0] + (lane[1]-lane[0])*u, y: 110 + Math.max(0,innerHeight - 240)*v};
  }
  function tick(now) {
    frame = 0;
    if (!available() || !control) return;
    if (dirty) measure();
    const dt = Math.min((now - (last || now - 16)) / 1000, .035); last = now;
    if (theme === 'dark') {
      nightTime += dt;
      fireflies.forEach((f, i) => {
        const target = nightTarget(i), oldX = f.x;
        const ease = 1 - Math.exp(-dt * 1.5);
        f.x += (target.x-f.x)*ease; f.y += (target.y-f.y)*ease;
        // Constrain on resize immediately, while retaining smooth vertical drift.
        const lane = i === 1 ? rightLane : leftLane;
        f.x = clamp(f.x,lane[0],lane[1]);
        f.node.style.transform = `translate3d(${(f.x-fireflySize/2).toFixed(2)}px,${(f.y-fireflySize/2).toFixed(2)}px,0)`;
        f.body.style.rotate = `${clamp((f.x-oldX)/dt*1.5,-18,18).toFixed(2)}deg`;
      });
      frame = requestAnimationFrame(tick); return;
    }
    const perch = points[active];
    const targetX = article ? perchX : clamp(perch.x, 40, innerWidth - 40);
    const targetY = clamp(perch.y, 110, innerHeight - 110);
    const distance = Math.hypot(targetX - x, targetY - y);
    const idle = now - lastScroll > 260;
    const wandering = now < wanderEnd;
    if (!flying && (distance > 3 || !idle || wandering)) {
      flying = true; started = now; butterfly.dataset.flight = 'fly';
      clearTimeout(restTimer);
    }
    if (flying) {
      const breeze = Math.min(distance / 110, 1);
      const phase = (now - started) / 1000;
      const gx = targetX + Math.sin(phase * 2.1) * (article ? 9 : 38) * breeze + (wandering ? Math.sin(now / 480) * (article ? 8 : 28) : 0);
      const gy = targetY - Math.sin(Math.min(phase / 2, 1) * Math.PI) * 45 * breeze - (wandering ? 32 : 0);
      vx += clamp((gx - x) * 12 - vx * 6.5, -850, 850) * dt;
      vy += clamp((gy - y) * 12 - vy * 6.5, -850, 850) * dt;
      const speed = Math.hypot(vx, vy);
      if (speed > 300) { vx *= 300 / speed; vy *= 300 / speed; }
      x += vx * dt; y += vy * dt;
      paint(clamp(vx * .075, -17, 17));
      if (distance < 1.8 && Math.hypot(vx, vy) < 5 && idle && !wandering) {
        x = targetX; y = targetY; vx = vy = 0; flying = false;
        butterfly.dataset.flight = 'rest'; paint();
        if (perch.y > 110 && perch.y < innerHeight - 110) scheduleRest();
        return;
      }
    }
    if (!flying) { scheduleRest(); return; }
    frame = requestAnimationFrame(tick);
  }
  function stop() {
    cancelAnimationFrame(frame); frame = 0; clearTimeout(restTimer); last = 0;
  }
  function removeVisitors() {
    stop(); butterfly?.remove(); butterfly = body = undefined;
    fireflies.forEach(f => f.node.remove()); fireflies = [];
  }
  function swapTheme() {
    if (!control || theme === currentTheme()) {sync(); return;}
    removeVisitors(); theme = currentTheme(); dirty = true; active = 0; measure();
    if (theme === 'dark') {
      nightTime = 0;
      for (let i = 0; i < 3; i++) {
        const node = document.createElement('div'); node.className = 'nature-firefly';
        node.style.setProperty('--visitor-size', `${fireflySize}px`);
        node.setAttribute('aria-hidden','true'); node.innerHTML = fireflyArt(i);
        node.style.setProperty('--firefly-delay', `${-i * 1.7}s`);
        node.style.setProperty('--firefly-period', `${4.7 + i * .9}s`);
        const p = nightTarget(i);
        node.style.transform = `translate3d(${(p.x-fireflySize/2).toFixed(2)}px,${(p.y-fireflySize/2).toFixed(2)}px,0)`;
        document.body.append(node);
        fireflies.push({node,body:node.querySelector('.firefly-body'),x:p.x,y:p.y});
      }
    } else {
      butterfly = document.createElement('div'); butterfly.className = 'nature-butterfly';
      butterfly.style.setProperty('--visitor-size', `${butterflySize}px`);
      butterfly.setAttribute('aria-hidden', 'true'); butterfly.dataset.flight = 'rest'; butterfly.innerHTML = art;
      document.body.append(butterfly); body = butterfly.querySelector('.butterfly-body');
      x = article ? perchX : clamp(points[active].x, 40, innerWidth - 40);
      y = clamp(points[active].y, 110, innerHeight - 110);
      vx = vy = 0; flying = false; paint();
      wanderEnd = performance.now() + 900;
    }
    sync();
  }
  function sync() {
    if (!control) return;
    if (butterfly) butterfly.dataset.paused = String(!available());
    fireflies.forEach(f => {f.node.dataset.paused = String(!available());});
    control.textContent = paused() ? '▷ Lanjutkan gerak' : 'Ⅱ Jeda gerak';
    control.setAttribute('aria-pressed', String(paused()));
    control.setAttribute('aria-label', paused() ? 'Lanjutkan animasi alam' : 'Jeda animasi alam');
    if (available()) {dirty = true; wake();} else stop();
  }
  function onScroll() {dirty = true; lastScroll = performance.now(); wake();}
  function onHide() {suspended = true; sync();}
  function onShow() {suspended = false; sync();}
  function destroy() {
    removeVisitors(); watcher?.disconnect(); themeWatcher?.disconnect();
    window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll);
    window.removeEventListener('pagehide', onHide); window.removeEventListener('pageshow', onShow);
    document.removeEventListener('visibilitychange', sync);
    control?.remove(); control = undefined; theme = ''; suspended = false;
  }
  function setup() {
    if (!media.matches) {destroy(); return;}
    if (control) {swapTheme(); return;}
    control = document.createElement('button'); control.className = 'nature-page-toggle'; control.type = 'button';
    control.addEventListener('click', () => {if (toggle) toggle.click(); else {localPaused = !localPaused; sync();}});
    document.body.append(control);
    if (toggle) {watcher = new MutationObserver(sync); watcher.observe(toggle, {attributes:true,attributeFilter:['aria-pressed']});}
    themeWatcher = new MutationObserver(swapTheme); themeWatcher.observe(root, {attributes:true,attributeFilter:['data-theme']});
    window.addEventListener('scroll', onScroll, {passive:true}); window.addEventListener('resize', onScroll);
    document.addEventListener('visibilitychange', sync);
    window.addEventListener('pagehide', onHide); window.addEventListener('pageshow', onShow);
    swapTheme();
  }
  media.addEventListener('change', setup);
  document.fonts?.ready.then(() => {dirty = true; wake();});
  setup();
})();
