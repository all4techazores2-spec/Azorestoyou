const CACHE_NAME = 'azores-toyou-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-512.png',
  '/teste.mp4'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 1. Sempre retornar do cache se for uma imagem e já existir
      if (cachedResponse && event.request.url.match(/\.(jpg|jpeg|png|gif|svg|webp)/)) {
        return cachedResponse;
      }

      // 2. Senão, ir à rede
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && !event.request.url.includes('onrender.com')) {
           return networkResponse;
        }

        // Cachear dinamicamente todas as imagens e assets estáticos
        const url = event.request.url;
        if (url.match(/\.(jpg|jpeg|png|gif|svg|webp|mp4|css|js)/) || url.includes('/imagens/')) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }

        return networkResponse;
      }).catch(() => {
        // Fallback para navegação offline
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
        return cachedResponse;
      });
    })
  );
});
