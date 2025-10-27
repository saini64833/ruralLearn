import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

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

        // Fetch data based on role
        if (userInfo.role === "Teacher") {
          // Fetch all lessons by teacher
          const lessonsRes = await axiosInstance.get("/lessons/get-all-lessons");
          const teacherLessons = lessonsRes.data?.data.filter(
            (l) => l.createdBy._id === userInfo._id
          );
          setLessons(teacherLessons || []);

          // Fetch all quizzes by teacher
          const quizzesRes = await axiosInstance.get("/quizzes/get-all-quizzes");
          const teacherQuizzes = quizzesRes.data?.data.filter(
            (q) => q.createdBy._id === userInfo._id
          );
          setQuizzes(teacherQuizzes || []);
        } else if (userInfo.role === "Student") {
          // Fetch student progress
          const progressRes = await axiosInstance.get("/progress/my-progress");
          setProgress(progressRes.data?.data);
        } else if (userInfo.role === "Parent") {
          // Fetch children progress (assuming parent-child mapping exists)
          const childrenRes = await axiosInstance.get("/progress/children-progress");
          setChildrenProgress(childrenRes.data?.data || []);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchData();
  }, []);

  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const handleUploadLesson = () => navigate("/lessons/upload-lesson");
  const handleUploadQuiz = () => navigate("/quizzes/upload-quiz");
  const handleUpdateLesson = (lessonId) => navigate(`/lessons/update/${lessonId}`);
  const handleUpdateQuiz = (quizId) => navigate(`/quizzes/update/${quizId}`);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        {/* USER INFO */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
          <img
            src={userData.avatar || "https://via.placeholder.com/100"}
            alt="avatar"
            className="w-24 h-24 rounded-full border"
          />
          <div>
            <h2 className="text-2xl font-semibold">{userData.fullName}</h2>
            <p className="text-gray-600">@{userData.userName}</p>
            <p className="text-gray-500">{userData.email}</p>
            <span
              className={`mt-2 inline-block px-3 py-1 text-sm rounded-full ${
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
            {/* Actions */}
            <div className="mb-8 flex flex-wrap gap-4">
              <button
                onClick={handleUploadLesson}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Upload Lesson
              </button>
              <button
                onClick={handleUploadQuiz}
                className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
              >
                Upload Quiz
              </button>
            </div>

            {/* Lessons */}
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              Your Lessons ({lessons.length})
            </h3>
            {lessons.length > 0 ? (
              <ul className="space-y-3 mb-10">
                {lessons.map((lesson) => {
                  const firstVideo = lesson.videos?.[0];
                  return (
                    <li
                      key={lesson._id}
                      className="flex justify-between items-center p-4 bg-gray-100 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        {firstVideo?.thumbnail && (
                          <img
                            src={firstVideo.thumbnail}
                            alt="thumbnail"
                            className="w-20 h-14 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-gray-800">{lesson.title}</p>
                          <p className="text-gray-600 text-sm">{lesson.subject}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleUpdateLesson(lesson._id)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        Update
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-500 mb-10">No lessons uploaded yet.</p>
            )}

            {/* Quizzes */}
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              Your Quizzes ({quizzes.length})
            </h3>
            {quizzes.length > 0 ? (
              <ul className="space-y-3">
                {quizzes.map((quiz) => (
                  <li
                    key={quiz._id}
                    className="flex justify-between items-center p-4 bg-gray-100 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{quiz.title}</p>
                      <p className="text-gray-600 text-sm">
                        Questions: {quiz.questions?.length || 0}
                      </p>
                    </div>
                    <button
                      onClick={() => handleUpdateQuiz(quiz._id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Update
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No quizzes uploaded yet.</p>
            )}
          </>
        )}

        {/* STUDENT DASHBOARD */}
        {userData.role === "Student" && progress && (
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Your Progress</h3>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p>Lessons Completed: {progress.completedLessons || 0}</p>
              <p>Quizzes Completed: {progress.completedQuizzes || 0}</p>
              <p>Average Score: {progress.averageScore || 0}%</p>
            </div>
          </div>
        )}

        {/* PARENT DASHBOARD */}
        {userData.role === "Parent" && (
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              Children’s Progress
            </h3>
            {childrenProgress.length > 0 ? (
              <ul className="space-y-3">
                {childrenProgress.map((child) => (
                  <li
                    key={child.childId}
                    className="p-4 bg-gray-100 rounded-lg border"
                  >
                    <p className="font-semibold text-gray-800">{child.name}</p>
                    <p>Lessons Completed: {child.completedLessons}</p>
                    <p>Quizzes Completed: {child.completedQuizzes}</p>
                    <p>Average Score: {child.averageScore}%</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">
                No child progress data available yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
