/* The full balance is static by default. Activation weighs once, then rests. */
(() => {
  'use strict';
  const scene = document.querySelector('[data-scale-scene]');
  if (!scene || scene.dataset.scaleInitialized || !window.IntersectionObserver) return;
  const balance = scene.querySelector('[data-scale-balance]');
  const hangers = [...scene.querySelectorAll('[data-scale-hanger]')];
  const trigger = scene.querySelector('[data-scale-replay]');
  if (!trigger || !balance?.animate || hangers.length !== 2 || hangers.some(node => !node.animate)) return;
  scene.dataset.scaleInitialized = 'true';
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let observer, inView = false, suspended = false, generation = 0, observerEpoch = 0;
  let running = false, animations = [];

  const stop = () => {
    generation++;
    for (const animation of animations) animation.cancel();
    animations = [];
    running = false;
    scene.dataset.motion = 'static';
    trigger.setAttribute('aria-disabled', String(preference.matches || suspended));
  };
  const play = () => {
    if (running || suspended || !inView || document.hidden || preference.matches) return;
    running = true;
    scene.dataset.motion = 'running';
    // Keep the native button focused; the guard ignores repeat activations.
    trigger.setAttribute('aria-disabled', 'true');
    const current = ++generation;
    try {
      const animate = (node, frames, timing) => {
        const animation = node.animate(frames, timing);
        animations.push(animation);
        animation.finished.catch(() => {});
      };
      // Counter-rotation at each bearing keeps gravity vertical. The fixed
      // column, axle, pedestal and every filled surface are never revealed again.
      const angles = [0, -4.5, 2.15, -.72, .14, 0];
      const offsets = [0, .23, .48, .71, .88, 1];
      const frames = sign => angles.map((angle, index) => ({transform:'rotate(' + angle * sign + 'deg)', offset:offsets[index], easing:'ease-in-out'}));
      const timing = {duration:2200, fill:'none'};
      animate(balance, frames(1), timing);
      for (const hanger of hangers) animate(hanger, frames(-1), timing);
      const start = document.timeline?.currentTime;
      if (start != null) for (const animation of animations) animation.startTime = start;
      Promise.all(animations.map(animation => animation.finished)).then(() => {
        if (current === generation) stop();
      }).catch(() => { if (current === generation) stop(); });
    } catch (_) { stop(); }
  };
  const setup = () => {
    const currentObserver = ++observerEpoch;
    observer?.disconnect();
    observer = undefined;
    inView = false;
    stop();
    if (suspended || preference.matches) return;
    observer = new IntersectionObserver(entries => {
      if (suspended || currentObserver !== observerEpoch) return;
      const entry = entries.filter(item => item.target === scene).pop();
      if (!entry) return;
      inView = entry.isIntersecting;
      if (!inView) stop();
    }, {threshold:0.12});
    observer.observe(scene);
  };
  trigger.addEventListener('click', play);
  preference.addEventListener('change', setup);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  window.addEventListener('pagehide', () => {
    suspended = true;
    observerEpoch++;
    observer?.disconnect();
    observer = undefined;
    stop();
  });
  window.addEventListener('pageshow', () => {
    if (!suspended) return;
    suspended = false;
    setup();
  });
  setup();
})();
