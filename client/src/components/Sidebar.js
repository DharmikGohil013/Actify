import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/tasks", label: "Daily Tasks" },
  { to: "/calendar", label: "Calendar" },
  { to: "/upcoming", label: "Upcoming" },
  { to: "/notifications", label: "Notifications" },
  { to: "/settings", label: "Settings" },
  { to: "/profile", label: "Profile" },
];

export default function Sidebar() {
  const location = useLocation();
  return (
    <aside
      style={{
        width: 220,
        background: "#222e3a",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        padding: "30px 0 0 0",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          fontSize: 22,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 32,
          letterSpacing: 1.5,
        }}
      >
        Actify
      </div>
      <nav>
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              display: "block",
              color: location.pathname === link.to ? "#61dafb" : "#fff",
              background: location.pathname === link.to ? "#29394a" : "none",
              padding: "14px 32px",
              textDecoration: "none",
              fontWeight: location.pathname === link.to ? "bold" : "normal",
            }}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
