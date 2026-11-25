/* S01 / Reading progress, bounded to the published article, not the footer. */
(() => {
  'use strict';
  function init() {
    const article = document.querySelector('main.single-main article.article-layout');
    const body = article?.querySelector('.article-content');
    if (!article || !body) return;
    const mobile = matchMedia('(max-width:767px), (max-width:1024px) and (pointer:coarse)');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const rail = document.createElement('div');
    rail.className = 'nh-reading-rail';
    rail.setAttribute('aria-hidden','true');
    document.body.append(rail);
    let frame = 0, listening = false;
    const update = () => {
      frame = 0;
      const start = article.getBoundingClientRect().top + window.scrollY;
      const end = body.getBoundingClientRect().bottom + window.scrollY;
      const span = end - start - window.innerHeight;
      const value = span > 0 ? Math.max(0, Math.min(1, (window.scrollY - start) / span)) : 0;
      rail.style.setProperty('--nh-reading-progress', String(value));
      rail.toggleAttribute('data-active', listening && span > 0 && window.scrollY >= start && window.scrollY < end);
    };
    const schedule = () => { if (listening && !frame) frame = requestAnimationFrame(update); };
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(schedule) : null;
    function sync() {
      const enabled = mobile.matches && !reduce.matches;
      if (enabled === listening) { schedule(); return; }
      listening = enabled;
      if (enabled) {
        window.addEventListener('scroll', schedule, {passive:true});
        window.addEventListener('resize', schedule, {passive:true});
        window.addEventListener('pageshow', schedule);
        observer?.observe(article);
        schedule();
      } else {
        window.removeEventListener('scroll', schedule);
        window.removeEventListener('resize', schedule);
        window.removeEventListener('pageshow', schedule);
        observer?.disconnect();
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        rail.removeAttribute('data-active');
      }
    }
    for (const query of [mobile, reduce]) {
      if (query.addEventListener) query.addEventListener('change', sync);
      else query.addListener(sync);
    }
    document.fonts?.ready.then(schedule);
    sync();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
