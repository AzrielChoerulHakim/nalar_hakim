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
function harness({capable = true, hasScene = true, hasObserver = true, loader = false, articlePage = false, dark = false, width = 1366} = {}) {
  let now = 100, scroll = 0, nextId = 1, created = 0, layoutReads = 0;
  const frames = new Map(), timers = new Map(), watchers = new Set(), queries = [];
  const live = [], head = [];
  const media = target({matches: capable});
  const rect = (left, top, width, height) => ({left, top: top-scroll, width, height, bottom: top-scroll+height, right: left+width});
  function element(tag) {
    created++;
    const attrs = {};
    const node = target({tagName: tag, dataset: {}, style: {setProperty(k,v){this[k]=v;}}, hidden: false, className: '', removed: false,
      setAttribute(k,v) {attrs[k]=v; for(const w of watchers) if(w.element===node && (!w.filter || w.filter.includes(k))) w.callback();},
      getAttribute(k) {return attrs[k] ?? null;},
      remove() {node.removed=true; for(const list of [live,head]) {const i=list.indexOf(node); if(i>=0)list.splice(i,1);}},
      click() {node.emit('click');},
      querySelector(selector) {if(selector==='.butterfly-body' || selector==='.firefly-body') return node.visualBody ||= {style:{}}; throw Error(`Unexpected generated selector ${selector}`);}
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
  const html = element('html'); html.dataset.theme = dark ? 'dark' : 'light';
  const articleHeadings = [120,1000,2000,3000].map(top=>({getBoundingClientRect(){layoutReads++;return rect((width-940)/2,top,800,55);}}));
  const articleNode = {querySelectorAll:()=>articleHeadings,getBoundingClientRect(){layoutReads++;return rect((width-940)/2,100,940,3500);}};
  const document=target({hidden:false,documentElement:html,currentScript:{dataset:{butterflySrc:'preview/butterfly.js?v=test'}},
    querySelector:s=>s==='[data-nature-scene]'?(hasScene&&!articlePage?scene:null):s==='.article-layout'?(articlePage?articleNode:null):(headings[s]||null),
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
  const context={document,window,MutationObserver:hasObserver?Observer:undefined,matchMedia:q=>{queries.push(q);return media;},innerWidth:width,innerHeight:900,
    performance:{now:()=>now},requestAnimationFrame,cancelAnimationFrame,setTimeout,clearTimeout};
  created=0;
  vm.runInNewContext(loader?loaderSource:butterflySource,context);
  const h={document,window,toggle,media,live,head,frames,timers,queries,
    get created(){return created;},get reads(){return layoutReads;},get watchers(){return watchers.size;},
    get butterfly(){return live.find(n=>n.className==='nature-butterfly');},
    get fireflies(){return live.filter(n=>n.className==='nature-firefly');},
    theme(value){html.dataset.theme=value;html.setAttribute('data-theme',value);},
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
 const h=harness();h.settle();const before=h.position();h.scrollTo(850);h.settle();const after=h.position();
 assert.ok(Math.abs(after.x-before.x)>300,'Did not move from statue to heading');assert.equal(h.control.hidden,false);assert.equal(h.butterfly.dataset.flight,'rest');
});
test('Capability destroy removes DOM/listeners; recreation has one controller',()=>{
 const h=harness();h.settle();h.capability(false);assert.equal(h.live.length,0);assert.equal(h.frames.size,0);assert.equal(h.timers.size,0);assert.equal(h.watchers,0);assert.equal(h.window.count('scroll'),0);
 h.capability(true);assert.equal(h.live.length,2);assert.equal(h.watchers,2);assert.equal(h.window.count('scroll'),1);h.settle();
});
test('Pause intent survives capability destroy and recreation',()=>{
 const h=harness();h.toggle.click();h.capability(false);h.capability(true);assert.equal(h.butterfly.dataset.paused,'true');assert.equal(h.frames.size,0);assert.equal(h.control.getAttribute('aria-pressed'),'true');
});
test('Dark initial mode contains exactly three fireflies with unique glow IDs and no butterfly',()=>{
 const h=harness({dark:true});assert.equal(h.fireflies.length,3);assert.equal(h.butterfly,undefined);assert.equal(h.live.length,4);assert.equal(h.frames.size,1);
 const ids=h.fireflies.map(n=>n.innerHTML.match(/id="(nh-firefly-glow-\d)"/)[1]);assert.equal(new Set(ids).size,3);
});
test('Repeated theme switches replace visitors without duplicating controllers, frames or watchers',()=>{
 const h=harness();for(let i=0;i<12;i++){h.theme('dark');assert.equal(h.fireflies.length,3);assert.equal(h.butterfly,undefined);assert.equal(h.live.length,4);h.theme('light');assert.equal(h.fireflies.length,0);assert.ok(h.butterfly);assert.equal(h.live.length,2);assert.equal(h.frames.size,1);assert.equal(h.watchers,2);}
 h.settle();
});
test('Paused intent survives both kinds of visitor, with no timers or frame work',()=>{
 const h=harness();h.toggle.click();h.theme('dark');assert.equal(h.frames.size,0);assert.equal(h.timers.size,0);assert.ok(h.fireflies.every(n=>n.dataset.paused==='true'));
 h.theme('light');assert.equal(h.butterfly.dataset.paused,'true');assert.equal(h.frames.size,0);
});
test('Firefly motion is distinct and smooth, does not read layout each frame, and freezes while hidden',()=>{
 const h=harness({dark:true});h.step();const reads=h.reads;const before=h.fireflies.map(n=>n.style.transform);
 for(let i=0;i<120;i++)h.step();assert.equal(h.reads,reads);assert.equal(h.frames.size,1);
 assert.ok(h.fireflies.every((n,i)=>n.style.transform!==before[i]));assert.equal(new Set(h.fireflies.map(n=>n.style.transform)).size,3);
 const frozen=h.fireflies.map(n=>n.style.transform);h.visibility(true);h.step(60000);assert.equal(h.frames.size,0);assert.deepEqual(h.fireflies.map(n=>n.style.transform),frozen);
 h.visibility(false);h.step();assert.equal(h.frames.size,1);assert.ok(h.fireflies.every(n=>n.dataset.paused==='false'));
});
test('Dark lifecycle removes all visitors/observers on capability loss and suspends on pagehide',()=>{
 const h=harness({dark:true});h.window.emit('pagehide');assert.equal(h.frames.size,0);h.window.emit('pageshow');assert.equal(h.frames.size,1);
 h.capability(false);assert.equal(h.live.length,0);assert.equal(h.watchers,0);assert.equal(h.window.count('scroll'),0);assert.equal(h.document.count('visibilitychange'),0);h.capability(true);assert.equal(h.fireflies.length,3);assert.equal(h.frames.size,1);
});
test('Article without hero has its own pause control and preserves intent across theme switches',()=>{
 const h=harness({articlePage:true});assert.ok(h.butterfly);assert.equal(h.control.hidden,false);h.control.click();assert.equal(h.frames.size,0);h.theme('dark');assert.equal(h.fireflies.length,3);assert.equal(h.control.getAttribute('aria-pressed'),'true');assert.equal(h.frames.size,0);h.control.click();assert.equal(h.frames.size,1);
});
test('Article visitors fit outside the full article width, even at 1024px',()=>{
 for(const width of [1024,1366]){
  const h=harness({articlePage:true,width});h.settle();
  let p=h.position();const size=parseFloat(h.butterfly.style['--visitor-size']);assert.ok(p.x>=0);assert.ok(p.x+size<=(width-940)/2);
  h.scrollTo(950);h.settle();p=h.position();assert.ok(p.x+size<=(width-940)/2);
  h.theme('dark');for(let i=0;i<600;i++){h.step();for(const f of h.fireflies){const m=f.style.transform.match(/translate3d\(([-\d.]+)px/);const x=+m[1],sz=parseFloat(f.style['--visitor-size']);assert.ok(x>=0 && x+sz<=width);assert.ok(x+sz<=(width-940)/2 || x>=(width+940)/2);}}
 }
});
test('Article compact capability creates no creatures, control, observers or scroll listeners',()=>{
 const h=harness({articlePage:true,capable:false,dark:true});assert.equal(h.created,0);assert.equal(h.live.length,0);assert.equal(h.watchers,0);assert.equal(h.frames.size,0);assert.equal(h.window.count('scroll'),0);assert.equal(h.document.count('visibilitychange'),0);
});
console.log(`${count} butterfly checks passed; ${failures} failed.`);process.exitCode=failures?1:0;
