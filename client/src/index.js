import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

// Suppress ResizeObserver loop completed with undelivered notifications error
// This is a common React development issue that's harmless but annoying
const resizeObserverErrorHandler = (e) => {
  if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
    // Suppress this specific error
    const resizeObserverErr = document.getElementById('webpack-dev-server-client-overlay-div');
    if (resizeObserverErr) {
      resizeObserverErr.style.display = "none";
    }
    return false;
  }
  return true;
};

// Add error event listener
window.addEventListener('error', resizeObserverErrorHandler);

// Also handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
  if (e.reason?.message === 'ResizeObserver loop completed with undelivered notifications.') {
    e.preventDefault();
    return false;
  }
});

// Override console.error to filter ResizeObserver errors
const originalError = console.error;
console.error = (...args) => {
  if (args[0]?.includes?.('ResizeObserver loop completed with undelivered notifications')) {
    return;
  }
  originalError.apply(console, args);
};

// import "./index.css"; // Uncomment if you have global CSS or Tailwind

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
