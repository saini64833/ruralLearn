import React, { useState } from "react";
import { FaThumbsUp, FaComment, FaFilePdf } from "react-icons/fa";
import axiosInstance from "../api/axiosInstance.js";
import VideoPlayer from "./VideoPlayer.jsx";

const LessonCard = ({ lesson }) => {
  const [likesCount, setLikesCount] = useState(lesson.likes?.length || 0);
  const [comments, setComments] = useState(lesson.comments || []);
  const [commentText, setCommentText] = useState("");
  const [activeVideo, setActiveVideo] = useState(0); // index of current video

  // ✅ Handle Like
  const handleLike = async () => {
    try {
      const res = await axiosInstance.put(`/lessons/${lesson._id}/like`);
      setLikesCount(res.data.likesCount || likesCount + 1);
    } catch (err) {
      console.log("Like failed:", err);
    }
  };

  // ✅ Handle Comment
  const handleComment = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await axiosInstance.post(`/lessons/${lesson._id}/comment`, {
        text: commentText,
      });
      setComments(res.data.comments || []);
      setCommentText("");
    } catch (err) {
      console.log("Comment failed:", err);
    }
  };

  return (
    <div className="border border-gray-200 rounded-2xl shadow-md p-4 bg-white">
      {/* Title & Description */}
      <h2 className="text-lg font-bold text-indigo-700 mb-1">
        {lesson.title}
      </h2>
      <p className="text-gray-700 mb-3 line-clamp-2">
        {lesson.description}
      </p>

      {/* Video Player */}
      {lesson.videoUrl?.length > 0 ? (
        <div className="mb-3">
          <VideoPlayer videoUrl={lesson.videoUrl[activeVideo]} />

          {/* Video Navigation */}
          {lesson.videoUrl.length > 1 && (
            <div className="flex justify-center gap-2 mt-2">
              {lesson.videoUrl.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveVideo(index)}
                  className={`w-3 h-3 rounded-full ${
                    activeVideo === index
                      ? "bg-indigo-600"
                      : "bg-gray-300 hover:bg-indigo-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-400 italic text-sm mb-3">
          No videos uploaded.
        </p>
      )}

      {/* PDFs */}
      {lesson.pdfUrl?.length > 0 && (
        <div className="mb-3">
          <h3 className="font-semibold mb-1 flex items-center gap-2 text-indigo-600">
            <FaFilePdf /> Download PDFs
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            {lesson.pdfUrl.map((pdf, i) => (
              <li key={i}>
                <a
                  href={pdf}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  PDF {i + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Likes & Comments */}
      <div className="border-t pt-3 mt-3">
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={handleLike}
            className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition"
          >
            <FaThumbsUp /> {likesCount}
          </button>
          <span className="flex items-center gap-1 text-gray-600">
            <FaComment /> {comments.length}
          </span>
        </div>

        {/* Add Comment */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="border p-2 flex-1 rounded-lg text-sm"
          />
          <button
            onClick={handleComment}
            className="bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700"
          >
            Comment
          </button>
        </div>

        {/* Comments List */}
        <div className="max-h-32 overflow-y-auto border-t pt-2">
          {comments.length === 0 ? (
            <p className="text-sm text-gray-400 italic">
              No comments yet.
            </p>
          ) : (
            comments.map((c, i) => (
              <p key={i} className="text-sm border-b py-1">
                {c.text}
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonCard;
