import React from "react";

const VideoPlayer = ({ videoUrl, previewMode = false }) => {
  if (!videoUrl) return null;

  return (
    <div className="relative w-full bg-black">
      <video
        controls={!previewMode}
        muted={previewMode}
        autoPlay={false}
        className={`w-full ${previewMode ? "h-48 object-cover" : "rounded-lg"}`}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {previewMode && (
        <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center text-white font-semibold">
          ▶ Preview
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
