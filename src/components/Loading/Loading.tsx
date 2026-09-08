"use client";

import { memo } from "react";
import "./Loading.css";

const Loading = memo(function Loading({
  message = "",
  size = "medium",
  fullScreen = false,
}) {
  return (
    <div
      className={`loading-container ${fullScreen ? "fullscreen" : ""}`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className={`loading-spinner ${size}`}>
        <img className="spinner-ring" src="/general/loading-spinner-blue.png"></img>
      </div>
      {message && (
        <p className="loading-message" aria-hidden="true">
          {message}
        </p>
      )}
    </div>
  );
});

export default Loading;
