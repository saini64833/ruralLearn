import { Router } from "express";

import { upload } from "../middlewares/multer.middleware.js";

import { loginUser, logOutUser, registerUser,refreshAccessToken,changeCurrentPassword} from "../controllers/user.controller.js";

import {verifyJwt} from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/register").post(
  upload.single({
    name: "avatar",
    maxCount: 1,
  }),
  registerUser
);

router.route("/login").post(loginUser)

router.route("/logout").post(verifyJwt,logOutUser)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJwt,changeCurrentPassword)
export default router;
