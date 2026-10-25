/* Load the travelling butterfly only on motion-capable desktops. */
(() => {
  const source = document.currentScript?.dataset.butterflySrc;
  const capable = matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  let loaded = false;
  function load() {
    if (!capable.matches || loaded || !source) return;
    loaded = true;
    const script = document.createElement('script');
    script.src = source;
    script.onerror = () => { loaded = false; script.remove(); };
    document.head.append(script);
  }
  capable.addEventListener('change', load);
  load();
})();
