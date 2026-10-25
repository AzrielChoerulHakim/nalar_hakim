#!/usr/bin/env node
'use strict';
// Native-scroll lifecycle tests. Deterministic DOM/RAF mocks, no browser/dependencies.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const base = path.resolve(__dirname, '..');
const storySource = fs.readFileSync(path.join(base, 'preview/scroll-story.js'), 'utf8');
const loaderSource = fs.readFileSync(path.join(base, 'preview/desktop-nature.js'), 'utf8');
function events(properties = {}) {
  const listeners = new Map();
  return Object.assign(properties, {
    addEventListener(type, callback) {if (!listeners.has(type)) listeners.set(type,new Set()); listeners.get(type).add(callback);},
    removeEventListener(type, callback) {listeners.get(type)?.delete(callback);},
    dispatchEvent(event) {for (const callback of [...(listeners.get(event.type)||[])]) callback(event);},
    emit(type, properties = {}) {this.dispatchEvent({type,...properties});},
    count(type) {return listeners.get(type)?.size || 0;}
  });
}
function harness({capable=true, hasHero=true, hasToggle=true, hasSection=true, mutation=true, resize=true, loader=false}={}) {
  let scroll=0, created=0, reads=0, nextId=1, ticks=0;
  const frames=new Map(), watchers=new Set(), resizers=new Set();
  function node(tag, id='') {
    created++; const attrs={}, classes=new Set(), properties=new Map();
    const n=events({tagName:tag,id,children:[],parent:null,dataset:{},hidden:false,className:'',scrollCalls:[],
      style:{setProperty(k,v){properties.set(k,String(v));},removeProperty(k){properties.delete(k);},getPropertyValue(k){return properties.get(k)||'';}},
      classList:{add(...names){names.forEach(n=>classes.add(n));},remove(...names){names.forEach(n=>classes.delete(n));},contains(name){return classes.has(name);},toggle(name,force){const add=force===undefined?!classes.has(name):force;add?classes.add(name):classes.delete(name);return add;}},
      setAttribute(k,v){attrs[k]=String(v);for(const w of watchers)if(w.node===n&&w.filter.includes(k))w.callback();},
      getAttribute(k){return attrs[k]??null;},removeAttribute(k){delete attrs[k];},
      append(...children){children.forEach(c=>{c.parent=n;n.children.push(c);});},
      remove(){if(n.parent)n.parent.children.splice(n.parent.children.indexOf(n),1);n.parent=null;},
      contains(other){return n===other||n.children.some(c=>c.contains(other));},
      closest(selector){return selector==='.landing-channel'&&classes.has('landing-channel')?n:n.parent?.closest(selector)||null;},
      scrollIntoView(options){n.scrollCalls.push(options);},
      querySelectorAll(selector){return selector==='.landing-channel'?n.children.filter(c=>c.classList.contains('landing-channel')):[];}
    });return n;
  }
  const root=node('html');root.scrollHeight=4000;
  const body=node('body'),head=node('head'),hero=node('section'),toggle=node('button');toggle.setAttribute('aria-pressed','false');
  const sections=['sikap','bentuk','kirim'].map(id=>node('section',id));
  const cards=[0,1,2].map(i=>{const c=node('a',`card-${i}`);c.classList.add('landing-channel');return c;});sections[1].append(...cards);
  const geometry=(top,height=600)=>()=>{reads++;return {top:top-scroll,bottom:top+height-scroll,height,width:1100,left:40};};
  hero.getBoundingClientRect=geometry(0,780);
  sections.forEach((s,i)=>s.getBoundingClientRect=geometry([820,1650,2800][i],[700,1100,700][i]));
  cards.forEach((c,i)=>c.getBoundingClientRect=geometry(1750+i*310,260));
  const media=events({matches:capable});
  const location={hash:''};
  const document=events({documentElement:root,body,head,activeElement:null,hidden:false,currentScript:{dataset:{desktopSrc:'preview/scroll-story.js?v=test'}},
    querySelector:s=>s==='.landing-hero'?(hasHero?hero:null):s==='[data-nature-toggle]'?(hasToggle?toggle:null):null,
    getElementById:id=>[...sections,...cards].find(n=>n.id===id&&(hasSection||id!=='bentuk'))||null,
    createElement:node});
  class Mutation {constructor(callback){this.callback=callback;}observe(n,{attributeFilter}){this.node=n;this.filter=attributeFilter;watchers.add(this);}disconnect(){watchers.delete(this);}}
  class Resize {constructor(callback){this.callback=callback;}observe(n){resizers.add(this);}disconnect(){resizers.delete(this);}}
  const window=events({MutationObserver:mutation?Mutation:undefined,ResizeObserver:resize?Resize:undefined});
  const context={document,window,MutationObserver:mutation?Mutation:undefined,ResizeObserver:resize?Resize:undefined,matchMedia:()=>media,innerHeight:900,location,
    get scrollY(){return scroll;},Event:class Event{constructor(type){this.type=type;}},
    requestAnimationFrame:callback=>{const id=nextId++;frames.set(id,callback);return id;},cancelAnimationFrame:id=>frames.delete(id)};
  created=0;
  vm.runInNewContext(loader?loaderSource:storySource,context);
  return {document,window,root,body,head,hero,toggle,sections,cards,media,location,frames,watchers,resizers,
    get created(){return created;},get reads(){return reads;},get ticks(){return ticks;},get nav(){return body.children.find(n=>n.className==='scroll-chapters');},
    frame(){ticks++;const batch=[...frames.values()];frames.clear();batch.forEach(f=>f(ticks*16));},
    scrollTo(value){scroll=value;window.emit('scroll');},
    capability(value){media.matches=value;media.emit('change');},
    pause(value){toggle.setAttribute('aria-pressed',String(value));},
    visibility(hidden){document.hidden=hidden;document.emit('visibilitychange');},
    focus(target){document.activeElement=target;document.emit('focusin',{target});},
    hash(value){location.hash=value;window.emit('hashchange');},
    resize(){for(const r of resizers)r.callback();}
  };
}
let passed=0,failed=0;
function test(name,fn){try{fn();passed++;console.log(`PASS ${name}`);}catch(error){failed++;console.error(`FAIL ${name}: ${error.message}`);}}
function decoration(h){return [h.hero.style.getPropertyValue('--story-sky-shift'),h.sections[0].style.getPropertyValue('--statement-progress'),...h.cards.map(c=>c.style.getPropertyValue('--card-progress'))];}

