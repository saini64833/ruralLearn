import axios from "../api/axiosInstance";
import { dbPromise } from "../db/indexedDb";

// ONLINE
export const getLessonsOnline = async () => {
  const res = await axios.get("/lessons");

  const db = await dbPromise;
  res.data.forEach((lesson) => {
    db.put("lessons", lesson);
  });

  return res.data;
};

// OFFLINE
export const getLessonsOffline = async () => {
  const db = await dbPromise;
  return await db.getAll("lessons");
};
