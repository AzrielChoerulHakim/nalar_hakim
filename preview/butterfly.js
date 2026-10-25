/* One decorative visitor. Read layout only on scroll/resize, never every frame. */
(() => {
  'use strict';
  const media = matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  const scene = document.querySelector('[data-nature-scene]');
  const toggle = scene?.querySelector('[data-nature-toggle]');
  if (!scene || !toggle || !window.MutationObserver) return;
  const anchors = [
    {element: scene.querySelector('svg'), statue: true},
    ...['#landing-manifest-title', '#landing-channels-title', '#landing-invitation-title', '.landing-footer-brand'].map(s => ({element: document.querySelector(s)}))
  ].filter(a => a.element);
  let butterfly, body, control, watcher, frame = 0, restTimer = 0;
  let points = [], active = 0, dirty = true, flying = false, suspended = false;
  let x = 0, y = 0, vx = 0, vy = 0, last = 0, lastScroll = -1000, wanderEnd = 0, started = 0;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const paused = () => toggle.getAttribute('aria-pressed') === 'true';
  const available = () => media.matches && !document.hidden && !suspended && !paused();
  const art = `<svg viewBox="0 0 44 40" aria-hidden="true"><g class="butterfly-body">
    <g fill="var(--butter-wing)" stroke="var(--butter-edge)" stroke-width=".8" stroke-linejoin="round">
      <g class="butterfly-wing butterfly-left"><path d="M21 24C13 23 2 15 3 7C4 0 16 7 21 20C16 17 8 20 8 27C8 34 18 33 21 24Z"/><path d="M20 22L6 9M20 23L10 27M17 18L9 17M14 14L14 10" fill="none" stroke="var(--butter-vein)" stroke-width=".75"/><path d="M6 10L8 13M10 9L12 12M11 28L14 29" stroke="var(--butter-edge)" stroke-width="1.4"/></g>
      <g class="butterfly-wing butterfly-right"><path d="M23 24C31 23 42 15 41 7C40 0 28 7 23 20C28 17 36 20 36 27C36 34 26 33 23 24Z"/><path d="M24 22L38 9M24 23L34 27M27 18L35 17M30 14L30 10" fill="none" stroke="var(--butter-vein)" stroke-width=".75"/><path d="M38 10L36 13M34 9L32 12M33 28L30 29" stroke="var(--butter-edge)" stroke-width="1.4"/></g>
    </g><path d="M22 17C19.8 19 20.8 29 22 32C23.2 29 24.2 19 22 17Z" fill="var(--butter-edge)"/><path d="M21 18Q18 12 16 13M23 18Q26 12 28 13M21 27L18 35M23 27L26 35" fill="none" stroke="var(--butter-edge)" stroke-width=".7" stroke-linecap="round"/>
  </g></svg>`;
  function measure() {
    dirty = false;
    points = anchors.map(({element, statue}) => {
      const rect = element.getBoundingClientRect();
      if (statue) return {x: rect.left + rect.width * .46, y: rect.top + rect.height * .142};
      // Range around the first printed letter; no wrapping spans or layout changes.
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
    // A visible perch remains preferred until it leaves the comfortable frame.
    const visible = p => p.y > 90 && p.y < innerHeight - 95;
    if (!points[active] || !visible(points[active])) {
      const candidates = points.map((p, i) => ({p, i})).filter(({p}) => visible(p));
      if (candidates.length) active = candidates.reduce((a, b) => Math.abs(a.p.y - innerHeight * .4) < Math.abs(b.p.y - innerHeight * .4) ? a : b).i;
    }
    const r = toggle.getBoundingClientRect();
    control.hidden = r.bottom > 0 && r.top < innerHeight;
  }
  function paint(bank = 0) {
    butterfly.style.transform = `translate3d(${(x - 22).toFixed(2)}px,${(y - 35).toFixed(2)}px,0)`;
    body.style.rotate = `${bank.toFixed(2)}deg`;
  }
  function wake() {
    if (!butterfly || !available() || frame) return;
    last = 0;
    frame = requestAnimationFrame(tick);
  }
  function scheduleRest() {
    clearTimeout(restTimer);
    restTimer = setTimeout(() => { wanderEnd = performance.now() + 1800; wake(); }, 11000);
  }
  function tick(now) {
    frame = 0;
    if (!available() || !butterfly) return;
    if (dirty) measure();
    const dt = Math.min((now - (last || now - 16)) / 1000, .035); last = now;
    const perch = points[active];
    const targetX = clamp(perch.x, 40, innerWidth - 40);
    const targetY = clamp(perch.y, 100, innerHeight - 85);
    const distance = Math.hypot(targetX - x, targetY - y);
    const idle = now - lastScroll > 260;
    const wandering = now < wanderEnd;
    if (!flying && (distance > 3 || !idle || wandering)) {
      flying = true; started = now; butterfly.dataset.flight = 'fly';
      clearTimeout(restTimer);
    }
    if (flying) {
      // A damped flight path preserves velocity when the destination changes.
      // The sideways breeze fades near landing rather than snapping to scroll.
      const breeze = Math.min(distance / 110, 1);
      const phase = (now - started) / 1000;
      const gx = targetX + Math.sin(phase * 2.1) * 38 * breeze + (wandering ? Math.sin(now / 480) * 28 : 0);
      const gy = targetY - Math.sin(Math.min(phase / 2, 1) * Math.PI) * 45 * breeze - (wandering ? 32 : 0);
      vx += clamp((gx - x) * 12 - vx * 6.5, -850, 850) * dt;
      vy += clamp((gy - y) * 12 - vy * 6.5, -850, 850) * dt;
      const speed = Math.hypot(vx, vy);
      if (speed > 300) { vx *= 300 / speed; vy *= 300 / speed; }
      x += vx * dt; y += vy * dt;
      paint(clamp(vx * .075, -17, 17));
      if (distance < 1.8 && Math.hypot(vx, vy) < 5 && idle && !wandering && perch.y > 90 && perch.y < innerHeight - 85) {
        x = targetX; y = targetY; vx = vy = 0; flying = false;
        butterfly.dataset.flight = 'rest'; paint();
        scheduleRest();
        return;
      }
      // In a gap between headings, hold quietly in the margin until another scroll.
      if (distance < 2 && idle && !wandering && (perch.y <= 90 || perch.y >= innerHeight - 85)) {
        butterfly.dataset.flight = 'rest'; flying = false; paint(); return;
      }
    }
    if (!flying) { scheduleRest(); return; }
    frame = requestAnimationFrame(tick);
  }
  function stop() {
    cancelAnimationFrame(frame); frame = 0; clearTimeout(restTimer); last = 0;
  }
  function sync() {
    if (!butterfly) return;
    butterfly.dataset.paused = String(!available());
    control.textContent = paused() ? '▷ Lanjutkan gerak' : 'Ⅱ Jeda gerak';
    control.setAttribute('aria-pressed', String(paused()));
    control.setAttribute('aria-label', paused() ? 'Lanjutkan animasi alam' : 'Jeda animasi alam');
    if (available()) {dirty = true; wake();} else stop();
  }
  function onScroll() { dirty = true; lastScroll = performance.now(); wake(); }
  function destroy() {
    stop(); watcher?.disconnect();
    window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll);
    butterfly?.remove(); control?.remove(); butterfly = control = body = undefined;
  }
  function setup() {
    if (!media.matches) { destroy(); return; }
    if (butterfly) {sync(); return;}
    butterfly = document.createElement('div'); butterfly.className = 'nature-butterfly';
    butterfly.setAttribute('aria-hidden', 'true'); butterfly.dataset.flight = 'rest'; butterfly.innerHTML = art;
    control = document.createElement('button'); control.className = 'nature-page-toggle'; control.type = 'button';
    control.addEventListener('click', () => toggle.click());
    document.body.append(butterfly, control); body = butterfly.querySelector('.butterfly-body');
    active = 0; dirty = true; measure();
    x = clamp(points[active].x, 40, innerWidth - 40); y = clamp(points[active].y, 100, innerHeight - 85);
    vx = vy = 0; flying = false; paint();
    watcher = new MutationObserver(sync); watcher.observe(toggle, {attributes: true, attributeFilter: ['aria-pressed']});
    window.addEventListener('scroll', onScroll, {passive: true}); window.addEventListener('resize', onScroll);
    wanderEnd = performance.now() + 900; sync();
  }
  media.addEventListener('change', setup);
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pagehide', () => {suspended = true; sync();});
  window.addEventListener('pageshow', () => {suspended = false; sync();});
  document.fonts?.ready.then(() => {dirty = true; wake();});
  setup();
})();
