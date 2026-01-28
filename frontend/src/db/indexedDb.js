import { openDB } from "idb";

export const dbPromise = openDB("rural-learn-db", 1, {
  upgrade(db) {

    db.createObjectStore("lessons", { keyPath: "_id" });
    db.createObjectStore("videos", { keyPath: "_id" });
    db.createObjectStore("quizResults", { keyPath: "_id" });
    db.createObjectStore("progress", { keyPath: "_id" });

    // offline submit queue
    db.createObjectStore("syncQueue", {
      keyPath: "id",
      autoIncrement: true,
    });
  },
});
