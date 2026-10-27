#!/usr/bin/env node
'use strict';
// Contract checks for optional cross-document covers; no browser APIs are polyfilled on the site.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(path.join(__dirname, '../preview/article-transitions.js'), 'utf8');
function target(properties = {}) {
  const events = new Map();
  return Object.assign(properties, {
    addEventListener(type, callback) { if (!events.has(type)) events.set(type, []); events.get(type).push(callback); },
    emit(type, value) { for (const callback of events.get(type) || []) callback(value); },
    get listeners() { return [...events.values()].reduce((sum, list) => sum + list.length, 0); }
  });
}
function style() { return {viewTransitionName: '', setProperty(key, value) { this[key] = value; }, removeProperty(key) { delete this[key]; }}; }
const articleURL = 'https://nalarhakim.test/artikel/contoh/';
function frame({image = false, ready = true, visible = true, id = 'same', detail = false} = {}) {
  const imageNode = {complete: ready, naturalWidth: ready ? 1600 : 0, naturalHeight: ready ? 1000 : 0,
    src: 'https://nalarhakim.test/media/' + id + '.webp'};
  const node = {
    style: style(),
    matches(selector) { return detail && image && selector === 'img'; },
    querySelector(selector) { return selector === 'img' ? (image ? imageNode : null) : selector === 'svg.cover-art' && !image ? {outerHTML: '<svg class="cover-art">' + id + '</svg>'} : null; },
    getBoundingClientRect() { return {left: 30, right: 330, top: visible ? 150 : 1000, bottom: visible ? 330 : 1180, width: 300, height: 180}; },
    getAttribute(name) { return name === 'href' ? articleURL : null; }
  };
  return detail && image ? Object.assign(node, imageNode) : node;
}
function harness({supported = true, article = false, storage = new Map(), blocked = false,
  image = false, ready = true, visible = true, id = 'same', reduced = false, navigationType = 'push', from} = {}) {
  const preference = target({matches: reduced});
  const graphic = frame({image, ready, visible, id, detail: article});
  const articleContainer = {querySelector() { return graphic; }};
  const document = target({documentElement: {style: style()}, querySelector(selector) {
    assert.equal(selector, '.article-layout > .article-cover'); return article ? articleContainer : null;
  }});
  const window = target({CSS: {supports: () => true}, navigation: {activation: {navigationType, from: from ? {url: from} : undefined}}});
  if (supported) { window.onpageswap = null; window.onpagereveal = null; }
  const location = {href: article ? articleURL : 'https://nalarhakim.test/beranda.html', origin: 'https://nalarhakim.test'};
  const sessionStorage = {setItem(key, value) { if (blocked) throw Error('blocked'); storage.set(key, value); },
    getItem(key) { if (blocked) throw Error('blocked'); return storage.get(key) || null; },
    removeItem(key) { if (blocked) throw Error('blocked'); storage.delete(key); }};
  const context = {window, document, location, sessionStorage, matchMedia: () => preference,
    innerHeight: 900, innerWidth: 1200, URL, Date, getComputedStyle: () => ({objectPosition: '50% 50%'})};
  vm.runInNewContext(source, context);
  const card = {querySelector() { return graphic; }};
  const anchor = {href: articleURL, target: '', hasAttribute: () => false, closest: () => card};
  const click = overrides => document.emit('click', {button: 0, defaultPrevented: false,
    target: {closest: () => anchor}, ...overrides});
  return {window, document, graphic, storage, preference, anchor, click,
    swap(active, type = 'push') { window.emit('pageswap', {viewTransition: active, activation: {navigationType: type, entry: {url: articleURL}}}); },
    reveal(active) { window.emit('pagereveal', {viewTransition: active}); },
    rerun() { vm.runInNewContext(source, context); }};
}
function transition() {
  let finish;
  return {skips: 0, ready: Promise.resolve(), finished: new Promise(resolve => { finish = resolve; }),
    skipTransition() { this.skips++; }, finish() { finish(); }};
}
const tests = [];
function test(name, run) { tests.push({name, run}); }
test('Unsupported browsers add no listeners or navigation side effects', () => {
  const h = harness({supported: false}); assert.equal(h.window.listeners, 0); assert.equal(h.document.listeners, 0);
});
test('A card link stays a native navigation and names only its loaded cover', async () => {
  const h = harness(); const active = transition(); h.click();
  assert.equal(h.graphic.style.viewTransitionName, ''); h.swap(active);
  assert.equal(h.graphic.style.viewTransitionName, 'nh-article-cover'); assert.equal(active.skips, 0);
  assert.equal(h.storage.size, 1); active.finish(); await Promise.resolve();
  assert.equal(h.graphic.style.viewTransitionName, '');
});
test('A matching incoming SVG and a loaded admin image both continue the cover', async () => {
  for (const image of [false, true]) {
    const outgoing = harness({image}); outgoing.click(); outgoing.swap(transition());
    const incoming = harness({article: true, image, storage: outgoing.storage, from: 'https://nalarhakim.test/beranda.html'});
    const active = transition(); incoming.reveal(active);
    assert.equal(incoming.graphic.style.viewTransitionName, 'nh-article-cover'); assert.equal(active.skips, 0);
    assert.equal(incoming.storage.size, 0); active.finish(); await Promise.resolve(); assert.equal(incoming.graphic.style.viewTransitionName, '');
  }
});
test('Partial covers animate inside the destination rectangle and clean up every inset', async () => {
  const outgoing = harness();
  outgoing.graphic.getBoundingClientRect = () => ({left: 30, right: 330, top: -50, bottom: 130, width: 300, height: 180});
  outgoing.click(); const before = transition(); outgoing.swap(before);
  assert.equal(before.skips, 0); assert.equal(outgoing.document.documentElement.style['--nh-cover-top'], undefined);
  const incoming = harness({article: true, storage: outgoing.storage});
  incoming.graphic.getBoundingClientRect = () => ({left: 30, right: 330, top: 850, bottom: 1030, width: 300, height: 180});
  const active = transition(); incoming.reveal(active);
  const styles = incoming.document.documentElement.style;
  assert.equal(active.skips, 0); assert.equal(incoming.graphic.style.viewTransitionName, 'nh-article-cover');
  assert.equal(styles['--nh-cover-top'], '850px'); assert.equal(styles['--nh-cover-right'], '870px');
  assert.equal(styles['--nh-cover-bottom'], '0px'); assert.equal(styles['--nh-cover-left'], '30px');
  active.finish(); await Promise.resolve();
  for (const edge of ['top', 'right', 'bottom', 'left']) assert.equal(styles['--nh-cover-' + edge], undefined);
  assert.equal(incoming.graphic.style.viewTransitionName, '');
});
test('Clipping stays within the viewport and reduced motion removes it immediately', () => {
  const outgoing = harness(); outgoing.click(); outgoing.swap(transition());
  const incoming = harness({article: true, storage: outgoing.storage});
  incoming.graphic.getBoundingClientRect = () => ({left: -50, right: 250, top: 150, bottom: 330, width: 300, height: 180});
  const active = transition(); incoming.reveal(active);
  const styles = incoming.document.documentElement.style;
  assert.equal(active.skips, 0); assert.equal(styles['--nh-cover-left'], '0px'); assert.equal(styles['--nh-cover-bottom'], '570px');
  incoming.preference.matches = true; incoming.preference.emit('change'); assert.equal(active.skips, 1);
  for (const edge of ['top', 'right', 'bottom', 'left']) assert.equal(styles['--nh-cover-' + edge], undefined);
});
test('Less than 24 visible pixels in either axis uses normal navigation', () => {
  for (const rect of [
    {left: 30, right: 330, top: 877, bottom: 1057, width: 300, height: 180},
    {left: 1177, right: 1477, top: 150, bottom: 330, width: 300, height: 180}
  ]) {
    const h = harness(); h.graphic.getBoundingClientRect = () => rect; h.click();
    const active = transition(); h.swap(active); assert.equal(active.skips, 1); assert.equal(h.storage.size, 0);
  }
});
test('Modifier clicks, new tabs, downloads and cancelled clicks do not opt in', () => {
  for (const overrides of [{ctrlKey: true}, {metaKey: true}, {shiftKey: true}, {altKey: true}, {button: 1}, {defaultPrevented: true}]) {
    const h = harness(); h.click(overrides); const active = transition(); h.swap(active); assert.equal(active.skips, 1); assert.equal(h.storage.size, 0);
  }
  const tab = harness(); tab.anchor.target = '_blank'; tab.click(); const active = transition(); tab.swap(active); assert.equal(active.skips, 1);
  const download = harness(); download.anchor.hasAttribute = () => true; download.click(); const other = transition(); download.swap(other); assert.equal(other.skips, 1);
});
test('Keyboard activation uses the same native-link path; coverless articles fall back', () => {
  const keyboard = harness(); keyboard.click({detail: 0}); const active = transition(); keyboard.swap(active);
  assert.equal(active.skips, 0); assert.equal(keyboard.graphic.style.viewTransitionName, 'nh-article-cover');
  const noCover = harness(); noCover.anchor.closest = () => ({querySelector: () => null}); noCover.click();
  const missing = transition(); noCover.swap(missing); assert.equal(missing.skips, 1);
  const outgoing = harness(); outgoing.click(); outgoing.swap(transition());
  const incoming = harness({article: true, storage: outgoing.storage}); incoming.document.querySelector = () => null;
  const absent = transition(); incoming.reveal(absent); assert.equal(absent.skips, 1);
});
test('Direct links, reloads and history traversal retain normal rendering', () => {
  const direct = harness({article: true}); const active = transition(); direct.reveal(active); assert.equal(active.skips, 1);
  const outgoing = harness(); outgoing.click(); outgoing.swap(transition());
  const back = harness({article: true, storage: outgoing.storage, navigationType: 'traverse'}); const history = transition(); back.reveal(history); assert.equal(history.skips, 1);
  const stale = harness({article: true}); stale.storage.set('nh-cover-transition-v1', JSON.stringify({to: articleURL, from: 'https://nalarhakim.test/beranda.html', time: Date.now() - 10001})); const reload = transition(); stale.reveal(reload); assert.equal(reload.skips, 1);
});
test('Slow or broken images, offscreen covers and differing graphics skip without waiting', () => {
  for (const options of [{image: true, ready: false}, {visible: false}]) {
    const h = harness(options); h.click(); const active = transition(); h.swap(active); assert.equal(active.skips, 1); assert.equal(h.storage.size, 0);
  }
  for (const options of [{image: true, ready: false}, {visible: false}, {id: 'changed'}]) {
    const outgoing = harness({image: !!options.image}); outgoing.click(); outgoing.swap(transition());
    const incoming = harness({article: true, storage: outgoing.storage, ...options}); const active = transition(); incoming.reveal(active); assert.equal(active.skips, 1);
  }
});
test('Blocked storage and reduced motion immediately fall back', () => {
  for (const options of [{blocked: true}, {reduced: true}]) {
    const h = harness(options); h.click(); const active = transition(); h.swap(active); assert.equal(active.skips, 1); assert.equal(h.graphic.style.viewTransitionName, '');
  }
  const h = harness(); h.click(); const active = transition(); h.swap(active); h.preference.matches = true; h.preference.emit('change');
  assert.equal(active.skips, 1); assert.equal(h.graphic.style.viewTransitionName, '');
});
test('Rapid clicks keep one cover name and setup is idempotent', () => {
  const h = harness(); h.click(); h.click(); const active = transition(); h.swap(active);
  assert.equal(h.graphic.style.viewTransitionName, 'nh-article-cover'); assert.equal(h.storage.size, 1);
  const count = h.window.listeners + h.document.listeners; h.rerun(); assert.equal(h.window.listeners + h.document.listeners, count);
});
(async () => {
  let failures = 0;
  for (const {name, run} of tests) { try { await run(); console.log('PASS', name); } catch (error) { failures++; console.error('FAIL', name, error); } }
  console.log(`${tests.length} cover-transition checks; ${failures} failed.`); process.exitCode = failures ? 1 : 0;
})();
