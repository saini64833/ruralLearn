import { Lessons } from "../models/lessons.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

// ✅ Helper to extract Cloudinary public_id from URL
const extractPublicId = (url, resourceType = "image") => {
  if (!url) return null;
  if (resourceType === "raw") {
    const match = url.match(/\/raw\/upload\/(?:v\d+\/)?(.+)$/);
    return match ? match[1] : null;
  }
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  return match ? match[1] : null;
};

const uploadLesson = asyncHandler(async (req, res) => {
  if (req.user.role !== "Teacher")
    throw new ApiError(401, "Only teachers can upload lessons");

  const { title, description, language, subject, content, tags } = req.body;

  if ([title, description, language, subject, content].some((f) => !f?.trim()))
    throw new ApiError(400, "All fields are required");

  // ✅ Validate files BEFORE any DB/upload operations
  const pdfFiles = req.files?.pdfUrl || [];
  const videoFiles = req.files?.videoFile || [];

  if (pdfFiles.length === 0)
    throw new ApiError(400, "At least one PDF is required");
  if (videoFiles.length === 0)
    throw new ApiError(400, "At least one video is required");

  const lessonTags = Array.isArray(tags) ? tags : tags?.split(",") || [];

  // ✅ Upload all PDFs first
  const pdfUrls = [];
  for (const file of pdfFiles) {
    console.log("Uploading PDF:", file.path);
    const uploadedPdf = await uploadOnCloudinary(file.path, "raw"); // "raw" for PDFs
    if (!uploadedPdf?.secure_url)
      throw new ApiError(500, "Failed to upload PDF");
    pdfUrls.push(uploadedPdf.secure_url);
  }

  // ✅ Upload all videos
  const uploadedVideos = [];
  for (const file of videoFiles) {
    console.log("Uploading Video:", file.path);
    const uploadedVideo = await uploadOnCloudinary(file.path, "video");
    if (!uploadedVideo?.secure_url)
      throw new ApiError(500, "Video upload failed");
    uploadedVideos.push({ file, uploadedVideo });
  }

  // ✅ Now create lesson only after all uploads succeed
  const lesson = await Lessons.create({
    title,
    description,
    language,
    subject,
    content,
    tags: lessonTags,
    pdfUrl: pdfUrls,
    createdBy: req.user._id,
    videos: [],
  });

  // ✅ Create video documents
  const videoIds = [];
  for (const { file, uploadedVideo } of uploadedVideos) {
    const videoDoc = await Video.create({
      videoFile: uploadedVideo.secure_url,
      thumbnail: uploadedVideo.thumbnail_url || "",
      title: file.originalname,
      duration: uploadedVideo.duration || 0,
      owner: req.user._id,
      lesson: lesson._id,
    });
    videoIds.push(videoDoc._id);
  }

  lesson.videos = videoIds;
  await lesson.save();

  res
    .status(201)
    .json(new ApiResponse(201, lesson, "Lesson uploaded successfully"));
});

