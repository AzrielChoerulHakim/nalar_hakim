/* Mobile hero: play once when the existing balance actually enters view. */
(() => {
  'use strict';
  function init() {
    const scene=document.querySelector('.landing-hero .scale-scene');
    if (!scene || !('IntersectionObserver' in window)) return;
    const mobile=matchMedia('(max-width:767px), (max-width:1024px) and (pointer:coarse)');
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    let played=false;
    const observer=new IntersectionObserver(entries=>{
      if (!mobile.matches || reduced.matches || played) return;
      if (entries.some(entry=>entry.isIntersecting && entry.intersectionRatio>=.35)) {
        played=true;
        scene.setAttribute('data-mobile-settle','');
        observer.disconnect();
      }
    },{threshold:.35});
    function sync() {
      observer.disconnect();
      if (reduced.matches || !mobile.matches) scene.removeAttribute('data-mobile-settle');
      else if (!played) observer.observe(scene);
    }
    for(const query of [mobile,reduced]) {
      if(query.addEventListener) query.addEventListener('change',sync);
      else query.addListener(sync);
    }
    sync();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
