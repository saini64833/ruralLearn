import jwt  from  "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
export const verifyJwt = asyncHandler(async (req, _, next) => {
  try {
    const token = req.cookie?.accessToken || req.header("Authorization")?.replace("Bearer", "");
    if (!token) {
      throw new ApiError(401, "unAuthorized request");
    }

    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    if (!user) {
      throw new ApiError(401, "user does not exist!!");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(400, error?.message || "invailid accessToken!!");
  }
});
