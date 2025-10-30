import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const QuizeDetail = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axiosInstance.get(`quizzes/${id}`);
        setQuiz(res.data.data);
      } catch (err) {
        console.error("Error fetching quiz:", err);
      }
    };
    fetchQuiz();
  }, [id]);

  if (!quiz) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
      <p className="text-gray-600 mb-4">{quiz.description}</p>
      <div className="mb-4">
        <span className="mr-3">Subject: {quiz.subject}</span>
        <span>Difficulty: {quiz.difficulty}</span>
      </div>
      <h3 className="text-xl font-semibold mb-2">Questions:</h3>
      {quiz.questions?.map((q, index) => (
        <div key={q._id} className="mb-4 border-b pb-2">
          <p className="font-medium">{index + 1}. {q.questionText}</p>
          <ul className="list-disc pl-6 text-gray-700">
            {q.options.map((opt, i) => (
              <li
                key={i}
                className={i === q.correctAnswerIndex ? "text-green-600 font-semibold" : ""}
              >
                {opt}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <button
        onClick={() => navigate(`/quizzes/update/${quiz._id}`)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Edit Quiz
      </button>
    </div>
  );
};

export default QuizeDetail;
