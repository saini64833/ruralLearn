import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  uploadLesson,
  updateLesson,
  deleteLesson,
  likeLesson,
  commentLesson,
  getAllLessons,
   getLessonById,
} from "../controllers/lessons.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { roleVerification } from "../middlewares/role.middlewares.js";

const router = Router();

// Upload a new lesson
router.post(
  "/upload-lesson",
  verifyJwt,
  roleVerification(["Teacher"]),
  upload.fields([{ name: "pdfUrl" }, { name: "videoUrl" }]),
  uploadLesson
);

// Update a lesson
router.put(
  "/:id",
  verifyJwt,
  roleVerification(["Teacher"]),
  upload.fields([{ name: "pdfUrl" }, { name: "videoUrl" }]),
  updateLesson
);

// Delete a lesson
router.delete("/:id", verifyJwt, roleVerification(["Teacher"]), deleteLesson);

// Like a lesson
router.put(
  "/:id/like",
  verifyJwt,
  roleVerification(["Teacher", "Student"]),
  likeLesson
);

// Comment on a lesson
router.post(
  "/:id/comment",
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

// Get lesson by ID (for LessonDetail page)
router.get(
  "/:id",
  verifyJwt,
  roleVerification(["Teacher", "Student"]),
  getLessonById
);

export default router;
