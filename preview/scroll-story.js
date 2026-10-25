/* Desktop editorial scrollytelling. Native scroll; one frame per input, no loop. */
(() => {
  'use strict';
  const root = document.documentElement;
  const media = matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  const hero = document.querySelector('.landing-hero');
  const sections = ['sikap', 'bentuk', 'kirim'].map(id => document.getElementById(id));
  const toggle = document.querySelector('[data-nature-toggle]');
  if (!hero || sections.some(s => !s) || !toggle || !window.MutationObserver) return;
  const cards = [...sections[1].querySelectorAll('.landing-channel')];
  const labels = ['Sikap redaksi', 'Bentuk tulisan', 'Kirim naskah'];
  const journey = document.getElementById('gagasan');
  if (journey) { sections.push(journey); labels.push('Perjalanan gagasan'); }
  let nav, links = [], watcher, resizeObserver, frame = 0, suspended = false;
  const clamp = n => Math.min(1, Math.max(0, n));
  const paused = () => toggle.getAttribute('aria-pressed') === 'true';
  function render() {
    frame = 0;
    if (!nav || !media.matches || document.hidden || suspended) return;
    // Read all geometry before writing styles. Sticky elements keep their native flow.
    const h = hero.getBoundingClientRect();
    const rects = sections.map(s => s.getBoundingClientRect());
    const cardRects = cards.map(c => c.getBoundingClientRect());
    const viewport = innerHeight;
    const total = document.documentElement.scrollHeight - viewport;
    const progress = total > 0 ? clamp(scrollY / total) : 0;
    let active = 0;
    rects.forEach((r, i) => { if (r.top < viewport * .42) active = i; });
    nav.hidden = h.bottom > 130 && !nav.contains(document.activeElement);
    nav.style.setProperty('--story-progress', progress.toFixed(4));
    links.forEach((link, i) => {
      link.classList.toggle('is-current', i === active);
      if (i === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    root.dataset.scrollPaused = String(paused());
    if (paused()) return;
    hero.style.setProperty('--story-sky-shift', `${(clamp(-h.top / Math.max(h.height, 1)) * 28).toFixed(2)}px`);
    sections[0].style.setProperty('--statement-progress', clamp((viewport * .8 - rects[0].top) / (viewport * .6)).toFixed(4));
    cards.forEach((card, i) => card.style.setProperty('--card-progress', clamp((viewport * .87 - cardRects[i].top) / (viewport * .55)).toFixed(4)));
  }
  function schedule() {
    if (!nav || frame || document.hidden || suspended || !media.matches) return;
    frame = requestAnimationFrame(render);
  }
  function onFocus(event) {
    const card = event.target.closest?.('.landing-channel');
    // Keyboard focus exposes every link in natural order rather than under a stack.
    const expose = Boolean(card && sections[1].contains(card));
    sections[1].classList.toggle('scroll-focus-content', expose);
    if (expose) card.scrollIntoView({block: 'nearest', behavior: 'instant'});
    schedule();
  }
  function onHash() {
    const id = location.hash.slice(1);
    const target = document.getElementById(id);
    if (target && sections[1].contains(target) && target.closest('.landing-channel')) {
      sections[1].classList.add('scroll-focus-content');
    }
    schedule();
  }
  function stopFrame() {cancelAnimationFrame(frame); frame = 0;}
  function destroy() {
    stopFrame(); watcher?.disconnect(); resizeObserver?.disconnect();
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    window.removeEventListener('hashchange', onHash);
    document.removeEventListener('focusin', onFocus);
    nav?.remove(); nav = undefined; links = [];
    root.classList.remove('nh-scroll-story'); delete root.dataset.scrollPaused;
    hero.style.removeProperty('--story-sky-shift');
    sections[0].style.removeProperty('--statement-progress');
    sections[1].classList.remove('scroll-focus-content');
    cards.forEach(c => {c.style.removeProperty('--card-index'); c.style.removeProperty('--card-progress');});
    // Let the independent butterfly remeasure after restoring the compact layout.
    window.dispatchEvent(new Event('resize'));
  }
  function setup() {
    if (!media.matches) { if (nav) destroy(); return; }
    if (nav) {schedule(); return;}
    nav = document.createElement('nav'); nav.className = 'scroll-chapters';
    nav.setAttribute('aria-label', 'Bagian halaman'); nav.hidden = true;
    sections.forEach((s, i) => {
      const link = document.createElement('a'); link.href = `#${s.id}`;
      const number = document.createElement('span'); number.className = 'scroll-chapter-number'; number.textContent = `0${i + 1}`;
      const label = document.createElement('span'); label.className = 'scroll-chapter-label'; label.textContent = labels[i];
      link.append(number, label); nav.append(link); links.push(link);
    });
    document.body.append(nav);
    cards.forEach((c, i) => c.style.setProperty('--card-index', i));
    root.classList.add('nh-scroll-story');
    watcher = new MutationObserver(schedule); watcher.observe(toggle, {attributes: true, attributeFilter: ['aria-pressed']});
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(schedule);
      sections.forEach(s => resizeObserver.observe(s));
    }
    window.addEventListener('scroll', schedule, {passive: true});
    window.addEventListener('resize', schedule);
    window.addEventListener('hashchange', onHash);
    document.addEventListener('focusin', onFocus);
    window.dispatchEvent(new Event('resize'));
    onHash();
  }
  media.addEventListener('change', setup);
  document.addEventListener('visibilitychange', () => {if (document.hidden) stopFrame(); else schedule();});
  window.addEventListener('pagehide', () => {suspended = true; stopFrame();});
  window.addEventListener('pageshow', () => {suspended = false; schedule();});
  document.fonts?.ready.then(schedule);
  setup();
})();
