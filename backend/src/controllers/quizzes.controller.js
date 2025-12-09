import { Question } from "../models/question.model.js";
import { Quize } from "../models/quize.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { QuizeResult } from "../models/quizeResult.model.js";
const uploadQuize = asyncHandler(async (req, res) => {
  const {
    title,
    subject,
    description,
    duration,
    totalMarks,
    difficulty,
    tags,
    questions,
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

  if (!Array.isArray(questions) || questions.length === 0) {
    throw new ApiError(400, "At least one question is required!");
  }

  // Validate each question
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    if (!q.questionText?.trim())
      throw new ApiError(400, `Question ${i + 1} text is required`);
    if (!Array.isArray(q.options) || q.options.length < 2)
      throw new ApiError(400, `Question ${i + 1} must have at least 2 options`);
    if (
      q.correctAnswerIndex === undefined ||
      q.correctAnswerIndex < 0 ||
      q.correctAnswerIndex >= q.options.length
    )
      throw new ApiError(
        400,
        `Question ${i + 1} has invalid correctAnswerIndex`
      );
    if (q.marks === undefined || isNaN(Number(q.marks)))
      throw new ApiError(400, `Question ${i + 1} marks are required`);
  }

  const createdQuestions = await Question.insertMany(
    questions.map((q) => ({
      questionText: q.questionText,
      options: q.options,
      correctAnswerIndex: Number(q.correctAnswerIndex),
      marks: Number(q.marks),
    }))
  );

  const tagArray = Array.isArray(tags)
    ? tags
    : typeof tags === "string"
      ? tags.split(",").map((t) => t.trim())
      : [];

  const quize = await Quize.create({
    title: title.trim(),
    subject: subject.trim(),
    description: description.trim(),
    duration: Number(duration),
    totalMarks: Number(totalMarks),
    difficulty: difficulty.trim(),
    tags: tagArray,
    createdBy: req.user?._id,
    questions: createdQuestions.map((q) => q._id),
  });

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
    questions = [],
    deletedQuestions = [],
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
      ? tags.map((t) => t.trim())
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

  const finalQuestionIds = [
    ...existingQuiz.questions.map((id) => id.toString()),
  ];

  for (const q of questions) {
    const { _id, questionText, options, correctAnswerIndex, marks } = q;

    const cleanOptions = Array.isArray(options)
      ? options.map((o) => o.trim()).filter((o) => o.length > 0)
      : [];

    if (!questionText || cleanOptions.length < 2) {
      throw new ApiError(
        400,
        "Each question must have text & at least 2 options."
      );
    }

    if (_id) {
      const updatedQ = await Question.findByIdAndUpdate(
        _id,
        {
          $set: {
            questionText: questionText.trim(),
            options: cleanOptions,
            correctAnswerIndex:
              correctAnswerIndex === null ? null : Number(correctAnswerIndex),
            marks: Number(marks) || 1,
          },
        },
        { new: true }
      );

      if (!updatedQ) throw new ApiError(404, `Question not found: ${_id}`);

      if (!finalQuestionIds.includes(updatedQ._id.toString())) {
        finalQuestionIds.push(updatedQ._id.toString());
      }
    } else {
      const newQ = await Question.create({
        questionText: questionText.trim(),
        options: cleanOptions,
        correctAnswerIndex:
          correctAnswerIndex === null ? null : Number(correctAnswerIndex),
        marks: Number(marks) || 1,
      });

      finalQuestionIds.push(newQ._id.toString());
    }
  }

  existingQuiz.questions = [...new Set(finalQuestionIds)];

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
      select: "questionText options correctAnswerIndex marks",
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

const getQuizResponse = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) throw new ApiError(400, "Quiz ID not found!");

  const studentId = req.user.id;
  if (!studentId) throw new ApiError(400, "Student ID required!");

  const attemptedResponse = await QuizeResult.findOne({
    quizId: id,
    studentId,
  });

  if (attemptedResponse) {
    throw new ApiError(402, "Quiz already attempted!");
  }

  const userAnswers = req.body.answers;
  if (!Array.isArray(userAnswers)) {
    throw new ApiError(400, "Invalid answer format!");
  }

  const quiz = await Quize.findById(id).populate("questions");
  if (!quiz) throw new ApiError(401, "Quiz not found!");

  const answers = [];
  let totalScore = 0;

  quiz.questions.forEach((q) => {
    const userAnswer = userAnswers.find(
      (a) => a.questionId === q._id.toString()
    );

    const selectedOptionIndex =
      userAnswer && userAnswer.selectedOptionIndex !== undefined
        ? userAnswer.selectedOptionIndex
        : null;

    const isCorrect =
      selectedOptionIndex !== null &&
      selectedOptionIndex === q.correctAnswerIndex;

    const score = isCorrect ? q.marks : 0;
    totalScore += score;

    answers.push({
      questionId: q._id,
      selectedOptionIndex,
      isCorrect,
      score,
    });
  });

  const totalMarks = quiz.totalMarks || quiz.questions.length * 1;
  const totalPercentage = (totalScore / totalMarks) * 100;

  const response = await QuizeResult.create({
    quizId: id,
    studentId,
    answers,
    totalScore,
    totalPercentage,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, response, "Quiz response taken successfully!"));
});

const resultView = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "id is required!!");
  }
  const studentId = req.user.id;
  if (!studentId) {
    throw new ApiError(400, "student id is required!!");
  }
  const result = await QuizeResult.findOne({
    quizId: id,
    studentId,
  })
    .populate("quiz", "title totalMarks")
    .populate({
      path: "answers.questionId",
      select: "questionText options correctAnswerIndex marks",
    });

  if (!result) {
    throw new ApiError(400, "you need to attemp  quize");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, result, "result viewed successfully!!"));
});


export {
  uploadQuize,
  updateQuize,
  getAllQuizzes,
  getQuizeById,
  deleteQuize,
  getQuizResponse,
  resultView,
};
