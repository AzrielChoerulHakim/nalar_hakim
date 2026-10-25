/* A static illustration everywhere; automatic ambient movement on capable desktops. */
(() => {
  'use strict';
  const scene = document.querySelector('[data-nature-scene]');
  if (!scene || !window.IntersectionObserver) return;
  const preference = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  let observer, inView = false, suspended = false, generation = 0;
  const update = () => {
    const capable = preference.matches && !suspended;
    const running = capable && inView && !document.hidden;
    scene.dataset.motion = !capable ? 'static' : running ? 'running' : 'paused';
  };
  const dispose = () => {
    generation++;
    observer?.disconnect(); observer = undefined;
    inView = false;
    scene.dataset.motion = 'static';
  };
  const setup = () => {
    dispose();
    if (!preference.matches || suspended) return;
    const current = generation;
    observer = new IntersectionObserver(entries => {
      if (current !== generation) return;
      const latest = entries.filter(entry => entry.target === scene).pop();
      if (latest) { inView = latest.isIntersecting; update(); }
    }, {threshold: 0});
    observer.observe(scene);
    update();
  };
  document.addEventListener('visibilitychange', update);
  preference.addEventListener('change', setup);
  window.addEventListener('pagehide', () => {suspended = true; dispose();});
  window.addEventListener('pageshow', () => {suspended = false; setup();});
  setup();
})();
