import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";

const Dashboard = () => {
  const { user } = useAuth(); // e.g. { accessToken, ... }
  const [form, setForm] = useState(null);
  const [teacherData, setTeacherData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Get the logged-in user info
        const res = await axiosInstance.get("/users/me");
        const userData = res.data?.data;
        setForm(userData);

        // 2️⃣ If teacher, fetch extra stats
        if (userData.role === "teacher") {
          const statsRes = await axiosInstance.get(`/teacher/stats/${userData._id}`);
          setTeacherData(statsRes.data);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchData();
  }, []);

  if (!form) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        {/* USER INFO */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
          <img
            src={form.avatar || "https://via.placeholder.com/100"}
            alt="avatar"
            className="w-24 h-24 rounded-full border"
          />
          <div>
            <h2 className="text-2xl font-semibold">{form.fullName}</h2>
            <p className="text-gray-600">@{form.userName}</p>
            <p className="text-gray-500">{form.email}</p>
            <span
              className={`mt-2 inline-block px-3 py-1 text-sm rounded-full ${
                form.role === "teacher"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {form.role.toUpperCase()}
            </span>
          </div>
        </div>

        {/* ROLE-BASED DASHBOARD */}
        {form.role === "teacher" ? (
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">
              Teacher Dashboard
            </h3>
            {teacherData ? (
              <>
                <div className="grid sm:grid-cols-2 gap-6 mb-6">
                  <div className="bg-blue-50 p-6 rounded-xl text-center">
                    <p className="text-gray-600">Lessons Uploaded</p>
                    <h4 className="text-3xl font-bold text-blue-700">
                      {teacherData.totalLessons}
                    </h4>
                  </div>
                  <div className="bg-yellow-50 p-6 rounded-xl text-center">
                    <p className="text-gray-600">Quizzes Uploaded</p>
                    <h4 className="text-3xl font-bold text-yellow-700">
                      {teacherData.totalQuizzes}
                    </h4>
                  </div>
                </div>

                <h4 className="text-xl font-semibold mb-3 text-gray-700">
                  Lessons Uploaded
                </h4>
                {teacherData.lessonsUploaded?.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-700">
                    {teacherData.lessonsUploaded.map((lesson, index) => (
                      <li key={index}>{lesson}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No lessons uploaded yet.</p>
                )}
              </>
            ) : (
              <p>Loading teacher stats...</p>
            )}
          </div>
        ) : (
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              Student Dashboard
            </h3>
            <p className="text-gray-600 mb-6">
              Welcome back! Check your progress below.
            </p>
            <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              View Progress
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
