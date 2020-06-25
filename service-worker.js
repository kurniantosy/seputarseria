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
  "/article.html",
  "/src/pages/about.html",
  "/src/pages/favorite.html",
  "/src/pages/home.html",
  "/src/pages/klasemen.html",
  "/bundle.js",
  "/src/assets/apple-ico.png",
  "/src/assets/favicon.ico",
  "/src/assets/ikonku.png",
  "/src/assets/walpaper.jpg",
  "/src/js/api.js",
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
  var base_url = "https://api.football-data.org/v2";
  if (event.request.url.indexOf(base_url) > -1) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async function (cache) {
        const response = await fetch(event.request);
        cache.put(event.request.url, response.clone());
        return response;
      })
    );
  } else {
    event.respondWith(
      caches
        .match(event.request, { ignoreSearch: true })
        .then(function (response) {
          return response || fetch(event.request);
        })
    );
  }
});
