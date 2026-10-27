/* Optional cover continuity across ordinary document navigations. No router or waits. */
(() => {
  'use strict';
  if (window.__nhCoverTransitions || !('onpageswap' in window) ||
      !('onpagereveal' in window) || !window.CSS?.supports('view-transition-name', 'nh-article-cover')) return;
  window.__nhCoverTransitions = true;

  const key = 'nh-cover-transition-v1';
  const clipProperties = ['--nh-cover-top', '--nh-cover-right', '--nh-cover-bottom', '--nh-cover-left'];
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  let selected, named, previousName, transition, generation = 0;

  function url(value) {
    try {
      const result = new URL(value, location.href);
      if (result.origin !== location.origin) return null;
      result.hash = ''; result.search = '';
      return result.href;
    } catch (_) { return null; }
  }
  function clearRecord() { try { sessionStorage.removeItem(key); } catch (_) {} }
  function reset() {
    generation++;
    if (named) named.style.viewTransitionName = previousName;
    named = undefined;
    root.style.removeProperty('--nh-cover-position');
    for (const property of clipProperties) root.style.removeProperty(property);
  }
  function skip(active) {
    active?.ready?.catch(() => {});
    active?.skipTransition();
  }
  function visible(element) {
    const rect = element.getBoundingClientRect();
    // A useful visible slice is enough; wholly offscreen covers keep normal navigation.
    return Math.min(rect.right, innerWidth) - Math.max(rect.left, 0) >= 24 &&
      Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0) >= 24;
  }
  function fingerprint(value) {
    let hash = 2166136261;
    for (let i = 0; i < value.length; i++) hash = Math.imul(hash ^ value.charCodeAt(i), 16777619);
    return (hash >>> 0).toString(36);
  }
  function cover(frame) {
    if (!frame || !visible(frame)) return null;
    const image = frame.matches('img') ? frame : frame.querySelector('img');
    if (image) {
      // Do not decode, preload, or postpone navigation for a slow/broken cover.
      if (!image.complete || !image.naturalWidth || !image.naturalHeight) return null;
      return {frame, id: 'image:' + image.src, position: getComputedStyle(image).objectPosition};
    }
    const drawing = frame.querySelector('svg.cover-art');
    if (!drawing) return null;
    return {frame, id: 'drawing:' + fingerprint(drawing.outerHTML.replace(/\s+/g, ' ')), position: '50% 50%'};
  }
  function mark(item, active, clip = false) {
    transition = active;
    const current = generation;
    named = item.frame; previousName = named.style.viewTransitionName;
    named.style.viewTransitionName = 'nh-article-cover';
    root.style.setProperty('--nh-cover-position', item.position);
    if (clip) {
      // Clip the overlay, not its image: the moving cover never paints over article text.
      const rect = item.frame.getBoundingClientRect();
      const insets = [Math.max(0, rect.top), Math.max(0, innerWidth - rect.right),
        Math.max(0, innerHeight - rect.bottom), Math.max(0, rect.left)];
      clipProperties.forEach((property, index) => root.style.setProperty(property, `${insets[index]}px`));
    }
    active.ready?.catch(() => {});
    const finish = () => {
      if (generation === current) { reset(); transition = undefined; }
    };
    active.finished.then(finish, finish);
  }

  document.addEventListener('click', event => {
    selected = undefined;
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey ||
        event.shiftKey || event.altKey || preference.matches) return;
    const anchor = event.target.closest?.('a[href]');
    if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return;
    const card = anchor.closest('.story-card');
    const target = url(anchor.href);
    if (!card || !target || !/\/artikel\/[^/]+\/(?:index\.html)?$/.test(new URL(target).pathname)) return;
    const frame = card.querySelector('.story-image');
    if (frame && url(frame.getAttribute('href')) === target) selected = {target, frame};
  });

  window.addEventListener('pageswap', event => {
    reset(); clearRecord();
    const active = event.viewTransition;
    if (!active || preference.matches || event.activation?.navigationType === 'traverse') {
      selected = undefined; skip(active); return;
    }
    const target = url(event.activation?.entry?.url);
    const item = selected && selected.target === target ? cover(selected.frame) : null;
    selected = undefined;
    if (!item) { skip(active); return; }
    try {
      sessionStorage.setItem(key, JSON.stringify({from: url(location.href), to: target,
        id: item.id, position: item.position, time: Date.now()}));
    } catch (_) { skip(active); return; }
    mark(item, active);
  });

  window.addEventListener('pagereveal', event => {
    reset();
    const active = event.viewTransition;
    let record;
    try { record = JSON.parse(sessionStorage.getItem(key)); } catch (_) {}
    clearRecord();
    const activation = window.navigation?.activation;
    if (!active || preference.matches || activation?.navigationType === 'traverse' || !record ||
        record.to !== url(location.href) || !record.from || !url(record.from) ||
        (activation?.from?.url && record.from !== url(activation.from.url)) ||
        !Number.isFinite(record.time) || Date.now() - record.time > 10000 || Date.now() < record.time) {
      skip(active); return;
    }
    const container = document.querySelector('.article-layout > .article-cover');
    const item = cover(container?.querySelector('.story-image, img'));
    if (!item || item.id !== record.id || item.position !== record.position) { skip(active); return; }
    mark(item, active, true);
  });

  preference.addEventListener('change', () => {
    if (preference.matches) { skip(transition); reset(); clearRecord(); selected = undefined; }
  });
})();
