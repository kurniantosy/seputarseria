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
  "/src/assets/WhatsAp.jpeg",
  "/src/js/api.js",
  "/src/js/idb.js",
  "/src/js/db.js",
  "/src/js/push.js",
  "/src/css/article.css",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
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

self.addEventListener("push", function (event) {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = "Push message no payload";
  }
  var options = {
    body: body,
    icon: "/src/assets/ikonku.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };
  event.waitUntil(
    self.registration.showNotification("Push Notification", options)
  );
});
