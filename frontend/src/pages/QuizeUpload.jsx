import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import MathRenderer from "../components/MathRenderer";

const QuizeUpload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState({
    title: "",
    subject: "",
    description: "",
    duration: "",
    totalMarks: "",
    difficulty: "easy",
    tags: "",
    questions: [
      {
        questionText: "",
        options: ["", ""],
        correctAnswerIndex: 0,
        marks: 1,
      },
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuizData({ ...quizData, [name]: value });
  };

  const handleQuestionChange = (qIndex, field, value) => {
    const updated = [...quizData.questions];
    updated[qIndex][field] = value;
    setQuizData({ ...quizData, questions: updated });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...quizData.questions];
    updated[qIndex].options[oIndex] = value;
    setQuizData({ ...quizData, questions: updated });
  };

  const addOption = (qIndex) => {
    const updated = [...quizData.questions];
    updated[qIndex].options.push("");
    setQuizData({ ...quizData, questions: updated });
  };

  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [
        ...quizData.questions,
        {
          questionText: "",
          options: ["", ""],
          correctAnswerIndex: 0,
          marks: 1,
        },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user?.role !== "Teacher") {
      toast.error("Only teachers can upload quizzes!");
      return;
    }

    try {
      const payload = {
        title: quizData.title,
        subject: quizData.subject,
        description: quizData.description,
        duration: Number(quizData.duration),
        totalMarks: Number(quizData.totalMarks),
        difficulty: quizData.difficulty,
        tags: quizData.tags,
        questions: quizData.questions.map((q) => ({
          questionText: q.questionText,
          options: q.options,
          correctAnswerIndex: Number(q.correctAnswerIndex),
          marks: Number(q.marks),
        })),
      };

      const res = await axiosInstance.post("/quizzes/upload-quize", payload, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success("Quiz uploaded successfully!");

      setTimeout(() => {
        navigate("/quizzes/get-all-quizzes");
      }, 1000);

      console.log("Response:", res.data);
    } catch (err) {
      console.error("Error uploading quiz:", err);
      toast.error(err.response?.data?.message || "Error uploading quiz");
    }
  };

  // Access restriction
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-xl font-semibold text-gray-600">
          Please log in to access this page.
        </h2>
      </div>
    );
  }

  if (user.role !== "Teacher") {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-xl font-semibold text-red-600">
          Only teachers can upload quizzes.
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 flex justify-center">
      <div className="w-full max-w-4xl bg-white border border-gray-300 shadow-md rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8 border-b pb-3">
          Upload New Quiz
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Quiz Details */}
          <section className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-indigo-600 mb-4 border-b pb-2">
              Quiz Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="title"
                placeholder="Quiz Title"
                value={quizData.title}
                onChange={handleChange}
                className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                name="subject"
                placeholder="Subject"
                value={quizData.subject}
                onChange={handleChange}
                className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <textarea
              name="description"
              placeholder="Description"
              value={quizData.description}
              onChange={handleChange}
              rows="3"
              className="border rounded-lg p-3 w-full mt-4 focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <input
                name="duration"
                placeholder="Duration (mins)"
                value={quizData.duration}
                onChange={handleChange}
                className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                name="totalMarks"
                placeholder="Total Marks"
                value={quizData.totalMarks}
                onChange={handleChange}
                className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <select
                name="difficulty"
                value={quizData.difficulty}
                onChange={handleChange}
                className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <input
              name="tags"
              placeholder="Tags (comma separated)"
              value={quizData.tags}
              onChange={handleChange}
              className="border rounded-lg p-3 w-full mt-4 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </section>

          {/* Questions */}
          <section className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-indigo-600 mb-4 border-b pb-2">
              Add Questions
            </h3>

            {quizData.questions.map((q, qIndex) => (
              <div
                key={qIndex}
                className="p-5 mb-5 border border-gray-200 rounded-lg bg-white shadow-sm"
              >
                {/* Question Number */}
                <h4 className="font-semibold text-gray-700 mb-3">
                  Question {qIndex + 1}
                </h4>

                {/* Question Text */}
                <label className="block text-gray-600 mb-1">
                  Enter the question:
                </label>
                <textarea
                  placeholder="Type question (LaTeX supported, e.g. \begin{pmatrix}1 & 2 \\ 3 & 4\end{pmatrix})"
                  value={q.questionText}
                  onChange={(e) =>
                    handleQuestionChange(qIndex, "questionText", e.target.value)
                  }
                  rows={3}
                  className="border rounded-lg p-3 w-full mb-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                />

                {/* LIVE PREVIEW */}
                {q.questionText && (
                  <div className="bg-gray-50 border rounded p-3 mb-3">
                    <MathRenderer math={q.questionText} />
                  </div>
                )}

                {/* Options with radio buttons for correct answer */}
                <label className="block text-gray-600 mb-2">
                  Options (select the correct one):
                </label>
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} className="flex items-center mb-2">
                    <input
                      type="radio"
                      name={`correct-${qIndex}`}
                      checked={q.correctAnswerIndex === oIndex}
                      onChange={() =>
                        handleQuestionChange(
                          qIndex,
                          "correctAnswerIndex",
                          oIndex
                        )
                      }
                      className="mr-2 accent-indigo-600"
                    />
                    <textarea
                      placeholder={`Option ${oIndex + 1} (LaTeX supported)`}
                      value={opt}
                      onChange={(e) =>
                        handleOptionChange(qIndex, oIndex, e.target.value)
                      }
                      rows={2}
                      className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-indigo-500 outline-none"
                    />

                    {/* Option Preview */}
                    {opt && (
                      <div className="ml-6 mt-1 bg-gray-50 border rounded p-2">
                        <MathRenderer math={opt} />
                      </div>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addOption(qIndex)}
                  className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md hover:bg-indigo-200"
                >
                  + Add Another Option
                </button>

                {/* Marks input */}
                <label className="block text-gray-600 mt-3 mb-1">
                  Marks for this question:
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="Enter marks for this question"
                  value={q.marks}
                  onChange={(e) =>
                    handleQuestionChange(
                      qIndex,
                      "marks",
                      Number(e.target.value)
                    )
                  }
                  className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            ))}

            <button
              type="button"
              onClick={addQuestion}
              className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 border border-gray-300"
            >
              + Add Another Question
            </button>
          </section>

          {/* Upload Button */}
          {user?.role === "Teacher" && (
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
            >
              Upload Quiz
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default QuizeUpload;
