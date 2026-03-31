import mongoose, { Schema } from "mongoose";

const answerSchema = new Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  selectedOptionIndex: {
    type: Number,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
  score: {
    type: Number,
    default: 0,
  },
});

const quizeResultSchema = new Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quize",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answers: {
      type: [answerSchema],
    },
    totalScore: {
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
    isattempted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

quizeResultSchema.pre("save", function (next) {
  if (this.answers && this.answers.length > 0) {
    this.totalScore = this.answers.reduce((sum, a) => sum + a.score, 0);
  }
  next();
});
quizeResultSchema.index({ quizId: 1, totalScore: -1 });
quizeResultSchema.index({ studentId: 1 });
export const QuizeResult = mongoose.model("QuizeResult", quizeResultSchema);
