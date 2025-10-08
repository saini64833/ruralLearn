import mongoose, { Schema } from "mongoose";

const answerSchema = new Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  selectedOptionIndex: {
    type: Number,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
  score: {
    type: Number,
    default: 0,
  },
  totalMarks: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    default: function () {
      return this.totalMarks ? (this.score * 100) / this.totalMarks : 0;
    },
  },
  completedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const quizeResultSchema = new Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answers: {
      type: [answerSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "Quiz must have at least one answer",
      },
    },
    totalScore: {
      type: Number,
      default: 0,
    },
    totalMarks: {
      type: Number,
      default: 0,
    },
    totalPercentage: {
      type: Number,
      default: 0,
    },
    completedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { timestamps: true }
);

quizeResultSchema.pre("save", function (next) {
  if (this.answers && this.answers.length > 0) {
    this.totalScore = this.answers.reduce((sum, a) => sum + a.score, 0);
    this.totalMarks = this.answers.reduce((sum, a) => sum + a.totalMarks, 0);
    this.totalPercentage = this.totalMarks
      ? (this.totalScore * 100) / this.totalMarks
      : 0;
  }
  next();
});

export const QuizeResult = mongoose.model("QuizeResult", quizeResultSchema);
