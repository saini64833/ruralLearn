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
        console.log(lessonData)
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
    <div className="max-w-2xl mx-auto bg-white shadow-md p-6 mt-10 rounded-xl">
      <h1 className="text-2xl font-bold mb-4 text-center text-indigo-600">
        Update Lesson
      </h1>

      {lesson && (
        <div className="mb-4">
          <p className="font-semibold">Lesson Title:</p>
          <p className="text-gray-700">{lesson.title}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* PDF Upload */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Add PDFs</label>
          <input
            type="file"
            multiple
            accept=".pdf"
            onChange={handlePdfChange}
            className="block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Video Upload */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Add Videos</label>
          <input
            type="file"
            multiple
            accept="video/*"
            onChange={handleVideoChange}
            className="block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Preview Files */}
        {(pdfFiles.length > 0 || videoFiles.length > 0) && (
          <div className="bg-gray-100 p-3 rounded-md mb-4">
            <h3 className="font-semibold mb-2">Files to Upload:</h3>
            {pdfFiles.map((file, i) => (
              <p key={`pdf-${i}`} className="text-sm text-gray-700">
                📄 {file.name}
              </p>
            ))}
            {videoFiles.map((file, i) => (
              <p key={`video-${i}`} className="text-sm text-gray-700">
                🎬 {file.name}
              </p>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Updating..." : "Update Lesson"}
        </button>
      </form>
    </div>
  );
};

export default UpdateLesson;
