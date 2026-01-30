const CACHE_NAME = 'checkin-go-v15-absolute-paths';
const STATIC_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg'
];

// 1. INSTALAÇÃO
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Instalando App Shell');
      return cache.addAll(STATIC_URLS);
    })
  );
});

// 2. ATIVAÇÃO
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. INTERCEPTAÇÃO DE REDE
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // A. Cache de Clima e Mapas (Stale-While-Revalidate)
  if (url.hostname.includes('open-meteo.com') || url.hostname.includes('openstreetmap.org')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            if(networkResponse.ok) {
                cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
             // Fallback silencioso
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // B. Ignorar outras APIs dinâmicas
  if (event.request.method !== 'GET' || (
      url.hostname.includes('googleapis') ||
      url.hostname.includes('firebase') ||
      url.hostname.includes('identitytoolkit')
  )) {
    return;
  }

  // C. Assets do Vite e Estáticos - Cache First
  if (url.pathname.startsWith('/assets/') || 
      url.pathname.endsWith('.js') || 
      url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.svg')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then((networkResponse) => {
          if(networkResponse.ok) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse.clone()));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // D. Navegação (HTML) - Network First com Fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          const resClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
          return networkResponse;
        })
        .catch(() => {
          return caches.match('/index.html')
            .then((res) => res || caches.match('/'));
        })
    );
    return;
  }
});