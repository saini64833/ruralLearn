import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  FileText,
  Upload,
  Trash2,
  Edit3,
  UserCircle2,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [progress, setProgress] = useState(null);
  const [childrenProgress, setChildrenProgress] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/users/me");
        const userInfo = res.data?.data;
        setUserData(userInfo);

        if (userInfo.role === "Teacher") {
          const lessonsRes = await axiosInstance.get("/lessons/get-all-lessons");
          const teacherLessons = lessonsRes.data?.data.filter(
            (l) => l.createdBy._id === userInfo._id
          );
          setLessons(teacherLessons || []);

          const quizzesRes = await axiosInstance.get("/quizzes/get-all-quizzes");
          const teacherQuizzes = quizzesRes.data?.data.filter(
            (q) => q.createdBy === userInfo._id
          );
          setQuizzes(teacherQuizzes || []);
        } else if (userInfo.role === "Student") {
          const progressRes = await axiosInstance.get("/progress/my-progress");
          setProgress(progressRes.data?.data);
        } else if (userInfo.role === "Parent") {
          const childrenRes = await axiosInstance.get("/progress/children-progress");
          setChildrenProgress(childrenRes.data?.data || []);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchData();
  }, []);

  const handleUploadLesson = () => navigate("/lessons/upload-lesson");
  const handleUploadQuiz = () => navigate("/quizzes/upload-quize");
  const handleUpdateLesson = (lessonId) => navigate(`/lessons/update/${lessonId}`);
  const handleUpdateQuiz = (quizId) => navigate(`/quizzes/update-quize/${quizId}`);

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    try {
      await axiosInstance.delete(`/lessons/${lessonId}`);
      setLessons((prev) => prev.filter((l) => l._id !== lessonId));
      alert("Lesson deleted successfully!");
    } catch (error) {
      console.error("Error deleting lesson:", error);
      alert("Failed to delete lesson.");
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await axiosInstance.delete(`/quizzes/quize/${quizId}`);
      setQuizzes((prev) => prev.filter((q) => q._id !== quizId));
      alert("Quiz deleted successfully!");
    } catch (error) {
      console.error("Error deleting quiz:", error);
      alert("Failed to delete quiz.");
    }
  };

  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-indigo-600 font-medium">
        Loading dashboard...
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-10 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-3xl p-8 border border-indigo-100">
        {/* USER INFO */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
          <div className="relative">
            <img
              src={userData.avatar || "https://via.placeholder.com/100"}
              alt="avatar"
              className="w-28 h-28 rounded-full border-4 border-indigo-500 shadow"
            />
            <UserCircle2 className="absolute -bottom-1 -right-1 text-indigo-500 bg-white rounded-full p-1 w-7 h-7" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              {userData.fullName}
            </h2>
            <p className="text-gray-600">@{userData.userName}</p>
            <p className="text-gray-500">{userData.email}</p>
            <span
              className={`mt-3 inline-block px-4 py-1.5 text-sm font-semibold rounded-full shadow-sm ${
                userData.role === "Teacher"
                  ? "bg-blue-100 text-blue-700"
                  : userData.role === "Student"
                  ? "bg-green-100 text-green-700"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              {userData.role.toUpperCase()}
            </span>
          </div>
        </div>

        {/* TEACHER DASHBOARD */}
        {userData.role === "Teacher" && (
          <>
            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap gap-4 mb-10">
              <button
                onClick={handleUploadLesson}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
              >
                <Upload size={18} /> Upload Lesson
              </button>
              <button
                onClick={handleUploadQuiz}
                className="flex items-center gap-2 px-5 py-2.5 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition"
              >
                <FileText size={18} /> Upload Quiz
              </button>
            </div>

            {/* LESSONS */}
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-indigo-700">
              <BookOpen /> Your Lessons ({lessons.length})
            </h3>
            {lessons.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {lessons.map((lesson) => (
                  <motion.div
                    key={lesson._id}
                    className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h4 className="font-bold text-gray-800">{lesson.title}</h4>
                        <p className="text-sm text-gray-600">{lesson.subject}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateLesson(lesson._id)}
                          className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteLesson(lesson._id)}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {lesson.description || "No description available."}
                    </p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mb-8">No lessons uploaded yet.</p>
            )}

            {/* QUIZZES */}
            <h3 className="text-2xl font-semibold mt-10 mb-4 flex items-center gap-2 text-yellow-700">
              <FileText /> Your Quizzes ({quizzes.length})
            </h3>
            {quizzes.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {quizzes.map((quiz) => (
                  <motion.div
                    key={quiz._id}
                    className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-gray-800">{quiz.title}</h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateQuiz(quiz._id)}
                          className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteQuiz(quiz._id)}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      Questions: {quiz.questions?.length || 0}
                    </p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No quizzes uploaded yet.</p>
            )}
          </>
        )}

        {/* STUDENT DASHBOARD */}
        {userData.role === "Student" && progress && (
          <motion.div
            className="bg-indigo-50 p-6 rounded-2xl shadow-sm mt-6"
            whileHover={{ scale: 1.01 }}
          >
            <h3 className="text-2xl font-semibold mb-4 text-indigo-700">
              Your Progress
            </h3>
            <div className="grid grid-cols-3 text-center gap-4">
              <div>
                <p className="text-xl font-bold text-indigo-600">
                  {progress.completedLessons || 0}
                </p>
                <p className="text-gray-600">Lessons Completed</p>
              </div>
              <div>
                <p className="text-xl font-bold text-indigo-600">
                  {progress.completedQuizzes || 0}
                </p>
                <p className="text-gray-600">Quizzes Completed</p>
              </div>
              <div>
                <p className="text-xl font-bold text-indigo-600">
                  {progress.averageScore || 0}%
                </p>
                <p className="text-gray-600">Average Score</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* PARENT DASHBOARD */}
        {userData.role === "Parent" && (
          <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-4 text-purple-700">
              Children’s Progress
            </h3>
            {childrenProgress.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {childrenProgress.map((child) => (
                  <motion.div
                    key={child.childId}
                    className="p-5 bg-purple-50 rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition"
                    whileHover={{ scale: 1.02 }}
                  >
                    <h4 className="font-bold text-gray-800 mb-2">
                      {child.name}
                    </h4>
                    <p>Lessons Completed: {child.completedLessons}</p>
                    <p>Quizzes Completed: {child.completedQuizzes}</p>
                    <p>Average Score: {child.averageScore}%</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No child progress data available yet.
              </p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;
