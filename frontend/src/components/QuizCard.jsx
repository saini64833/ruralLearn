import React from "react";
import { useNavigate } from "react-router-dom";

const QuizeCard = ({ quiz }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/quizzes/${quiz._id}`)}
      className="p-4 border rounded-lg shadow hover:shadow-md transition cursor-pointer bg-white"
    >
      <h2 className="text-lg font-bold">{quiz.title}</h2>
      <p className="text-gray-600 text-sm">{quiz.subject}</p>
      <p className="text-gray-500 text-sm mt-2 line-clamp-2">{quiz.description}</p>

      <div className="mt-3 flex justify-between text-sm text-gray-500">
        <span>Duration: {quiz.duration} mins</span>
        <span>Marks: {quiz.totalMarks}</span>
      </div>
      <div className="mt-2">
        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
          {quiz.difficulty.toUpperCase()}
        </span>
      </div>
    </div>
  );
};

export default QuizeCard;
