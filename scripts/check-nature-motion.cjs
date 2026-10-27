#!/usr/bin/env node
'use strict';
// Finite scale motion: bearings, cancellation, replay and page lifecycle.
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
function harness({reduced = false, hasScene = true, hasObserver = true, hasAnimation = true, throws = false} = {}) {
  const created = [], intersections = [];
  function animated(name) {
    return {animate:hasAnimation ? function(frames, options) {
      if (throws) throw Error('Animation unavailable');
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
  const parts = {base:[animated('base')], column:[animated('column')], beam:[animated('beam')], chains:[animated('left-chain'),animated('right-chain')], pans:[animated('left-pan'),animated('right-pan')]};
  const replay = events({hidden:true, disabled:false});
  const scene = {dataset:{motion:'static'},
    querySelector(selector) {return selector === '[data-scale-balance]' ? balance : selector === '[data-scale-replay]' ? replay : undefined;},
    querySelectorAll(selector) {return selector === '[data-scale-hanger]' ? hangers : parts[selector.match(/data-scale-reveal="(\w+)"/)?.[1]] || [];}
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
  return {scene,replay,preference,intersections,document,window,created,
    get query() {return query;},
    get active() {return created.filter(animation => !animation.canceled);},
    intersect(value,index=intersections.length-1) {intersections[index].callback([{target:scene,isIntersecting:value}]);},
    reduce(value) {preference.matches=value; preference.emit('change');},
    visibility(value) {document.hidden=value; document.emit('visibilitychange');},
    loadAgain() {vm.runInNewContext(source,context);},
    async finish() {for (const animation of created) animation.finish(); await new Promise(setImmediate);}
  };
}
let passed = 0;
async function test(name, run) {await run(); passed++; console.log(`PASS ${name}`);}
(async () => {
  await test('The complete illustration stays static before it enters the viewport', () => {
    const h=harness(); assert.equal(h.created.length,0); assert.equal(h.scene.dataset.motion,'static'); assert.equal(h.intersections.length,1); assert.equal(h.replay.hidden,false);
  });
  await test('First visibility starts one finite sequence on desktop or touch', () => {
    const h=harness();h.intersect(true);assert.equal(h.scene.dataset.motion,'running');assert.equal(h.active.length,10);assert.equal(h.replay.disabled,true);assert.equal(h.query,'(prefers-reduced-motion: reduce)');assert.ok(h.active.every(a=>a.options.iterations===undefined));
  });
  await test('Base and column reveal without inheriting the beam rotation', () => {
    const h=harness();h.intersect(true);for(const name of ['base','column']) {const a=h.created.find(a=>a.name===name);assert.ok(a.frames.every(f=>!f.transform));}assert.ok(h.created.find(a=>a.name==='base').options.delay<h.created.find(a=>a.name==='column').options.delay);
  });
  await test('Both suspended assemblies counter-rotate about their own bearings', () => {
    const h=harness();h.intersect(true);const beam=h.created.find(a=>a.name==='balance');for(const name of ['left','right']) {const pan=h.created.find(a=>a.name===name);assert.equal(pan.startTime,beam.startTime);assert.deepEqual(pan.options,beam.options);for(let i=0;i<beam.frames.length;i++) assert.equal(parseFloat(beam.frames[i].transform.slice(7))+parseFloat(pan.frames[i].transform.slice(7)),0);}
    assert.equal(beam.frames.at(-1).transform,'rotate(0deg)');assert.ok(Math.abs(parseFloat(beam.frames[1].transform.slice(7)))>Math.abs(parseFloat(beam.frames[2].transform.slice(7))));
  });
  await test('Rapid replay and repeated intersection cannot accumulate animations', () => {
    const h=harness();h.intersect(true);for(let i=0;i<20;i++){h.replay.emit('click');h.intersect(true);}assert.equal(h.created.length,10);
  });
  await test('Finished movement releases every animation and allows one replay', async () => {
    const h=harness();h.intersect(true);await h.finish();assert.equal(h.active.length,0);assert.equal(h.replay.disabled,false);assert.equal(h.scene.dataset.motion,'static');h.replay.emit('click');assert.equal(h.created.length,20);assert.equal(h.active.length,10);
  });
  await test('Scrolling away settles immediately; scrolling back never auto-replays', () => {
    const h=harness();h.intersect(true);h.intersect(false);assert.equal(h.active.length,0);h.intersect(true);assert.equal(h.created.length,10);assert.equal(h.scene.dataset.motion,'static');
  });
  await test('Hidden pages settle and leave no animation work behind', () => {
    const h=harness();h.intersect(true);h.visibility(true);assert.equal(h.active.length,0);h.visibility(false);assert.equal(h.created.length,10);
  });
  await test('Reduced motion shows final artwork without scheduling an observer', () => {
    const h=harness({reduced:true});assert.equal(h.created.length,0);assert.equal(h.intersections.length,0);assert.equal(h.replay.hidden,true);assert.equal(h.scene.dataset.motion,'static');h.replay.emit('click');assert.equal(h.created.length,0);
  });
  await test('Changing preference cancels active work and rejects stale observer callbacks', () => {
    const h=harness();h.intersect(true);h.reduce(true);assert.equal(h.active.length,0);assert.equal(h.intersections[0].disconnected,true);h.intersect(true,0);assert.equal(h.created.length,10);h.reduce(false);h.intersect(true,0);assert.equal(h.created.length,10);h.intersect(true);assert.equal(h.created.length,10);h.replay.emit('click');assert.equal(h.created.length,20);
  });
  await test('BFCache lifecycle never repeats the entrance or duplicates observers', () => {
    const h=harness();h.intersect(true);h.window.emit('pagehide');assert.equal(h.active.length,0);assert.equal(h.intersections[0].disconnected,true);h.intersect(true,0);assert.equal(h.created.length,10);h.window.emit('pageshow');h.intersect(true);assert.equal(h.created.length,10);assert.equal(h.intersections.length,2);h.window.emit('pageshow');assert.equal(h.intersections.length,2);
  });
  await test('A repeated script load does not stack listeners or observers', () => {
    const h=harness();const listeners=h.window.listenerCount()+h.document.listenerCount()+h.replay.listenerCount()+h.preference.listenerCount();h.loadAgain();assert.equal(h.intersections.length,1);assert.equal(listeners,h.window.listenerCount()+h.document.listenerCount()+h.replay.listenerCount()+h.preference.listenerCount());
  });
  await test('Unrelated intersection entries cannot start or stop the artwork', () => {
    const h=harness();h.intersections[0].callback([]);h.intersections[0].callback([{target:{},isIntersecting:true}]);assert.equal(h.created.length,0);h.intersect(true);h.intersections[0].callback([{target:{},isIntersecting:false}]);assert.equal(h.active.length,10);
  });
  for(const [name,options] of [['No scene',{hasScene:false}],['No IntersectionObserver',{hasObserver:false}],['No Web Animations',{hasAnimation:false}]]) {
    await test(`${name} keeps the static fallback and installs no listeners`,()=>{const h=harness(options);assert.equal(h.created.length,0);assert.equal(h.intersections.length,0);assert.equal(h.window.listenerCount()+h.document.listenerCount(),0);assert.equal(h.replay.hidden,true);});
  }
  await test('An animation API failure falls back to the full static artwork', () => {
    const h=harness({throws:true});h.intersect(true);assert.equal(h.scene.dataset.motion,'static');assert.equal(h.replay.disabled,false);assert.equal(h.active.length,0);
  });
  console.log(`${passed} finite scale-motion checks passed.`);
})().catch(error=>{console.error(error);process.exitCode=1;});
