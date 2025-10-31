import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";

const AttemptQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axiosInstance.get(`/quizzes/quize/${id}`);
        setQuiz(res.data.quiz);
        setTimeLeft(res.data.quiz.duration * 60);
      } catch (err) {
        toast.error("Failed to load quiz");
      }
    };
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit(); 
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerChange = (qId, option) => {
    setAnswers({ ...answers, [qId]: option });
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // try {
    //   await axiosInstance.post(`/quizzes/submit/${id}`, { answers });
    //   toast.success("Quiz submitted successfully!");
    //   navigate(`quizzes/attemp/${id}`);
    // } catch (err) {
    //   toast.error(err.response?.data?.message || "Submission failed");
    // }
  };

  if (!quiz) return <div className="text-center mt-20">Loading quiz...</div>;

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-700">{quiz.title}</h1>
        <span className="text-lg font-semibold text-red-500">
          ⏳ Time Left: {formatTime(timeLeft)}
        </span>
      </div>

      {quiz.questions.map((q, index) => (
        <div key={q._id} className="mb-6 p-4 bg-white shadow rounded-lg">
          <p className="font-semibold text-gray-800">
            {index + 1}. {q.question}
          </p>
          <div className="mt-2 space-y-2">
            {q.options.map((opt, i) => (
              <label key={i} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`question-${q._id}`}
                  value={opt}
                  checked={answers[q._id] === opt}
                  onChange={() => handleAnswerChange(q._id, opt)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all"
      >
        {isSubmitting ? "Submitting..." : "Submit Now"}
      </button>
    </div>
  );
};

export default AttemptQuiz;