test('Desktop source loader is inert on compact/reduced-motion and loads once when eligible',()=>{
 const h=harness({loader:true,capable:false});assert.equal(h.created,0);assert.equal(h.frames.size,0);
 h.capability(true);assert.equal(h.head.children.length,1);assert.equal(h.head.children[0].src,'preview/scroll-story.js?v=test');
 h.capability(false);h.capability(true);assert.equal(h.head.children.length,1);
});
test('Mobile or incomplete documents remain native without DOM/RAF enhancements',()=>{
 for(const option of [{capable:false},{hasHero:false},{hasSection:false}]){
  const h=harness(option);assert.equal(h.created,0);assert.equal(h.frames.size,0);assert.equal(h.body.children.length,0);assert.equal(h.root.classList.contains('nh-scroll-story'),false);
 }
});
test('One initial frame, then no recurring animation loop',()=>{
 const h=harness();assert.equal(h.frames.size,1);h.frame();assert.equal(h.frames.size,0);const reads=h.reads;h.frame();assert.equal(h.reads,reads);assert.equal(h.nav.hidden,true);
});
test('Scroll and resize bursts coalesce into one geometry batch',()=>{
 const h=harness();h.frame();const reads=h.reads;
 for(let i=0;i<10;i++){h.scrollTo(900+i);h.window.emit('resize');h.resize();}
 assert.equal(h.frames.size,1);h.frame();assert.equal(h.frames.size,0);assert.equal(h.reads-reads,7);assert.equal(h.nav.hidden,false);
});
test('Chapter links remain native hash anchors and track the section in view',()=>{
 const h=harness();h.frame();assert.deepEqual(h.nav.children.map(a=>a.href),['#sikap','#bentuk','#kirim']);
 for(const a of h.nav.children)assert.equal(a.count('click'),0);
 for(const [scroll,index] of [[800,0],[1600,1],[2800,2]]){
  h.scrollTo(scroll);h.frame();assert.equal(h.nav.children[index].getAttribute('aria-current'),'location');
  h.nav.children.forEach((a,i)=>{if(i!==index)assert.equal(a.getAttribute('aria-current'),null);});
 }
});
test('Scroll decoration runs automatically without a pause button or MutationObserver',()=>{
 const h=harness({hasToggle:false,mutation:false});h.scrollTo(900);h.frame();const before=decoration(h),progress=h.nav.style.getPropertyValue('--story-progress');
 h.scrollTo(1900);h.frame();assert.notDeepEqual(decoration(h),before);assert.notEqual(h.nav.style.getPropertyValue('--story-progress'),progress);
 assert.equal(h.nav.children[1].getAttribute('aria-current'),'location');assert.equal(h.root.dataset.scrollPaused,undefined);assert.equal(h.watchers.size,0);assert.ok(h.body.children.every(n=>n.tagName!=='button'));
});
test('Hidden tab and pagehide cancel pending frames and preserve idle scheduling',()=>{
 const h=harness();h.visibility(true);assert.equal(h.frames.size,0);h.scrollTo(1000);assert.equal(h.frames.size,0);
 h.visibility(false);assert.equal(h.frames.size,1);h.frame();assert.equal(h.frames.size,0);
 h.scrollTo(1500);h.window.emit('pagehide');assert.equal(h.frames.size,0);h.visibility(false);assert.equal(h.frames.size,0);
 h.window.emit('pageshow');assert.equal(h.frames.size,1);h.frame();assert.equal(h.frames.size,0);
});
test('Keyboard focus reveals stacked links in document order and keeps focused nav visible',()=>{
 const h=harness();h.frame();h.focus(h.cards[1]);assert.equal(h.sections[1].classList.contains('scroll-focus-content'),true);assert.equal(h.cards[1].scrollCalls.length,1);assert.equal(h.cards[1].scrollCalls[0].block,'nearest');
 h.frame();h.focus(h.nav.children[0]);h.frame();assert.equal(h.sections[1].classList.contains('scroll-focus-content'),false);assert.equal(h.nav.hidden,false);
});
test('Hash targets inside cards expose the stack without hijacking native navigation',()=>{
 const h=harness();h.hash('#card-2');h.frame();assert.equal(h.sections[1].classList.contains('scroll-focus-content'),true);assert.equal(h.cards[2].scrollCalls.length,0);
});
test('Capability destroy restores native properties, disconnects observers and avoids duplicate listeners',()=>{
 const h=harness();h.scrollTo(1900);h.frame();h.focus(h.cards[0]);h.frame();h.capability(false);
 assert.equal(h.body.children.length,0);assert.equal(h.frames.size,0);assert.equal(h.watchers.size,0);assert.equal(h.resizers.size,0);
 assert.equal(h.root.classList.contains('nh-scroll-story'),false);assert.equal(h.root.dataset.scrollPaused,undefined);
 assert.equal(h.sections[1].classList.contains('scroll-focus-content'),false);
 assert.ok(decoration(h).every(v=>v===''));h.cards.forEach(c=>assert.equal(c.style.getPropertyValue('--card-index'),''));
 for(const type of ['scroll','resize','hashchange'])assert.equal(h.window.count(type),0);assert.equal(h.document.count('focusin'),0);
 h.capability(true);h.frame();assert.equal(h.body.children.length,1);assert.equal(h.watchers.size,0);assert.equal(h.resizers.size,1);
 for(const type of ['scroll','resize','hashchange'])assert.equal(h.window.count(type),1);assert.equal(h.document.count('focusin'),1);
});
test('ResizeObserver absence retains scroll/native resize functionality',()=>{
 const h=harness({resize:false});h.frame();assert.equal(h.resizers.size,0);h.scrollTo(1600);h.frame();assert.equal(h.nav.children[1].getAttribute('aria-current'),'location');assert.equal(h.frames.size,0);
});
test('General reveals suspend hidden tabs and cannot restart before pageshow',()=>{
 const classes=new Set(),observers=new Set(),preference=events({matches:true});
 const root={classList:{add:n=>classes.add(n),remove:n=>classes.delete(n),contains:n=>classes.has(n)}};
 const document=events({hidden:true,documentElement:root,activeElement:null,querySelectorAll:()=>[],querySelector:()=>null,getElementById:()=>null});
 class Intersection {constructor(callback){this.callback=callback;observers.add(this);}observe(){}unobserve(){}disconnect(){observers.delete(this);}}
 class Element {animate(){throw Error('No element was selected for animation');}}
 const window=events({matchMedia:()=>preference,IntersectionObserver:Intersection,location:{hash:'',href:'https://example.test/'},scrollY:0,innerHeight:900});
 vm.runInNewContext(fs.readFileSync(path.join(base,'preview/motion.js'),'utf8'),{window,document,IntersectionObserver:Intersection,Element,URL});
 assert.equal(observers.size,0);assert.equal(classes.has('nh-motion'),false);
 document.hidden=false;document.emit('visibilitychange');assert.equal(observers.size,1);assert.equal(classes.has('nh-motion'),true);
 document.hidden=true;document.emit('visibilitychange');assert.equal(observers.size,0);assert.equal(classes.has('nh-motion'),false);
 window.emit('pagehide');document.hidden=false;document.emit('visibilitychange');assert.equal(observers.size,0);
 window.emit('pageshow',{persisted:true});assert.equal(observers.size,1);
 preference.matches=false;preference.emit('change');assert.equal(observers.size,0);assert.equal(classes.has('nh-motion'),false);
});
test('Native reveal finish and cancellation notify final heading geometry only once',()=>{
 const classes=new Set(),animations=[],preference=events({matches:true});let notifications=0;
 const root={classList:{add:n=>classes.add(n),remove:n=>classes.delete(n),contains:n=>classes.has(n)}};
 class Element {contains(){return false;}animate(){const animation={cancel(){animation.oncancel?.();}};animations.push(animation);return animation;}}
 const headings=[new Element(),new Element()];
 const document=events({hidden:false,documentElement:root,activeElement:null,querySelectorAll:s=>s.startsWith('.home-intro .eyebrow')?headings:[],querySelector:()=>null,getElementById:()=>null});
 class Intersection {observe(){}unobserve(){}disconnect(){}}
 class Event {constructor(type){this.type=type;}}
 const window=events({matchMedia:()=>preference,IntersectionObserver:Intersection,location:{hash:'',href:'https://example.test/'},scrollY:0,innerHeight:900});
 window.addEventListener('nh:layout-settled',()=>notifications++);
 vm.runInNewContext(fs.readFileSync(path.join(base,'preview/motion.js'),'utf8'),{window,document,IntersectionObserver:Intersection,Element,Event,URL});
 assert.equal(animations.length,2);assert.equal(notifications,0);animations[0].onfinish();assert.equal(notifications,1);
 document.hidden=true;document.emit('visibilitychange');assert.equal(notifications,2);animations[0].onfinish();animations[1].oncancel();assert.equal(notifications,2,'Obsolete callbacks must not schedule duplicate measurements');
});
test('Queued reveal callbacks cannot affect a replacement observer after visibility changes',()=>{
 const classes=new Set(),observers=[],animations=[],preference=events({matches:true});
 const root={classList:{add:n=>classes.add(n),remove:n=>classes.delete(n),contains:n=>classes.has(n)}};
 class Element {
  constructor(){this.dataset={};}
  contains(){return false;}closest(){return null;}querySelector(){return null;}
  getBoundingClientRect(){return {top:1200,bottom:1300};}
  animate(){const animation={cancel(){}};animations.push(animation);return animation;}
 }
 const target=new Element();
 const document=events({hidden:false,documentElement:root,activeElement:null,querySelectorAll:s=>s.startsWith('.landing-manifest-copy')?[target]:[],querySelector:()=>null,getElementById:()=>null});
 class Intersection {constructor(callback){this.callback=callback;this.unobserved=[];observers.push(this);}observe(){}unobserve(element){this.unobserved.push(element);}disconnect(){}}
 class Event {constructor(type){this.type=type;}}
 const window=events({matchMedia:()=>preference,IntersectionObserver:Intersection,location:{hash:'',href:'https://example.test/'},scrollY:200,innerHeight:900});
 vm.runInNewContext(fs.readFileSync(path.join(base,'preview/motion.js'),'utf8'),{window,document,IntersectionObserver:Intersection,Element,Event,URL});
 const oldObserver=observers[0];
 document.hidden=true;document.emit('visibilitychange');document.hidden=false;document.emit('visibilitychange');
 const newObserver=observers[1],entry={target,isIntersecting:true,boundingClientRect:{top:700,bottom:800}};
 oldObserver.callback([entry]);
 assert.equal(animations.length,0);assert.equal(oldObserver.unobserved.length,0);assert.equal(newObserver.unobserved.length,0);
 newObserver.callback([entry]);
 assert.equal(animations.length,1,'The old callback must not mark the target as already seen');assert.equal(newObserver.unobserved.length,1);
});
test('Compact category navigation reveals new context without moving or restoring the page',()=>{
 function navigation({offset=400,width=180,viewport=320,total=800,position=0,type='navigate',ready='interactive'}={}){
  let writes=0;
  const current={getBoundingClientRect:()=>({left:20+offset-position,right:20+offset-position+width,width})};
  const strip={clientLeft:0,clientWidth:viewport,scrollWidth:total,querySelector:()=>current,getBoundingClientRect:()=>({left:20,right:20+viewport}),
   get scrollLeft(){return position;},set scrollLeft(value){position=value;writes++;}};
  const document=events({readyState:ready,documentElement:{dataset:{}},querySelectorAll:()=>[],querySelector:s=>s==='.publication-nav .container'?strip:null});
  const window=events({performance:{getEntriesByType:()=>[{type}]}});
  vm.runInNewContext(fs.readFileSync(path.join(base,'theme/nalar-hakim/assets/site.js'),'utf8'),{window,document,localStorage:{getItem:()=>null}});
  return {document,window,strip,get writes(){return writes;}};
 }
 const hidden=navigation();assert.equal(hidden.strip.scrollLeft,260);assert.equal(hidden.writes,1);
 const visible=navigation({offset:40});assert.equal(visible.strip.scrollLeft,0);assert.equal(visible.writes,0);
 const desktop=navigation({viewport:900,total:900});assert.equal(desktop.writes,0);
 const wide=navigation({width:380});assert.equal(wide.strip.scrollLeft,400,'A long category must expose its beginning');
 const restored=navigation({position:90});assert.equal(restored.strip.scrollLeft,90);assert.equal(restored.writes,0);
 for(const type of ['back_forward','reload']){const h=navigation({type});assert.equal(h.writes,0,type);}
 const pending=navigation({ready:'loading'});assert.equal(pending.writes,0);pending.document.emit('DOMContentLoaded');assert.equal(pending.strip.scrollLeft,260);
 hidden.strip.scrollLeft=75;hidden.window.emit('pageshow',{persisted:true});hidden.window.emit('resize');
 assert.equal(hidden.strip.scrollLeft,75,'History restoration and resize must retain the reader\'s position');assert.equal(hidden.writes,2);
});
console.log(`${passed} scroll-story checks passed; ${failed} failed.`);process.exitCode=failed?1:0;
