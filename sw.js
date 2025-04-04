var CACHE_NAME = 'static-assets-v2';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll([
        'index.html',
        "manifest.json",
        'https://cdn.jsdelivr.net/npm/chart.js',
        'https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@3.0.0/dist/chartjs-adapter-date-fns.bundle.min.js'
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log("ServiceWorker ativate");
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(caches.open(CACHE_NAME).then((cache) => {
    return cache.match(event.request).then((cachedResponse) => {
      const fetchedResponse = fetch(event.request).then((networkResponse) => {
        cache.put(event.request, networkResponse.clone());

        return networkResponse;
      });

      return cachedResponse || fetchedResponse;
    });
  }));

});

self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
