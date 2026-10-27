/* One-shot decoration only: no scroll handlers, text hiding, or navigation changes. */
(() => {
  'use strict';
  const root = document.documentElement;
  if (root.dataset.editorialMotion === 'ready') return;
  root.dataset.editorialMotion = 'ready';

  document.querySelectorAll('[data-brand-reveal]').forEach(brand => {
    const wordmark = brand.querySelector('.brand-name') || brand.querySelector(':scope > span:last-child');
    if (!wordmark || wordmark.querySelector('.nh-brand-accent')) return;
    const accent = document.createElement('span');
    accent.className = 'nh-brand-accent';
    accent.setAttribute('aria-hidden', 'true');
    accent.textContent = wordmark.textContent;
    wordmark.classList.add('nh-brand-wordmark');
    wordmark.append(accent);
  });

  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !window.IntersectionObserver || document.hidden) return;
  const pending = new Set();
  let observer;
  let stopped = false;
  const completed = event => {
    if (event.animationName === 'nh-ink-draw' || event.animationName === 'nh-portal-open') finish(event.target);
  };
  const detach = () => {
    if (stopped) return;
    stopped = true;
    observer?.disconnect();
    preference.removeEventListener('change', reduce);
    document.removeEventListener('visibilitychange', hidden);
    window.removeEventListener('pagehide', finishAll);
  };
  function finish(target) {
    if (!pending.has(target)) return;
    target.dataset.editorialState = 'shown';
    target.removeEventListener('animationend', completed);
    observer?.unobserve(target);
    pending.delete(target);
    if (!pending.size) detach();
  }
  function finishAll() { [...pending].forEach(finish); detach(); }
  function reduce() { if (preference.matches) finishAll(); }
  function hidden() { if (document.hidden) finishAll(); }
  observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const target = entry.target;
      if (!pending.has(target)) continue;
      if (entry.isIntersecting) {
        target.dataset.editorialState = 'revealing';
      } else if (target.dataset.editorialState === 'revealing') {
        // A quick scroll away finishes the decoration; returning never replays it.
        finish(target);
      }
    }
  }, {threshold:0, rootMargin:'0px 0px -8% 0px'});

  document.querySelectorAll('[data-ink-divider]').forEach(section => {
    const line = document.createElement('span');
    line.className = 'nh-ink-divider';
    line.setAttribute('aria-hidden', 'true');
    section.append(line);
    section.dataset.editorialInk = 'true';
    pending.add(line);
  });
  document.querySelectorAll('[data-quote-portal] .quote-portal-media').forEach(media => pending.add(media));
  if (!pending.size) { detach(); return; }
  for (const target of pending) {
    target.dataset.editorialState = 'pending';
    target.addEventListener('animationend', completed);
    observer.observe(target);
  }
  preference.addEventListener('change', reduce);
  document.addEventListener('visibilitychange', hidden);
  window.addEventListener('pagehide', finishAll);
})();
