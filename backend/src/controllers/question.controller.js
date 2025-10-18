import { Question } from "../models/question.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";

const uploadQuestion = asyncHandler(async (req, res) => {
  const { questionText, options, correctAnswerIndex } = req.body;
  if (
    [questionText, options, correctAnswerIndex].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(401, "question all field is required");
  }
  const question = await Question.create({
    questionText,
    options,
    correctAnswerIndex,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, question, "The question created Successfully"));
});

const updateQuestion = asyncHandler(async (req, res) => {
  const { questionText, options, correctAnswerIndex } = req.body;
  if (
    [questionText, options, correctAnswerIndex].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(401, "foe updation these question field required!!");
  }
  const newQuestion = await Question.findByIdAndUpdate(
    req.question._id,
    {
      $set: {
        questionText,
        options,
        correctAnswerIndex,
      },
    },
    {
      new: true,
    }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, newQuestion, "question Updated Successfully"));
});



export { uploadQuestion, updateQuestion };
