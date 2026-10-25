#!/usr/bin/env node
'use strict';

// Lifecycle regression tests for the ambient scene. No browser or dependencies.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../preview/nature-scene.js'), 'utf8');

function eventTarget(properties = {}) {
  const listeners = new Map();
  return Object.assign(properties, {
    addEventListener(name, callback) {
      const callbacks = listeners.get(name) || [];
      callbacks.push(callback);
      listeners.set(name, callbacks);
    },
    emit(name) { for (const callback of listeners.get(name) || []) callback({type: name}); },
    listenerCount() { return [...listeners.values()].reduce((n, callbacks) => n + callbacks.length, 0); }
  });
}

function setup({capable = true, hasScene = true, hasToggle = true, hasObserver = true} = {}) {
  const label = {textContent: 'Jeda gerak'};
  const icon = {textContent: 'Ⅱ'};
  const attributes = {};
  const toggle = eventTarget({
    hidden: true,
    setAttribute(name, value) { attributes[name] = value; },
    querySelector(selector) {
      if (selector === '[data-nature-label]') return label;
      if (selector === '[aria-hidden]') return icon;
      throw new Error(`Unexpected toggle selector: ${selector}`);
    }
  });
  const scene = {
    dataset: {motion: 'static'},
    querySelector(selector) {
      assert.equal(selector, '[data-nature-toggle]');
      return hasToggle ? toggle : null;
    }
  };
  const preference = eventTarget({matches: capable});
  let callback;
  let observed = false;
  let mediaQuery;
  class Observer {
    constructor(listener) { callback = listener; }
    observe(element) { assert.equal(element, scene); observed = true; }
  }
  const document = eventTarget({
    hidden: false,
    querySelector(selector) {
      assert.equal(selector, '[data-nature-scene]');
      return hasScene ? scene : null;
    }
  });
  const window = eventTarget({
    IntersectionObserver: hasObserver ? Observer : undefined,
    matchMedia(query) { mediaQuery = query; return preference; }
  });
  vm.runInNewContext(source, {document, window, IntersectionObserver: hasObserver ? Observer : undefined});
  return {
    scene, toggle, label, icon, attributes, preference, document, window,
    get observed() { return observed; },
    get mediaQuery() { return mediaQuery; },
    intersect(value) { assert.ok(callback); callback([{target: scene, isIntersecting: value}]); },
    capability(value) { preference.matches = value; preference.emit('change'); },
    visibility(hidden) { document.hidden = hidden; document.emit('visibilitychange'); }
  };
}

let passed = 0;
function test(name, run) {
  run(); passed++;
  console.log(`PASS ${name}`);
}

test('Desktop starts paused until intersection is known, then stops offscreen', () => {
  const h = setup();
  assert.equal(h.observed, true);
  assert.equal(h.scene.dataset.motion, 'paused');
  assert.equal(h.toggle.hidden, false);
  h.intersect(true); assert.equal(h.scene.dataset.motion, 'running');
  h.intersect(false); assert.equal(h.scene.dataset.motion, 'paused');
  h.intersect(true); assert.equal(h.scene.dataset.motion, 'running');
});

test('Capability query requires wide fine-pointer desktop and reduced-motion opt-in', () => {
  const {mediaQuery} = setup();
  for (const clause of ['min-width: 1024px', 'hover: hover', 'pointer: fine', 'prefers-reduced-motion: no-preference']) {
    assert.ok(mediaQuery.includes(clause), `Missing capability condition ${clause}`);
  }
});

test('User pause survives scrolling out and back; resume updates accessible control', () => {
  const h = setup(); h.intersect(true); h.toggle.emit('click');
  assert.equal(h.scene.dataset.motion, 'paused');
  assert.equal(h.attributes['aria-pressed'], 'true');
  assert.equal(h.attributes['aria-label'], 'Lanjutkan animasi alam');
  assert.equal(h.label.textContent, 'Lanjutkan gerak');
  h.intersect(false); h.intersect(true); assert.equal(h.scene.dataset.motion, 'paused');
  h.toggle.emit('click'); assert.equal(h.scene.dataset.motion, 'running');
  assert.equal(h.attributes['aria-pressed'], 'false');
  assert.equal(h.attributes['aria-label'], 'Jeda animasi alam');
  assert.equal(h.label.textContent, 'Jeda gerak');
});

test('Hidden tab pauses automatically without overriding explicit user pause', () => {
  const h = setup(); h.intersect(true);
  h.visibility(true); assert.equal(h.scene.dataset.motion, 'paused');
  h.visibility(false); assert.equal(h.scene.dataset.motion, 'running');
  h.toggle.emit('click'); h.visibility(true); h.visibility(false);
  assert.equal(h.scene.dataset.motion, 'paused');
  assert.equal(h.attributes['aria-pressed'], 'true');
});

test('Compact, touch, or reduced-motion initial state stays static with no pause control', () => {
  const h = setup({capable: false});
  assert.equal(h.scene.dataset.motion, 'static');
  assert.equal(h.toggle.hidden, true);
  h.intersect(true); assert.equal(h.scene.dataset.motion, 'static');
  h.visibility(true); h.visibility(false); assert.equal(h.scene.dataset.motion, 'static');
});

test('Live capability changes preserve user intent and restore eligible animation', () => {
  const h = setup(); h.intersect(true);
  h.capability(false); assert.equal(h.scene.dataset.motion, 'static'); assert.equal(h.toggle.hidden, true);
  h.capability(true); assert.equal(h.scene.dataset.motion, 'running'); assert.equal(h.toggle.hidden, false);
  h.toggle.emit('click'); h.capability(false); h.capability(true);
  assert.equal(h.scene.dataset.motion, 'paused'); assert.equal(h.attributes['aria-pressed'], 'true');
});

test('Pagehide/pageshow suspend and restore without losing explicit pause', () => {
  const h = setup(); h.intersect(true);
  h.window.emit('pagehide'); assert.equal(h.scene.dataset.motion, 'paused');
  h.visibility(false); assert.equal(h.scene.dataset.motion, 'paused');
  h.window.emit('pageshow'); assert.equal(h.scene.dataset.motion, 'running');
  h.toggle.emit('click'); h.window.emit('pagehide'); h.window.emit('pageshow');
  assert.equal(h.scene.dataset.motion, 'paused');
});

for (const [name, options] of [
  ['No illustration on article pages', {hasScene: false}],
  ['No usable animation control', {hasToggle: false}],
  ['IntersectionObserver unavailable', {hasObserver: false}]
]) {
  test(`${name}: leave static content intact`, () => {
    const h = setup(options);
    assert.equal(h.scene.dataset.motion, 'static');
    assert.equal(h.toggle.hidden, true);
    assert.equal(h.observed, false);
    assert.equal(h.document.listenerCount() + h.window.listenerCount() + h.toggle.listenerCount(), 0);
  });
}
console.log(`${passed} nature-motion lifecycle checks passed.`);
