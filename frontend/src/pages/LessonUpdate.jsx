import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const UpdateLesson = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [lesson, setLesson] = useState(null);
  const [pdfFiles, setPdfFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notAllowed, setNotAllowed] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const { lesson } = await axiosInstance.get(`/lessons/${id}`);
        const lessonData = lesson.data?.data;
        setLesson(lessonData);

        if (lessonData.createdBy?._id !== user?._id) {
          setNotAllowed(true);
        }
      } catch (error) {
        toast.error("Failed to load lesson details");
      }
    };

    if (user) fetchLesson();
  }, [id, user]);


  const handlePdfChange = (e) => setPdfFiles([...e.target.files]);
  const handleVideoChange = (e) => setVideoFiles([...e.target.files]);

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (notAllowed) return toast.error("You cannot update this lesson.");

    if (!pdfFiles.length && !videoFiles.length) {
      toast.warning("Please select at least one file to update.");
      return;
    }

    const formData = new FormData();


    pdfFiles.forEach((file) => formData.append("pdfUrl", file));
    videoFiles.forEach((file) => formData.append("videoFile", file));

    setLoading(true);
    try {
      await axiosInstance.put(`/lessons/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Lesson updated successfully!");
      navigate(`/lessons/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating lesson");
    } finally {
      setLoading(false);
    }
  };

 
  if (notAllowed) {
    return (
      <div className="text-center mt-20 text-red-600 font-semibold text-lg">
        You are not allowed to update this lesson.
      </div>
    );
  }


return (
  <div className="max-w-4xl mx-auto mt-10 p-4">
    <div className="bg-gray-50 border rounded-2xl shadow-sm p-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Update Lesson Resources
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Upload PDFs or Videos to update the lesson
        </p>
      </header>

      {/* Lesson Information */}
      {lesson && (
        <div className="p-4 bg-white border rounded-lg shadow-sm mb-6">
          <p className="text-sm text-gray-500">Lesson Title</p>
          <p className="text-lg font-semibold text-gray-800 mt-1">
            {lesson.title}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* PDFs Upload */}
        <div className="bg-white border rounded-lg p-5 shadow-sm">
          <label className="flex items-center gap-2 font-semibold text-gray-700 mb-3">
            📄 PDF Files
          </label>
          <input
            type="file"
            accept=".pdf"
            multiple
            onChange={handlePdfChange}
            className="w-full border border-gray-300 p-3 rounded-md bg-gray-100 focus:ring-2 focus:ring-blue-500"
          />

          {pdfFiles.length > 0 && (
            <div className="mt-3 bg-gray-100 p-3 rounded-lg border">
              <p className="font-semibold text-gray-700 mb-2 text-sm">
                Selected PDF Files:
              </p>
              {pdfFiles.map((file, index) => (
                <p className="text-gray-600 text-sm mb-1" key={index}>
                  📎 {file.name}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Videos Upload */}
        <div className="bg-white border rounded-lg p-5 shadow-sm">
          <label className="flex items-center gap-2 font-semibold text-gray-700 mb-3">
            🎬 Video Files
          </label>
          <input
            type="file"
            accept="video/*"
            multiple
            onChange={handleVideoChange}
            className="w-full border border-gray-300 p-3 rounded-md bg-gray-100 focus:ring-2 focus:ring-blue-500"
          />

          {videoFiles.length > 0 && (
            <div className="mt-3 bg-gray-100 p-3 rounded-lg border grid grid-cols-2 sm:grid-cols-3 gap-3">
              {videoFiles.map((file, index) => (
                <div key={index} className="text-sm text-gray-700">
                  🎞 {file.name.slice(0, 20)}...
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || notAllowed}
          className={`w-full py-3 rounded-md font-semibold text-white text-lg
            ${loading || notAllowed
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"}
          `}
        >
          {loading ? "Updating..." : "Save Updates"}
        </button>
      </form>
    </div>
  </div>
);

};

export default UpdateLesson;
