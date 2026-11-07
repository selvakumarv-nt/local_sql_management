const CACHE_NAME = 'sql-playground-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './css/editor.css',
  './css/responsive.css',
  './js/app.js',
  './js/database.js',
  './js/sqlite-engine.js',
  './js/editor.js',
  './js/query-executor.js',
  './js/database-explorer.js',
  './js/results.js',
  './js/sample-databases.js',
  './js/learning-lab.js',
  './js/exercises.js',
  './js/history.js',
  './js/import-export.js',
  './js/visualizer.js',
  './js/settings.js',
  './vendor/sqlite/sql-wasm.js',
  './vendor/sqlite/sql-wasm.wasm'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request).catch(() => {
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});