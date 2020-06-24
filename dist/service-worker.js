const CACHE_NAME = "firstpwa-v4";
var urlsToCache = [
  "/",
  "/manifest.json",
  "/src/nav.html",
  "/src/assets/72.png",
  "/src/assets/128.png",
  "/src/assets/144.png",
  "/src/assets/192.png",
  "/src/assets/256.png",
  "/src/assets/512.png",
  "/index.html",
  "/src/pages/about.html",
  "/src/pages/contact.html",
  "/src/pages/home.html",
  "/src/pages/klasemen.html",
  "/bundle.js",
  "/src/assets/apple-ico.png",
  "/src/assets/favicon.ico",
  "/src/assets/ikonku.png",
  "/src/assets/walpaper.jpg",
];
// disini juga aku ubah sesuai file-file yang ada di folder dist, soalnya kan pakai webpack, hehe
// file materialize tidak dimasukkan, kenapa ? karena sudah di bundling oleh webpack, hehe
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("activate", function (event) {
  console.log("Aktivasi service worker baru");
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (
            cacheName !== CACHE_NAME &&
            cacheName.startsWith("codepolitan-reader-lite")
          ) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches
      .match(event.request, { cacheName: CACHE_NAME })
      .then(function (response) {
        if (response) {
          return response;
        }
        var fetchRequest = event.request.clone();
        return fetch(fetchRequest).then(function (response) {
          if (!response || response.status !== 200) {
            return response;
          }
          var responseToCache = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, responseToCache);
          });
          return response;
        });
      })
  );
});
