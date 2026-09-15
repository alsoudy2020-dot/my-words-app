const CACHE_NAME = 'vocab-v2';
const ASSETS = ['./', './index.html', './manifest.json', './icon.svg'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // جلب الملفات من الإنترنت أولاً إذا توفر لتحديث التعديلات فوراً، والاعتماد على الكاش عند عدم توفر نت
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
