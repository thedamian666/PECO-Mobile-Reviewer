const CACHE_NAME = "peco-mobile-multicam-shell-v31";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./pecoreview-archive.js",
  "./browser-storage.js",
  "./review-workflow.js",
  "./draft.html",
  "./draft.css",
  "./draft-storage.js",
  "./peco-draft-archive.js",
  "./draft.js",
  "./promo.html",
  "./promo.css",
  "./promo-core.js",
  "./promo-storage.js",
  "./promo.js",
  "./vendor/webm-muxer/webm-muxer.js",
  "./app.js",
  "./manifest.webmanifest",
  "./icons/peco-mobile.svg",
  "./icons/peco-mobile-180.png",
  "./icons/peco-mobile-192.png",
  "./icons/peco-mobile-512.png"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.pathname.includes("/package/")) {
    return;
  }
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
