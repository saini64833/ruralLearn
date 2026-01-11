import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ResultQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch quiz result
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

  const { quizId, answers, totalScore, totalPercentage } = result;

  // Chart Data
  const correctCount = answers.filter(a => a.isCorrect).length;
  const wrongCount = answers.filter(a => a.selectedOptionIndex !== null && !a.isCorrect).length;
  const notAttemptedCount = answers.filter(a => a.selectedOptionIndex === null).length;

  const barData = {
    labels: ["Correct", "Incorrect", "Not Attempted"],
    datasets: [
      {
        label: "Answers",
        data: [correctCount, wrongCount, notAttemptedCount],
        backgroundColor: ["#4ade80", "#f87171", "#facc15"],
        borderRadius: 5,
      },
    ],
  };

  const pieData = {
    labels: ["Score", "Remaining"],
    datasets: [
      {
        data: [totalPercentage, 100 - totalPercentage],
        backgroundColor: ["#3b82f6", "#d1d5db"],
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Quiz Summary" },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">{quizId.title}</h1>
        <p className="text-gray-600">
          Total Score: {totalScore} / {quizId.totalMarks}
        </p>
        <p className="text-gray-600">
          Percentage: {totalPercentage.toFixed(2)}%
        </p>
      </div>

      {/* Charts */}
      <div className="max-w-4xl mx-auto mb-6 grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-2 text-gray-700">Correct vs Wrong</h3>
          <Bar data={barData} options={chartOptions} />
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-2 text-gray-700">Score Percentage</h3>
          <Pie data={pieData} options={chartOptions} />
        </div>
      </div>

      {/* Questions */}
      <div className="max-w-4xl mx-auto space-y-4">
        {answers.map((ans, idx) => {
          const question = ans.questionId; // populated question
          const selected = ans.selectedOptionIndex; // number or null
          const isCorrect = ans.isCorrect;

          return (
            <div key={idx} className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold">
                  Q{idx + 1}: {question.questionText}
                </h2>

                <div className="flex items-center gap-1">
                  {isCorrect ? (
                    <span className="text-green-600 font-medium">Correct</span>
                  ) : selected != null ? (
                    <span className="text-red-600 font-medium">Incorrect</span>
                  ) : (
                    <span className="text-yellow-600 font-medium">Not Attempted</span>
                  )}
                </div>
              </div>

              {/* Options */}
              <ul className="list-disc list-inside space-y-1">
                {question.options.map((opt, i) => {
                  const isSelected = selected === i;
                  const isCorrectOpt = question.correctAnswerIndex === i;

                  return (
                    <li
                      key={i}
                      className={`px-2 py-1 rounded ${
                        isCorrectOpt
                          ? "bg-green-100 font-semibold"
                          : isSelected
                          ? "bg-red-100 line-through"
                          : ""
                      }`}
                    >
                      {opt}
                      {isSelected && !isCorrectOpt && " (Your choice)"}
                      {isCorrectOpt && " (Correct)"}
                    </li>
                  );
                })}
              </ul>

              {/* Score */}
              <p className="mt-2 text-gray-700 font-medium">
                Score: {ans.score} / {question.marks}
              </p>

              {/* Not attempted */}
              {selected === null && (
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
