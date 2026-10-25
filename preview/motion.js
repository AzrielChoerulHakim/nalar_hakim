/* Progressive enhancement: static, visible HTML is the baseline. No scroll loop. */
(() => {
  'use strict';
  const preference = window.matchMedia('(min-width: 1000px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  const root = document.documentElement;
  const seen = new WeakSet();
  const running = new Map();
  let observer;
  let introduced = false;

  const cancel = (element) => {
    const animation = running.get(element);
    if (animation) animation.cancel();
    running.delete(element);
  };
  const animate = (element, keyframes, delay = 0, duration = 650) => {
    if (!element || element.contains(document.activeElement)) return;
    cancel(element);
    const animation = element.animate(keyframes, { duration, delay, fill: 'backwards', easing: 'cubic-bezier(.22,1,.36,1)' });
    running.set(element, animation);
    animation.onfinish = animation.oncancel = () => {
      if (running.get(element) === animation) running.delete(element);
    };
  };
  const settle = (target) => {
    if (!(target instanceof Element)) return;
    for (const [element] of running) {
      if (element.contains(target) || target.contains(element)) cancel(element);
    }
    for (const element of document.querySelectorAll('[data-nh-reveal]')) {
      if (element.contains(target) || target.contains(element)) {
        seen.add(element);
        observer?.unobserve(element);
      }
    }
  };
  const settleHash = (hash) => {
    if (!hash || hash === '#') return;
    try { settle(document.getElementById(decodeURIComponent(hash.slice(1)))); } catch (_) { /* Invalid fragments leave native navigation intact. */ }
  };
  const onFocus = (event) => settle(event.target);
  const onHash = () => settleHash(window.location.hash);
  const onClick = (event) => {
    const anchor = event.target.closest?.('a[href]');
    if (!anchor) return;
    const url = new URL(anchor.href, window.location.href);
    if (url.origin === window.location.origin && url.pathname === window.location.pathname) settleHash(url.hash);
  };
  const stop = () => {
    observer?.disconnect();
    observer = undefined;
    for (const [element] of running) cancel(element);
    root.classList.remove('nh-motion');
    document.querySelectorAll('.nh-rule-enter').forEach((element) => element.classList.remove('nh-rule-enter'));
    document.removeEventListener('focusin', onFocus);
    document.removeEventListener('click', onClick, true);
    window.removeEventListener('hashchange', onHash);
  };
  const start = () => {
    stop();
    if (!preference.matches || !window.IntersectionObserver || !Element.prototype.animate) return;
    try {
      observer = new IntersectionObserver((entries) => {
        if (!observer || !preference.matches) return;
        entries.forEach(({ target, isIntersecting, boundingClientRect }) => {
          if (!isIntersecting) return;
          observer.unobserve(target);
          if (seen.has(target)) return;
          seen.add(target);
          // Existing above-fold content never fades out when enhancement starts.
          if (target.dataset.nhReveal === 'below' && boundingClientRect.bottom > 0) {
            animate(target, [{ opacity: .5, transform: 'translateY(14px)' }, { opacity: 1, transform: 'translateY(0)' }]);
          }
          const rule = target.querySelector('.landing-manifest-notes');
          if (rule) rule.classList.add('nh-rule-enter');
        });
      }, { rootMargin: '0px 0px 32px 0px', threshold: 0 });
      root.classList.add('nh-motion');
      document.addEventListener('focusin', onFocus);
      document.addEventListener('click', onClick, true);
      window.addEventListener('hashchange', onHash);

      const targets = document.querySelectorAll('.landing-manifest-copy,.landing-channel-heading,.landing-channel,.landing-invitation h2,.section-heading,.article-grid > .story-card,.preview-invite,.channel-card,.article-references,.format-card,.editorial-invitation,.debate-invitation,.review-grid > article');
      targets.forEach((element) => {
        if (seen.has(element)) return;
        element.dataset.nhReveal = element.getBoundingClientRect().top > window.innerHeight ? 'below' : 'visible';
        observer.observe(element);
      });
      if (!introduced && !window.location.hash && window.scrollY < 40) {
        introduced = true;
        const titleLines = document.querySelectorAll('.landing-hero h1 > span');
        // Native animations own their cleanup. No CSS class ever hides the title.
        // Slightly expanded clip bounds preserve the oversized letterforms.
        titleLines.forEach((element, index) => animate(element, [
          { transform: 'translateY(32px)', clipPath: 'inset(100% -4% -10% -4%)' },
          { transform: 'translateY(0)', clipPath: 'inset(-10% -4% -10% -4%)' }
        ], index * 110, 880));
        animate(document.querySelector('.landing-running-head'), [
          { opacity: .65, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }
        ], 0, 550);
        animate(document.querySelector('.landing-hero-support'), [
          { opacity: .7, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }
        ], 230, 740);
        animate(document.querySelector('.landing-asterisk'), [
          { transform: 'rotate(-50deg) scale(.9)' }, { transform: 'rotate(0) scale(1)' }
        ], 90, 1000);
        const editorialIntro = document.querySelectorAll('.home-intro .eyebrow,.home-intro h1,.home-position,.archive-header .eyebrow,.archive-header h1,.article-header .eyebrow,.article-header h1,.article-header .article-deck');
        editorialIntro.forEach((element, index) => animate(element, [{ transform: 'translateY(12px)' }, { transform: 'translateY(0)' }], Math.min(index * 65, 195), 700));
        document.querySelector('.landing-hero-support')?.classList.add('nh-rule-enter');
      }
      onHash();
    } catch (_) { stop(); }
  };
  preference.addEventListener?.('change', start);
  window.addEventListener('pagehide', stop);
  window.addEventListener('pageshow', (event) => { if (event.persisted) start(); });
  start();
})();
