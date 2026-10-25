#!/usr/bin/env node
'use strict';
// Deterministic browser contract: actual character geometry, flight time, lifecycle.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname,'..');
const source = fs.readFileSync(path.join(root,'preview/butterfly.js'),'utf8');
const loader = fs.readFileSync(path.join(root,'preview/desktop-nature.js'),'utf8');
function eventTarget(properties={}) {
 const events=new Map();
 return Object.assign(properties,{
  addEventListener(t,h){if(!events.has(t))events.set(t,new Set());events.get(t).add(h);},
  removeEventListener(t,h){events.get(t)?.delete(h);},
  emit(t){for(const h of [...events.get(t)||[]])h({type:t});},
  count(t){return events.get(t)?.size||0;}
 });
}
function harness({capable=true,article=false,dark=false,width=1366,hasScene=true,hasObserver=true,loadOnly=false,shortHeading=false,layoutShift=0}={}) {
 let now=100,scroll=0,nextId=0,created=0,reads=0,metricReads=0;
 const frames=new Map(),timers=new Map(),watchers=new Set(),live=[],head=[],queries=[];
 const media=eventTarget({matches:capable});
 const rect=(x,y,w,h)=>({left:x,right:x+w,top:y-scroll+layoutShift,bottom:y-scroll+h+layoutShift,width:w,height:h});
 function element(tag){
  created++;const attrs={};
  const n=eventTarget({nodeType:1,tagName:tag,dataset:{},style:{setProperty(k,v){this[k]=v;}},childNodes:[],hidden:false,
   setAttribute(k,v){attrs[k]=v;for(const w of [...watchers])if(w.element===n&&(!w.filter||w.filter.includes(k)))w.callback();},
   getAttribute(k){return attrs[k]??null;},
   remove(){for(const arr of [live,head]){const i=arr.indexOf(n);if(i>=0)arr.splice(i,1);}},
   click(){n.emit('click');},
   append(...nodes){live.push(...nodes);},
   querySelector(s){if(['.butterfly-body','.firefly-body'].includes(s))return n.visualBody||={style:{}};throw Error('Unexpected generated selector '+s);}
  });if(tag==='canvas')n.getContext=()=>({font:'',measureText(char){metricReads++;const size=parseFloat(this.font.match(/([\d.]+)px/)[1]);return{fontBoundingBoxAscent:size*.8,actualBoundingBoxAscent:size*(/[A-Z]/.test(char)?.6:.5)};}});return n;
 }
 function heading(x,y,text,columns=28,charWidth=16,charHeight=38){
  const h=element('h2');let cursor=0;
  // Multiple nested text nodes, punctuation/whitespace, and a wrapped second line.
  const parts=[text.slice(0,6),text.slice(6,16),text.slice(16)];
  h.childNodes=parts.map(t=>{const start=cursor;cursor+=t.length;const textNode={nodeType:3,textContent:t,glyph(offset){const i=start+offset;return rect(x+(i%columns)*charWidth,y+Math.floor(i/columns)*(charHeight+8),charWidth,charHeight);}};const span=element('span');span.childNodes=[textNode];span.fontSize=charHeight;span.parentElement=h;textNode.parentElement=span;return span;});
  h.getBoundingClientRect=()=>{reads++;return rect(x,y,Math.min(columns,text.length)*charWidth,Math.ceil(text.length/columns)*(charHeight+8));};return h;
 }
 const headings={
  '#landing-title':heading(40,280,shortHeading?'A':'NALAR HAKIM',5,70,90),
  '#landing-manifest-title':heading(180,1000,'  Nama disamarkan. Argumen diuji.',28),
  '#landing-channels-title':heading(200,1850,'TIGA BENTUK. SATU SIKAP.',28),
  '#landing-invitation-title':heading(200,2700,'AJUKAN ARGUMEN.',28),
  '#idea-flow-title':heading(200,3550,'Dari gagasan, menjadi percakapan.',28),
  '.landing-footer-brand':heading(150,4400,'NALAR HAKIM.',28)
 };
 const articleHeadings=[120,1000,2000,3000].map(y=>heading((width-940)/2,y,'  Pertanyaan hukum: alasan dan akibat bagi masyarakat.',28));
 let selectorUsed='';
 const articleNode={querySelectorAll(s){selectorUsed=s;return articleHeadings;},getBoundingClientRect(){reads++;return rect((width-940)/2,120,940,3500);}};
 const svg={getBoundingClientRect(){reads++;return rect(650,120,500,500);}};
 const scene={querySelector:s=>{assert.equal(s,'svg','Scene must not depend on a manual control');return svg;}};
 const html=element('html');html.dataset.theme=dark?'dark':'light';
 const document=eventTarget({hidden:false,documentElement:html,currentScript:{dataset:{butterflySrc:'preview/butterfly.js?v=test'}},
  querySelector:s=>s==='[data-nature-scene]'?(!article&&hasScene?scene:null):s==='.article-layout'?(article?articleNode:null):headings[s]||null,
  createElement:element,createRange(){let node,offset;return {setStart(n,o){node=n;offset=o;},setEnd(){},getBoundingClientRect(){reads++;return node.glyph(offset);}};},
  body:{append(...n){live.push(...n);}},head:{append(n){head.push(n);}}
 });
 class Observer{constructor(callback){this.callback=callback;}observe(element,opts){this.element=element;this.filter=opts.attributeFilter;watchers.add(this);}disconnect(){watchers.delete(this);}}
 const window=eventTarget({MutationObserver:hasObserver?Observer:undefined});
 const context={document,window,MutationObserver:Observer,matchMedia:q=>{queries.push(q);return media;},innerWidth:width,innerHeight:900,
  getComputedStyle:n=>({fontStyle:'normal',fontWeight:'700',fontSize:`${n.fontSize||38}px`,fontFamily:'Arial, sans-serif',textTransform:'none'}),
  requestAnimationFrame:f=>{const id=++nextId;frames.set(id,f);return id;},cancelAnimationFrame:id=>frames.delete(id),
  setTimeout:(f,delay)=>{const id=++nextId;timers.set(id,{f,due:now+delay});return id;},clearTimeout:id=>timers.delete(id)};
 created=0;vm.runInNewContext(loadOnly?loader:source,context);
 const h={document,window,media,html,live,head,frames,timers,queries,
  get created(){return created;},get reads(){return reads;},get metricReads(){return metricReads;},get watchers(){return watchers.size;},get selectorUsed(){return selectorUsed;},
  get butterfly(){return live.find(n=>n.className==='nature-butterfly');},get fireflies(){return live.filter(n=>n.className==='nature-firefly');},
  get control(){return live.find(n=>n.className==='nature-page-toggle');},get visitors(){return live.filter(n=>['nature-butterfly','nature-firefly'].includes(n.className));},
  step(ms=16){now+=ms;const batch=[...frames];frames.clear();for(const [,f]of batch)f(now);for(const [id,t]of [...timers])if(t.due<=now){timers.delete(id);t.f();}},
  settle(limit=1800){let i=0;while(frames.size&&i++<limit)h.step();assert.equal(frames.size,0,'Flight failed to rest');},
  theme(value){html.dataset.theme=value;html.setAttribute('data-theme',value);},
  scrollTo(value){scroll=value;window.emit('scroll');},
  visibility(hidden){document.hidden=hidden;document.emit('visibilitychange');},
  capability(value){media.matches=value;media.emit('change');},
  position(node=h.butterfly){const m=node.style.transform.match(/translate3d\(([-\d.]+)px,([-\d.]+)px/);return {x:+m[1],y:+m[2]};},
  feet(node=h.butterfly){const p=h.position(node),size=parseFloat(node.style['--visitor-size']);return{x:p.x+size/2,y:p.y+size*(node.className==='nature-butterfly'?.86:.65625)};},
  resize(w){context.innerWidth=w;window.emit('resize');},
  settleLayout(value){layoutShift=value;window.emit('nh:layout-settled');}
 };return h;
}
let count=0,failed=0;
function test(name,fn){try{fn();count++;console.log('PASS '+name);}catch(e){failed++;console.error('FAIL '+name+': '+e.message);}}
test('Desktop loader is inert on mobile and loads only once when capable',()=>{
 const h=harness({capable:false,loadOnly:true});assert.equal(h.created,0);assert.equal(h.frames.size,0);h.capability(true);assert.equal(h.head.length,1);h.capability(false);h.capability(true);assert.equal(h.head.length,1);
 for(const c of ['min-width: 1024px','hover: hover','pointer: fine','prefers-reduced-motion: no-preference'])assert.ok(h.queries[0].includes(c));
});
test('Failed loader can recover after a later capability change',()=>{const h=harness({loadOnly:true});h.head[0].onerror();assert.equal(h.head.length,0);h.capability(false);h.capability(true);assert.equal(h.head.length,1);});
test('Mobile, unsupported and unrelated pages create no visitors or frame work',()=>{
 for(const config of [{capable:false},{hasScene:false},{hasObserver:false},{article:true,capable:false}]){const h=harness(config);assert.equal(h.created,0);assert.equal(h.frames.size,0);assert.equal(h.watchers,0);}
});
test('Butterfly enters from outside then rests on Justitia with an idle RAF',()=>{
 const h=harness();assert.ok(h.position().x<0);h.settle();assert.equal(h.butterfly.dataset.flight,'rest');assert.equal(h.butterfly.dataset.perchKind,'statue');assert.ok(Math.abs(h.feet().x-880)<.02);assert.equal(h.frames.size,0);assert.equal(h.timers.size,1);
});
test('Theme handoff waits for complete sideways departure before other species enters',()=>{
 const h=harness();h.settle();const old=h.butterfly;h.theme('dark');assert.equal(h.butterfly,old);assert.equal(old.dataset.phase,'exiting');assert.equal(h.fireflies.length,0);
 const before=h.position().x;h.step();assert.notEqual(h.position().x,before);
 for(let n=0;h.butterfly&&n<1000;n++){h.step();if(h.butterfly)assert.equal(h.fireflies.length,0);}
 assert.equal(h.butterfly,undefined);assert.ok(h.position(old).x>1366,'Removed butterfly before it left viewport');assert.equal(h.fireflies.length,3);assert.ok(h.fireflies.every(v=>v.dataset.phase==='entering'));h.settle();assert.ok(h.fireflies.every(v=>v.dataset.flight==='rest'));
});
test('Night visitors enter separately, settle on distinct first-line glyphs, and fold wings',()=>{
 const h=harness({dark:true});assert.equal(h.fireflies.length,3);h.step();const reads=h.reads;h.settle();assert.equal(h.reads,reads,'Flight reads layout per frame');
 const ids=h.fireflies.map(n=>n.innerHTML.match(/id="(nh-firefly-glow-\d)"/)[1]);assert.equal(new Set(ids).size,3);
 assert.equal(new Set(h.fireflies.map(n=>n.dataset.perch)).size,3);assert.ok(h.fireflies.every(n=>n.dataset.flight==='rest'&&n.dataset.perchKind==='letter'));
 const feet=h.fireflies.map(n=>h.feet(n));assert.ok(feet.every(p=>Math.abs(p.y-297)<.02));for(let i=1;i<feet.length;i++)assert.ok(Math.abs(feet[i].x-feet[i-1].x)>48);
 assert.equal(h.frames.size,0);assert.equal(h.timers.size,1);
});
test('Insufficient spaced letters use separate margin perches without stacking visitors',()=>{
 const h=harness({dark:true,shortHeading:true});h.settle();assert.equal(h.fireflies.filter(n=>n.dataset.perchKind==='letter').length,1);assert.equal(h.fireflies.filter(n=>n.dataset.perchKind==='margin').length,2);assert.equal(new Set(h.fireflies.map(n=>n.dataset.perch)).size,3);
});
test('Reverse handoff flies all three away before the butterfly enters',()=>{
 const h=harness({dark:true});h.settle();h.theme('light');assert.equal(h.fireflies.length,3);assert.equal(h.butterfly,undefined);h.settle();assert.equal(h.fireflies.length,0);assert.ok(h.butterfly);assert.equal(h.butterfly.dataset.flight,'rest');
});
test('Rapid reversals honor the latest requested theme without duplicate DOM or frames',()=>{
 const h=harness();h.settle();for(let i=0;i<12;i++){h.theme('dark');h.step(30);h.theme('light');h.step();assert.equal(h.fireflies.length,0);assert.equal(h.live.length,2);assert.ok(h.frames.size<=1);assert.equal(h.watchers,1);}
 h.theme('dark');h.settle();assert.equal(h.fireflies.length,3);assert.equal(h.live.length,4);assert.equal(h.frames.size,0);
});
test('Desktop starts automatically without creating pause controls on landing or articles',()=>{
 for(const article of [false,true]){const h=harness({article});assert.equal(h.control,undefined);assert.ok(h.frames.size>0);assert.equal(h.watchers,1);h.settle();assert.equal(h.butterfly.dataset.flight,'rest');assert.ok(h.live.every(n=>n.tagName!=='button'));}
});
test('Theme change in a hidden tab freezes departure and resumes automatically',()=>{
 const h=harness({article:true});h.settle();h.visibility(true);h.theme('dark');const before=h.position();assert.ok(h.butterfly);assert.equal(h.fireflies.length,0);assert.equal(h.frames.size,0);h.step(60000);assert.deepEqual(h.position(),before);assert.equal(h.butterfly.dataset.paused,'true');h.visibility(false);h.settle();assert.equal(h.fireflies.length,3);
});
test('Hidden tab freezes entry without time jumps; resumed night flight settles',()=>{
 const h=harness({dark:true});for(let i=0;i<30;i++)h.step();const before=h.visitors.map(n=>h.position(n));h.visibility(true);h.step(60000);assert.equal(h.frames.size,0);assert.equal(h.timers.size,0);assert.deepEqual(h.visitors.map(n=>h.position(n)),before);
 h.visibility(false);h.step();h.visitors.forEach((v,i)=>assert.ok(Math.hypot(h.position(v).x-before[i].x,h.position(v).y-before[i].y)<12));h.settle();
});
test('Pagehide freezes transition; pageshow completes and capability loss cleans up',()=>{
 const h=harness();h.settle();h.theme('dark');h.window.emit('pagehide');assert.equal(h.frames.size,0);h.visibility(false);assert.equal(h.frames.size,0);h.window.emit('pageshow');h.settle();assert.equal(h.fireflies.length,3);
 h.capability(false);assert.equal(h.live.length,0);assert.equal(h.frames.size,0);assert.equal(h.timers.size,0);assert.equal(h.watchers,0);assert.equal(h.window.count('scroll'),0);assert.equal(h.window.count('nh:layout-settled'),0);assert.equal(h.document.count('visibilitychange'),0);h.capability(true);h.settle();assert.equal(h.fireflies.length,3);assert.equal(h.window.count('scroll'),1);assert.equal(h.window.count('nh:layout-settled'),1);
});
test('Scroll sends visitors on curved flights to fresh heading letters instead of snapping',()=>{
 const h=harness({dark:true});h.settle();const before=h.visitors.map(n=>h.position(n));h.scrollTo(850);assert.deepEqual(h.visitors.map(n=>h.position(n)),before);h.step();assert.ok(h.visitors.some(n=>n.dataset.flight==='fly'));h.settle();assert.ok(h.visitors.every(n=>n.dataset.perchKind==='letter'));assert.ok(h.visitors.every(n=>n.dataset.perch.startsWith('1:')));
});
test('Article title and subheadings use real nested first-line letters for both species',()=>{
 for(const width of [1024,1366]){
  const h=harness({article:true,width});assert.ok(!h.selectorUsed.includes('article-footer'));assert.equal(h.control,undefined);h.settle();assert.equal(h.butterfly.dataset.perchKind,'letter');assert.ok(h.feet().x>(width-940)/2);assert.ok(Math.abs(h.feet().y-130.4)<.02);
  h.theme('dark');h.settle();assert.equal(new Set(h.fireflies.map(n=>n.dataset.perch)).size,3);assert.ok(h.fireflies.every(n=>Math.abs(h.feet(n).y-130.4)<.02));h.scrollTo(944.1875);h.settle();assert.ok(h.fireflies.every(n=>n.dataset.perch.startsWith('1:')));assert.ok(h.fireflies.every(n=>Math.abs(h.feet(n).y-66.2125)<.02));
 }
});
test('Perches use visible glyph ink bounds, caching typography outside the flight loop',()=>{
 const h=harness({dark:true,shortHeading:true});h.settle();const letter=h.fireflies.find(n=>n.dataset.perchKind==='letter');assert.ok(Math.abs(h.feet(letter).y-297)<.02,'Feet must meet ink top at298, not Range box top280');const measured=h.metricReads;h.resize(1366);h.settle();assert.equal(h.metricReads,measured,'Unchanged typography should reuse cached ink metrics');
});
test('A gap in article headings uses quiet margin perches, then returns to letters',()=>{
 const h=harness({article:true,dark:true});h.settle();h.scrollTo(3100);h.settle();assert.ok(h.fireflies.every(n=>n.dataset.perchKind==='margin'));assert.equal(h.frames.size,0);h.scrollTo(940);h.settle();assert.ok(h.fireflies.every(n=>n.dataset.perchKind==='letter'));
});
test('Rest timer moves only one visitor at a time and returns to idle',()=>{
 const h=harness({dark:true});h.settle();h.step(13100);assert.equal(h.frames.size,1);h.step();assert.equal(h.visitors.filter(n=>n.dataset.flight==='fly').length,1);h.settle();assert.equal(h.frames.size,0);assert.equal(h.timers.size,1);
});
test('Capability restoration automatically starts the current theme with no controls',()=>{const h=harness({article:true,dark:true});h.settle();h.capability(false);h.capability(true);assert.equal(h.control,undefined);assert.equal(h.frames.size,1);h.settle();assert.ok(h.fireflies.every(n=>n.dataset.paused==='false'&&n.dataset.flight==='rest'));});
test('Resize remeasures heading perches without duplicate visitors',()=>{const h=harness({dark:true});h.settle();h.resize(1024);h.settle();assert.equal(h.fireflies.length,3);assert.equal(h.live.length,4);assert.equal(h.frames.size,0);assert.ok(h.fireflies.every(n=>h.feet(n).x>=0&&h.feet(n).x<=1024));});
test('Reveal completion refreshes transformed heading perches once without snapping',()=>{
 const h=harness({article:true,dark:true,layoutShift:12});h.settle();const before=h.visitors.map(n=>h.feet(n));assert.ok(before.every(p=>Math.abs(p.y-142.4)<.02));
 h.settleLayout(0);assert.equal(h.frames.size,1);assert.deepEqual(h.visitors.map(n=>h.feet(n)),before);h.step();const reads=h.reads;h.settle();assert.equal(h.reads,reads,'Layout must not be reread on every flight frame');assert.ok(h.visitors.every(n=>Math.abs(h.feet(n).y-130.4)<.02));
});
console.log(`${count} companion checks passed; ${failed} failed.`);process.exitCode=failed?1:0;
