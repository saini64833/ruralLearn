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

progressSchema.pre("save", function (next) {
  if (this.lessonsCompleted.length || this.quizzesAttempted.length) {
    const totalLessons = this.lessonsCompleted.length;
    const avgQuizScore =
      this.quizzesAttempted.reduce((sum, q) => sum + q.percentage, 0) /
        this.quizzesAttempted.length || 0;
    const lessonPercentage = totalLessons > 0 ? 100 : 0;
    this.overallPercentage = lessonPercentage * 0.5 + avgQuizScore * 0.5;
  }
  next();
});

export const Progress = mongoose.model("Progress", progressSchema);
