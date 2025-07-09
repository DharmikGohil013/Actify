// components/Loader.js
import React from "react";

const LoaderOverlay = () => {
  return (
    <>
      <div style={{
        position: "fixed",
        top: 0, left: 0, width: "100%", height: "100%",
        backgroundColor: "rgba(255,255,255,0.8)",
        zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(4px)"
      }}>
        <div className="spinner" />
      </div>
      <style>{`
        .spinner {
          width: 60px;
          height: 60px;
          border: 6px solid #1976d2;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default LoaderOverlay;
