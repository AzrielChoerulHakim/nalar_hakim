#!/usr/bin/env node
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../preview/idea-flow.js'), 'utf8');
function events(properties = {}) {
  const listeners = new Map();
  return Object.assign(properties, {
    addEventListener(name, callback) {const list = listeners.get(name) || []; list.push(callback); listeners.set(name, list);},
    emit(name) {for (const callback of listeners.get(name) || []) callback();}
  });
}
function harness({capable = true, observers = true, sectionPresent = true} = {}) {
  const section = {dataset: {flowState: 'static'}};
  let pressed = false;
  const toggle = {getAttribute() {return String(pressed);}};
  const media = events({matches: capable});
  const intersections = [], mutations = [];
  class IntersectionObserver {
    constructor(callback) {this.callback = callback; this.disconnected = false; intersections.push(this);}
    observe(element) {assert.equal(element, section);}
    disconnect() {this.disconnected = true;}
  }
  class MutationObserver {
    constructor(callback) {this.callback = callback; this.disconnected = false; mutations.push(this);}
    observe(element, options) {assert.equal(element, toggle); assert.deepEqual([...options.attributeFilter], ['aria-pressed']);}
    disconnect() {this.disconnected = true;}
  }
  const document = events({hidden: false, querySelector(selector) {return selector === '[data-idea-flow]' ? (sectionPresent ? section : null) : toggle;}});
  const window = events({IntersectionObserver: observers ? IntersectionObserver : undefined, MutationObserver: observers ? MutationObserver : undefined});
  let query;
  vm.runInNewContext(source, {document, window, IntersectionObserver, MutationObserver, matchMedia(value) {query = value; return media;}});
  return {section, media, intersections, mutations, document, window,
    get query() {return query;},
    intersect(value, index = intersections.length - 1) {intersections[index].callback([{target: section, isIntersecting: value}]);},
    pause(value) {pressed = value; mutations.at(-1).callback();},
    capability(value) {media.matches = value; media.emit('change');},
    visibility(value) {document.hidden = value; document.emit('visibilitychange');}
  };
}
let passed = 0;
function test(name, run) {run(); passed++; console.log(`PASS ${name}`);}
test('Waits for viewport then pauses offscreen', () => {
  const h = harness(); assert.equal(h.section.dataset.flowState, 'paused');
  h.intersect(true); assert.equal(h.section.dataset.flowState, 'running');
  h.intersect(false); assert.equal(h.section.dataset.flowState, 'paused');
});
test('Shared pause survives offscreen and visibility changes', () => {
  const h = harness(); h.intersect(true); h.pause(true); h.intersect(false); h.intersect(true);
  h.visibility(true); h.visibility(false); assert.equal(h.section.dataset.flowState, 'paused');
  h.pause(false); assert.equal(h.section.dataset.flowState, 'running');
});
test('Hidden tab freezes signals and returns to visible state', () => {
  const h = harness(); h.intersect(true); h.visibility(true); assert.equal(h.section.dataset.flowState, 'paused');
  h.visibility(false); assert.equal(h.section.dataset.flowState, 'running');
});
test('Compact, touch and reduced-motion capability excludes active setup', () => {
  const h = harness({capable: false}); assert.equal(h.intersections.length, 0); assert.equal(h.section.dataset.flowState, 'static');
  for (const phrase of ['min-width: 1024px','hover: hover','pointer: fine','prefers-reduced-motion: no-preference']) assert.ok(h.query.includes(phrase));
});
test('Capability changes disconnect observers and ignore stale callbacks', () => {
  const h = harness(); h.intersect(true); h.capability(false);
  assert.equal(h.intersections[0].disconnected, true); assert.equal(h.mutations[0].disconnected, true);
  h.intersect(true, 0); assert.equal(h.section.dataset.flowState, 'static');
  h.capability(true); assert.equal(h.section.dataset.flowState, 'paused');
  h.intersect(true, 0); assert.equal(h.section.dataset.flowState, 'paused');
  h.intersect(true); assert.equal(h.section.dataset.flowState, 'running');
});
test('Pagehide disposes and pageshow re-observes without losing pause', () => {
  const h = harness(); h.intersect(true); h.pause(true); h.window.emit('pagehide');
  assert.equal(h.section.dataset.flowState, 'static'); assert.equal(h.intersections[0].disconnected, true);
  h.intersect(true, 0); assert.equal(h.section.dataset.flowState, 'static');
  h.window.emit('pageshow'); h.intersect(true); assert.equal(h.section.dataset.flowState, 'paused');
  h.pause(false); assert.equal(h.section.dataset.flowState, 'running');
});
for (const [name, options] of [['Missing observers', {observers: false}], ['Other page', {sectionPresent: false}]]) {
  test(`${name} keeps static fallback`, () => {const h = harness(options); assert.equal(h.intersections.length, 0); assert.equal(h.section.dataset.flowState, 'static');});
}
console.log(`${passed} idea-flow lifecycle checks passed.`);
