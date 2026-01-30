import { openDB } from "idb";
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { NetworkFirst, CacheFirst } from "workbox-strategies";

// Precache build files
precacheAndRoute(self.__WB_MANIFEST);

// Cache API
registerRoute(
  ({ url }) => url.origin.includes("onrender.com"),
  new NetworkFirst({
    cacheName: "api-cache",
    networkTimeoutSeconds: 3,
  })
);

// Cache Images & Videos
registerRoute(
  ({ request }) =>
    request.destination === "image" ||
    request.destination === "video" ||
    request.destination === "font",
  new CacheFirst({
    cacheName: "media-cache",
  })
);

// Background Sync
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-quiz") {
    event.waitUntil(syncQuiz());
  }
});

async function syncQuiz() {
  const db = await openDB("rural-learn-db", 1);
  const all = await db.getAll("syncQueue");

  for (let item of all) {
    await fetch("https://rurallearn-wwxx.onrender.com/api/v1/quizzes/result", {
      method: "POST",
      body: JSON.stringify(item.payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    await db.delete("syncQueue", item.id);
  }
}
