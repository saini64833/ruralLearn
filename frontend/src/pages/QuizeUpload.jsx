import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";

const QuizeUpload = () => {
  const [quizData, setQuizData] = useState({
    title: "",
    subject: "",
    description: "",
    duration: "",
    totalMarks: "",
    difficulty: "easy",
    tags: "",
    questionText: "",
    options: ["", ""],
    correctAnswerIndex: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuizData({ ...quizData, [name]: value });
  };

  const handleOptionChange = (i, value) => {
    const updated = [...quizData.options];
    updated[i] = value;
    setQuizData({ ...quizData, options: updated });
  };

  const addOption = () => {
    setQuizData({ ...quizData, options: [...quizData.options, ""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(quizData).forEach(([key, value]) => {
      if (Array.isArray(value)) value.forEach((v) => formData.append(key, v));
      else formData.append(key, value);
    });

    try {
      const res = await axiosInstance.post("/quizzes/upload-quize", formData);
      toast.success("Quiz uploaded successfully!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error uploading quiz");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Upload New Quiz</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Title" onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="subject" placeholder="Subject" onChange={handleChange} className="w-full border p-2 rounded" />
        <textarea name="description" placeholder="Description" onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="duration" placeholder="Duration (mins)" onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="totalMarks" placeholder="Total Marks" onChange={handleChange} className="w-full border p-2 rounded" />
        <select name="difficulty" onChange={handleChange} className="w-full border p-2 rounded">
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <input name="tags" placeholder="Tags (comma separated)" onChange={handleChange} className="w-full border p-2 rounded" />

        <hr />
        <h3 className="font-semibold">Question</h3>
        <input name="questionText" placeholder="Question Text" onChange={handleChange} className="w-full border p-2 rounded" />

        {quizData.options.map((opt, i) => (
          <input
            key={i}
            placeholder={`Option ${i + 1}`}
            value={opt}
            onChange={(e) => handleOptionChange(i, e.target.value)}
            className="w-full border p-2 rounded"
          />
        ))}
        <button type="button" onClick={addOption} className="bg-gray-200 px-2 py-1 rounded">+ Add Option</button>

        <input
          name="correctAnswerIndex"
          type="number"
          placeholder="Correct Option Index"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Upload</button>
      </form>
    </div>
  );
};

export default QuizeUpload;
