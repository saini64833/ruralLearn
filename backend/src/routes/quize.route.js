import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { roleVerification } from "../middlewares/role.middlewares.js";
import {
  updateQuize,
  uploadQuize,
  getAllQuizzes,
  getQuizeById,
  deleteQuize,
  getQuizResponse,
  resultView,
} from "../controllers/quizzes.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router.post(
  "/upload-quize",
  verifyJwt,
  roleVerification(["Teacher"]),
  upload.none(),
  uploadQuize
);
router.put(
  "/update-quize/:id",
  verifyJwt,
  roleVerification(["Teacher"]),
  upload.none(),
  updateQuize
);
router.get(
  "/get-all-quizzes",
  verifyJwt,
  roleVerification(["Teacher", "Student"]),
  getAllQuizzes
);
router.get(
  "/quize/:id",
  verifyJwt,
  roleVerification(["Teacher", "Student"]),
  getQuizeById
);

router.delete(
  "/quize-delete/:id",
  verifyJwt,
  roleVerification(["Teacher"]),
  deleteQuize
);

router.post(
  "/response/:id",
  verifyJwt,
  roleVerification(["Student"]),
  getQuizResponse
);

router.get(
  "/result/:id",
  verifyJwt,
  roleVerification(["Student"]),
  resultView,
)
export default router;
