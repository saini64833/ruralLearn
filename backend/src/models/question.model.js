import mongoose, { Schema } from "mongoose";

const questionSchema = new Schema(
  {
    questionText: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => arr.length >= 2,
        message: "A question must have at least 2 options",
      },
    },
    correctAnswerIndex: {
      type: Number,
      required: true,
      validate: {
        validator: function (v) {
          return v >= 0 && v < this.options.length;
        },
        message: "correctAnswerIndex must be a valid index in options array",
      },
    },
  },
  { timestamps: true }
);

export const Question = mongoose.model("Question", questionSchema);
