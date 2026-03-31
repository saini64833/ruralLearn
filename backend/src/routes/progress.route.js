import express from "express";
import {
  getLeaderBoard,
  getUserRank,
  searchStudents,
  getUserPerformance,
  getGlobalLeaderboard
} from "../controllers/progress.controller.js";

import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.get("/leaderboard", getGlobalLeaderboard);
router.get("/search", searchStudents);
router.get("/:quizId", getLeaderBoard);
router.get("/:quizId/rank", verifyJwt, getUserRank);
router.get("/user/:userId", getUserPerformance);
export default router;

