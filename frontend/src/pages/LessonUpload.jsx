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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePdfChange = (e) => {
    setPdfFiles([...e.target.files]);
  };

  const handleVideoChange = (e) => {
    setVideoFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pdfFiles.length === 0 || videoFiles.length === 0) {
      alert("Please upload at least one PDF and one video");
      return;
    }

    const formData = new FormData();
    for (let key in form) {
      formData.append(key, form[key]);
    }

    pdfFiles.forEach((file) => formData.append("pdfUrl", file));
    videoFiles.forEach((file) => formData.append("videoUrl", file));

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
    } catch (err) {
      console.error(err);
      alert("Error uploading lesson");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload New Lesson</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="language"
          placeholder="Language"
          value={form.language}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={form.subject}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <textarea
          name="content"
          placeholder="Content"
          value={form.content}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        ></textarea>
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <div>
          <label className="font-semibold">Upload PDFs:</label>
          <input
            type="file"
            multiple
            accept=".pdf"
            onChange={handlePdfChange}
            className="mt-1"
          />
        </div>

        <div>
          <label className="font-semibold">Upload Videos:</label>
          <input
            type="file"
            multiple
            accept="video/*"
            onChange={handleVideoChange}
            className="mt-1"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded mt-3"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Lesson"}
        </button>
      </form>
    </div>
  );
};

export default LessonUpload;
