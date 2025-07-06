// src/components/StatCard.js

export default function StatCard({ label, value, icon, color = "#1976d2", subtext = "" }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      padding: 24,
      minWidth: 180,
      minHeight: 120,
      textAlign: "center",
      transition: "transform 0.2s ease",
      cursor: "default",
    }}
    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
    onMouseLeave={e => e.currentTarget.style.transform = "scale(1.0)"}
    >
      {/* Optional Icon */}
      {icon && (
        <div style={{
          fontSize: 28,
          marginBottom: 8,
          color: color,
        }}>
          {icon}
        </div>
      )}

      {/* Stat Value */}
      <div style={{
        fontSize: 34,
        fontWeight: 800,
        color: "#333"
      }}>
        {value}
      </div>

      {/* Label */}
      <div style={{
        fontSize: 14,
        color: "#555",
        marginTop: 6,
        fontWeight: 500
      }}>
        {label}
      </div>

      {/* Optional Subtext */}
      {subtext && (
        <div style={{
          fontSize: 12,
          color: "#999",
          marginTop: 4,
        }}>
          {subtext}
        </div>
      )}
    </div>
  );
}
