import mongoose, { Schema } from "mongoose";
import {Lessons} from "./lessons.model.js"
import {Quize} from "./quize.model.js"
const progressSchema = new Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    lessonsCompleted: [
      {
        lessonId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Lessons",
          required: true,
        },
        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    quizzesAttempted: [
      {
        quizeResultId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "QuizeResult",
          required: true,
        },
        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    overallPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);
progressSchema.pre("save", async function (next) {
  try {
    const attemptedQuizzesCount = this.quizzesAttempted.length;
    const lessonsCompletedCount = this.lessonsCompleted.length;

    const totalUploadedLessons = await Lessons.countDocuments();
    const totalUploadedQuizzes = await Quize.countDocuments();

    const lessonRatio =
      totalUploadedLessons > 0 ? lessonsCompletedCount / totalUploadedLessons : 0;
    const quizzesRatio =
      totalUploadedQuizzes > 0 ? attemptedQuizzesCount / totalUploadedQuizzes : 0;

    const overallPercentage = (0.5 * lessonRatio + 0.5 * quizzesRatio) * 100;

    this.overallPercentage = Math.round(overallPercentage * 100) / 100; 
    next();
  } catch (err) {
    next(err);
  }
});
export const Progress = mongoose.model("Progress", progressSchema);
