// 離線快取：先回快取、背景更新（stale-while-revalidate）；改版時提升 VERSION
const VERSION = 'selfcare-v1';
const FILES = ['./','index.html','disease.html','westmed.html','tcm.html','cpm.html','herbs.html','knowledge.html',
  'common.css','common.js','pharm.js','data_disease.js','data_west.js','data_tcm.js','data_cpm.js','data_herb.js',
  'manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable.png','apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.open(VERSION).then(async c => {
    const hit = await c.match(e.request, { ignoreSearch: true });
    const net = fetch(e.request).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});
