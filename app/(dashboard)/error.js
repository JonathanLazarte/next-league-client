"use client";

import { useEffect } from "react";

export default function DashboardError({ error /* , reset*/ }) {
  useEffect(() => {
    if (error?.name === "ChunkLoadError") {
      const reloadKey = "dashboard_chunk_reload";
      const hasReloaded = sessionStorage.getItem(reloadKey);
      if (!hasReloaded) {
        sessionStorage.setItem(reloadKey, "1");
        window.location.reload();
      }
    }
  }, [error]);

  useEffect(() => {
    sessionStorage.removeItem("dashboard_chunk_reload");
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "black",
        color: "#C8AA6E",
        gap: "16px",
      }}
    >
      <img
        src="/LOL_Icon_Rendered.png"
        style={{ width: "10rem", opacity: 0.6 }}
        alt="logo"
      />
      <p
        style={{ fontFamily: "Bold", letterSpacing: "2px", fontSize: "0.9rem" }}
      >
        ERROR AL CARGAR
      </p>
      <button
        onClick={() => window.location.reload()}
        style={{
          background: "transparent",
          border: "1px solid #C8AA6E",
          color: "#C8AA6E",
          padding: "8px 24px",
          cursor: "pointer",
          fontFamily: "Bold",
          letterSpacing: "1px",
          fontSize: "0.8rem",
        }}
      >
        REINTENTAR
      </button>
    </div>
  );
}
