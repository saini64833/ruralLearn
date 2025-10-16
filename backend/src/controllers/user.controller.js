import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

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
  console.log("grade:",grade);
  console.log("school:",school)
  if (
    [fullName, userName, email, password, role].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All Field Are Required!");
  }
  if (role === "Student") {
    if ([school, grade].some((field) => field?.trim === "")) {
      throw new ApiError(401, "school and grade required for Student");
    }
  }
  if (role === "Teacher") {
    if (!school) {
      throw new ApiError(401, "school  required for Teacher");
    }
  }
  const existedUser = await User.findOne({
    $or: [{ email }, { userName }],
  });
  if (existedUser) {
    throw new ApiError(400, "User allready exist!!");
  }
  const avatarLocalPath = await req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "avtar local path required!!");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(401, "avatar is required!!");
  } 
  const user = await User.create({
    password,
    fullName,
    userName: userName.toLowerCase(),
    email,
    role,
    grade,
    school,
    avatar: avatar,
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "something went wrong registering user");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;
  if (!(userName || email)) {
    throw new ApiError(400, "email and username required");
  }
  console.log(userName);
  const user = await User.findOne({
    $or: [{ email }, { userName }],
  });
  if (!user) {
    throw new ApiError(400, "User resistration required");
  }

  const isPasswordVailid = await user.isPasswordCorrect(password);

  if (!isPasswordVailid) {
    throw new ApiError(401, "password is invailid!!");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const logedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

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
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "refreshToken expired!!");
  }

  try {
    const decodedRefreshToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFERESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedRefreshToken._id);
    if (!user) {
      throw new ApiError(401, "invailid refreshToken!!");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "rfresh token expired or used");
    }
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);
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

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(400, "user does not exist");
  }
  const oldPasswordIsVailid = await user.isPasswordCorrect(oldPassword);
  if (!oldPasswordIsVailid) {
    throw new ApiError(401, "old password is invailid");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "password is successfully changed"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "current user fatched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { email, fullName, grade, school } = req.body;
  if (!fullName || !email || !grade || !school) {
    throw new ApiError(401, "fullName, eamil,school and garde are required ");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        email,
        fullName,
        grade,
        school,
      },
    },
    {
      new: true,
    }
  );
  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "Account details are successfully updated")
    );
});

const deleteAndUpdateAvatar = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(400, "User does not exist");
  }
  if (!user.avatar) {
    throw new ApiError(400, "User does not have an avatar to delete");
  }

  const extractPublicIdFromUrl = (url) => {
    const match = url.match(/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/);
    return match ? match[1] : null;
  };

  const publicId = extractPublicIdFromUrl(user.avatar);
  if (!publicId) {
    throw new ApiError(400, "Invalid avatar URL, cannot extract publicId");
  }

  await deleteFromCloudinary(publicId);

  if (!req.file || !req.file.path) {
    throw new ApiError(400, "New avatar file is required");
  }

  const avatar = await uploadOnCloudinary(req.file.path);
  if (!avatar?.url) {
    throw new ApiError(500, "Failed to upload new avatar");
  }

  user.avatar = avatar.url;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse(
      200,
      user,
      "User avatar deleted and updated successfully"
    )
  );
});

export {
  registerUser,
  loginUser,
  logOutUser,
  refreshAccessToken,
  getCurrentUser,
  changeCurrentPassword,
  updateAccountDetails,
  deleteAndUpdateAvatar,
};
