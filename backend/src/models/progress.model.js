import mongoose, { Schema } from "mongoose";

const progressSchema = new Schema(
  {
    student: {
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
        isCompleted: {
          type: Boolean,
          default: true,
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
        percentage: {
          type: Number,
          required: true,
        },
        isCompleted: {
          type: Boolean,
          default: true,
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


export const Progress = mongoose.model("Progress", progressSchema);
