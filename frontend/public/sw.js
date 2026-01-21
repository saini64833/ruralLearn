const STATIC_CACHE = "rural-static-v1";
const IMAGE_CACHE = "rural-images";
const DYNAMIC_CACHE = "rural-dynamic";

const STATIC_FILES = [
  "/",
  "/index.html",
  "/offline.html",
  "/manifest.json"
];

// INSTALL
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_FILES);
    })
  );
  self.skipWaiting();
});

// ACTIVATE
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (
            key !== STATIC_CACHE &&
            key !== IMAGE_CACHE &&
            key !== DYNAMIC_CACHE
          ) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// FETCH
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // IMAGE CACHE
  if (req.destination === "image") {
    event.respondWith(imageStrategy(req));
    return;
  }

  // NETWORK SPEED BASED
  event.respondWith(networkAware(req));
});

// IMAGE STRATEGY
async function imageStrategy(req) {
  const cache = await caches.open(IMAGE_CACHE);
  const cached = await cache.match(req);

  if (cached) return cached;

  const fresh = await fetch(req);
  cache.put(req, fresh.clone());
  return fresh;
}

// NETWORK SPEED BASED STRATEGY
async function networkAware(req) {
  try {
    const fresh = await fetch(req);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    const cached = await caches.match(req);
    return cached || caches.match("/offline.html");
  }
}

// BACKGROUND SYNC
self.addEventListener("sync", (event) => {
  if (event.tag === "syncForms") {
    event.waitUntil(syncOfflineForms());
  }
});

// PUSH NOTIFICATION
self.addEventListener("push", (event) => {
  const data = event.data.json();

  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "/icon-192.png",
    badge: "/icon-192.png"
  });
});
