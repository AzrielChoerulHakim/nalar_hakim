/* Mobile editorial motion: native scroll and real existing cover art. */
(() => {
  'use strict';
  function init() {
    const scene=document.querySelector('.landing-hero .scale-scene');
    const covers=[...document.querySelectorAll('.home-main .story-image:has(img)')];
    if(!scene && !covers.length) return;
    const mobile=matchMedia('(max-width:767px), (max-width:1024px) and (pointer:coarse)');
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    let active=false, frame=0;
    const played=new WeakSet();
    const observer='IntersectionObserver' in window ? new IntersectionObserver(entries=>{
      if(!active)return;
      for(const entry of entries) {
        if(entry.isIntersecting && entry.intersectionRatio>=.35 && !played.has(entry.target)){
          played.add(entry.target);
          entry.target.setAttribute('data-nh-reveal','');
          observer.unobserve(entry.target);
        }
      }
    },{threshold:.35}) : null;
    const update=()=>{
      frame=0;
      if(!active || !scene)return;
      const rect=scene.getBoundingClientRect();
      const start=Math.max(0,rect.top+scrollY-innerHeight*.78);
      const end=Math.max(start+1,rect.bottom+scrollY-innerHeight*.20);
      const p=Math.min(1,Math.max(0,(scrollY-start)/(end-start)));
      const angle=9*Math.sin(p*Math.PI*2)*(1-p);
      scene.style.setProperty('--nh-balance-angle',angle.toFixed(3)+'deg');
      scene.style.setProperty('--nh-pan-angle',(-angle).toFixed(3)+'deg');
      scene.style.setProperty('--nh-balance-progress',p.toFixed(4));
      scene.setAttribute('data-mobile-scroll','');
    };
    const schedule=()=>{if(active && scene && !frame)frame=requestAnimationFrame(update)};
    const resize=scene && 'ResizeObserver' in window ? new ResizeObserver(schedule):null;
    function sync(){
      const enabled=mobile.matches && !reduced.matches;
      if(enabled===active){schedule();return;}
      active=enabled;
      observer?.disconnect();
      if(enabled){
        if(scene){
          addEventListener('scroll',schedule,{passive:true});
          addEventListener('resize',schedule,{passive:true});
          addEventListener('pageshow',schedule);
          resize?.observe(scene);
          schedule();
        }
        for(const cover of covers)if(!played.has(cover))observer?.observe(cover);
      }else{
        removeEventListener('scroll',schedule);
        removeEventListener('resize',schedule);
        removeEventListener('pageshow',schedule);
        resize?.disconnect();
        if(frame)cancelAnimationFrame(frame);
        frame=0;
        scene?.removeAttribute('data-mobile-scroll');
        for(const cover of covers)cover.removeAttribute('data-nh-reveal');
      }
    }
    for(const query of [mobile,reduced]){
      if(query.addEventListener)query.addEventListener('change',sync);
      else query.addListener(sync);
    }
    document.fonts?.ready.then(schedule);
    sync();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
