import mongoose, { Schema } from "mongoose";
import { Lessons } from "./lessons.model.js";
import { Quize } from "./quize.model.js";
const progressSchema = new Schema(
  {
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

export const Progress = mongoose.model("Progress", progressSchema);
