self.addEventListener("sync", (event) => {
  if (event.tag === "quiz-sync") {
    event.waitUntil(syncQuiz());
  }
});
async function syncQuiz() {
  const db = await openDB("rural-learn-db", 1);
  const all = await db.getAll("syncQueue");

  for (let item of all) {
    if (item.type === "QUIZ") {
      await fetch("/api/quize-result", {
        method: "POST",
        body: JSON.stringify(item.payload),
        headers: {
          "Content-Type": "application/json",
        },
      });

      await db.delete("syncQueue", item.id);
    }
  }
}
workbox.routing.registerRoute(
  ({ url }) => url.pathname.includes("/lessons"),
  new workbox.strategies.NetworkFirst({
    cacheName: "lesson-api",
  }),
);
workbox.routing.registerRoute(
  ({ request }) =>
    request.destination === "video" ||
    request.destination === "image" ||
    request.destination === "document",

  new workbox.strategies.CacheFirst({
    cacheName: "media-cache",
  })
);
