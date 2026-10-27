/*! NEON GEARSTORM — © 2026 Rainwater Games (Jeff Rainwater). All rights reserved. */
// v0.5: network-first that BYPASSES the HTTP cache (GitHub Pages sends max-age=600), so new deploys show on the first open.
const C='ngs-v1.1.1';const F=['./','index.html','build/game.js?v=1.1.1','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F.map(u=>new Request(u,{cache:'no-store'})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>{const old=k.filter(x=>x!==C);return Promise.all(old.map(x=>caches.delete(x))).then(()=>self.clients.claim()).then(()=>{
 // upgrading from an older build: reload any open window so a stale page (old index.html / game.js) is replaced right away
 if(old.length)return self.clients.matchAll({type:'window'}).then(cs=>Promise.all(cs.map(c=>c.navigate(c.url).catch(()=>{}))));});}));});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
 const fresh=r.mode==='navigate'||/(\/|index\.html|game\.js|version\.json|sw\.js)$/.test(u.pathname);
 const p=r.mode==='navigate'?fetch(u.href,{cache:'no-store',credentials:'same-origin'}):fetch(r,fresh?{cache:'no-store'}:{cache:'no-cache'});
 e.respondWith(p.then(res=>{if(res.ok&&!/version\.json$/.test(u.pathname)){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));}return res;}).catch(()=>caches.match(r,{ignoreSearch:r.mode==='navigate'}).then(m=>m||caches.match('index.html'))));});
