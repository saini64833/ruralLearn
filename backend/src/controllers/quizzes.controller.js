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

  // Create all questions in DB
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

  // Create quiz
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
    questions,
    deletedQuestions,
  } = req.body;

  const existingQuiz = await Quize.findById(id);
  if (!existingQuiz) throw new ApiError(404, "Quiz not found!");

  // Authorization check
  if (req.user?._id.toString() !== existingQuiz.createdBy.toString()) {
    throw new ApiError(403, "You are not authorized to update this quiz!");
  }

  // Update quiz fields
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

  // Delete questions if any
  if (Array.isArray(deletedQuestions) && deletedQuestions.length > 0) {
    for (const qId of deletedQuestions) {
      await Question.findByIdAndDelete(qId);
    }
    existingQuiz.questions = existingQuiz.questions.filter(
      (qid) => !deletedQuestions.includes(qid.toString())
    );
  }

  // Update or add new questions
  if (Array.isArray(questions) && questions.length > 0) {
    const updatedQuestionIds = [];

    for (const q of questions) {
      const { _id, questionText, options, correctAnswerIndex, marks } = q;

      if (_id) {
        const updatedQ = await Question.findByIdAndUpdate(
          _id,
          {
            $set: {
              ...(questionText && { questionText: questionText.trim() }),
              ...(Array.isArray(options) && options.length >= 2 && { options }),
              ...(correctAnswerIndex !== undefined && { correctAnswerIndex }),
              ...(marks !== undefined && { marks: Number(marks) }),
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
          marks: marks !== undefined ? Number(marks) : 1,
        });
        updatedQuestionIds.push(newQ._id);
      }
    }

    // Merge old and new question IDs, ensuring uniqueness
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
      select: "questionText options correctAnswerIndex,marks",
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
  const { id: quizeId } = req.params;
  const studentId = req.user?.id;

  if (!studentId) throw new ApiError(400, "Student not found");
  if (!quizeId) throw new ApiError(400, "Quiz ID missing");

  const quiz = await Quize.findById(quizeId).populate("questions");
  if (!quiz) throw new ApiError(404, "Quiz not found");

  const userAnswers = req.body.answers || [];

  let answersArray = [];
  let totalScore = 0;

  quiz.questions.forEach((question, index) => {
    const selected = userAnswers[index]?.selectedOptionIndex || [];

    if (!selected || selected.length === 0) {
      answersArray.push({
        questionId: question._id,
        selectedOptionIndex: [],
        isCorrect: false,
        score: 0,
      });
      return; 
    }

    const correctIndexes = [...question.correctAnswerIndex].sort();
    const selectedSorted = [...selected].sort();

    const isCorrect =
      JSON.stringify(correctIndexes) === JSON.stringify(selectedSorted);

    let score = isCorrect ? question.marks : -1;

    totalScore += score;

    answersArray.push({
      questionId: question._id,
      selectedOptionIndex: selected,
      isCorrect,
      score,
    });
  });

  const totalPercentage =
    quiz.totalMarks > 0 ? (totalScore / quiz.totalMarks) * 100 : 0;

  const result = await QuizeResult.create({
    quiz: quizeId,
    student: studentId,
    answers: answersArray,
    totalScore,
    totalPercentage,
  });

  res.status(200).json({
    success: true,
    message: "Quiz checked successfully",
    result,
  });
});


export {
  uploadQuize,
  updateQuize,
  getAllQuizzes,
  getQuizeById,
  deleteQuize,
  getQuizeResponseById,
};
