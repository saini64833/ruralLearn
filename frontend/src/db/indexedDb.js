import { openDB } from "idb";

export const dbPromise = openDB("rural-learn-db", 1, {
  upgrade(db) {
    db.createObjectStore("lessons", { keyPath: "_id" });
    db.createObjectStore("quizzes", { keyPath: "_id" });
    db.createObjectStore("quizResults", { keyPath: "_id" });
    db.createObjectStore("dashboard", { keyPath: "_id" });
    db.createObjectStore("comments", { keyPath: "_id" });
    db.createObjectStore("syncQueue", {
      keyPath: "id",
      autoIncrement: true,
    });

  },
});
