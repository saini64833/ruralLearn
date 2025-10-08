import mongoose, { Schema } from "mongoose";

const lessonsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
    pdfUrl: {
      type: String, //cloudinary
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    isOfflineReady: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Lessons = mongoose.model("Lessons", lessonsSchema);
