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
        setQuiz(res.data.data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`quizzes/update-quize/${id}`, quiz);
      toast.success("Quiz updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update quiz");
    }
  };

  if (!quiz) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Update Quiz</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={quiz.title} onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="subject" value={quiz.subject} onChange={handleChange} className="w-full border p-2 rounded" />
        <textarea name="description" value={quiz.description} onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="duration" value={quiz.duration} onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="totalMarks" value={quiz.totalMarks} onChange={handleChange} className="w-full border p-2 rounded" />
        <select name="difficulty" value={quiz.difficulty} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Update</button>
      </form>
    </div>
  );
};

export default QuizeUpdate;
