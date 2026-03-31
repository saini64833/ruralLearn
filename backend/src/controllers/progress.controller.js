import mongoose from "mongoose";
import { QuizeResult } from "../models/quizeResult.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const getLeaderBoard = asyncHandler(async (req, res) => {
  const { quizId } = req.params;
  let { page = 1, limit = 10 } = req.query;

  if (!quizId) {
    throw new ApiError(400, "Quiz id is required!!");
  }

  page = parseInt(page);
  limit = Math.min(parseInt(limit), 50);
  const skip = (page - 1) * limit;

  const total = await QuizeResult.countDocuments({ quizId });

  const results = await QuizeResult.find({ quizId })
    .populate("studentId", "fullName email")
    .sort({ totalScore: -1, completedAt: 1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const leaderboard = results.map((item, index) => ({
    rank: skip + index + 1,
    studentId: item.studentId?._id,
    name: item.studentId?.fullName,
    email: item.studentId?.email,
    score: item.totalScore,
    percentage: item.totalPercentage,
  }));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        leaderboard,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      "Leaderboard fetched successfully"
    )
  );
});

const getUserRank = asyncHandler(async (req, res) => {
  const { quizId } = req.params;
  const userId = req.user?._id;

  if (!quizId || !userId) {
    throw new ApiError(400, "Quiz ID and user required");
  }

  const userResult = await QuizeResult.findOne({
    quizId,
    studentId: userId,
  }).lean();

  if (!userResult) {
    throw new ApiError(404, "User has not attempted this quiz");
  }

  const rank =
    (await QuizeResult.countDocuments({
      quizId,
      totalScore: { $gt: userResult.totalScore },
    })) + 1;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        rank,
        score: userResult.totalScore,
        percentage: userResult.totalPercentage,
      },
      "User rank fetched successfully"
    )
  );
});

const searchStudents = asyncHandler(async (req, res) => {
  const { name } = req.query;
  let { page = 1, limit = 10 } = req.query;

  if (!name) {
    throw new ApiError(400, "Search name is required");
  }

  page = parseInt(page);
  limit = Math.min(parseInt(limit), 50);
  const skip = (page - 1) * limit;

  const total = await User.countDocuments({
    fullName: { $regex: name, $options: "i" },
  });

  const users = await User.aggregate([
    {
      $match: {
        fullName: { $regex: name, $options: "i" },
      },
    },

    {
      $lookup: {
        from: "quizeresults",
        localField: "_id",
        foreignField: "studentId",
        as: "results",
      },
    },

    {
      $lookup: {
        from: "quizes",
        localField: "results.quizId",
        foreignField: "_id",
        as: "quizDetails",
      },
    },

    {
      $project: {
        _id: 1,
        fullName: 1,
        email: 1,
        quizzes: {
          $map: {
            input: "$results",
            as: "r",
            in: {
              score: "$$r.totalScore",
              percentage: "$$r.totalPercentage",
              quizTitle: {
                $let: {
                  vars: {
                    quiz: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$quizDetails",
                            cond: {
                              $eq: ["$$this._id", "$$r.quizId"],
                            },
                          },
                        },
                        0,
                      ],
                    },
                  },
                  in: {
                    $cond: [
                      { $eq: ["$$quiz", null] },
                      "Quiz Deleted",
                      "$$quiz.title",
                    ],
                  },
                },
              },
            },
          },
        },
      },
    },

    { $skip: skip },
    { $limit: limit },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        users,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      "Search results fetched successfully"
    )
  );
});
const getGlobalLeaderboard = asyncHandler(async (req, res) => {
  let { page = 1, limit = 10 } = req.query;

  page = parseInt(page);
  limit = Math.min(parseInt(limit), 50);
  const skip = (page - 1) * limit;

  const totalUsers = await QuizeResult.aggregate([
    {
      $group: {
        _id: "$studentId",
      },
    },
    {
      $count: "total",
    },
  ]);

  const total = totalUsers[0]?.total || 0;
  const leaderboard = await QuizeResult.aggregate([
    {
      $group: {
        _id: "$studentId",
        totalScore: { $sum: "$totalScore" },
        avgPercentage: { $avg: "$totalPercentage" },
        quizzesAttempted: { $sum: 1 },
      },
    },

    {
      $sort: { totalScore: -1 },
    },

    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },

    { $unwind: "$user" },

    {
      $project: {
        studentId: "$_id",
        name: "$user.fullName",
        email: "$user.email",
        totalScore: 1,
        avgPercentage: 1,
        quizzesAttempted: 1,
      },
    },

    { $skip: skip },
    { $limit: limit },
  ]);
  const data = leaderboard.map((item, index) => ({
    rank: skip + index + 1,
    ...item,
  }));
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        leaderboard: data,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      "Global leaderboard fetched successfully"
    )
  );
});
const getUserPerformance = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  let { page = 1, limit = 10 } = req.query;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  page = parseInt(page);
  limit = Math.min(parseInt(limit), 50);
  const skip = (page - 1) * limit;

  const total = await QuizeResult.countDocuments({
    studentId: userId,
  });

  const results = await QuizeResult.find({ studentId: userId })
    .populate("quizId", "title")
    .sort({ completedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  // Handle empty results gracefully
  const data = results
    .filter((item) => item.quizId) // Filter out results with deleted quizzes
    .map((item) => ({
      quizId: item.quizId._id,
      quizTitle: item.quizId.title,
      score: item.totalScore,
      percentage: item.totalPercentage,
      completedAt: item.completedAt,
    }));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        performance: data,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      "User performance fetched successfully"
    )
  );
});

export {
  getLeaderBoard,
  getUserRank,
  searchStudents,
  getUserPerformance,
  getGlobalLeaderboard,
};
