/* Nine native SVG signals, active only on visible fine-pointer desktops. */
(() => {
  'use strict';
  const field = document.querySelector('.landing-signal-field');
  const control = document.querySelector('[data-signal-toggle]');
  if (!field || !control || !Element.prototype.animate || !window.IntersectionObserver) return;
  const preference = window.matchMedia('(min-width: 1000px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  let animations = [];
  let observer;
  let visible = false;
  let userPaused = false;
  let suspended = false;
  let generation = 0;

  const update = () => {
    const active = preference.matches && visible && !document.hidden && !userPaused && !suspended;
    for (const animation of animations) active ? animation.play() : animation.pause();
    field.dataset.signalState = active ? 'running' : 'paused';
  };
  const dispose = () => {
    generation += 1;
    observer?.disconnect();
    observer = undefined;
    for (const animation of animations) animation.cancel();
    animations = [];
    visible = false;
    field.classList.remove('signals-ready');
    field.dataset.signalState = 'static';
    control.hidden = true;
  };
  const configure = () => {
    dispose();
    if (!preference.matches || suspended) return;
    try {
      field.querySelectorAll('.signal-packet').forEach((packet, index) => {
        const duration = 9000 + (index % 3) * 1500;
        packet.querySelectorAll('path').forEach((path) => {
          const animation = path.animate([{ strokeDashoffset: 1000 }, { strokeDashoffset: 0 }], { duration, iterations: Infinity, easing: 'linear' });
          animation.pause();
          animation.currentTime = (index * 1379 + 1100) % duration;
          animations.push(animation);
        });
      });
      field.classList.add('signals-ready');
      control.hidden = false;
      control.dataset.paused = String(userPaused);
      control.setAttribute('aria-label', userPaused ? 'Lanjutkan animasi jaringan' : 'Jeda animasi jaringan');
      control.querySelector('span').textContent = userPaused ? 'Lanjutkan animasi' : 'Jeda animasi';
      const currentGeneration = generation;
      observer = new IntersectionObserver((entries) => {
        if (currentGeneration !== generation) return;
        const latest = entries.filter(entry => entry.target === field).pop();
        if (!latest) return;
        visible = latest.isIntersecting;
        update();
      }, { threshold: 0 });
      observer.observe(field);
      update();
    } catch (_) { dispose(); }
  };
  control.addEventListener('click', () => {
    userPaused = !userPaused;
    control.dataset.paused = String(userPaused);
    control.setAttribute('aria-label', userPaused ? 'Lanjutkan animasi jaringan' : 'Jeda animasi jaringan');
    control.querySelector('span').textContent = userPaused ? 'Lanjutkan animasi' : 'Jeda animasi';
    update();
  });
  document.addEventListener('visibilitychange', update);
  preference.addEventListener?.('change', configure);
  window.addEventListener('pagehide', () => { suspended = true; dispose(); });
  window.addEventListener('pageshow', event => { if (event.persisted) { suspended = false; configure(); } });
  configure();
})();