const updateLesson = asyncHandler(async (req, res) => {
  if (req.user.role !== "Teacher")
    throw new ApiError(401, "Only teachers can update lessons");

  const { id } = req.params;
  const lesson = await Lessons.findById(id);
  if (!lesson) throw new ApiError(404, "Lesson not found");
  if (lesson.createdBy.toString() !== req.user._id.toString())
    throw new ApiError(403, "You cannot update this lesson");

  // ✅ Upload new PDFs if provided
  if (req.files?.pdfUrl?.length > 0) {
    const newPdfUrls = [];
    for (const file of req.files.pdfUrl) {
      const uploadedPdf = await uploadOnCloudinary(file.path, "raw");
      if (uploadedPdf?.secure_url) newPdfUrls.push(uploadedPdf.secure_url);
    }
    lesson.pdfUrl = [...(lesson.pdfUrl || []), ...newPdfUrls];
  }

  // ✅ Upload new videos if provided
  if (req.files?.videoFile?.length > 0) {
    const newVideoIds = [];
    for (const file of req.files.videoFile) {
      const uploadedVideo = await uploadOnCloudinary(file.path, "video");
      if (uploadedVideo?.secure_url) {
        const videoDoc = await Video.create({
          videoFile: uploadedVideo.secure_url,
          thumbnail: uploadedVideo.thumbnail_url || "",
          title: file.originalname,
          duration: uploadedVideo.duration || 0,
          owner: req.user._id,
          lesson: lesson._id,
        });
        newVideoIds.push(videoDoc._id);
      }
    }
    lesson.videos = [...(lesson.videos || []), ...newVideoIds];
  }

  // ✅ Update text fields if provided
  const fields = ["title", "description", "language", "subject", "content"];
  fields.forEach((field) => {
    if (req.body[field]?.trim()) lesson[field] = req.body[field];
  });

  if (req.body.tags) {
    lesson.tags = Array.isArray(req.body.tags)
      ? req.body.tags
      : req.body.tags.split(",");
  }

  await lesson.save();

  return res
    .status(200)
    .json(new ApiResponse(200, lesson, "Lesson updated successfully"));
});

const deleteLesson = asyncHandler(async (req, res) => {
  if (req.user.role !== "Teacher")
    throw new ApiError(403, "Only teachers can delete lessons");

  const { id } = req.params;
  const lesson = await Lessons.findById(id).populate("videos");
  if (!lesson) throw new ApiError(404, "Lesson not found");
  if (lesson.createdBy.toString() !== req.user._id.toString())
    throw new ApiError(403, "You cannot delete this lesson");

  // ✅ Delete PDFs from Cloudinary
  for (const pdfUrl of lesson.pdfUrl || []) {
    const publicId = extractPublicId(pdfUrl, "raw");
    if (publicId) await deleteFromCloudinary(publicId);
  }

  // ✅ Delete videos from Cloudinary
  for (const video of lesson.videos || []) {
    const publicId = extractPublicId(video.videoFile, "video");
    if (publicId) await deleteFromCloudinary(publicId);
  }

  await Video.deleteMany({ lesson: lesson._id });
  await Lessons.findByIdAndDelete(id);

  res.status(200).json(new ApiResponse(200, {}, "Lesson deleted successfully"));
});

const commentLesson = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  if (!text) throw new ApiError(400, "Comment text is required");

  const lesson = await Lessons.findById(id);
  if (!lesson) throw new ApiError(404, "Lesson not found");

  lesson.comments.push({ user: req.user._id, text });
  await lesson.save();
  res.status(201).json(new ApiResponse(201, lesson.comments, "Comment added"));
});

const likeLesson = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const lesson = await Lessons.findById(id);
  if (!lesson) throw new ApiError(404, "Lesson not found");

  const userId = req.user._id.toString();
  const index = lesson.likes.findIndex((like) => like.toString() === userId);

  if (index === -1) lesson.likes.push(userId);
  else lesson.likes.splice(index, 1);

  await lesson.save();
  res
    .status(200)
    .json(
      new ApiResponse(200, { likesCount: lesson.likes.length }, "Like toggled")
    );
});

const getAllLessons = asyncHandler(async (req, res) => {
  const lessons = await Lessons.find()
    .populate("videos")
    .populate("createdBy", "fullName email avatar");
  if (!lessons?.length) throw new ApiError(404, "No lessons found");
  res
    .status(200)
    .json(new ApiResponse(200, lessons, "Lessons fetched successfully"));
});

const getLessonById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const lesson = await Lessons.findById(id)
    .populate("videos")
    .populate("createdBy", "fullName email avatar");
  if (!lesson) throw new ApiError(404, "Lesson not found");

  res
    .status(200)
    .json(new ApiResponse(200, lesson, "Lesson fetched successfully"));
});

export {
  uploadLesson,
  updateLesson,
  deleteLesson,
  likeLesson,
  commentLesson,
  getAllLessons,
  getLessonById,
};