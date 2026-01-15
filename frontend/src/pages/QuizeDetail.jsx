import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance.js";
import { useAuth } from "../context/AuthContext.jsx";
import { FaEdit, FaPlay, FaCheckCircle } from "react-icons/fa"; 
import MathRenderer from "../components/MathRenderer";


const QuizeDetail = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axiosInstance.get(`/quizzes/quize/${id}`);
        setQuiz(res.data.data);
      } catch (err) {
        console.error("Error fetching quiz:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        Loading quiz details...
      </div>
    );

  if (!quiz)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg">
        Quiz not found!
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl border border-gray-100 p-8">
        {/* Header */}
        <div className="border-b border-gray-200 pb-5 mb-6">
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            {quiz.title}
          </h1>
          <p className="text-gray-600 mt-2">{quiz.description}</p>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-700">
            <span>
              <strong className="text-gray-800">Subject:</strong> {quiz.subject}
            </span>
            <span>
              <strong className="text-gray-800">Difficulty:</strong>{" "}
              <span
                className={`px-2 py-0.5 rounded text-sm font-medium ${
                  quiz.difficulty === "easy"
                    ? "bg-emerald-100 text-emerald-700"
                    : quiz.difficulty === "medium"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-rose-100 text-rose-700"
                }`}
              >
                {quiz.difficulty}
              </span>
            </span>
            <span>
              <strong className="text-gray-800">Duration:</strong>{" "}
              {quiz.duration} mins
            </span>
            <span>
              <strong className="text-gray-800">Total Marks:</strong>{" "}
              {quiz.totalMarks}
            </span>
            {quiz.tags?.length > 0 && (
              <span>
                <strong className="text-gray-800">Tags:</strong>{" "}
                {quiz.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded mr-1 text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </span>
            )}
          </div>
        </div>

        {/* Questions */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Questions
          </h2>

          {quiz.questions?.length > 0 ? (
            quiz.questions.map((q, index) => (
              <div
                key={q._id || index}
                className="mb-5 bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium text-gray-900">
                    <span className="mr-2">{index + 1}.</span>
                    <MathRenderer text={q.questionText} />
                  </div>

                  <span className="text-sm text-gray-600">
                    Marks: {q.marks}
                  </span>
                </div>

                <ul className="space-y-1 text-gray-700">
                  {q.options?.map((opt, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 pl-2 bg-white border rounded p-2"
                    >
                      {i === q.correctAnswerIndex && (
                        <FaCheckCircle className="text-emerald-600 mt-1" />
                      )}
                      <MathRenderer text={opt} />
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">
              No questions have been added to this quiz yet.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 flex-wrap">
          {user?.role === "Teacher" && (
            <button
              onClick={() => navigate(`/quizzes/update-quize/${quiz._id}`)}
              className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              <FaEdit /> Edit Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizeDetail;
