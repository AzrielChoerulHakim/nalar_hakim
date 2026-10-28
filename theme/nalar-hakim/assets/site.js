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

  // Static pages already contain SVG icons. Apply the same treatment to links
  // produced by the article admin or legacy theme, without altering prose.
  function decorateNavigation() {
    if (!document.createTreeWalker || !document.createElementNS) return;
    const arrows = {
      '→': ['right', 'M5 12h14M12 5l7 7-7 7'],
      '←': ['left', 'M19 12H5M12 5l-7 7 7 7'],
      '↑': ['up', 'M12 19V5M5 12l7-7 7 7'],
      '↓': ['down', 'M12 5v14M5 12l7 7 7-7'],
      '↗': ['up-right', 'M6 18 18 6M6 6h12v12'],
      '↘': ['down-right', 'M6 6l12 12M6 18h12V6'],
      '↙': ['down-left', 'M18 6 6 18M18 18H6V6'],
      '↖': ['up-left', 'M18 18 6 6M18 6H6v12']
    };
    const candidates = new Set();
    document.querySelectorAll('a,button,summary,.rail-arrow,.format-arrow,.eyebrow,.landing-section-top > [aria-hidden]').forEach((scope) => {
      const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
      for (let text = walker.nextNode(); text; text = walker.nextNode()) {
        const parent = text.parentElement;
        if (!/[→←↑↓↗↘↙↖]/.test(text.data) || !parent || parent.closest('svg,script,style,pre,code,textarea,math,template')) continue;
        if (parent.closest('.article-content,.admin-prose') && !parent.closest('.article-references .reference-return,.article-references [aria-hidden]')) continue;
        if (parent.closest('h1,h2,h3,h4,h5,h6') && !parent.closest('[aria-hidden="true"]')) continue;
        candidates.add(text);
      }
    });
    for (const text of candidates) {
      const fragment = document.createDocumentFragment();
      for (const part of text.data.split(/([→←↑↓↗↘↙↖])/)) {
        if (!Object.hasOwn(arrows, part)) { fragment.append(document.createTextNode(part)); continue; }
        const [direction, pathData] = arrows[part];
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const attributes = {class:`nh-icon nh-icon-${direction}`,viewBox:'0 0 24 24',width:'20',height:'20',fill:'none',stroke:'currentColor','stroke-width':'1.6','stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true',focusable:'false'};
        Object.entries(attributes).forEach(([key, value]) => svg.setAttribute(key, value));
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData); svg.append(path); fragment.append(svg);
      }
      text.replaceWith(fragment);
    }
  }
  decorateNavigation();

  // Format guards for the three donation address types; not on-chain verification.
  const addressPatterns = {
    bitcoin: /^bc1p[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{58}$/,
    evm: /^0x[0-9a-fA-F]{40}$/,
    solana: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/
  };
  document.querySelectorAll('[data-copy-address]').forEach((button) => {
    button.hidden = false;
    button.addEventListener('click', async () => {
      const scope = button.closest('.donation-network') || button.closest('.donation');
      const status = scope?.querySelector('[data-copy-status]');
      const network = button.getAttribute('data-copy-network') || 'Ethereum Mainnet';
      const address = button.getAttribute('data-copy-address') || '';
      const addressType = button.getAttribute('data-copy-type') || 'evm';
      if (!status) return;
      status.textContent = '';
      if (!Object.hasOwn(addressPatterns, addressType) || !addressPatterns[addressType].test(address)) {
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
