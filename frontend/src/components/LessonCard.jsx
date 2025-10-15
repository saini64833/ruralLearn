import React, { useState } from "react";
import { FaThumbsUp, FaComment } from "react-icons/fa";
import axiosInstance from "../api/axiosInstance";

const LessonCard = ({ lesson }) => {
  const [likesCount, setLikesCount] = useState(lesson.likes?.length || 0);
  const [comments, setComments] = useState(lesson.comments || []);
  const [commentText, setCommentText] = useState("");

  const handleLike = async () => {
    try {
      const res = await axiosInstance.put(`/lessons/${lesson._id}/like`);
      setLikesCount(res.data.likesCount);
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async () => {
    if (!commentText) return;
    try {
      const res = await axiosInstance.post(`/lessons/${lesson._id}/comment`, { text: commentText });
      setComments(res.data.comments);
      setCommentText("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="lesson-card border p-4 rounded mb-4">
      <h2 className="text-xl font-bold">{lesson.title}</h2>
      <p>{lesson.description}</p>

      <div className="flex gap-4 mt-2">
        <button onClick={handleLike} className="flex items-center gap-1">
          <FaThumbsUp /> {likesCount}
        </button>
      </div>

      <div className="mt-2">
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="border p-1 mr-2"
        />
        <button onClick={handleComment} className="bg-blue-500 text-white px-2 py-1">
          <FaComment /> Comment
        </button>
      </div>

      <div className="mt-2">
        {comments.map((c, i) => (
          <p key={i} className="text-sm border-b py-1">{c.text}</p>
        ))}
      </div>
    </div>
  );
};

export default LessonCard;
