import React, { useEffect, useState } from "react";
import { FaThumbsUp, FaComment } from "react-icons/fa";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance.js";
import VideoPlayer from "../components/VideoPlayer.jsx";

const LessonDetail = () => {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const fetchLesson = async () => {
    try {
      const res = await axiosInstance.get(`/lessons/${id}`);
      setLesson(res.data?.data);
    } catch (err) {
      console.log(err);
      alert("Error fetching lesson");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

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

  if (loading) return <p>Loading...</p>;
  if (!lesson) return <p>Lesson not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
      <p className="text-gray-700 mb-2">{lesson.description}</p>
      <p className="mb-2">
        <strong>Language:</strong> {lesson.language}
      </p>
      <p className="mb-2">
        <strong>Subject:</strong> {lesson.subject}
      </p>
      <p className="mb-2">
        <strong>Content:</strong> {lesson.content}
      </p>
      <p className="mb-4 ">
        <strong>Tags:</strong> {lesson.tags?.join(", ")}
      </p>

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

      {/* ✅ PDF Section */}
      <div className="mb-4">
        <h2 className="font-semibold mb-2">PDFs</h2>
        <ul className="list-disc pl-5">
          {lesson.pdfUrl?.map((pdf, i) => (
            <li key={i}>
              <a
                href={pdf}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500"
              >
                PDF {i + 1}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h2 className="font-semibold mb-2">Videos</h2>
        {lesson.videos?.length > 0 ? (
          <VideoPlayer
            videoUrls={lesson.videos.map((v) => v.videoFile)} // ✅ extract URLs
          />
        ) : (
          <p className="text-gray-500">No videos available.</p>
        )}
      </div>

      {/* ✅ Comments Section */}
      <div className="mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition flex items-center gap-1"
        >
          View comments
          <span className="text-xs">→</span>
        </button>
      </div>
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
  );
};

export default LessonDetail;
