var cacheName = 'mq-v6';
var filesToCache = [
  '/',
  '/index.html',
  '/css/bootstrap.min.css',
  '/js/bootstrap.bundle.js',
  '/js/app/constants.js',
  '/js/app/db.js',
  '/js/app/ui-state-manager.js',
  '/js/app/alias-manager.js',
  '/js/app/dom-helpers.js',
  '/js/app/validators.js',
  '/js/app/app.js'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

/* Clean up old caches when activating */
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(name) {
          if (name !== cacheName) {
            return caches.delete(name);
          }
        })
      );
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
