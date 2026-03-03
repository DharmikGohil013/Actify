// src/components/TaskList.js
export default function TaskList({ tasks, emptyText, onEdit, onDelete, onToggle }) {
  if (!tasks || tasks.length === 0)
    return (
      <div className="empty-state">
        {emptyText || "No tasks available"}
      </div>
    );

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
      {tasks.map((task, idx) => {
        const priorityColor = task.priority === "High"
          ? "var(--accent-red)"
          : task.priority === "Medium"
          ? "var(--accent-orange)"
          : "var(--accent-green)";

        return (
          <li
            key={task._id}
            style={{
              background: "var(--bg-secondary)",
              padding: "16px 20px",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-color)",
              borderLeft: `4px solid ${priorityColor}`,
              transition: "all var(--transition-base)",
              animation: `fadeInUp 0.3s ease-out ${idx * 0.05}s both`,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = "var(--shadow-md)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)" }}>{task.name}</div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span className={`badge ${task.status === "Complete" ? "badge-success" : "badge-warning"}`}>
                  {task.status}
                </span>
                <span className="badge badge-primary">
                  {new Date(task.date).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Meta */}
            <div style={{ color: "var(--text-secondary)", marginTop: 6, fontSize: 13, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <span>🕐 {task.time || "N/A"}</span>
              <span>📂 {task.type}</span>
              {task.duration && <span>⏱ {task.duration} min</span>}
              <span style={{ color: priorityColor, fontWeight: 700 }}>{task.priority}</span>
            </div>

            {/* Notes */}
            {task.notes && (
              <div style={{
                fontSize: 13,
                color: "var(--text-muted)",
                marginTop: 8,
                padding: "8px 12px",
                background: "var(--bg-tertiary)",
                borderRadius: "var(--radius-sm)",
                whiteSpace: "pre-wrap",
              }}>
                {task.notes}
              </div>
            )}

            {/* Actions */}
            {(onEdit || onDelete || onToggle) && (
              <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                {onToggle && (
                  <button
                    onClick={() => onToggle(task._id)}
                    className={`btn-sm btn-pill ${task.status === "Complete" ? "btn-outline" : "btn-primary"}`}
                  >
                    {task.status === "Complete" ? "↩ Undo" : "✓ Complete"}
                  </button>
                )}
                {onEdit && (
                  <button onClick={() => onEdit(task)} className="btn-sm btn-pill btn-outline" style={{ color: "var(--accent-green)" }}>
                    ✎ Edit
                  </button>
                )}
                {onDelete && (
                  <button onClick={() => onDelete(task._id)} className="btn-sm btn-pill btn-outline" style={{ color: "var(--accent-red)", borderColor: "var(--accent-red-light)" }}>
                    ✕ Delete
                  </button>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
