import axios from "../api/axiosInstance";
import { dbPromise } from "../db/indexedDb";

export const getLessons = async () => {
  const db = await dbPromise;

  if (navigator.onLine) {
    const res = await axios.get("/lessons");

    res.data.forEach((l) => db.put("lessons", l));

    return res.data;
  } else {
    return await db.getAll("lessons");
  }
};
