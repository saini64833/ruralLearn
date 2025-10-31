import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import QuizeCard from "../components/QuizCard.jsx";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { PlusCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext"; 

const QuizePage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth(); 

  const fetchQuizzes = async () => {
    try {
      const res = await axiosInstance.get("/quizzes/get-all-quizzes");
      setQuizzes(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  return (
    <div className="min-h-screen bg-white p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-6xl mx-auto mb-8 flex justify-between items-center"
      >
        <h1 className="text-4xl font-extrabold text-gray-800">
          Explore Quizzes
        </h1>

        {/* ✅ Only show Upload button if user is a teacher */}
        {user?.role === "Teacher" && (
          <button
            onClick={() => navigate("/quizzes/upload-quize")}
            className="flex items-center gap-2 bg-indigo-600 text-white font-semibold px-5 py-2 rounded-full shadow-md hover:bg-indigo-700 transition-all"
          >
            <PlusCircle size={20} /> Upload Quiz
          </button>
        )}
      </motion.div>

      {loading ? (
        <p className="text-center text-lg font-medium text-gray-700 animate-pulse">
          Loading quizzes...
        </p>
      ) : quizzes.length === 0 ? (
        <div className="text-center text-gray-600 text-lg font-medium mt-10">
          No quizzes found.
        </div>
      ) : (
        <motion.div
          layout
          className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {quizzes.map((quiz, index) => (
            <motion.div
              key={quiz._id}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="bg-white shadow-lg rounded-xl p-4 border border-gray-100 hover:shadow-xl transition-all">
                <QuizeCard quiz={quiz} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default QuizePage;
