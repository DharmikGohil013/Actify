import React, { useContext } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { AuthContext } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import AppRoutes from "./routes";
import "./App.css";

// Layout with sidebar visibility logic
function Layout({ children }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const noSidebarPaths = ["/login", "/register"];
  const showSidebar = user && !noSidebarPaths.includes(location.pathname);

  return (
    <div className="app-layout">
      {showSidebar && <Sidebar />}
      <main className="app-main">{children}</main>
    </div>
  );
}

// App component
export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <LayoutWrapper>
          <AppRoutes />
        </LayoutWrapper>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

// Helper for useLocation inside BrowserRouter
function LayoutWrapper({ children }) {
  const location = useLocation();
  return <Layout location={location}>{children}</Layout>;
}
