import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { NetworkFirst, CacheFirst } from "workbox-strategies";
import { openDB } from "idb";

// Allow update instantly
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Precache build files
precacheAndRoute(self.__WB_MANIFEST);

// Cache API responses
registerRoute(
  ({ url }) => url.origin.includes("onrender.com"),
  new NetworkFirst({
    cacheName: "api-cache",
    networkTimeoutSeconds: 3,
  })
);

// Cache images/videos/icons
registerRoute(
  ({ request }) =>
    request.destination === "image" ||
    request.destination === "video" ||
    request.destination === "font",
  new CacheFirst({
    cacheName: "media-cache",
  })
);

// Background sync listener
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-quiz") {
    event.waitUntil(syncQuiz());
  }
});

async function syncQuiz() {
  const db = await openDB("rural-learn-db", 1);
  const all = await db.getAll("syncQueue");

  for (let item of all) {
    await fetch(
      "https://rurallearn-wwxx.onrender.com/api/v1/quizzes/result",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item.payload),
      }
    );

    await db.delete("syncQueue", item.id);
  }
}
