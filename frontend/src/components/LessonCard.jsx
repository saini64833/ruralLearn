import React, { useState } from "react";
import { FaThumbsUp, FaComment } from "react-icons/fa";

const LessonCard = ({ lesson }) => {
  // Local state for likes and comments
  const [likes, setLikes] = useState(0); // default 0, can be from API
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  // Handle like button
  const handleLike = () => {
    setLikes((prev) => prev + 1);
    // TODO: Call API to save like count in backend
  };

  const handleAddComment = () => {
    if (commentText.trim() === "") return;
    setComments((prev) => [...prev, commentText]);
    setCommentText("");
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-200">
      {/* Lesson Info */}
      <h2 className="text-xl font-bold text-indigo-700 mb-2">{lesson.title}</h2>
      <p className="text-gray-600 mb-4">{lesson.description}</p>
      <p className="text-sm text-gray-500 mb-2">
        <strong>Subject:</strong> {lesson.subject} | <strong>Language:</strong> {lesson.language}
      </p>

      {/* Video / PDF Links */}
      <div className="mb-4">
        {lesson.videoUrl && (
          <a
            href={lesson.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-500 hover:underline mr-4"
          >
            Watch Video
          </a>
        )}
        {lesson.pdfUrl && (
          <a
            href={lesson.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-500 hover:underline"
          >
            View PDF
          </a>
        )}
      </div>

      {/* Tags */}
      {lesson.tags && lesson.tags.length > 0 && (
        <div className="mb-4">
          {lesson.tags.map((tag, index) => (
            <span
              key={index}
              className="text-sm bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full mr-2"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Likes & Comments */}
      <div className="flex items-center mb-4 space-x-4">
        <button
          className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800"
          onClick={handleLike}
        >
          <FaThumbsUp />
          <span>{likes}</span>
        </button>

        <button
          className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800"
          onClick={() => document.getElementById(`comment-input-${lesson._id}`)?.focus()}
        >
          <FaComment />
          <span>{comments.length}</span>
        </button>
      </div>

      {/* Comment Input */}
      <div className="flex space-x-2">
        <input
          id={`comment-input-${lesson._id}`}
          type="text"
          placeholder="Add a comment..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button
          onClick={handleAddComment}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Post
        </button>
      </div>

      {/* Comments List */}
      {comments.length > 0 && (
        <div className="mt-4">
          {comments.map((comment, index) => (
            <p key={index} className="text-gray-700 text-sm mb-1">
              {comment}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default LessonCard;
