import { precacheAndRoute } from "workbox-precaching";
import { registerRoute, setCatchHandler } from "workbox-routing";
import { NetworkFirst, CacheFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { clientsClaim } from "workbox-core";
import { openDB } from "idb";

// Activate SW immediately
self.skipWaiting();
clientsClaim();

// Precache build files
precacheAndRoute(self.__WB_MANIFEST);

// ---------------- API CACHE ----------------

registerRoute(
  ({ url }) => url.origin.includes("onrender.com"),
  new NetworkFirst({
    cacheName: "api-cache",
    networkTimeoutSeconds: 5,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 // 1 hour
      })
    ]
  })
);

// ---------------- CLOUDINARY + MEDIA CACHE ----------------

registerRoute(
  ({ request, url }) =>
    request.destination === "image" ||
    request.destination === "video" ||
    request.destination === "font" ||
    url.origin.includes("cloudinary.com"),
  new CacheFirst({
    cacheName: "media-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 150,
        maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
      })
    ]
  })
);

// ---------------- OFFLINE FALLBACK ----------------

setCatchHandler(async ({ event }) => {
  if (event.request.destination === "image") {
    return caches.match("/offline-image.png");
  }

  if (event.request.mode === "navigate") {
    return caches.match("/offline");
  }

  return Response.error();
});

// ---------------- BACKGROUND SYNC ----------------

self.addEventListener("sync", (event) => {
  if (event.tag === "sync-quiz") {
    event.waitUntil(syncQuiz());
  }
});

async function syncQuiz() {
  try {
    const db = await openDB("rural-learn-db", 1);
    const all = await db.getAll("syncQueue");

    for (let item of all) {
      const res = await fetch(
        "https://rurallearn-wwxx.onrender.com/api/v1/quizzes/result",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item.payload),
        }
      );

      if (res.ok) {
        await db.delete("syncQueue", item.id);
      }
    }
  } catch (err) {
    console.log("Background sync failed — will retry", err);
  }
}
