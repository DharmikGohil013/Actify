import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Helper for initials
function getInitials(name) {
  if (!name) return "";
  return name.slice(0, 2).toUpperCase();
}

const links = [
  { to: "/", label: "Dashboard", icon: "🏠" },
  { to: "/tasks", label: "Daily Tasks", icon: "📝" },
  { to: "/calendar", label: "Calendar", icon: "📅" },
  { to: "/upcoming", label: "Upcoming", icon: "⏳" },
  { to: "/notifications", label: "Notifications", icon: "🔔" },
  { to: "/settings", label: "Settings", icon: "⚙️" },
];

export default function Sidebar() {
  const location = useLocation();
  const { user } = useContext(AuthContext); // 👈 real user from context

  return (
    <aside
      style={{
        width: 230,
        background: "#222e3a",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "100vh",
        boxShadow: "2px 0 12px #0001",
      }}
    >
      {/* Top logo + brand */}
      <div style={{ padding: "34px 0 0 0" }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
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
        </div>
        {/* Main navigation */}
        <nav>
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                color: location.pathname === link.to ? "#61dafb" : "#fff",
                background: location.pathname === link.to ? "#2c3d4f" : "none",
                padding: "13px 34px",
                textDecoration: "none",
                fontWeight: location.pathname === link.to ? "bold" : "normal",
                fontSize: 17,
                borderLeft: location.pathname === link.to ? "4px solid #61dafb" : "4px solid transparent",
                transition: "background 0.15s, color 0.15s, border 0.15s",
                borderRadius: "0 22px 22px 0",
                margin: "3px 0",
                cursor: "pointer",
              }}
              onMouseOver={e => e.currentTarget.style.background = "#263447"}
              onMouseOut={e => e.currentTarget.style.background = location.pathname === link.to ? "#2c3d4f" : "none"}
            >
              <span style={{ fontSize: 20 }}>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      {/* Bottom: Profile link with avatar initials */}
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
          {/* Avatar with initials */}
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
              letterSpacing: 1,
              userSelect: "none",
            }}
          >
            {user && user.name ? getInitials(user.name) : ""}
          </div>
          <span>{user && user.name ? user.name : "Profile"}</span>
        </Link>
      </div>
    </aside>
  );
}
