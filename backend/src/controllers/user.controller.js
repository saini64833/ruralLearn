import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error.message);
    throw new ApiError(500, "something went wrong!!");
  }
};

const option = {
  httpOnly: true,
  secure: true,
};

const registerUser = asyncHandler(async (req, res) => {
  const { password, fullName, userName, email, role, grade, school } = req.body;
  console.log("email:", email);
  console.log("password:", password);
  console.log("fullName:", fullName);
  console.log("userName:", userName);
  console.log("role:", role);
  if (
    [fullName, userName, email, password, role, grade, school].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All Field Are Required!");
  }
  const existedUser = await User.findOne({
    $or: [{ email }, { userName }],
  });
  if (existedUser) {
    throw new ApiError(400, "User allready exist!!");
  }
  const avatarLocalPath = await req.files?.avatar?.[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "avtar local path required!!");
  }
  const user = await User.create({
    password,
    fullName,
    userName: userName.toLowerCase(),
    email,
    role,
    grade,
    school,
    avatar: avatar.url,
  });
  const createdUser = await User.findById(user._id).select("-password -refreshToken");
  if (!createdUser) {
    throw new ApiError(500, "something went wrong registering user");
  }
  return res.status(201).json(new ApiResponse(200, createdUser, "user registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { userName, email, password, role } = req.body;
  if (!(userName || email || role)) {
    throw new ApiError(400, "email,role and username equired");
  }
  const user = await User.findOne({
    $or: [{ email }, { role }, { userName }],
  });
  if (!user) {
    throw new ApiError(400, "User does not exist!!");
  }

  const isPasswordVailid = await user.isPasswordCorrect(password);

  if (!isPasswordVailid) {
    throw new ApiError(401, "password is invailid!!");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  const logedInUser = await User.findById(user._id).select("-password -refreshToken");

  console.log(logedInUser);

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, option)
    .cookie("accessToken", accessToken, option)
    .json(
      new ApiResponse(
        200,
        {
          user: logedInUser,
          refreshToken,
          accessToken,
        },
        "User logged in successfully!!"
      )
    );
});

const logOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, {}, "User successfully loged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "refreshToken expired!!");
  }

  try {
    const decodedRefreshToken = jwt.verify(incomingRefreshToken, process.env.REFERESH_TOKEN_SECRET);
    const user = await User.findById(decodedRefreshToken._id);
    if (!user) {
      throw new ApiError(401, "invailid refreshToken!!");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "rfresh token expired or used");
    }
    const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id);
    return res
      .status(200)
      .cookie("refreshToken", newRefreshToken, option)
      .cookie("accessToken", accessToken, option)
      .json(
        new ApiResponse(
          200,
          {
            refreshToken: newRefreshToken,
            accessToken,
          },
          "successfully refreshToken is refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "refreshToken is invailid");
  }
});



export { registerUser, loginUser, logOutUser, refreshAccessToken };
