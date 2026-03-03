// src/components/StatCard.js

export default function StatCard({ label, value, icon, color = "var(--primary)", subtext = "" }) {
  return (
    <div
      className="stat-card"
      style={{
        background: "var(--bg-secondary)",
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--border-color)",
        padding: "24px 20px",
        textAlign: "center",
        transition: "all var(--transition-base)",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = `0 12px 28px ${color}22, var(--shadow-md)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Top accent bar */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: color,
        borderRadius: "var(--radius-xl) var(--radius-xl) 0 0",
      }} />

      {/* Icon */}
      {icon && (
        <div style={{
          fontSize: 28,
          marginBottom: 8,
          color: color,
          display: "flex",
          justifyContent: "center",
        }}>
          {icon}
        </div>
      )}

      {/* Value */}
      <div style={{
        fontSize: 32,
        fontWeight: 800,
        color: "var(--text-primary)",
        lineHeight: 1.2,
      }}>
        {value}
      </div>

      {/* Label */}
      <div style={{
        fontSize: 13,
        color: "var(--text-secondary)",
        marginTop: 6,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.03em",
      }}>
        {label}
      </div>

      {/* Subtext */}
      {subtext && (
        <div style={{
          fontSize: 12,
          color: "var(--text-muted)",
          marginTop: 4,
        }}>
          {subtext}
        </div>
      )}
    </div>
  );
}
