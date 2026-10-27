const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(require('node:path').join(__dirname,'../preview/editorial-motion.js'),'utf8');
function events(props={}){const listeners=new Map();return Object.assign(props,{listeners,addEventListener(n,f){let s=listeners.get(n);if(!s)listeners.set(n,s=new Set());s.add(f)},removeEventListener(n,f){listeners.get(n)?.delete(f)},emit(n,e={}){for(const f of [...listeners.get(n)||[]])f(e)}})}
function element(){return events({dataset:{},children:[],setAttribute(){},append(n){this.children.push(n)}})}
function setup({reduced=false,hidden=false,supported=true}={}){
 const sections=[element(),element()],portal=element(),media=events({matches:reduced});let observer;
 class Observer{constructor(cb){this.cb=cb;this.watched=new Set();observer=this}observe(n){this.watched.add(n)}unobserve(n){this.watched.delete(n)}disconnect(){this.watched.clear();this.disconnected=true}intersect(n,inside){this.cb([{target:n,isIntersecting:inside}])}}
 const document=events({documentElement:{dataset:{}},hidden,querySelectorAll(s){if(s==='[data-brand-reveal]')return[];if(s==='[data-ink-divider]')return sections;if(s==='[data-quote-portal] .quote-portal-media')return[portal];throw new Error(s)},createElement:element});
 const window=events({matchMedia:()=>media,IntersectionObserver:supported?Observer:undefined});
 const context={document,window,IntersectionObserver:Observer};vm.runInNewContext(source,context);
 return {sections,portal,media,document,window,observer,context,targets:()=>[...sections.flatMap(s=>s.children),portal]};
}
const a=setup();assert.equal(a.observer.watched.size,3);for(const n of a.targets())assert.equal(n.dataset.editorialState,'pending');
const [first,second,portal]=a.targets();a.observer.intersect(first,true);assert.equal(first.dataset.editorialState,'revealing');a.observer.intersect(first,false);assert.equal(first.dataset.editorialState,'shown');assert.equal(a.observer.watched.size,2);
a.observer.intersect(second,true);second.emit('animationend',{animationName:'nh-ink-draw',target:second});assert.equal(second.dataset.editorialState,'shown');
a.observer.intersect(portal,true);portal.emit('animationend',{animationName:'nh-portal-open',target:portal});assert.equal(portal.dataset.editorialState,'shown');assert.ok(a.observer.disconnected);assert.equal(a.media.listeners.get('change').size,0);assert.equal(a.window.listeners.get('pagehide').size,0);
vm.runInNewContext(source,a.context);assert.equal(a.sections[0].children.length,1);
for(const finish of ['hidden','reduce','pagehide']){const h=setup();if(finish==='hidden'){h.document.hidden=true;h.document.emit('visibilitychange')}if(finish==='reduce'){h.media.matches=true;h.media.emit('change')}if(finish==='pagehide')h.window.emit('pagehide');for(const n of h.targets())assert.equal(n.dataset.editorialState,'shown');assert.ok(h.observer.disconnected)}
for(const option of [{reduced:true},{hidden:true},{supported:false}]){const h=setup(option);assert.equal(h.observer,undefined);assert.equal(h.sections[0].children.length,0);assert.equal(h.portal.dataset.editorialState,undefined)}
console.log('PASS editorial one-shot lifecycle, quick scroll exit, animation completion, duplicate setup, hidden tab, reduced-motion change, pagehide, static fallbacks');
