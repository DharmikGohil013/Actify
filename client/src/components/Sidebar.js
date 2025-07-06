import { Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

// Generate user initials
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
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        color: active ? "#61dafb" : "#fff",
        background: active ? "#2c3d4f" : "none",
        padding: "13px 34px",
        textDecoration: "none",
        fontWeight: active ? "bold" : "normal",
        fontSize: 17,
        borderLeft: active ? "4px solid #61dafb" : "4px solid transparent",
        transition: "background 0.15s, color 0.15s, border 0.15s",
        borderRadius: "0 22px 22px 0",
        margin: "3px 0",
        cursor: "pointer",
      }}
      onMouseOver={e => e.currentTarget.style.background = "#263447"}
      onMouseOut={e => e.currentTarget.style.background = active ? "#2c3d4f" : "none"}
    >
      <span style={{ fontSize: 20 }}>{icon}</span>
      {label}
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
    <aside
      style={{
        width: collapsed ? 80 : 230,
        background: "#222e3a",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "100vh",
        boxShadow: "2px 0 12px #0001",
        transition: "width 0.2s ease-in-out"
      }}
    >
      {/* Top Section */}
      <div style={{ padding: "34px 0 0 0" }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "center",
          marginBottom: 36, gap: 12
        }}>
          <img
            src="/w..png"
            alt="Actify Logo"
            style={{
              width: 38,
              height: 38,
              borderRadius: 9,
              background: "#fff",
              padding: 5,
              boxShadow: "0 1px 7px #1976d210",
            }}
          />
          {!collapsed && (
            <span
              style={{
                fontSize: 26,
                fontWeight: 800,
                fontFamily: "'CuboWide','Orbitron','Arial Black',Arial,sans-serif",
                color: "#61dafb",
                letterSpacing: 2,
              }}
            >
              Actify
            </span>
          )}
        </div>

        {/* Collapse Button */}
        <div style={{ textAlign: "right", paddingRight: 20, marginBottom: 14 }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background: "none",
              border: "none",
              color: "#aaa",
              cursor: "pointer",
              fontSize: 18
            }}
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? "➡️" : "⬅️"}
          </button>
        </div>

        {/* Main Navigation */}
        <nav>
          {coreLinks.map(link => (
            <SidebarLink
              key={link.to}
              to={link.to}
              icon={link.icon}
              label={!collapsed ? link.label : ""}
              currentPath={location.pathname}
            />
          ))}

          {/* Team/Project/Friends Only for logged-in users */}
          {user && extraLinks.map(link => (
            <SidebarLink
              key={link.to}
              to={link.to}
              icon={link.icon}
              label={!collapsed ? link.label : ""}
              currentPath={location.pathname}
            />
          ))}

          {/* Admin Only Section (Example) */}
          {role === "Admin" && (
            <SidebarLink
              to="/admin/users"
              icon="🛡️"
              label={!collapsed ? "Admin Panel" : ""}
              currentPath={location.pathname}
            />
          )}
        </nav>
      </div>

      {/* Bottom Profile Section */}
      <div style={{
        margin: "0 0 32px 0",
        padding: "18px 0 0 0",
        borderTop: "1px solid #344256",
        display: "flex", flexDirection: "column", alignItems: "center"
      }}>
        <Link
          to="/profile"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 13,
            color: location.pathname === "/profile" ? "#61dafb" : "#fff",
            background: location.pathname === "/profile" ? "#2c3d4f" : "none",
            padding: "13px 32px",
            textDecoration: "none",
            fontWeight: location.pathname === "/profile" ? "bold" : "normal",
            fontSize: 17,
            borderLeft: location.pathname === "/profile" ? "4px solid #61dafb" : "4px solid transparent",
            borderRadius: "0 22px 22px 0",
            width: "100%",
            transition: "background 0.16s, color 0.16s, border 0.16s",
          }}
          onMouseOver={e => e.currentTarget.style.background = "#263447"}
          onMouseOut={e => e.currentTarget.style.background = location.pathname === "/profile" ? "#2c3d4f" : "none"}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#61dafb",
              color: "#222e3a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 16,
              textTransform: "uppercase",
              userSelect: "none",
            }}
          >
            {user?.name ? getInitials(user.name) : ""}
          </div>
          {!collapsed && <span>{user?.name || "Profile"}</span>}
        </Link>
      </div>
    </aside>
  );
}
