import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Timer, Star } from "lucide-react";
import { useAuth } from "../context/AuthContext"; 

const QuizeCard = ({ quiz }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const difficultyColors = {
    easy: "bg-green-100 text-green-700 border-green-300",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
    hard: "bg-red-100 text-red-700 border-red-300",
  };

  const diff = quiz?.difficulty?.toLowerCase() || "medium";

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -3 }}
      transition={{ type: "spring", stiffness: 280, damping: 15 }}
      className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-sm hover:shadow-xl border border-transparent hover:border-indigo-200 p-5 transition-all duration-300 h-full flex flex-col justify-between"
    >
      {/* Header */}
      <div onClick={() => navigate(`/quizzes/quize/${quiz._id}`)} className="cursor-pointer">
        <h2 className="text-lg font-bold text-indigo-700 truncate">{quiz?.title}</h2>
        <p className="text-gray-600 text-sm font-medium mb-2">{quiz?.subject}</p>
        <p className="text-gray-500 text-sm mt-2 line-clamp-3">
          {quiz?.description || "No description available."}
        </p>
      </div>

      {/* Stats */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Timer size={15} className="text-indigo-500" />
          <span>{quiz?.duration || 0} mins</span>
        </div>
        <div className="flex items-center gap-1">
          <Star size={15} className="text-pink-500" />
          <span>{quiz?.totalMarks || 0} marks</span>
        </div>
      </div>

      {/* Difficulty & Button */}
      <div className="mt-4 flex justify-between items-center">
        <span
          className={`px-3 py-1 border rounded-full text-xs font-semibold uppercase ${difficultyColors[diff]}`}
        >
          {quiz?.difficulty || "Medium"}
        </span>

        {/* ✅ Attempt Button (only for student) */}
        {user?.role === "Student" && (
          <button
            onClick={() => navigate(`/quizzes/attempt/${quiz._id}`)}
            className="bg-indigo-600 text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all"
          >
            Attempt
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default QuizeCard;
  