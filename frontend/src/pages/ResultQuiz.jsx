import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const ResultQuiz = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await axiosInstance.get(`/quizzes/result/${id}`);
        setResult(res.data.data);
      } catch (err) {
        console.error("Failed to fetch result:", err);
        alert("Failed to load result");
        navigate("/quizzes/get-all-quizzes"); 
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading result...
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        No result found
      </div>
    );
  }

  const { quiz, answers, totalScore, totalPercentage } = result;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
        <p className="text-gray-600">
          Total Score: {totalScore} / {quiz.totalMarks}
        </p>
        <p className="text-gray-600">
          Percentage: {totalPercentage.toFixed(2)}%
        </p>
      </div>

      {/* Questions */}
      <div className="max-w-4xl mx-auto space-y-4">
        {answers.map((ans, idx) => {
          const question = ans.questionId;
          const selected = ans.selectedOptionIndex || [];
          const isCorrect = ans.isCorrect;

          return (
            <div key={idx} className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold">
                  Q{idx + 1}: {question.questionText}
                </h2>
                <div className="flex items-center gap-1">
                  {isCorrect ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                  <span
                    className={`font-medium ${
                      isCorrect ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isCorrect ? "Correct" : "Incorrect"}
                  </span>
                </div>
              </div>

              {/* Options */}
              <ul className="list-disc list-inside space-y-1">
                {question.options.map((opt, i) => {
                  const selectedOpt = selected.includes(i);
                  const correctOpt = question.correctAnswerIndex === i;

                  return (
                    <li
                      key={i}
                      className={`px-2 py-1 rounded ${
                        correctOpt
                          ? "bg-green-100 font-semibold"
                          : selectedOpt
                          ? "bg-red-100 line-through"
                          : ""
                      }`}
                    >
                      {opt} {selectedOpt && !correctOpt ? "(Your choice)" : ""}
                      {correctOpt ? " (Correct)" : ""}
                    </li>
                  );
                })}
              </ul>

              {/* Score for the question */}
              <p className="mt-2 text-gray-700 font-medium">
                Score: {ans.score} / {question.marks}
              </p>

              {/* If not attempted */}
              {selected.length === 0 && (
                <p className="mt-1 text-gray-500 italic">Not Attempted</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Back Button */}
      <div className="max-w-4xl mx-auto mt-6 flex justify-end">
        <button
          onClick={() => navigate("/quizzes/get-all-quizzes")}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Back to Quizzes
        </button>
      </div>
    </div>
  );
};

export default ResultQuiz;
