import { Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Sidebar.css";

// Get user initials for profile avatar
function getInitials(name) {
  if (!name) return "";
  return name.split(" ").map(word => word[0]).join("").slice(0, 2).toUpperCase();
}

// Reusable sidebar link
function SidebarLink({ to, icon, label, currentPath }) {
  const active = currentPath === to;
  return (
    <Link
      to={to}
      title={label}
      className={`sidebar-link ${active ? "active" : ""}`}
    >
      <span className="icon">{icon}</span>
      <span className="label">{label}</span>
    </Link>
  );
}

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const role = user?.role || "User";

  const coreLinks = [
    { to: "/", label: "Dashboard", icon: "🏠" },
    { to: "/tasks", label: "Daily Tasks", icon: "📝" },
    { to: "/calendar", label: "Calendar", icon: "📅" },
    { to: "/upcoming", label: "Upcoming", icon: "⏳" },
    { to: "/notifications", label: "Notifications", icon: "🔔" },
    { to: "/settings", label: "Settings", icon: "⚙️" },
  ];

  const extraLinks = [
    { to: "/projects", label: "Team Projects", icon: "🧑‍🤝‍🧑" },
    { to: "/friends", label: "Friends", icon: "🤝" },
  ];

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : "expanded"}`}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <img src="/w..png" alt="Actify Logo" />
          <span className="label">Actify</span>
        </div>

        <div className="sidebar-collapse">
          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? "➡️" : "⬅️"}
          </button>
        </div>

        {/* Navigation */}
        <nav>
          {coreLinks.map(link => (
            <SidebarLink
              key={link.to}
              to={link.to}
              icon={link.icon}
              label={link.label}
              currentPath={location.pathname}
            />
          ))}
          {user && extraLinks.map(link => (
            <SidebarLink
              key={link.to}
              to={link.to}
              icon={link.icon}
              label={link.label}
              currentPath={location.pathname}
            />
          ))}
          {role === "Admin" && (
            <SidebarLink
              to="/admin/users"
              icon="🛡️"
              label="Admin Panel"
              currentPath={location.pathname}
            />
          )}
        </nav>
      </div>

      {/* Footer Profile */}
      <div className="sidebar-footer">
        <Link
          to="/profile"
          className={`profile-link ${location.pathname === "/profile" ? "active" : ""}`}
        >
          <div className="profile-avatar">{getInitials(user?.name)}</div>
          <span className="label">{user?.name || "Profile"}</span>
        </Link>
      </div>
    </aside>
  );
}
