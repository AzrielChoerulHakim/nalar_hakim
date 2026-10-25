/* Native SVG signals: no frame loop; one lifecycle for visibility and shared pause. */
(() => {
  'use strict';
  const section = document.querySelector('[data-idea-flow]');
  const toggle = document.querySelector('[data-nature-toggle]');
  if (!section || !toggle || !window.IntersectionObserver || !window.MutationObserver) return;
  const capable = matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  let intersection, watcher, visible = false, suspended = false, generation = 0;
  function update() {
    const active = capable.matches && visible && !suspended && !document.hidden && toggle.getAttribute('aria-pressed') !== 'true';
    section.dataset.flowState = capable.matches && !suspended ? (active ? 'running' : 'paused') : 'static';
  }
  function dispose() {
    generation++;
    intersection?.disconnect(); watcher?.disconnect();
    intersection = watcher = undefined;
    visible = false;
    section.dataset.flowState = 'static';
  }
  function setup() {
    dispose();
    if (!capable.matches || suspended) return;
    const current = generation;
    intersection = new IntersectionObserver(entries => {
      if (current !== generation) return;
      const latest = entries.filter(entry => entry.target === section).pop();
      if (latest) { visible = latest.isIntersecting; update(); }
    }, {threshold: 0});
    watcher = new MutationObserver(update);
    watcher.observe(toggle, {attributes: true, attributeFilter: ['aria-pressed']});
    intersection.observe(section);
    update();
  }
  capable.addEventListener('change', setup);
  document.addEventListener('visibilitychange', update);
  window.addEventListener('pagehide', () => {suspended = true; dispose();});
  window.addEventListener('pageshow', () => {suspended = false; setup();});
  setup();
})();
