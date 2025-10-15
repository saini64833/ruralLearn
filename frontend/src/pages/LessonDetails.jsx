import React, { useEffect, useState } from "react";
import { FaThumbsUp, FaComment } from "react-icons/fa";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance.js";

const LessonDetail = () => {
  const { id } = useParams(); // lesson ID from URL
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");

  const fetchLesson = async () => {
    try {
      const res = await axiosInstance.get(`/lessons/${id}`);
      setLesson(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching lesson");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLesson();
  }, [id]);

  const handleLike = async () => {
    try {
      const res = await axiosInstance.put(`/lessons/${id}/like`);
      setLesson({ ...lesson, likes: res.data.likesCount });
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async () => {
    if (!commentText) return;
    try {
      const res = await axiosInstance.post(`/lessons/${id}/comment`, { text: commentText });
      setLesson({ ...lesson, comments: res.data.comments });
      setCommentText("");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!lesson) return <p>Lesson not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
      <p className="text-gray-700 mb-2">{lesson.description}</p>
      <p className="mb-2"><strong>Language:</strong> {lesson.language}</p>
      <p className="mb-2"><strong>Subject:</strong> {lesson.subject}</p>
      <p className="mb-2"><strong>Content:</strong> {lesson.content}</p>
      <p className="mb-4"><strong>Tags:</strong> {lesson.tags.join(", ")}</p>

      <div className="flex gap-4 mb-4">
        <button
          className="flex items-center gap-1 bg-blue-500 text-white px-2 py-1 rounded"
          onClick={handleLike}
        >
          <FaThumbsUp /> {lesson.likes?.length || 0}
        </button>
        <span className="flex items-center gap-1">
          <FaComment /> {lesson.comments?.length || 0}
        </span>
      </div>

      <div className="mb-4">
        <h2 className="font-semibold mb-2">PDFs</h2>
        <ul className="list-disc pl-5">
          {lesson.pdfUrl.map((pdf, i) => (
            <li key={i}>
              <a href={pdf} target="_blank" rel="noreferrer" className="text-blue-500">
                PDF {i + 1}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h2 className="font-semibold mb-2">Videos</h2>
        {lesson.videoUrl.map((video, i) => (
          <video key={i} controls className="w-full my-2">
            <source src={video} type="video/mp4" />
          </video>
        ))}
      </div>

      <div className="mb-4">
        <h2 className="font-semibold mb-2">Comments</h2>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="border p-1 flex-1 rounded"
          />
          <button
            className="bg-blue-500 text-white px-3 rounded"
            onClick={handleComment}
          >
            Comment
          </button>
        </div>
        <ul>
          {lesson.comments.map((c, i) => (
            <li key={i} className="border-b py-1">
              {c.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LessonDetail;
