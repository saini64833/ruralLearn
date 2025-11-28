import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
    const { name, value } = e.target;
    setQuiz({ ...quiz, [name]: value });
  };

  const handleQuestionChange = (index, e) => {
    const { name, value } = e.target;
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index][name] = value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuiz({ ...quiz, questions: updatedQuestions });
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
    const questionToDelete = quiz.questions[index];

    if (questionToDelete._id) {
      setDeletedQuestions((prev) => [...prev, questionToDelete._id]);
    }


    const updatedQuestions = quiz.questions.filter((_, i) => i !== index);
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...quiz,
      deletedQuestions, 
    };

    try {
      await axiosInstance.put(`/quizzes/update-quize/${id}`, payload);

      toast.success("✅ Quiz updated successfully!");
      setTimeout(() => {
        navigate(`/quizzes/quize/${id}`);
      }, 600);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update quiz");
    }
  };

  if (!quiz)
    return (
      <p className="text-center mt-10 text-gray-500 text-lg">Loading...</p>
    );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-10 border border-gray-200">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          ✏️ Update Quiz
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Quiz Info */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="text-gray-600 font-medium">Quiz Title</label>
              <input
                name="title"
                value={quiz.title}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter title..."
              />
            </div>

            <div>
              <label className="text-gray-600 font-medium">Subject</label>
              <input
                name="subject"
                value={quiz.subject}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter subject..."
              />
            </div>
          </div>

          <div>
            <label className="text-gray-600 font-medium">Description</label>
            <textarea
              name="description"
              value={quiz.description}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              rows="3"
              placeholder="Enter description..."
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <label className="text-gray-600 font-medium">Duration (mins)</label>
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

          {/* Questions Section */}
          <div className="mt-10">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-semibold text-gray-800">
                🧠 Manage Questions
              </h2>
              <button
                type="button"
                onClick={addQuestion}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                ➕ Add Question
              </button>
            </div>

            {quiz.questions.map((q, qIndex) => (
              <div
                key={qIndex}
                className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6 shadow-sm"
              >
                <div className="flex justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Question {qIndex + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => deleteQuestion(qIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    🗑 Delete
                  </button>
                </div>

                <input
                  name="questionText"
                  value={q.questionText}
                  onChange={(e) => handleQuestionChange(qIndex, e)}
                  placeholder="Enter question..."
                  className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />

                <div className="space-y-3">
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={q.correctAnswerIndex === oIndex}
                        onChange={() => {
                          const updatedQuestions = [...quiz.questions];
                          updatedQuestions[qIndex].correctAnswerIndex = oIndex;
                          setQuiz({ ...quiz, questions: updatedQuestions });
                        }}
                      />
                      <input
                        type="text"
                        value={opt}
                        placeholder={`Option ${oIndex + 1}`}
                        onChange={(e) =>
                          handleOptionChange(qIndex, oIndex, e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Save Button */}
          <div className="text-center mt-10">
            <button
              type="submit"
              className="bg-black text-white px-10 py-3 rounded-lg font-medium text-lg hover:bg-gray-800 transition"
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
