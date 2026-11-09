"use client";

// Coordinates the preloader → hero handoff. The hero (and anything else that should wait
// for the preloader) calls onSiteReady(); it fires immediately when there is no preloader.

const EVENT = "hevinka:ready";

declare global {
  interface Window {
    __hevinkaReady?: boolean;
  }
}

export function markSiteReady() {
  window.__hevinkaReady = true;
  window.dispatchEvent(new Event(EVENT));
}

export function onSiteReady(cb: () => void): () => void {
  if (window.__hevinkaReady) {
    cb();
    return () => {};
  }
  window.addEventListener(EVENT, cb, { once: true });
  return () => window.removeEventListener(EVENT, cb);
}

/** Inline <head> script: sets `js` (FOUC guard) and `preload` (first visit, motion allowed) before paint. */
export const headScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(!sessionStorage.getItem('hv-visited')&&!matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('preload')}catch(e){}})();`;
