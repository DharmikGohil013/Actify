// components/Loader.js
import React from "react";

const LoaderOverlay = () => {
  return (
    <>
      <div style={{
        position: "fixed",
        top: 0, left: 0, width: "100%", height: "100%",
        background: "rgba(248, 250, 252, 0.85)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}>
        <div className="loader-ring" />
        <div style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#64748b",
          letterSpacing: "0.02em",
        }}>
          Loading...
        </div>
      </div>
      <style>{`
        .loader-ring {
          width: 44px;
          height: 44px;
          border: 3px solid #e2e8f0;
          border-top-color: #4f46e5;
          border-radius: 50%;
          animation: loaderSpin 0.8s linear infinite;
        }
        @keyframes loaderSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default LoaderOverlay;
