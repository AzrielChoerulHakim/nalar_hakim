/* A static illustration everywhere; quiet ambient movement on capable desktops. */
(() => {
  'use strict';
  const scene = document.querySelector('[data-nature-scene]');
  const toggle = scene?.querySelector('[data-nature-toggle]');
  if (!scene || !toggle || !window.IntersectionObserver) return;
  const preference = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  let inView = false;
  let userPaused = false;
  let suspended = false;
  const update = () => {
    const capable = preference.matches;
    const running = capable && inView && !document.hidden && !userPaused && !suspended;
    scene.dataset.motion = !capable ? 'static' : running ? 'running' : 'paused';
    toggle.hidden = !capable;
    toggle.setAttribute('aria-pressed', String(userPaused));
    toggle.setAttribute('aria-label', userPaused ? 'Lanjutkan animasi alam' : 'Jeda animasi alam');
    toggle.querySelector('[data-nature-label]').textContent = userPaused ? 'Lanjutkan gerak' : 'Jeda gerak';
    toggle.querySelector('[aria-hidden]').textContent = userPaused ? '▷' : 'Ⅱ';
  };
  const observer = new IntersectionObserver(entries => {
    inView = entries[entries.length - 1].isIntersecting;
    update();
  }, {threshold: 0});
  observer.observe(scene);
  toggle.addEventListener('click', () => {userPaused = !userPaused; update();});
  document.addEventListener('visibilitychange', update);
  preference.addEventListener('change', update);
  window.addEventListener('pagehide', () => {suspended = true; update();});
  window.addEventListener('pageshow', () => {suspended = false; update();});
  update();
})();
