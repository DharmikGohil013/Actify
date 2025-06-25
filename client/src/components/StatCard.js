// src/components/StatCard.js
export default function StatCard({ label, value }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 1px 4px #0001",
      padding: 24,
      minWidth: 160,
      textAlign: "center"
    }}>
      <div style={{ fontSize: 32, fontWeight: 700 }}>{value}</div>
      <div style={{ color: "#666", marginTop: 8 }}>{label}</div>
    </div>
  );
}
