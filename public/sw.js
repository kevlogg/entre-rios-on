// ON+ Portal Comercial — PWA Service Worker
const CACHE_NAME = 'onmas-portal-v5';
const SHELL_URLS = ['/', '/catalogo', '/comercios', '/turismo', '/planes'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Solo maneja solicitudes GET
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  // No interceptar rutas de API ni Supabase
  if (url.pathname.startsWith('/api/') || url.hostname.includes('supabase')) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      // Network-first para HTML, cache-first para assets
      if (event.request.mode === 'navigate') {
        return fetch(event.request).catch(() => cached || caches.match('/'));
      }
      return cached || fetch(event.request);
    })
  );
});
