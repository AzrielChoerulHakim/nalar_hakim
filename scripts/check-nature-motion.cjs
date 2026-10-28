#!/usr/bin/env node
'use strict';
// Finite, explicitly activated weighing: bearings, no entrance, lifecycle cleanup.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../preview/nature-scene.js'), 'utf8');
const markup = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, '../preview/nature-scene.css'), 'utf8');
function events(properties = {}) {
  const listeners = new Map();
  return Object.assign(properties, {
    addEventListener(name, callback) {const list = listeners.get(name) || []; list.push(callback); listeners.set(name, list);},
    emit(name) {for (const callback of listeners.get(name) || []) callback();},
    listenerCount() {return [...listeners.values()].reduce((n, list) => n + list.length, 0);}
  });
}
function harness({reduced = false, hasScene = true, hasObserver = true, hasAnimation = true, hasTrigger = true, throws = false} = {}) {
  const created = [], intersections = [];
  function animated(name) {
    return {animate:hasAnimation ? function(frames, options) {
      if (throws === true || (typeof throws === 'number' && created.length === throws)) throw Error('Animation unavailable');
      let resolve, reject;
      const animation = {name, frames, options, canceled:false,
        finished:new Promise((yes, no) => {resolve=yes; reject=no;}),
        cancel() {this.canceled=true; reject(Error('cancelled'));},
        finish() {resolve();}
      };
      created.push(animation); return animation;
    } : undefined};
  }
  const balance = animated('balance');
  const hangers = [animated('left'), animated('right')];
  const trigger = events({disabled:false, hidden:false, attributes:{'aria-disabled':'true'},
    setAttribute(name,value) {this.attributes[name]=value;}
  });
  const scene = {dataset:{motion:'static'},
    querySelector(selector) {return selector === '[data-scale-balance]' ? balance : selector === '[data-scale-replay]' && hasTrigger ? trigger : undefined;},
    querySelectorAll(selector) {return selector === '[data-scale-hanger]' ? hangers : [];}
  };
  const preference = events({matches:reduced});
  class IntersectionObserver {
    constructor(callback) {this.callback=callback; this.disconnected=false; intersections.push(this);}
    observe(element) {assert.equal(element,scene);}
    disconnect() {this.disconnected=true;}
  }
  const document = events({hidden:false,timeline:{currentTime:120},querySelector(selector) {assert.equal(selector,'[data-scale-scene]'); return hasScene ? scene : null;}});
  let query;
  const window = events({IntersectionObserver:hasObserver ? IntersectionObserver : undefined,matchMedia(value) {query=value; return preference;}});
  const context = {document,window,IntersectionObserver};
  vm.runInNewContext(source, context);
  return {scene,trigger,preference,intersections,document,window,created,
    get query() {return query;},
    get active() {return created.filter(animation => !animation.canceled);},
    intersect(value,index=intersections.length-1) {intersections[index].callback([{target:scene,isIntersecting:value}]);},
    reduce(value) {preference.matches=value; preference.emit('change');},
    visibility(value) {document.hidden=value; document.emit('visibilitychange');},
    activate() {trigger.emit('click');},
    loadAgain() {vm.runInNewContext(source,context);},
    async finish() {for (const animation of created) animation.finish(); await new Promise(setImmediate);}
  };
}
let passed = 0;
async function test(name, run) {await run(); passed++; console.log('PASS ' + name);}
(async () => {
  await test('The illustration is a named native button with a visible keyboard focus rule and no text replay', () => {
    assert.match(markup, /<button class="scale-trigger" type="button" data-scale-replay aria-label="Gerakkan timbangan Nalar Hakim"/);
    assert.match(markup, /<button[^>]*>\s*<svg/);
    assert.match(markup, /<\/svg>\s*<\/button>/);
    assert.doesNotMatch(markup, /Ulangi gerak timbangan|data-scale-reveal/);
    assert.match(css, /\.scale-trigger:focus-visible\{outline:2px solid/);
    assert.doesNotMatch(css, /\.scale-trigger[^{]*\{[^}]*display:none/);
  });
  await test('Initial visibility and repeated viewport entries never auto-play', () => {
    const h=harness();assert.equal(h.created.length,0);h.intersect(true);h.intersect(false);h.intersect(true);
    assert.equal(h.created.length,0);assert.equal(h.scene.dataset.motion,'static');assert.equal(h.trigger.attributes['aria-disabled'],'false');
  });
  await test('Activation starts one immediate finite sequence on desktop or touch', () => {
    const h=harness();h.intersect(true);h.activate();assert.equal(h.scene.dataset.motion,'running');assert.equal(h.active.length,3);
    assert.equal(h.trigger.attributes['aria-disabled'],'true');assert.equal(h.trigger.disabled,false);assert.equal(h.query,'(prefers-reduced-motion: reduce)');
    assert.ok(h.active.every(a=>a.options.iterations===undefined && !a.options.delay));
  });
  await test('Only beam and hangers animate; no opacity, clipping or base/column reveal occurs', () => {
    const h=harness();h.intersect(true);h.activate();assert.deepEqual(h.created.map(a=>a.name),['balance','left','right']);
    for(const a of h.created) assert.ok(a.frames.every(f=>Object.keys(f).every(k=>['transform','offset','easing'].includes(k))));
  });
  await test('Suspensions counter-rotate synchronously at their bearings and the motion decays to level', () => {
    const h=harness();h.intersect(true);h.activate();const beam=h.created.find(a=>a.name==='balance');
    for(const name of ['left','right']) {const pan=h.created.find(a=>a.name===name);assert.equal(pan.startTime,beam.startTime);assert.deepEqual(pan.options,beam.options);for(let i=0;i<beam.frames.length;i++) assert.equal(parseFloat(beam.frames[i].transform.slice(7))+parseFloat(pan.frames[i].transform.slice(7)),0);}
    assert.equal(beam.frames[0].transform,'rotate(0deg)');assert.equal(beam.frames.at(-1).transform,'rotate(0deg)');
    const peaks=beam.frames.slice(1,-1).map(f=>Math.abs(parseFloat(f.transform.slice(7))));for(let i=1;i<peaks.length;i++)assert.ok(peaks[i]<peaks[i-1]);
  });
  await test('Rapid activations and observer notifications cannot accumulate animations', () => {
    const h=harness();h.intersect(true);h.activate();for(let i=0;i<20;i++){h.activate();h.intersect(true);}assert.equal(h.created.length,3);
  });
  await test('Finishing releases all animations and a later activation weighs again without a reveal', async () => {
    const h=harness();h.intersect(true);h.activate();await h.finish();assert.equal(h.active.length,0);assert.equal(h.trigger.attributes['aria-disabled'],'false');assert.equal(h.scene.dataset.motion,'static');
    h.activate();assert.equal(h.created.length,6);assert.equal(h.active.length,3);
  });
  await test('Scroll exit settles immediately and reentry remains static', () => {
    const h=harness();h.intersect(true);h.activate();h.intersect(false);assert.equal(h.active.length,0);h.activate();assert.equal(h.created.length,3);
    h.intersect(true);assert.equal(h.created.length,3);assert.equal(h.scene.dataset.motion,'static');
  });
  await test('Hidden pages settle and becoming visible does not restart motion', () => {
    const h=harness();h.intersect(true);h.activate();h.visibility(true);assert.equal(h.active.length,0);h.activate();h.visibility(false);assert.equal(h.created.length,3);
  });
  await test('Reduced motion keeps full visible artwork and ignores activation without an observer', () => {
    const h=harness({reduced:true});assert.equal(h.created.length,0);assert.equal(h.intersections.length,0);assert.equal(h.trigger.hidden,false);
    assert.equal(h.trigger.attributes['aria-disabled'],'true');assert.equal(h.scene.dataset.motion,'static');h.activate();assert.equal(h.created.length,0);
  });
  await test('Preference changes cancel motion and reject stale observer callbacks', () => {
    const h=harness();h.intersect(true);h.activate();h.reduce(true);assert.equal(h.active.length,0);assert.equal(h.intersections[0].disconnected,true);h.intersect(true,0);h.activate();assert.equal(h.created.length,3);
    h.reduce(false);h.intersect(true,0);h.activate();assert.equal(h.created.length,3);h.intersect(true);assert.equal(h.created.length,3);h.activate();assert.equal(h.created.length,6);
  });
  await test('BFCache lifecycle restores static state without duplicate observers or an entrance', () => {
    const h=harness();h.intersect(true);h.activate();h.window.emit('pagehide');assert.equal(h.active.length,0);assert.equal(h.intersections[0].disconnected,true);h.intersect(true,0);h.activate();assert.equal(h.created.length,3);
    h.window.emit('pageshow');h.intersect(true);assert.equal(h.created.length,3);assert.equal(h.intersections.length,2);h.window.emit('pageshow');assert.equal(h.intersections.length,2);h.activate();assert.equal(h.created.length,6);
  });
  await test('Repeated script setup does not duplicate listeners or observers', () => {
    const h=harness();const listeners=h.window.listenerCount()+h.document.listenerCount()+h.trigger.listenerCount()+h.preference.listenerCount();h.loadAgain();
    assert.equal(h.intersections.length,1);assert.equal(listeners,h.window.listenerCount()+h.document.listenerCount()+h.trigger.listenerCount()+h.preference.listenerCount());
  });
  await test('Unrelated intersection entries cannot start or cancel a user activation', () => {
    const h=harness();h.intersections[0].callback([]);h.intersections[0].callback([{target:{},isIntersecting:true}]);h.activate();assert.equal(h.created.length,0);
    h.intersect(true);h.activate();h.intersections[0].callback([{target:{},isIntersecting:false}]);assert.equal(h.active.length,3);
  });
  for(const [name,options] of [['No scene',{hasScene:false}],['No IntersectionObserver',{hasObserver:false}],['No Web Animations',{hasAnimation:false}],['No trigger',{hasTrigger:false}]]) {
    await test(name + ' keeps the static fallback and installs no listeners',()=>{const h=harness(options);assert.equal(h.created.length,0);assert.equal(h.intersections.length,0);assert.equal(h.window.listenerCount()+h.document.listenerCount(),0);assert.equal(h.trigger.attributes['aria-disabled'],'true');});
  }
  for(const fail of [true,1]) await test('Animation API failure ' + fail + ' cancels partial work and restores the static artwork', () => {
    const h=harness({throws:fail});h.intersect(true);h.activate();assert.equal(h.scene.dataset.motion,'static');assert.equal(h.trigger.attributes['aria-disabled'],'false');assert.equal(h.active.length,0);
  });
  console.log(passed + ' finite scale-motion checks passed.');
})().catch(error=>{console.error(error);process.exitCode=1;});
