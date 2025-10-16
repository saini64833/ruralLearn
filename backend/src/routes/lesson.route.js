import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  uploadLesson,
  updateLesson,
  deleteLesson,
  likeLesson,
  commentLesson,
  getAllLessons,
} from "../controllers/lessons.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { roleVerification } from "../middlewares/role.middlewares.js";

const router = Router();

// Upload lesson
router.post(
  "/upload-lesson",
  verifyJwt,
  roleVerification(["Teacher"]),
  upload.fields([{ name: "pdfUrl" }, { name: "videoUrl" }]),
  uploadLesson
);

// Update lesson
router.put(
  "/lesson/:id",
  verifyJwt,
  roleVerification(["Teacher"]),
  upload.fields([{ name: "pdfUrl" }, { name: "videoUrl" }]),
  updateLesson
);

// Delete lesson
router.delete(
  "/lesson/:id",
  verifyJwt,
  roleVerification(["Teacher"]),
  deleteLesson
);

// Like a lesson
router.put(
  "/lesson/:id/like",
  verifyJwt,
  roleVerification(["Teacher", "Student"]),
  likeLesson
);

// Comment on a lesson
router.post(
  "/lesson/:id/comment",
  verifyJwt,
  roleVerification(["Teacher", "Student"]),
  commentLesson
);

// Get all lessons
router.get(
  "/get-all-lessons",
  verifyJwt,
  roleVerification(["Teacher", "Student"]),
  getAllLessons
);

export default router;
