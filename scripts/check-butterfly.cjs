#!/usr/bin/env node
'use strict';
// Deterministic lifecycle integration. No browser, network or dependencies.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const butterflySource = fs.readFileSync(path.join(root, 'preview/butterfly.js'), 'utf8');
const loaderSource = fs.readFileSync(path.join(root, 'preview/desktop-nature.js'), 'utf8');

function target(properties = {}) {
  const events = new Map();
  return Object.assign(properties, {
    addEventListener(type, handler) {
      const handlers = events.get(type) || new Set(); handlers.add(handler); events.set(type, handlers);
    },
    removeEventListener(type, handler) { events.get(type)?.delete(handler); },
    emit(type) { for (const handler of [...(events.get(type) || [])]) handler({type}); },
    count(type) { return events.get(type)?.size || 0; }
  });
}
function harness({capable = true, hasScene = true, hasObserver = true, loader = false} = {}) {
  let now = 100, scroll = 0, nextId = 1, created = 0, layoutReads = 0;
  const frames = new Map(), timers = new Map(), watchers = new Set(), queries = [];
  const live = [], head = [];
  const media = target({matches: capable});
  const rect = (left, top, width, height) => ({left, top: top-scroll, width, height, bottom: top-scroll+height, right: left+width});
  function element(tag) {
    created++;
    const attrs = {};
    const node = target({tagName: tag, dataset: {}, style: {}, hidden: false, className: '', removed: false,
      setAttribute(k,v) {attrs[k]=v; for(const w of watchers) if(w.element===node && (!w.filter || w.filter.includes(k))) w.callback();},
      getAttribute(k) {return attrs[k] ?? null;},
      remove() {node.removed=true; for(const list of [live,head]) {const i=list.indexOf(node); if(i>=0)list.splice(i,1);}},
      click() {node.emit('click');},
      querySelector(selector) {if(selector==='.butterfly-body') return node.visualBody ||= {style:{}}; throw Error(`Unexpected generated selector ${selector}`);}
    });
    return node;
  }
  const toggle = element('button'); toggle.setAttribute('aria-pressed','false');
  toggle.getBoundingClientRect = () => {layoutReads++;return rect(850,680,130,44);};
  toggle.addEventListener('click',()=>toggle.setAttribute('aria-pressed',toggle.getAttribute('aria-pressed')==='true'?'false':'true'));
  const svg={getBoundingClientRect(){layoutReads++;return rect(650,120,500,500);}};
  const scene={querySelector:s=>s==='[data-nature-toggle]'?toggle:s==='svg'?svg:null};
  const selectors=['#landing-manifest-title','#landing-channels-title','#landing-invitation-title','.landing-footer-brand'];
  const headings=Object.fromEntries(selectors.map((s,i)=>{
    const node={nodeType:3,textContent:'  Heading',getBoundingClientRect:()=>rect(180+i*30,1000+i*850,18,55)};
    return [s,{firstChild:node,getBoundingClientRect(){layoutReads++;return rect(180+i*30,1000+i*850,500,55);}}];
  }));
  const document=target({hidden:false,currentScript:{dataset:{butterflySrc:'preview/butterfly.js?v=test'}},
    querySelector:s=>s==='[data-nature-scene]'?(hasScene?scene:null):(headings[s]||null),
    createElement:element,
    createRange:()=>{let node; return {setStart(n){node=n;},setEnd(){},getBoundingClientRect:()=>node.getBoundingClientRect()};},
    body:{append(...nodes){live.push(...nodes);}},head:{append(node){head.push(node);}}
  });
  class Observer {
    constructor(callback){this.callback=callback;}
    observe(element,options){this.element=element;this.filter=options.attributeFilter;watchers.add(this);}
    disconnect(){watchers.delete(this);}
  }
  const window=target({MutationObserver:hasObserver?Observer:undefined});
  const requestAnimationFrame=callback=>{const id=nextId++;frames.set(id,callback);return id;};
  const cancelAnimationFrame=id=>frames.delete(id);
  const setTimeout=(callback,delay)=>{const id=nextId++;timers.set(id,{callback,due:now+delay});return id;};
  const clearTimeout=id=>timers.delete(id);
  const context={document,window,MutationObserver:hasObserver?Observer:undefined,matchMedia:q=>{queries.push(q);return media;},innerWidth:1366,innerHeight:900,
    performance:{now:()=>now},requestAnimationFrame,cancelAnimationFrame,setTimeout,clearTimeout};
  created=0;
  vm.runInNewContext(loader?loaderSource:butterflySource,context);
  const h={document,window,toggle,media,live,head,frames,timers,queries,
    get created(){return created;},get reads(){return layoutReads;},get watchers(){return watchers.size;},
    get butterfly(){return live.find(n=>n.className==='nature-butterfly');},
    get control(){return live.find(n=>n.className==='nature-page-toggle');},
    step(ms=16){now+=ms;const batch=[...frames];frames.clear();for(const [,f] of batch)f(now);for(const [id,t]of [...timers])if(t.due<=now){timers.delete(id);t.callback();}},
    settle(limit=1500){let n=0;while(frames.size&&n++<limit)h.step();assert.equal(frames.size,0,`RAF did not rest within ${limit} frames`);return n;},
    scrollTo(value){scroll=value;window.emit('scroll');},
    visibility(hidden){document.hidden=hidden;document.emit('visibilitychange');},
    capability(value){media.matches=value;media.emit('change');},
    runLoaded(){vm.runInNewContext(butterflySource,context);},
    position(){const m=h.butterfly.style.transform.match(/translate3d\(([-\d.]+)px,([-\d.]+)px/);return {x:+m[1],y:+m[2]};}
  };return h;
}
let count=0, failures=0;
function test(name,fn){try{fn();count++;console.log(`PASS ${name}`);}catch(e){failures++;console.error(`FAIL ${name}: ${e.message}`);}}

test('Mobile/reduced-motion loader makes no DOM or animation requests',()=>{
 const h=harness({capable:false,loader:true});assert.equal(h.created,0);assert.equal(h.frames.size,0);assert.equal(h.head.length,0);
});
test('Loader loads exactly once on desktop capability, including toggling capability',()=>{
 const h=harness({capable:false,loader:true});h.capability(true);assert.equal(h.head.length,1);assert.equal(h.head[0].src,'preview/butterfly.js?v=test');
 h.capability(false);h.capability(true);assert.equal(h.head.length,1);assert.equal(h.created,1);
 for(const condition of ['min-width: 1024px','hover: hover','pointer: fine','prefers-reduced-motion: no-preference'])assert.ok(h.queries[0].includes(condition));
});
test('Loader failed request can recover on a later capability change',()=>{
 const h=harness({loader:true});h.head[0].onerror();assert.equal(h.head.length,0);h.capability(false);h.capability(true);assert.equal(h.head.length,1);
});
test('Full butterfly script stays inert on mobile, absent scene, or missing observer',()=>{
 for(const options of [{capable:false},{hasScene:false},{hasObserver:false}]){const h=harness(options);assert.equal(h.created,0);assert.equal(h.frames.size,0);assert.equal(h.live.length,0);}
});
test('Initial flight settles and rest timer is bounded without per-frame layout reads',()=>{
 const h=harness();assert.equal(h.live.length,2);assert.equal(h.butterfly.getAttribute('aria-hidden'),'true');
 const reads=h.reads;h.settle();assert.equal(h.butterfly.dataset.flight,'rest');assert.ok(h.timers.size<=1);assert.ok(h.reads-reads<=10,'Layout read each frame');
});
test('A resting butterfly stays RAF-idle after hidden tab resumes',()=>{
 const h=harness();h.settle();h.visibility(true);assert.equal(h.frames.size,0);assert.equal(h.timers.size,0);assert.equal(h.butterfly.dataset.paused,'true');
 h.visibility(false);h.settle(20);assert.equal(h.butterfly.dataset.paused,'false');assert.ok(h.timers.size<=1);
});
test('Pagehide cancels RAF and timers; pageshow restarts without a rest loop',()=>{
 const h=harness();h.window.emit('pagehide');assert.equal(h.frames.size,0);assert.equal(h.timers.size,0);h.visibility(false);assert.equal(h.frames.size,0);
 h.window.emit('pageshow');h.settle();assert.ok(h.timers.size<=1);
});
test('Shared pause button stops flight; floating control resumes same pause state',()=>{
 const h=harness();h.toggle.click();assert.equal(h.frames.size,0);assert.equal(h.butterfly.dataset.paused,'true');assert.equal(h.control.getAttribute('aria-pressed'),'true');
 h.scrollTo(900);assert.equal(h.frames.size,0);h.control.click();assert.equal(h.toggle.getAttribute('aria-pressed'),'false');h.settle();assert.equal(h.butterfly.dataset.paused,'false');
});
test('Scroll transitions to a visible heading and reveals remote pause control',()=>{
 const h=harness();h.settle();const before=h.position();h.scrollTo(900);h.settle();const after=h.position();
 assert.ok(Math.abs(after.x-before.x)>300,'Did not move from statue to heading');assert.equal(h.control.hidden,false);assert.equal(h.butterfly.dataset.flight,'rest');
});
test('Capability destroy removes DOM/listeners; recreation has one controller',()=>{
 const h=harness();h.settle();h.capability(false);assert.equal(h.live.length,0);assert.equal(h.frames.size,0);assert.equal(h.timers.size,0);assert.equal(h.watchers,0);assert.equal(h.window.count('scroll'),0);
 h.capability(true);assert.equal(h.live.length,2);assert.equal(h.watchers,1);assert.equal(h.window.count('scroll'),1);h.settle();
});
test('Pause intent survives capability destroy and recreation',()=>{
 const h=harness();h.toggle.click();h.capability(false);h.capability(true);assert.equal(h.butterfly.dataset.paused,'true');assert.equal(h.frames.size,0);assert.equal(h.control.getAttribute('aria-pressed'),'true');
});
console.log(`${count} butterfly checks passed; ${failures} failed.`);process.exitCode=failures?1:0;
