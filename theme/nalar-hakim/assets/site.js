/* Small, optional enhancements. Reading and navigation do not depend on JS. */
(() => {
  'use strict';

  const root = document.documentElement;
  const toggles = document.querySelectorAll('[data-theme-toggle]');
  toggles.forEach((button) => { button.hidden = false; });

  function applyTheme(theme) {
    const light = theme === 'light';
    root.dataset.theme = light ? 'light' : 'dark';
    toggles.forEach((button) => {
      button.setAttribute('aria-pressed', String(light));
      button.setAttribute('aria-label', light ? 'Aktifkan mode gelap' : 'Aktifkan mode terang');
      button.textContent = light ? 'Gelap' : 'Terang';
    });
  }

  let savedTheme = 'dark';
  try {
    savedTheme = localStorage.getItem('nalar-hakim-theme') || 'dark';
  } catch (_) { /* Storage may be disabled. The theme remains usable. */ }
  applyTheme(savedTheme);

  toggles.forEach((button) => {
    button.addEventListener('click', () => {
      const next = root.dataset.theme === 'light' ? 'dark' : 'light';
      applyTheme(next);
      try { localStorage.setItem('nalar-hakim-theme', next); } catch (_) { /* Optional preference. */ }
    });
  });

  document.querySelectorAll('[data-copy-address]').forEach((button) => {
    button.hidden = false;
    button.addEventListener('click', async () => {
      const donation = button.closest('.donation');
      const status = donation?.querySelector('[data-copy-status]');
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
        status.textContent = 'Alamat disalin. Jaringan: Ethereum Mainnet.';
      } catch (_) {
        status.textContent = 'Salin otomatis tidak tersedia. Pilih alamat di atas lalu salin secara manual.';
      } finally {
        button.disabled = false;
      }
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
