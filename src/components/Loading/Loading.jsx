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
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
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
