import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  loginUser,
  logOutUser,
  registerUser,
  refreshAccessToken,
  changeCurrentPassword,
  updateAccountDetails,
  getCurrentUser,
  deleteAndUpdateAvatar,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", upload.single("avatar"), registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyJwt, logOutUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/change-password", verifyJwt, changeCurrentPassword);
router.get("/me", verifyJwt, getCurrentUser);
router.put("/account-detail-update", verifyJwt, updateAccountDetails);
router.put(
  "/update-avatar",
  verifyJwt,
  upload.single("avatar"),
  deleteAndUpdateAvatar
);

export default router;
