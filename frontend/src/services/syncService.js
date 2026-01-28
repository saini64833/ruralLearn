import { dbPromise } from "../db/indexedDb";

export const saveQuizOffline = async (quizData) => {

  const db = await dbPromise;

  await db.add("syncQueue", {
    type: "QUIZ",
    payload: quizData,
  });
};
