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
  const media = events({matches: capable});
  const intersections = [];
  class IntersectionObserver {
    constructor(callback) {this.callback = callback; this.disconnected = false; intersections.push(this);}
    observe(element) {assert.equal(element, section);}
    disconnect() {this.disconnected = true;}
  }
  const document = events({
    hidden: false,
    querySelector(selector) {assert.equal(selector, '[data-idea-flow]'); return sectionPresent ? section : null;},
    createElement() {throw Error('Automatic motion must not create a control');}
  });
  const window = events({IntersectionObserver: observers ? IntersectionObserver : undefined});
  let query;
  vm.runInNewContext(source, {document, window, IntersectionObserver, matchMedia(value) {query = value; return media;}});
  return {section, media, intersections, document, window,
    get query() {return query;},
    intersect(value, index = intersections.length - 1) {intersections[index].callback([{target: section, isIntersecting: value}]);},
    capability(value) {media.matches = value; media.emit('change');},
    visibility(value) {document.hidden = value; document.emit('visibilitychange');}
  };
}
let passed = 0;
function test(name, run) {run(); passed++; console.log(`PASS ${name}`);}
test('Signals run automatically in view without a pause control or MutationObserver', () => {
  const h = harness(); assert.equal(h.section.dataset.flowState, 'paused');
  h.intersect(true); assert.equal(h.section.dataset.flowState, 'running');
  h.intersect(false); assert.equal(h.section.dataset.flowState, 'paused');
});
test('Hidden tab freezes signals and resumes only while section is in view', () => {
  const h = harness(); h.intersect(true); h.visibility(true); assert.equal(h.section.dataset.flowState, 'paused');
  h.visibility(false); assert.equal(h.section.dataset.flowState, 'running');
  h.intersect(false); h.visibility(true); h.visibility(false); assert.equal(h.section.dataset.flowState, 'paused');
});
test('Compact, touch and reduced-motion capability excludes active setup', () => {
  const h = harness({capable:false}); assert.equal(h.intersections.length, 0); assert.equal(h.section.dataset.flowState, 'static');
  for (const phrase of ['min-width: 1024px','hover: hover','pointer: fine','prefers-reduced-motion: no-preference']) assert.ok(h.query.includes(phrase));
});
test('Capability changes disconnect observers and ignore stale callbacks', () => {
  const h = harness(); h.intersect(true); h.capability(false);
  assert.equal(h.intersections[0].disconnected, true);
  h.intersect(true, 0); assert.equal(h.section.dataset.flowState, 'static');
  h.capability(true); assert.equal(h.section.dataset.flowState, 'paused');
  h.intersect(true, 0); assert.equal(h.section.dataset.flowState, 'paused');
  h.intersect(true); assert.equal(h.section.dataset.flowState, 'running');
});
test('Pagehide disposes and pageshow resumes after fresh intersection', () => {
  const h = harness(); h.intersect(true); h.window.emit('pagehide');
  assert.equal(h.section.dataset.flowState, 'static'); assert.equal(h.intersections[0].disconnected, true);
  h.visibility(false); h.intersect(true, 0); assert.equal(h.section.dataset.flowState, 'static');
  h.window.emit('pageshow'); assert.equal(h.section.dataset.flowState, 'paused');
  h.intersect(true); assert.equal(h.section.dataset.flowState, 'running');
});
test('Empty or unrelated observer batches leave current flow intact', () => {
  const h = harness(); h.intersect(true);
  h.intersections[0].callback([]);
  h.intersections[0].callback([{target:{},isIntersecting:false}]);
  assert.equal(h.section.dataset.flowState, 'running');
});
for (const [name, options] of [['Missing observer', {observers:false}], ['Other page', {sectionPresent:false}]]) {
  test(`${name} keeps static fallback`, () => {const h = harness(options); assert.equal(h.intersections.length, 0); assert.equal(h.section.dataset.flowState, 'static');});
}
console.log(`${passed} idea-flow lifecycle checks passed.`);
