import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const AttemptQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);

  // Fetch quiz + persistent timer
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const res = await axiosInstance.get(`/quizzes/quize/${id}`);
        const quizData = res.data.data;
        setQuiz(quizData);

        const totalSec = quizData.duration * 60;
        const key = `quiz-${id}-startTime`;
        let start = localStorage.getItem(key);

        if (!start) {
          start = Date.now();
          localStorage.setItem(key, start);
        }

        const elapsed = Math.floor((Date.now() - start) / 1000);
        setTimeLeft(totalSec - elapsed);
      } catch (err) {
        console.error(err);
      }
    };

    loadQuiz();
  }, [id]);

  // Timer countdown with aut0-submit
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) return handleSubmit();

    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  // Select multiple options
  const handleOptionSelect = (qIndex, optIndex) => {
    setSelectedAnswers((prev) => {
      const selected = prev[qIndex] || [];
      return {
        ...prev,
        [qIndex]: selected.includes(optIndex)
          ? selected.filter((x) => x !== optIndex)
          : [...selected, optIndex],
      };
    });
  };

  // Submit quiz
  const handleSubmit = async () => {
    try {
      await axiosInstance.post(`/quizzes/submit`, {
        quizId: id,
        answers: selectedAnswers,
      });

      localStorage.removeItem(`quiz-${id}-startTime`);
      navigate(`/quizzes/result/${id}`);
    } catch (error) {
      console.error("Submit Error:", error);
    }
  };

  // Time formatting
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 10;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  if (!quiz)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 text-lg">
        Loading quiz...
      </div>
    );

  const fullTime = quiz.duration * 60;
  const progress = (timeLeft / fullTime) * 100;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">

      {/* Top Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-semibold">{quiz.title}</div>
        <div
          className={`text-xl font-bold ${
            timeLeft < 60 ? "text-red-600 animate-pulse" : "text-indigo-600"
          }`}
        >
          ⏳ {formatTime(timeLeft)}
        </div>
      </header>

      {/* Time Progress Bar */}
      <div className="h-2 w-full bg-gray-300">
        <div
          className="h-2 bg-indigo-600 transition-all"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <main className="max-w-3xl mx-auto px-5 py-10">

        {/* Each Question */}
        {quiz.questions.map((q, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl p-6 mb-8 border border-gray-200"
          >
            <h2 className="text-lg font-semibold mb-4">
              {index + 1}. {q.questionText}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {q.options.map((opt, i) => {
                const checked = selectedAnswers[index]?.includes(i);

                return (
                  <label
                    key={i}
                    className={`flex items-start gap-3 cursor-pointer p-4 border rounded-lg 
                        transition-all shadow-sm
                        ${
                          checked
                            ? "border-indigo-600 bg-indigo-50"
                            : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                        }`}
                  >
                    <input
                      type="checkbox"
                      className="mt-1 h-5 w-5 accent-indigo-600"
                      checked={checked}
                      onChange={() => handleOptionSelect(index, i)}
                    />
                    <span className="text-gray-800 text-base leading-6">
                      {opt}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full py-3 mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition"
        >
          Submit Quiz
        </button>
      </main>
    </div>
  );
};

export default AttemptQuiz;
