// src/components/TaskList.js
export default function TaskList({ tasks, emptyText, onEdit, onDelete, onToggle }) {
  if (!tasks || tasks.length === 0)
    return <div style={{ color: "#aaa" }}>{emptyText}</div>;
  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {tasks.map(task => (
        <li
          key={task._id}
          style={{
            background: "#f8f9fa",
            marginBottom: 8,
            padding: 16,
            borderRadius: 8,
            borderLeft: `5px solid ${
              task.priority === "High"
                ? "#e74c3c"
                : task.priority === "Medium"
                ? "#f39c12"
                : "#2ecc71"
            }`
          }}
        >
          <div style={{ fontWeight: 600 }}>{task.name}</div>
          <div style={{ color: "#777" }}>
            {task.time} &bull; {task.type}
          </div>
          <div style={{ color: "#888", fontSize: 12 }}>
            {task.status} | {new Date(task.date).toLocaleDateString()}
          </div>
          {(onEdit || onDelete || onToggle) && (
            <div style={{ marginTop: 8 }}>
              {onToggle && (
                <button onClick={() => onToggle(task._id)}>
                  Mark as {task.status === "Complete" ? "Incomplete" : "Complete"}
                </button>
              )}
              {onEdit && (
                <button onClick={() => onEdit(task)}>Edit</button>
              )}
              {onDelete && (
                <button onClick={() => onDelete(task._id)} style={{ color: "red" }}>Delete</button>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
