import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance.js";
const LessonUpload = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    language: "",
    subject: "",
    content: "",
    tags: "",
  });
  const [pdfFiles, setPdfFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handlePdfChange = (e) => {
    setPdfFiles([...e.target.files]);
  };
  const handleVideoChange = (e) => {
    const files = [...e.target.files];
    setVideoFiles(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setVideoPreviews(previews);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pdfFiles.length === 0 || videoFiles.length === 0) {
      alert("Please upload at least one PDF and one video");
      return;
    }
    const formData = new FormData();
    for (let key in form) formData.append(key, form[key]);
    const tagsArray = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    tagsArray.forEach((tag) => formData.append("tags", tag));
    pdfFiles.forEach((file) => formData.append("pdfUrl", file));
    videoFiles.forEach((file) => formData.append("videoFile", file));
    try {
      setLoading(true);
      const res = await axiosInstance.post("/lessons/upload-lesson", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Lesson uploaded successfully!");
      setForm({
        title: "",
        description: "",
        language: "",
        subject: "",
        content: "",
        tags: "",
      });
      setPdfFiles([]);
      setVideoFiles([]);
      setVideoPreviews([]);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error uploading lesson");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {" "}
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">
        {" "}
        Upload Lesson{" "}
      </h1>{" "}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-4 sm:p-6 space-y-5 border overflow-hidden"
      >
        {" "}
        {/* Basic Details */}{" "}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {" "}
          <div className="flex flex-col">
            {" "}
            <label className="font-medium mb-1">Title *</label>{" "}
            <input
              type="text"
              name="title"
              className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
              value={form.title}
              onChange={handleChange}
              required
            />{" "}
          </div>{" "}
          <div className="flex flex-col">
            {" "}
            <label className="font-medium mb-1">Language *</label>{" "}
            <input
              type="text"
              name="language"
              className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
              value={form.language}
              onChange={handleChange}
              required
            />{" "}
          </div>{" "}
          <div className="flex flex-col">
            {" "}
            <label className="font-medium mb-1">Subject *</label>{" "}
            <input
              type="text"
              name="subject"
              className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
              value={form.subject}
              onChange={handleChange}
              required
            />{" "}
          </div>{" "}
          <div className="flex flex-col">
            {" "}
            <label className="font-medium mb-1">
              Tags (comma separated)
            </label>{" "}
            <input
              type="text"
              name="tags"
              className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
              value={form.tags}
              onChange={handleChange}
            />{" "}
          </div>{" "}
        </div>{" "}
        {/* Description */}{" "}
        <div className="flex flex-col">
          {" "}
          <label className="font-medium mb-1">Description *</label>{" "}
          <input
            type="text"
            name="description"
            className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
            value={form.description}
            onChange={handleChange}
            required
          />{" "}
        </div>{" "}
        {/* Content */}{" "}
        <div className="flex flex-col">
          {" "}
          <label className="font-medium mb-1">Content *</label>{" "}
          <textarea
            name="content"
            rows="4"
            className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
            value={form.content}
            onChange={handleChange}
            required
          />{" "}
        </div>{" "}
        {/* PDF Upload */}{" "}
        <div>
          {" "}
          <label className="font-semibold block mb-1">PDF Files *</label>{" "}
          <input
            type="file"
            accept=".pdf"
            multiple
            onChange={handlePdfChange}
            className="border p-2 rounded w-full"
          />{" "}
          {pdfFiles.length > 0 && (
            <ul className="mt-2 text-sm text-gray-700 list-disc pl-5">
              {" "}
              {pdfFiles.map((file, i) => (
                <li key={i}>{file.name}</li>
              ))}{" "}
            </ul>
          )}{" "}
        </div>{" "}
        {/* Video Upload */}{" "}
        <div>
          {" "}
          <label className="font-semibold block mb-1">Video Files *</label>{" "}
          <input
            type="file"
            accept="video/*"
            multiple
            onChange={handleVideoChange}
            className="border p-2 rounded w-full"
          />{" "}
          {videoFiles.length > 0 && (
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
              {" "}
              {videoPreviews.map((src, i) => (
                <video
                  key={i}
                  src={src}
                  className="w-full aspect-video object-cover rounded border"
                  controls
                />
              ))}{" "}
            </div>
          )}{" "}
        </div>{" "}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded-md w-full font-medium disabled:opacity-50"
        >
          {" "}
          {loading ? "Uploading..." : "Upload Lesson"}{" "}
        </button>{" "}
      </form>{" "}
    </div>
  );
};
export default LessonUpload;
