import { Lessons } from "../models/lessons.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const uploadLesson = asyncHandler(async (req, res) => {
  if (req.user.role !== "Teacher") {
    throw new ApiError(401, "Only Teacher can upload lessons!");
  }

  const { title, description, language, subject, content, tags } = req.body;

  if (
    [title, description, language, subject, content].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required!");
  }

  const lessonTags = Array.isArray(tags) ? tags : tags?.split(",") || [];

  const pdfFiles = req.files.pdfUrl;
  if (!pdfFiles) {
    throw new ApiError(401, "pdf file path mistake");
  }
  if (pdfFiles.length === 0)
    throw new ApiError(400, "At least one PDF file is required!");
  const pdfUrls = [];
  for (const file of pdfFiles) {
    const url = await uploadOnCloudinary(file.path);
    pdfUrls.push(url);
  }

  const videoFiles = req.files.videoUrl;
  if (!videoFiles) {
    throw new ApiError(401, "something wrong on video file path");
  }
  if (videoFiles.length === 0)
    throw new ApiError(400, "At least one video file is required!");
  const videoUrls = [];
  for (const file of videoFiles) {
    const url = await uploadOnCloudinary(file.path);
    videoUrls.push(url);
  }

  const lesson = await Lessons.create({
    title,
    description,
    language,
    subject,
    content,
    tags: lessonTags,
    pdfUrl: pdfUrls,
    videoUrl: videoUrls,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, lesson, "Lesson uploaded successfully"));
});

const updateLesson = asyncHandler(async (req, res) => {
  if (req.user.role !== "Teacher") {
    throw new ApiError(401, "Only teacher can update lesson");
  }

  const { id } = req.params;
  const lesson = await Lessons.findById(id);
  if (!lesson) throw new ApiError(404, "Lesson not found");
  if (lesson.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to update this lesson");
  }

  lesson.pdfUrl = Array.isArray(lesson.pdfUrl) ? lesson.pdfUrl : [];
  lesson.videoUrl = Array.isArray(lesson.videoUrl) ? lesson.videoUrl : [];

  if (req.files && req.files.pdfUrl && req.files.pdfUrl.length > 0) {
    for (const file of req.files.pdfUrl) {
      const url = await uploadOnCloudinary(file.path);
      lesson.pdfUrl.push(url);
    }
  }

  if (req.files && req.files.videoUrl && req.files.videoUrl.length > 0) {
    for (const file of req.files.videoUrl) {
      const url = await uploadOnCloudinary(file.path);
      lesson.videoUrl.push(url);
    }
  }

  await lesson.save();

  return res
    .status(200)
    .json(new ApiResponse(200, lesson, "Lesson updated successfully"));
});

const deleteLesson = asyncHandler(async (req, res) => {
  if (req.user.role !== "Teacher") {
    throw new ApiError(403, "Only teachers can delete lessons");
  }

  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Lesson id is required");
  }

  const lesson = await Lessons.findById(id);
  if (!lesson) {
    throw new ApiError(404, "Lesson not found");
  }

  if (lesson.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to delete this lesson");
  }

  await Lessons.findByIdAndDelete(id);

  return res.status(200).json({
    success: true,
    message: "Lesson deleted successfully",
  });
});
const commentLesson = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text) throw new ApiError(400, "Comment text is required");

  const lesson = await Lessons.findById(id);
  if (!lesson) throw new ApiError(404, "Lesson not found");

  lesson.comments.push({ user: req.user._id, text });
  await lesson.save();

  res.status(201).json({ success: true, comments: lesson.comments });
});

const likeLesson = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const lesson = await Lessons.findById(id);
  if (!lesson) throw new ApiError(404, "Lesson not found");

  const userId = req.user._id.toString();
  const index = lesson.likes.findIndex((like) => like.toString() === userId);

  if (index === -1) {
    lesson.likes.push(userId);
  } else {
    lesson.likes.splice(index, 1);
  }

  await lesson.save();
  res.status(200).json({ success: true, likesCount: lesson.likes.length });
});

export { uploadLesson, updateLesson, deleteLesson, likeLesson, commentLesson };
