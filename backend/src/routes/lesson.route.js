import { Router } from "express";

import { upload } from "../middlewares/multer.middleware.js";

import {
  uploadLesson,
  updateLesson,
  deleteLesson
} from "../controllers/lessons.controller.js";

import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/upload-lesson")
  .post(
    verifyJwt,
    upload.fields([{ name: "pdfUrl" }, { name: "videoUrl" }]),
    uploadLesson
  );

router
  .route("/update-lesson/:id")
  .put(
    verifyJwt,
    upload.fields([{ name: "pdfUrl" }, { name: "videoUrl" }]),
    updateLesson
  );

  router.route("/delete-lesson/:id").put(verifyJwt,deleteLesson)

export default router;
