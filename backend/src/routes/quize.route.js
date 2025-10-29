import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { roleVerification } from "../middlewares/role.middlewares.js";
import { updateQuize, uploadQuize } from "../controllers/quizzes.controller.js";
const router = Router();

router.post(
  "/upload-quize",
  verifyJwt,
  roleVerification(["Teacher"]),
  uploadQuize
);
router.put(
  "/update-quize/:id",
  verifyJwt,
  roleVerification(["Teacher"]),
  updateQuize
);

export default router;
