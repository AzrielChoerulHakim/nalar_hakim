/* Optional cover continuity across ordinary document navigations. No router or waits. */
(() => {
  'use strict';
  if (window.__nhCoverTransitions || !('onpageswap' in window) ||
      !('onpagereveal' in window) || !window.CSS?.supports('view-transition-name', 'nh-article-cover')) return;
  window.__nhCoverTransitions = true;

  const key = 'nh-cover-transition-v2';
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  let selected, transition, generation = 0;
  let names = [], styles = [];

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
    for (const {node, value} of names) node.style.viewTransitionName = value;
    for (const {node, property, value} of styles) node.style[property] = value;
    for (const {node, hadStyle} of names) if (!hadStyle && !node.getAttribute('style')) node.removeAttribute('style');
    names = []; styles = [];
    root.style.removeProperty('--nh-cover-position');
    root.style.removeProperty('--nh-cover-reading-inset');
    root.style.removeProperty('--nh-cover-type-keyline');
  }
  function skip(active) {
    active?.ready?.catch(() => {});
    active?.skipTransition();
  }
  function visible(rect) {
    // A useful visible slice is enough; wholly offscreen covers keep native navigation.
    return Math.min(rect.right, innerWidth) - Math.max(rect.left, 0) >= 24 &&
      Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0) >= 24;
  }
  function fingerprint(value) {
    let hash = 2166136261;
    for (let i = 0; i < value.length; i++) hash = Math.imul(hash ^ value.charCodeAt(i), 16777619);
    return (hash >>> 0).toString(36);
  }
  function cover(frame) {
    if (!frame || !visible(frame.getBoundingClientRect())) return null;
    const image = frame.matches('img') ? frame : frame.querySelector('img');
    if (image) {
      // Never decode, preload, or postpone navigation for a slow/broken cover.
      if (!image.complete || !image.naturalWidth || !image.naturalHeight) return null;
      const rect = image.getBoundingClientRect();
      if (!visible(rect)) return null;
      return {node:image, kind:'image', id:'image:' + (image.currentSrc || image.src),
        position:getComputedStyle(image).objectPosition};
    }
    const drawing = frame.querySelector('svg.cover-art');
    if (!drawing) return null;
    const viewBox = drawing.getAttribute('viewBox')?.trim().split(/[\s,]+/).map(Number);
    const align = drawing.getAttribute('preserveAspectRatio');
    if (!viewBox || viewBox.length !== 4 || !viewBox.every(Number.isFinite) ||
        viewBox[2] <= 0 || viewBox[3] <= 0 || (align && align !== 'xMidYMid meet')) return null;
    const rect = drawing.getBoundingClientRect();
    const ratio = Math.min(rect.width / viewBox[2], rect.height / viewBox[3]);
    const width = viewBox[2] * ratio, height = viewBox[3] * ratio;
    const painted = {left:rect.left + (rect.width - width) / 2,
      top:rect.top + (rect.height - height) / 2, width, height};
    painted.right = painted.left + width; painted.bottom = painted.top + height;
    if (!visible(painted) || !drawing.parentElement) return null;
    // The SVG meets its box without cropping. Snapshot its painted bounds, not
    // the wider article frame: a 2:1 drawing then remains 2:1 throughout the move.
    return {node:drawing, kind:'drawing', id:'drawing:' + fingerprint(drawing.outerHTML.replace(/\s+/g, ' ')),
      position:'50% 50%', painted};
  }
  function name(node, value) {
    if (!node) return;
    names.push({node, value:node.style.viewTransitionName, hadStyle:node.hasAttribute('style')});
    node.style.viewTransitionName = value;
  }
  function normalizeDrawing(item) {
    if (!item.painted) return;
    const parent = item.node.parentElement.getBoundingClientRect();
    const values = {left:item.painted.left - parent.left + 'px', top:item.painted.top - parent.top + 'px',
      width:item.painted.width + 'px', height:item.painted.height + 'px', right:'auto', bottom:'auto'};
    for (const [property, value] of Object.entries(values)) {
      styles.push({node:item.node, property, value:item.node.style[property]});
      item.node.style[property] = value;
    }
  }
  function mark(item, active, incoming = false) {
    transition = active;
    const current = generation;
    name(item.node, 'nh-article-cover');
    normalizeDrawing(item);
    root.style.setProperty('--nh-cover-position', item.position);
    if (incoming) {
      // A one-pixel paper keyline keeps small header text legible where the
      // moving illustration passes behind it. No blur, filter or layout change.
      root.style.setProperty('--nh-cover-type-keyline', '1px 0 0 var(--bg), -1px 0 0 var(--bg), 0 1px 0 var(--bg), 0 -1px 0 var(--bg)');
      // The heading stays opaque, static and above the moving graphic. It is
      // named only on this incoming article, never on ordinary menu navigation.
      name(document.querySelector('.article-layout > .article-header'), 'nh-article-heading');
      // Protect caption/prose/footnotes, rather than clipping away the entire
      // journey above the destination cover (which looked like a mere fade-in).
      const reading = [...document.querySelectorAll('.article-layout > .article-cover > figcaption, .article-layout > .article-content')]
        .map(node => node.getBoundingClientRect().top).filter(Number.isFinite);
      const boundary = Math.max(0, Math.min(innerHeight, ...reading));
      root.style.setProperty('--nh-cover-reading-inset', innerHeight - boundary + 'px');
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
      sessionStorage.setItem(key, JSON.stringify({from:url(location.href), to:target,
        id:item.id, kind:item.kind, position:item.position, time:Date.now()}));
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
    if (!item || item.id !== record.id || item.kind !== record.kind || item.position !== record.position) { skip(active); return; }
    mark(item, active, true);
  });

  preference.addEventListener('change', () => {
    if (preference.matches) { skip(transition); reset(); clearRecord(); selected = undefined; }
  });
})();
