#!/usr/bin/env node
'use strict';

// Lifecycle regression tests for automatic ambient motion, without a browser.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../preview/nature-scene.js'), 'utf8');
function events(properties = {}) {
  const listeners = new Map();
  return Object.assign(properties, {
    addEventListener(name, callback) {const list = listeners.get(name) || []; list.push(callback); listeners.set(name, list);},
    emit(name) {for (const callback of listeners.get(name) || []) callback();},
    listenerCount() {return [...listeners.values()].reduce((n, list) => n + list.length, 0);}
  });
}
function harness({capable = true, hasScene = true, hasObserver = true} = {}) {
  const scene = {dataset: {motion: 'static'}};
  const preference = events({matches: capable});
  const intersections = [];
  class IntersectionObserver {
    constructor(callback) {this.callback = callback; this.disconnected = false; intersections.push(this);}
    observe(element) {assert.equal(element, scene);}
    disconnect() {this.disconnected = true;}
  }
  const document = events({
    hidden: false,
    querySelector(selector) {assert.equal(selector, '[data-nature-scene]'); return hasScene ? scene : null;},
    createElement() {throw Error('Automatic motion must not create a control');}
  });
  let query;
  const window = events({
    IntersectionObserver: hasObserver ? IntersectionObserver : undefined,
    matchMedia(value) {query = value; return preference;}
  });
  vm.runInNewContext(source, {document, window, IntersectionObserver});
  return {scene, preference, intersections, document, window,
    get query() {return query;},
    intersect(value, index = intersections.length - 1) {intersections[index].callback([{target: scene, isIntersecting: value}]);},
    capability(value) {preference.matches = value; preference.emit('change');},
    visibility(value) {document.hidden = value; document.emit('visibilitychange');}
  };
}
let passed = 0;
function test(name, run) {run(); passed++; console.log(`PASS ${name}`);}
test('Desktop runs automatically in view with no pause-control dependency', () => {
  const h = harness(); assert.equal(h.intersections.length, 1); assert.equal(h.scene.dataset.motion, 'paused');
  h.intersect(true); assert.equal(h.scene.dataset.motion, 'running');
  h.intersect(false); assert.equal(h.scene.dataset.motion, 'paused');
  h.intersect(true); assert.equal(h.scene.dataset.motion, 'running');
});
test('Capability requires desktop, fine pointer, hover and reduced-motion opt-in', () => {
  const h = harness();
  for (const clause of ['min-width: 1024px','hover: hover','pointer: fine','prefers-reduced-motion: no-preference']) assert.ok(h.query.includes(clause));
});
test('Hidden tab stops motion and visible tab resumes only while scene is in view', () => {
  const h = harness(); h.intersect(true); h.visibility(true); assert.equal(h.scene.dataset.motion, 'paused');
  h.visibility(false); assert.equal(h.scene.dataset.motion, 'running');
  h.intersect(false); h.visibility(true); h.visibility(false); assert.equal(h.scene.dataset.motion, 'paused');
});
test('Compact, touch or reduced-motion state stays static without an observer', () => {
  const h = harness({capable:false}); assert.equal(h.intersections.length, 0); assert.equal(h.scene.dataset.motion, 'static');
  h.visibility(true); h.visibility(false); assert.equal(h.scene.dataset.motion, 'static');
});
test('Capability changes disconnect observers and ignore obsolete callbacks', () => {
  const h = harness(); h.intersect(true); h.capability(false);
  assert.equal(h.intersections[0].disconnected, true); assert.equal(h.scene.dataset.motion, 'static');
  h.intersect(true, 0); assert.equal(h.scene.dataset.motion, 'static');
  h.capability(true); assert.equal(h.scene.dataset.motion, 'paused');
  h.intersect(true, 0); assert.equal(h.scene.dataset.motion, 'paused');
  h.intersect(true); assert.equal(h.scene.dataset.motion, 'running');
});
test('Pagehide disposes and pageshow waits for a fresh visibility observation', () => {
  const h = harness(); h.intersect(true); h.window.emit('pagehide');
  assert.equal(h.scene.dataset.motion, 'static'); assert.equal(h.intersections[0].disconnected, true);
  h.visibility(false); h.intersect(true, 0); assert.equal(h.scene.dataset.motion, 'static');
  h.window.emit('pageshow'); assert.equal(h.scene.dataset.motion, 'paused');
  h.intersect(true); assert.equal(h.scene.dataset.motion, 'running');
});
test('Empty or unrelated intersection batches leave the current scene state intact', () => {
  const h = harness(); h.intersect(true);
  h.intersections[0].callback([]);
  h.intersections[0].callback([{target:{},isIntersecting:false}]);
  assert.equal(h.scene.dataset.motion, 'running');
});
for (const [name, options] of [['No illustration', {hasScene:false}], ['No IntersectionObserver', {hasObserver:false}]]) {
  test(`${name} keeps static content and registers no lifecycle work`, () => {
    const h = harness(options); assert.equal(h.scene.dataset.motion, 'static'); assert.equal(h.intersections.length, 0);
    assert.equal(h.document.listenerCount() + h.window.listenerCount(), 0);
  });
}
console.log(`${passed} nature-motion lifecycle checks passed.`);
