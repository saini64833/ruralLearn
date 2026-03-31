import mongoose, { Schema } from "mongoose";
const progressSchema = new Schema(
  {
    quizzesAttempted: [
      {
        quizeResultId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "QuizeResult",
          required: true,
        },
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    overallPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

progressSchema.methods.calculateOverall = async function () {
  const results = await mongoose.model("QuizeResult").find({
    _id: { $in: this.quizzesAttempted.map((q) => q.quizeResultId) },
  });

  const total = results.reduce((sum, r) => sum + r.totalPercentage, 0);

  this.overallPercentage = results.length ? total / results.length : 0;
};
progressSchema.index({ userId: 1 });
export const Progress = mongoose.model("Progress", progressSchema);
