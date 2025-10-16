import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LessonCard from "../components/LessonCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import axiosInstance from "../api/axiosInstance.js";

const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await axiosInstance.get("/lessons/get-all-lessons");
        setLessons(res.data.lessons);
      } catch (err) {
        console.log(
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
        <p className="text-gray-500">No lessons available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <div
              key={lesson._id}
              onClick={() => navigate(`/lessons/${lesson._id}`)}
            >
              <LessonCard lesson={lesson} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Lessons;
