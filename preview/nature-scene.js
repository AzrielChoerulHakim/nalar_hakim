/* One finite weighing cycle. Static HTML is the complete fallback. */
(() => {
  'use strict';
  const scene = document.querySelector('[data-scale-scene]');
  if (!scene || scene.dataset.scaleInitialized || !window.IntersectionObserver) return;
  const balance = scene.querySelector('[data-scale-balance]');
  const hangers = [...scene.querySelectorAll('[data-scale-hanger]')];
  const replay = scene.querySelector('[data-scale-replay]');
  if (!balance?.animate || hangers.length !== 2) return;
  scene.dataset.scaleInitialized = 'true';
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let observer, inView = false, suspended = false, generation = 0, observerEpoch = 0;
  let played = false, running = false, animations = [];

  const stop = () => {
    generation++;
    for (const animation of animations) animation.cancel();
    animations = [];
    running = false;
    scene.dataset.motion = 'static';
    if (replay) replay.disabled = false;
  };
  const play = () => {
    if (running || suspended || !inView || document.hidden || preference.matches) return;
    played = true;
    running = true;
    scene.dataset.motion = 'running';
    if (replay) replay.disabled = true;
    const current = ++generation;
    try {
      const animate = (node, frames, timing) => {
        const animation = node.animate(frames, timing);
        animations.push(animation);
        // Cancellation is safe even if a later API call throws mid-sequence.
        animation.finished.catch(() => {});
        return animation;
      };
      const parts = [['base', 0], ['column', 120], ['beam', 320], ['chains', 470], ['pans', 600]];
      for (const [part, delay] of parts) {
        for (const node of scene.querySelectorAll(`[data-scale-reveal="${part}"]`)) {
          animate(node, [
            {opacity:0, clipPath:part === 'chains' ? 'inset(0 0 100% 0)' : 'inset(100% 0 0 0)'},
            {opacity:1, clipPath:'inset(0% 0 0 0)'}
          ], {duration:650, delay, easing:'cubic-bezier(.2,.65,.25,1)', fill:'backwards'});
        }
      }
      // Each suspension counter-rotates at the bearing, keeping both pans level.
      // Synchronised keyframes share a start time; there is no per-frame JS loop.
      const angles = [0, -3.8, 2.1, -.85, .25, 0];
      const offsets = [0, .22, .46, .68, .86, 1];
      const frames = sign => angles.map((angle, index) => ({transform:`rotate(${angle * sign}deg)`, offset:offsets[index], easing:'ease-in-out'}));
      const timing = {duration:2400, delay:1150, fill:'none'};
      animate(balance, frames(1), timing);
      for (const hanger of hangers) animate(hanger, frames(-1), timing);
      const start = document.timeline?.currentTime;
      if (start != null) for (const animation of animations) animation.startTime = start;
      Promise.all(animations.map(animation => animation.finished)).then(() => {
        if (current === generation) stop();
      }).catch(() => { if (current === generation) stop(); });
    } catch (_) {
      stop();
    }
  };
  const setup = () => {
    const currentObserver = ++observerEpoch;
    observer?.disconnect();
    observer = undefined;
    inView = false;
    stop();
    if (replay) replay.hidden = preference.matches;
    if (suspended || preference.matches) return;
    observer = new IntersectionObserver(entries => {
      if (suspended || currentObserver !== observerEpoch) return;
      const entry = entries.filter(item => item.target === scene).pop();
      if (!entry) return;
      inView = entry.isIntersecting;
      if (!inView) stop();
      else if (!played) play();
    }, {threshold:0.12});
    observer.observe(scene);
  };
  const visibility = () => {
    if (document.hidden) stop();
    else if (!played) play();
  };
  replay?.addEventListener('click', play);
  preference.addEventListener('change', setup);
  document.addEventListener('visibilitychange', visibility);
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
