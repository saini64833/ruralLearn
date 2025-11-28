import { Question } from "../models/question.model.js";
import { Quize } from "../models/quize.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { QuizeResult } from "../models/quizeResult.model.js";
const uploadQuize = asyncHandler(async (req, res) => {
  console.log(req.body);
  const {
    title,
    subject,
    description,
    duration,
    totalMarks,
    difficulty,
    tags,
    questionText,
    options,
    correctAnswerIndex,
  } = req.body;

  if (
    !title?.trim() ||
    !subject?.trim() ||
    !description?.trim() ||
    duration === undefined ||
    totalMarks === undefined ||
    !difficulty?.trim()
  ) {
    throw new ApiError(400, "All quiz fields are required!");
  }
  console.log(title);

  if (!questionText?.trim()) {
    throw new ApiError(400, "Question text is required!");
  }
  if (!Array.isArray(options) || options.length < 2) {
    throw new ApiError(
      400,
      "Options must be an array with at least 2 choices!"
    );
  }
  if (
    correctAnswerIndex === undefined ||
    correctAnswerIndex < 0 ||
    correctAnswerIndex >= options.length
  ) {
    throw new ApiError(400, "correctAnswerIndex must be a valid index!");
  }

  const question = await Question.create({
    questionText,
    options,
    correctAnswerIndex,
  });

  if (!question) {
    throw new ApiError(500, "Failed to create question!");
  }

  const tagArray = Array.isArray(tags)
    ? tags
    : typeof tags === "string"
      ? tags.split(",").map((t) => t.trim())
      : [];

  const quize = await Quize.create({
    title,
    subject,
    description,
    duration: Number(duration),
    totalMarks: Number(totalMarks),
    difficulty,
    tags: tagArray,
    createdBy: req.user?._id,
    questions: [question._id],
  });

  if (!quize) {
    throw new ApiError(500, "Failed to create quiz!");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, quize, "Quiz uploaded successfully!"));
});

const updateQuize = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const {
    title,
    subject,
    description,
    duration,
    totalMarks,
    difficulty,
    tags,
    questions,
    deletedQuestions,
  } = req.body;

  const existingQuiz = await Quize.findById(id);
  if (!existingQuiz) throw new ApiError(404, "Quiz not found!");

  if (req.user?._id.toString() !== existingQuiz.createdBy.toString()) {
    throw new ApiError(403, "You are not authorized to update this quiz!");
  }

  if (title) existingQuiz.title = title.trim();
  if (subject) existingQuiz.subject = subject.trim();
  if (description) existingQuiz.description = description.trim();
  if (duration !== undefined) existingQuiz.duration = Number(duration);
  if (totalMarks !== undefined) existingQuiz.totalMarks = Number(totalMarks);
  if (difficulty) existingQuiz.difficulty = difficulty.trim();

  if (tags) {
    existingQuiz.tags = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
        ? tags.split(",").map((t) => t.trim())
        : existingQuiz.tags;
  }

  if (Array.isArray(deletedQuestions) && deletedQuestions.length > 0) {
    for (const qId of deletedQuestions) {
      await Question.findByIdAndDelete(qId); 
    }


    existingQuiz.questions = existingQuiz.questions.filter(
      (qid) => !deletedQuestions.includes(qid.toString())
    );
  }


  if (Array.isArray(questions) && questions.length > 0) {
    const updatedQuestionIds = [];

    for (const q of questions) {
      const { _id, questionText, options, correctAnswerIndex } = q;

      if (_id) {
        const updatedQ = await Question.findByIdAndUpdate(
          _id,
          {
            $set: {
              ...(questionText && { questionText: questionText.trim() }),
              ...(Array.isArray(options) && options.length >= 2 && { options }),
              ...(correctAnswerIndex !== undefined && {
                correctAnswerIndex,
              }),
            },
          },
          { new: true }
        );

        if (updatedQ) updatedQuestionIds.push(updatedQ._id);
      } else {
        const newQ = await Question.create({
          questionText,
          options,
          correctAnswerIndex,
        });
        updatedQuestionIds.push(newQ._id);
      }
    }

    const uniqueIds = new Set([
      ...existingQuiz.questions.map((id) => id.toString()),
      ...updatedQuestionIds.map((id) => id.toString()),
    ]);

    existingQuiz.questions = Array.from(uniqueIds);
  }

  await existingQuiz.save();

  const updatedQuiz = await Quize.findById(id)
    .populate("questions")
    .populate("createdBy", "name email");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedQuiz, "Quiz updated successfully!"));
});

const getAllQuizzes = asyncHandler(async (req, res) => {
  const quizzes = await Quize.find().sort({ createdAt: -1 });

  if (!quizzes || quizzes.length === 0) {
    return res.status(404).json(new ApiResponse(404, [], "No quizzes found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, quizzes, "All quizzes fetched successfully"));
});

const getQuizeById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Quiz ID is required");
  }

  const quize = await Quize.findById(id)
    .populate({
      path: "questions",
      select: "questionText options correctAnswerIndex",
    })
    .populate({
      path: "createdBy",
      select: "name email role",
    });

  if (!quize) {
    throw new ApiError(404, "Quiz not found!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, quize, "Quiz fetched successfully!"));
});

const deleteQuize = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Quiz ID is required!");
  }

  const quize = await Quize.findById(id);
  if (!quize) {
    throw new ApiError(404, "Quiz not found!");
  }

  if (quize.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this quiz!");
  }

  if (quize.questions && quize.questions.length > 0) {
    await Question.deleteMany({ _id: { $in: quize.questions } });
  }

  await Quize.findByIdAndDelete(id);

  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "Quiz and its questions deleted successfully!")
    );
});

const getQuizeResponseById = asyncHandler(async (req, res) => {
  const {id}=req.params
  if(!id){
    throw new ApiError(401,"quize id not available")
  }

});
export { uploadQuize, updateQuize, getAllQuizzes, getQuizeById, deleteQuize,getQuizeResponseById };
