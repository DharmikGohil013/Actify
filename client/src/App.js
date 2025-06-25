import React, { useContext } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { AuthContext } from "./context/AuthContext";
import AppRoutes from "./routes";

// Layout with sidebar visibility logic
function Layout({ children }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const noSidebarPaths = ["/login", "/register"];
  const showSidebar = user && !noSidebarPaths.includes(location.pathname);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f7f8fa" }}>
      {showSidebar && <Sidebar />}
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}

// App component
export default function App() {
  return (
    <BrowserRouter>
      <LayoutWrapper>
        <AppRoutes />
      </LayoutWrapper>
    </BrowserRouter>
  );
}

// Helper for useLocation inside BrowserRouter
function LayoutWrapper({ children }) {
  const location = useLocation();
  return <Layout location={location}>{children}</Layout>;
}
