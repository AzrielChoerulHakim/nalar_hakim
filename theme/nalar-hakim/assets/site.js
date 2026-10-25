/* Small, optional enhancements. Reading and navigation do not depend on JS. */
(() => {
  'use strict';

  const root = document.documentElement;
  const toggles = document.querySelectorAll('[data-theme-toggle]');
  toggles.forEach((button) => { button.hidden = false; });

  function applyTheme(theme) {
    const light = theme === 'light';
    root.dataset.theme = light ? 'light' : 'dark';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', light ? '#F5F6F2' : '#18231E');
    toggles.forEach((button) => {
      // The label describes the next action; this is an ordinary action button.
      button.removeAttribute('aria-pressed');
      button.setAttribute('aria-label', light ? 'Aktifkan mode gelap' : 'Aktifkan mode terang');
      button.textContent = light ? 'Gelap' : 'Terang';
    });
  }

  let savedTheme = 'light';
  try {
    savedTheme = localStorage.getItem('nalar-hakim-theme') === 'dark' ? 'dark' : 'light';
  } catch (_) { /* Storage may be disabled. The theme remains usable. */ }
  applyTheme(savedTheme);

  toggles.forEach((button) => {
    button.addEventListener('click', () => {
      const next = root.dataset.theme === 'light' ? 'dark' : 'light';
      applyTheme(next);
      try { localStorage.setItem('nalar-hakim-theme', next); } catch (_) { /* Optional preference. */ }
    });
  });

  // A new article can open with its category outside the compact navigation.
  // Move only that horizontal strip; leave restored or user-chosen positions alone.
  function revealCurrentCategory() {
    const navigationType = window.performance?.getEntriesByType?.('navigation')[0]?.type;
    if (navigationType === 'back_forward' || navigationType === 'reload') return;
    const strip = document.querySelector('.publication-nav .container');
    const current = strip?.querySelector('[aria-current="page"]');
    if (!current || strip.scrollLeft !== 0) return;
    const maximum = strip.scrollWidth - strip.clientWidth;
    if (maximum <= 0) return;
    const stripBox = strip.getBoundingClientRect();
    const currentBox = current.getBoundingClientRect();
    const left = stripBox.left + strip.clientLeft;
    const right = left + strip.clientWidth;
    if (currentBox.left >= left && currentBox.right <= right) return;
    const delta = currentBox.width > strip.clientWidth || currentBox.left < left
      ? currentBox.left - left : currentBox.right - right;
    strip.scrollLeft = Math.max(0, Math.min(maximum, strip.scrollLeft + delta));
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', revealCurrentCategory, { once: true });
  } else {
    revealCurrentCategory();
  }

  document.querySelectorAll('[data-copy-address]').forEach((button) => {
    button.hidden = false;
    button.addEventListener('click', async () => {
      const scope = button.closest('.donation-network') || button.closest('.donation');
      const status = scope?.querySelector('[data-copy-status]');
      const network = button.getAttribute('data-copy-network') || 'Ethereum Mainnet';
      const address = button.getAttribute('data-copy-address') || '';
      if (!status) return;
      status.textContent = '';
      if (!/^0x[0-9a-fA-F]{40}$/.test(address)) {
        status.textContent = 'Alamat tidak dapat disalin. Hubungi redaksi.';
        return;
      }
      button.disabled = true;
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(address);
        status.textContent = `Alamat ${network} disalin.`;
      } catch (_) {
        status.textContent = 'Salin otomatis tidak tersedia. Pilih alamat di atas lalu salin secara manual.';
      } finally {
        button.disabled = false;
      }
    });
  });

  document.querySelectorAll('[data-copy-email]').forEach((button) => {
    button.hidden = false;
    button.addEventListener('click', async () => {
      const status = button.closest('.submission-contact')?.querySelector('[data-email-status]');
      if (!status) return;
      button.disabled = true;
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(button.getAttribute('data-copy-email') || '');
        status.textContent = 'Alamat email disalin.';
      } catch (_) {
        status.textContent = 'Pilih alamat email di atas lalu salin secara manual.';
      } finally { button.disabled = false; }
    });
  });

  document.querySelectorAll('[data-copy-url]').forEach((button) => {
    button.hidden = false;
    button.addEventListener('click', async () => {
      const status = button.closest('.share-row')?.querySelector('[data-share-status]');
      if (!status) return;
      button.disabled = true;
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(button.getAttribute('data-copy-url') || location.href);
        status.textContent = 'Tautan disalin.';
      } catch (_) {
        status.textContent = 'Salin alamat halaman dari bilah alamat peramban.';
      } finally { button.disabled = false; }
    });
  });
})();
