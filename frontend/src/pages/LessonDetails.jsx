import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance.js";
import LessonCard from "../components/LessonCard.jsx";

const LessonDetail = () => {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await axiosInstance.get(`/lessons/${id}`);
        setLesson(res.data.lesson);
      } catch (err) {
        console.error("Failed to fetch lesson:", err.response?.data || err.message);
      }
    };

    fetchLesson();
  }, [id]);

  if (!lesson)
    return <p className="text-center mt-10 text-gray-500">Loading lesson...</p>;

  return (
    <div className="container mx-auto p-6">
      <LessonCard lesson={lesson} />

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Content:</h2>
        <p className="text-gray-700 whitespace-pre-line">{lesson.content}</p>
      </div>
    </div>
  );
};

export default LessonDetail;
