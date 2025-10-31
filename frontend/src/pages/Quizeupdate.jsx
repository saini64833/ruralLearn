import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const QuizeUpdate = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const res = await axiosInstance.get(`/quizzes/quize/${id}`);
        setQuiz({
          ...res.data.data,
          questions: res.data.data.questions || [],
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load quiz");
      }
    };
    loadQuiz();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuiz({ ...quiz, [name]: value });
  };

  const handleQuestionChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...quiz.questions];
    updated[index][name] = value;
    setQuiz({ ...quiz, questions: updated });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...quiz.questions];
    updated[qIndex].options[oIndex] = value;
    setQuiz({ ...quiz, questions: updated });
  };

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        {
          questionText: "",
          options: ["", "", "", ""],
          correctAnswerIndex: 0,
        },
      ],
    });
  };

  const deleteQuestion = (index) => {
    const updated = quiz.questions.filter((_, i) => i !== index);
    setQuiz({ ...quiz, questions: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/quizzes/update-quize/${id}`, quiz);
      toast.success("✅ Quiz updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update quiz");
    }
  };

  if (!quiz) return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 shadow-sm rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          ✏️ Update Quiz
        </h1>

        {/* Quiz Info Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-600">
                Quiz Title
              </label>
              <input
                name="title"
                value={quiz.title}
                onChange={handleChange}
                placeholder="Enter quiz title"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-600">
                Subject
              </label>
              <input
                name="subject"
                value={quiz.subject}
                onChange={handleChange}
                placeholder="Enter subject"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-600">
              Description
            </label>
            <textarea
              name="description"
              value={quiz.description}
              onChange={handleChange}
              placeholder="Enter quiz description"
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Duration (mins)
              </label>
              <input
                name="duration"
                value={quiz.duration}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Total Marks
              </label>
              <input
                name="totalMarks"
                value={quiz.totalMarks}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Difficulty
              </label>
              <select
                name="difficulty"
                value={quiz.difficulty}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Questions */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold text-gray-800">
                🧠 Manage Questions
              </h2>
              <button
                type="button"
                onClick={addQuestion}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all"
              >
                ➕ Add Question
              </button>
            </div>

            {quiz.questions.length === 0 && (
              <p className="text-gray-500 text-sm italic mb-4">
                No questions yet. Add your first one!
              </p>
            )}

            {quiz.questions.map((q, qIndex) => (
              <div
                key={qIndex}
                className="border border-gray-200 rounded-xl p-5 mb-6 bg-gray-50"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-800">
                    Question {qIndex + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => deleteQuestion(qIndex)}
                    className="text-red-600 text-sm hover:text-red-700"
                  >
                    🗑 Delete
                  </button>
                </div>

                <input
                  name="questionText"
                  value={q.questionText}
                  onChange={(e) => handleQuestionChange(qIndex, e)}
                  placeholder="Enter question text"
                  className="border border-gray-300 rounded-lg w-full px-3 py-2 mb-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                />

                <div className="space-y-2">
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={q.correctAnswerIndex === oIndex}
                        onChange={() => {
                          const updated = [...quiz.questions];
                          updated[qIndex].correctAnswerIndex = oIndex;
                          setQuiz({ ...quiz, questions: updated });
                        }}
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) =>
                          handleOptionChange(qIndex, oIndex, e.target.value)
                        }
                        placeholder={`Option ${oIndex + 1}`}
                        className="border border-gray-300 rounded-lg flex-1 px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Save Button */}
          <div className="text-center mt-6">
            <button
              type="submit"
              className="bg-gray-900 text-white font-medium px-8 py-3 rounded-lg hover:bg-gray-800 transition-all"
            >
              💾 Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizeUpdate;
