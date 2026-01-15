import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MathRenderer from "../components/MathRenderer";
import { FiPlus, FiTrash2, FiSave, FiPlusCircle, FiEdit } from "react-icons/fi";
import { GiBrain } from "react-icons/gi";
const QuizeUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [deletedQuestions, setDeletedQuestions] = useState([]);

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
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...quiz.questions];
    updated[index][field] = value;
    setQuiz({ ...quiz, questions: updated });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...quiz.questions];
    updated[qIndex].options[oIndex] = value;
    setQuiz({ ...quiz, questions: updated });
  };

  const addOption = (qIndex) => {
    const updated = [...quiz.questions];
    updated[qIndex].options.push("");
    setQuiz({ ...quiz, questions: updated });
  };

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        {
          questionText: "",
          options: ["", ""],
          correctAnswerIndex: 0,
          marks: 1,
        },
      ],
    });
  };

  const deleteQuestion = (index) => {
    const toDelete = quiz.questions[index];
    if (toDelete._id) {
      setDeletedQuestions((prev) => [...prev, toDelete._id]);
    }

    setQuiz({
      ...quiz,
      questions: quiz.questions.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...quiz,
      duration: Number(quiz.duration),
      totalMarks: Number(quiz.totalMarks),
      questions: quiz.questions.map((q) => ({
        ...q,
        marks: Number(q.marks),
        correctAnswerIndex: Number(q.correctAnswerIndex),
      })),
      deletedQuestions,
    };

    try {
      await axiosInstance.put(`/quizzes/update-quize/${id}`, payload);
      toast.success("Quiz updated successfully!");
      navigate(`/quizzes/quize/${id}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update quiz");
    }
  };

  if (!quiz) {
    return (
      <p className="text-center mt-10 text-gray-500 text-lg">Loading...</p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-10 border border-gray-200">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 flex justify-center gap-3 items-center">
          <FiEdit />
          Update Quiz
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Info */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="text-gray-600 font-medium">Quiz Title</label>
              <input
                name="title"
                value={quiz.title}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter quiz title"
              />
            </div>

            <div>
              <label className="text-gray-600 font-medium">Subject</label>
              <input
                name="subject"
                value={quiz.subject}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter subject"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-600 font-medium">Description</label>
            <textarea
              name="description"
              value={quiz.description}
              onChange={handleChange}
              rows="3"
              className="w-full mt-2 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter quiz description"
            />
          </div>

          {/* Duration */}
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <label className="text-gray-600 font-medium">
                Duration (mins)
              </label>
              <input
                name="duration"
                value={quiz.duration}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="text-gray-600 font-medium">Total Marks</label>
              <input
                name="totalMarks"
                value={quiz.totalMarks}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="text-gray-600 font-medium">Difficulty</label>
              <select
                name="difficulty"
                value={quiz.difficulty}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Questions */}
          <div className="mt-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                <GiBrain /> Manage Questions
              </h2>

              <button
                type="button"
                onClick={addQuestion}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <FiPlus className="text-lg" /> Add Question
              </button>
            </div>

            {quiz.questions.map((q, qIndex) => (
              <div
                key={qIndex}
                className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6 shadow-sm"
              >
                {/* question head */}
                <div className="flex justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Question {qIndex + 1}
                  </h3>

                  <button
                    type="button"
                    onClick={() => deleteQuestion(qIndex)}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>

                {/* question text */}
                <textarea
                  value={q.questionText}
                  onChange={(e) =>
                    handleQuestionChange(qIndex, "questionText", e.target.value)
                  }
                  placeholder="Enter question text (LaTeX supported)"
                  rows={3}
                  className="w-full mb-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />

                {/* ✅ Question Preview */}
                {q.questionText && (
                  <div className="bg-white border rounded p-3 mb-4">
                    <MathRenderer text={q.questionText} />
                  </div>
                )}

                {/* options */}
                <div className="space-y-3">
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-3">
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
                      />

                      <textarea
                        value={opt}
                        placeholder={`Option ${oIndex + 1} (LaTeX supported)`}
                        rows={2}
                        onChange={(e) =>
                          handleOptionChange(qIndex, oIndex, e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />

                      {/* ✅ Option Preview */}
                      {opt && (
                        <div className="ml-8 mt-2 bg-white border rounded p-2">
                          <MathRenderer text={opt} />
                        </div>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addOption(qIndex)}
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-2"
                  >
                    <FiPlusCircle /> Add Option
                  </button>
                </div>

                {/* marks */}
                <div className="mt-4">
                  <label className="text-gray-600 font-medium">Marks</label>
                  <input
                    type="number"
                    min="1"
                    value={q.marks}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, "marks", e.target.value)
                    }
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="text-center mt-10">
            <button
              type="submit"
              className="flex items-center gap-2 mx-auto bg-black text-white px-10 py-3 rounded-lg font-medium text-lg hover:bg-gray-800 transition"
            >
              <FiSave className="text-xl" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizeUpdate;
