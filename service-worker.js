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

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName != CACHE_NAME) {
            console.log("ServiceWorker: cache " + cacheName + " dihapus");
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request, { cacheName: CACHE_NAME }).then((response) => {
      if (response) {
        console.log("ServiceWorker: Gunakan aset dari cache: ", response.url);
        return response;
      }

      console.log(
        "ServiceWorker: Memuat aset dari server: ",
        event.request.url
      );
      return fetch(event.request);
    })
  );
});
