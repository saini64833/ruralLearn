import React, { useRef, useEffect, useState } from "react";
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaExpand } from "react-icons/fa";

const VideoPlayer = ({ videoUrls = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentIndex < videoUrls.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) videoRef.current.requestFullscreen();
    else if (videoRef.current.webkitRequestFullscreen) videoRef.current.webkitRequestFullscreen();
    else if (videoRef.current.msRequestFullscreen) videoRef.current.msRequestFullscreen();
  };

  const handleEnded = () => {
    if (currentIndex < videoUrls.length - 1) setCurrentIndex(currentIndex + 1);
    else setCurrentIndex(0);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentIndex]);

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-md bg-black">
      <video
        ref={videoRef}
        controls
        onEnded={handleEnded}
        className="w-full h-64 object-cover"
      >
        <source src={videoUrls[currentIndex]} type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>

      {/* Controls */}
      <div className="flex justify-center items-center gap-4 py-3 bg-gray-900 text-white">
        <button onClick={handlePrev} disabled={currentIndex === 0}>
          <FaStepBackward />
        </button>
        <button onClick={togglePlay}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button onClick={handleNext} disabled={currentIndex === videoUrls.length - 1}>
          <FaStepForward />
        </button>
        <button onClick={handleFullscreen}>
          <FaExpand />
        </button>
      </div>

      {/* Playlist */}
      {videoUrls.length > 1 && (
        <div className="bg-gray-100 p-3 max-h-40 overflow-y-auto">
          <h3 className="text-sm font-semibold mb-2 text-gray-700">Playlist</h3>
          {videoUrls.map((url, i) => (
            <div
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`cursor-pointer px-3 py-2 rounded-md mb-1 text-sm ${
                i === currentIndex ? "bg-indigo-600 text-white" : "hover:bg-gray-200"
              }`}
            >
              Video {i + 1}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
