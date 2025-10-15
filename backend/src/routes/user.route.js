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

router.route("/register").post(upload.single("avatar"), registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJwt, logOutUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-password").post(verifyJwt, changeCurrentPassword);

router.route("/me").get(verifyJwt, getCurrentUser);
router.route("/account-detail-update").put(verifyJwt, updateAccountDetails);

router
  .route("/update-avatar")
  .put(verifyJwt, upload.single("avatar"), deleteAndUpdateAvatar);

export default router;
