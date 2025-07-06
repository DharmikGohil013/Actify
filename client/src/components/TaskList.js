// src/components/TaskList.js
export default function TaskList({ tasks, emptyText, onEdit, onDelete, onToggle }) {
  if (!tasks || tasks.length === 0)
    return (
      <div style={{ color: "#888", padding: "12px 8px", fontStyle: "italic" }}>
        {emptyText || "No tasks available"}
      </div>
    );

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {tasks.map((task) => (
        <li
          key={task._id}
          style={{
            background: "#fff",
            marginBottom: 12,
            padding: "16px 18px",
            borderRadius: 10,
            borderLeft: `5px solid ${
              task.priority === "High"
                ? "#e74c3c"
                : task.priority === "Medium"
                ? "#f39c12"
                : "#2ecc71"
            }`,
            boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
          }}
        >
          {/* Header row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 16 }}>{task.name}</div>
            <div
              style={{
                fontSize: 12,
                background: "#eee",
                padding: "2px 8px",
                borderRadius: 5,
                color: "#555",
              }}
            >
              {task.status} • {new Date(task.date).toLocaleDateString()}
            </div>
          </div>

          {/* Meta info */}
          <div
            style={{
              color: "#666",
              marginTop: 6,
              fontSize: 14,
            }}
          >
            ⏰ {task.time || "N/A"} • 🗂 {task.type}
            {task.duration && ` • ⏳ ${task.duration} min`}
          </div>

          {/* Notes */}
          {task.notes && (
            <div
              style={{
                fontSize: 13,
                color: "#888",
                marginTop: 6,
                whiteSpace: "pre-wrap",
              }}
            >
              📝 {task.notes}
            </div>
          )}

          {/* Actions */}
          {(onEdit || onDelete || onToggle) && (
            <div
              style={{
                marginTop: 10,
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              {onToggle && (
                <button
                  onClick={() => onToggle(task._id)}
                  style={{
                    background: "#1976d2",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "6px 12px",
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  Mark as {task.status === "Complete" ? "Incomplete" : "Complete"}
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(task)}
                  style={{
                    background: "#43a047",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "6px 12px",
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(task._id)}
                  style={{
                    background: "#e74c3c",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "6px 12px",
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
