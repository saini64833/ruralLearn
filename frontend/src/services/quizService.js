import axios from "../api/axiosInstance";
import { dbPromise } from "../db/indexedDb";

export const getQuizzes = async () => {
  const db = await dbPromise;

  if (navigator.onLine) {
    const res = await axios.get("/quizzes/get-all-quizzes");
    res.data.forEach((quiz) => {
      db.put("quizzes", quiz);
    });

    return res.data;
  } else {
    return await db.getAll("quizzes");
  }
};
