import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext"; 

const QuizeUpload = () => {
  const { user } = useAuth();

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
      },
    ],
  });

  // Handle field changes
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
        { questionText: "", options: ["", ""], correctAnswerIndex: 0 },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user?.role !== "teacher") {
      toast.error("Only teachers can upload quizzes!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", quizData.title);
      formData.append("subject", quizData.subject);
      formData.append("description", quizData.description);
      formData.append("duration", quizData.duration);
      formData.append("totalMarks", quizData.totalMarks);
      formData.append("difficulty", quizData.difficulty);
      formData.append("tags", quizData.tags);
      formData.append("questions", JSON.stringify(quizData.questions));

      const res = await axiosInstance.post("/quizzes/upload-quize", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Quiz uploaded successfully!");
      console.log("Response:", res.data);
    } catch (err) {
      console.error("Error uploading quiz:", err);
      toast.error(err.response?.data?.message || "Error uploading quiz");
    }
  };

  //  Restrict Access
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-xl font-semibold text-gray-600">
          Please log in to access this page.
        </h2>
      </div>
    );
  }

  if (user.role !== "teacher") {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-xl font-semibold text-red-600">
          Only teachers can upload quizzes.
        </h2>
      </div>
    );
  }

  //  Render for teacher only
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
                onChange={handleChange}
                className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                name="subject"
                placeholder="Subject"
                onChange={handleChange}
                className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <textarea
              name="description"
              placeholder="Description"
              onChange={handleChange}
              rows="3"
              className="border rounded-lg p-3 w-full mt-4 focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <input
                name="duration"
                placeholder="Duration (mins)"
                onChange={handleChange}
                className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                name="totalMarks"
                placeholder="Total Marks"
                onChange={handleChange}
                className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <select
                name="difficulty"
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
                <h4 className="font-semibold text-gray-700 mb-3">
                  Question {qIndex + 1}
                </h4>

                <input
                  placeholder="Enter question text"
                  value={q.questionText}
                  onChange={(e) =>
                    handleQuestionChange(qIndex, "questionText", e.target.value)
                  }
                  className="border rounded-lg p-3 w-full mb-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                />

                {q.options.map((opt, oIndex) => (
                  <input
                    key={oIndex}
                    placeholder={`Option ${oIndex + 1}`}
                    value={opt}
                    onChange={(e) =>
                      handleOptionChange(qIndex, oIndex, e.target.value)
                    }
                    className="border rounded-lg p-3 w-full mb-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                ))}

                <button
                  type="button"
                  onClick={() => addOption(qIndex)}
                  className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md hover:bg-indigo-200"
                >
                  + Add Option
                </button>

                <input
                  type="number"
                  placeholder="Correct Option Index (0-based)"
                  value={q.correctAnswerIndex}
                  onChange={(e) =>
                    handleQuestionChange(
                      qIndex,
                      "correctAnswerIndex",
                      e.target.value
                    )
                  }
                  className="border rounded-lg p-3 w-full mt-3 focus:ring-2 focus:ring-indigo-500 outline-none"
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

          {/*    Upload Button — visible only for teachers */}
          {user?.role === "teacher" && (
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
