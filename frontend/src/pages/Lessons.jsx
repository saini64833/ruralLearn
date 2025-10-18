import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LessonCard from "../components/LessonCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import axiosInstance from "../api/axiosInstance.js";
import VideoPlayer from "../components/VideoPlayer.jsx";

const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await axiosInstance.get("/lessons/get-all-lessons");
        console.log("Fetched lessons:", res.data);

        // ✅ Correctly set lessons based on backend structure
        // Assuming your backend returns: { success: true, message: "All lessons fetched", lessons: [...] }
        setLessons(res.data?.lessons || []);
      } catch (err) {
        console.error(
          "Failed to fetch lessons:",
          err.response?.data || err.message
        );
      }
    };
    fetchLessons();
  }, []);

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-700">All Lessons</h1>

        <div className="flex items-center gap-4">
          {user?.role === "Teacher" && (
            <button
              onClick={() => navigate("/lessons/upload-lesson")}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Upload Lesson
            </button>
          )}

          {user && (
            <div
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-600 cursor-pointer"
              onClick={() => navigate("/users/me")}
              title={user.fullName}
            >
              <img
                src={user.avatar || "/default-avatar.png"}
                alt={user.fullName}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* Lessons Grid */}
      {lessons.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          No lessons available.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <div
              key={lesson._id}
              onClick={() => navigate(`/lessons/${lesson._id}`)}
              className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden"
            >
              {/* ✅ Show first video as preview (if available) */}
              {lesson.videoUrl?.length > 0 ? (
                <VideoPlayer videoUrl={lesson.videoUrl[0]} previewMode />
              ) : (
                <img
                  src="/default-thumbnail.jpg"
                  alt="No video"
                  className="w-full h-48 object-cover bg-gray-200"
                />
              )}

              <LessonCard lesson={lesson} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Lessons;
