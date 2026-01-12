import React, { useState, useEffect } from "react";
import { FaThumbsUp, FaComment, FaFilePdf } from "react-icons/fa";
import axiosInstance from "../api/axiosInstance.js";
import VideoPlayer from "./VideoPlayer.jsx";

const LessonCard = ({ lesson, onClick }) => {
  const [likesCount, setLikesCount] = useState(lesson.likes?.length || 0);
  const [comments, setComments] = useState(lesson.comments || []);
  const [commentText, setCommentText] = useState("");
  const [activeVideo, setActiveVideo] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  // Toggle Like
  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      const res = await axiosInstance.put(`/lessons/${lesson._id}/like`);
      setLikesCount(res.data?.data?.likesCount || likesCount);
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  // Add Comment
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  const handleComment = async (e) => {
    e.stopPropagation();
    if (!commentText.trim()) return;
    try {
      const res = await axiosInstance.post(`/lessons/${lesson._id}/comment`, {
        text: commentText,
      });
      setComments(res.data?.data || []);
      setCommentText("");
    } catch (err) {
      console.error("Comment failed:", err);
    }
  };

  return (
    <div
      onClick={onClick}
      className=" border border-gray-200 rounded-2xl shadow-md p-4 bg-white hover:shadow-lg  h-auto transition cursor-pointer"
    >
      {/* Title & Description */}
      <h2 className="text-lg font-bold text-indigo-700 mb-1">{lesson.title}</h2>
      <p className="text-gray-700 mb-3 line-clamp-2">{lesson.description}</p>

      {/* Video Player */}
      {lesson.videos?.length > 0 ? (
        <div className="mb-3">
          <VideoPlayer videoUrls={lesson.videos.map((v) => v.videoFile)} />
          {lesson.videos.length > 1 && (
            <div className="flex justify-center gap-2 mt-2">
              {lesson.videos.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveVideo(index);
                  }}
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
        <p className="text-gray-400 italic text-sm mb-3">No videos uploaded.</p>
      )}

      {/* Likes & Comments */}
      <div className="pt-3  mt-3" onClick={(e) => e.stopPropagation()}>
        <div
          className="pt-3 mt-3 border-t flex items-center justify-between"
          onClick={(e) => e.stopPropagation()}
        >
          {/* LEFT ACTIONS */}
          <div className="flex items-center gap-5">
            {/* LIKE */}
            <button
              onClick={handleLike}
              className="flex items-center gap-1.5 text-gray-600 hover:text-indigo-600 transition group"
            >
              <FaThumbsUp className="group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">{likesCount}</span>
            </button>

            {/* COMMENT COUNT */}
            <div className="flex items-center gap-1.5 text-gray-500">
              <FaComment />
              <span className="text-sm">{comments.length}</span>
            </div>
          </div>

          {/* RIGHT ACTION */}
          <button
            onClick={() => setIsOpen(true)}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition flex items-center gap-1"
          >
            View comments
            <span className="text-xs">→</span>
          </button>
        </div>

        {/* Add Comment */}
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* BACKDROP */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
              onClick={() => setIsOpen(false)}
            />

            {/* MODAL */}
            <div className="relative w-full max-w-md rounded-3xl bg-white/90 shadow-2xl overflow-hidden">
              {/* HEADER */}
              <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex justify-between items-center">
                <h2 className="text-lg font-semibold tracking-wide">
                  Community Comments
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white text-xl"
                >
                  ✕
                </button>
              </div>

              {/* CONTENT */}
              <div className="p-5 flex flex-col gap-4">
                {/* INPUT */}
                <div className="flex gap-3 items-start bg-gray-50 p-3 rounded-2xl shadow-sm">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Share your thoughts..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="w-full bg-transparent border-none outline-none text-sm placeholder-gray-400"
                    />
                  </div>

                  <button
                    onClick={handleComment}
                    className="bg-indigo-600 text-white px-4 py-1.5 rounded-xl hover:bg-indigo-700 transition"
                  >
                    Post
                  </button>
                </div>

                {/* COMMENTS */}
                <div className="flex-1 max-h-64 overflow-y-auto space-y-4 pr-1">
                  {comments.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center mt-8">
                      Start the conversation
                    </p>
                  ) : (
                    comments.map((c) => (
                      <div key={c._id} className="flex gap-3">
                        <div className="bg-gray-100 rounded-xl px-4 py-2 w-full">
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-400">
                              {new Date(c.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm">{c.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonCard;
