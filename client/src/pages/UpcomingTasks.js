import React, { useEffect, useState } from "react";
import {
  getUpcomingTasks,
  updateTask,
  deleteTask,
  toggleTaskStatus,
} from "../utils/api";

// ---- Expensive, Modern Task Form ----
const defaultTask = {
  name: "",
  type: "Work",
  time: "",
  duration: "",
  notes: "",
  priority: "Medium",
};
function TaskForm({ onSave, onCancel, initialData }) {
  const [form, setForm] = useState(initialData || defaultTask);

  useEffect(() => {
    setForm(initialData || defaultTask);
  }, [initialData]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.time)
      return alert("Task Name and Time required");
    onSave(form);
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginBottom: 32,
        background: "linear-gradient(120deg,#e9f0fe 80%,#fff0fa 100%)",
        borderRadius: 20,
        boxShadow: "0 4px 26px #5ac8fa2a",
        padding: "23px 19px 16px 19px",
        display: "flex",
        flexWrap: "wrap",
        gap: 15,
        alignItems: "flex-end"
      }}
    >
      <input
        name="name"
        placeholder="Task Name"
        value={form.name}
        onChange={handleChange}
        required
        style={{
          flex: 2,
          minWidth: 125,
          padding: "13px 12px",
          borderRadius: 14,
          border: "none",
          background: "#f5faff",
          fontSize: 16,
          fontWeight: 700,
          boxShadow: "0 2px 14px #c9e8ff13"
        }}
      />
      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        style={{
          minWidth: 90,
          padding: "13px 14px",
          borderRadius: 14,
          border: "none",
          background: "#f5faff",
          fontWeight: 800,
          color: "#1976d2",
          fontSize: 15
        }}
      >
        <option>Work</option>
        <option>Personal</option>
        <option>Learning</option>
        <option>Other</option>
      </select>
      <div style={{ minWidth: 95, position: "relative", flex: 1 }}>
        <input
          name="time"
          type="time"
          value={form.time}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            border: "none",
            borderRadius: 14,
            fontSize: 16,
            fontWeight: 800,
            background: "#f7fcff",
            padding: "13px 10px 13px 36px",
            boxShadow: "0 3px 16px #89cffd33",
            outline: "none",
            color: "#1976d2",
          }}
        />
        <span style={{
          position: "absolute",
          left: 10,
          top: 13,
          fontSize: 18,
          color: "#1976d2",
          filter: "drop-shadow(0 1.5px 3px #43e97baa)",
          pointerEvents: "none"
        }}>
          ⏰
        </span>
      </div>
      <input
        name="duration"
        type="number"
        placeholder="Duration (min)"
        value={form.duration}
        onChange={handleChange}
        min={1}
        style={{
          minWidth: 70,
          padding: "13px 10px",
          borderRadius: 14,
          border: "none",
          background: "#f5faff",
          fontSize: 15,
          fontWeight: 700,
        }}
      />
      <select
        name="priority"
        value={form.priority}
        onChange={handleChange}
        style={{
          minWidth: 86,
          padding: "13px 12px",
          borderRadius: 14,
          border: "none",
          background: "#f5faff",
          fontWeight: 800,
          color:
            form.priority === "High" ? "#e74c3c"
              : form.priority === "Medium" ? "#f39c12"
                : "#2ecc71",
          fontSize: 15
        }}
      >
        <option style={{ color: "#e74c3c" }}>High</option>
        <option style={{ color: "#f39c12" }}>Medium</option>
        <option style={{ color: "#2ecc71" }}>Low</option>
      </select>
      <textarea
        name="notes"
        placeholder="Notes (optional)"
        value={form.notes}
        onChange={handleChange}
        style={{
          width: "100%",
          borderRadius: 13,
          border: "none",
          background: "#f5faff",
          fontSize: 15,
          padding: "13px 14px",
          fontWeight: 600,
          marginTop: 6,
          minHeight: 34
        }}
        rows={2}
      />
      <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
        <button
          type="submit"
          style={{
            background: "linear-gradient(90deg,#1976d2 60%,#43e97b 100%)",
            color: "#fff",
            fontWeight: 800,
            fontSize: 16,
            padding: "12px 36px",
            border: "none",
            borderRadius: 99,
            boxShadow: "0 2px 12px #1976d211",
            cursor: "pointer",
            letterSpacing: 0.3
          }}
        >
          {initialData ? "Update Task" : "Add Task"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: "#fff",
              color: "#1976d2",
              fontWeight: 700,
              fontSize: 16,
              border: "2px solid #b6d9f7",
              padding: "12px 26px",
              borderRadius: 99,
              cursor: "pointer",
              boxShadow: "0 1.5px 4px #1976d214",
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

// ---- Expensive Task Card List ----
function TaskList({ tasks, emptyText, onEdit, onDelete, onToggle }) {
  if (!tasks || tasks.length === 0)
    return <div style={{
      color: "#9db3cf",
      fontWeight: 600,
      padding: 26,
      textAlign: "center",
      background: "linear-gradient(90deg,#e6f0ff 65%,#fff0fa 100%)",
      borderRadius: 18,
      margin: "18px 0"
    }}>{emptyText}</div>;
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {tasks.map((task) => (
        <li
          key={task._id}
          style={{
            background: "linear-gradient(100deg,#e6f0ff 65%,#fff0fa 100%)",
            marginBottom: 18,
            padding: "20px 18px 14px 24px",
            borderRadius: 20,
            borderLeft: `8px solid ${
              task.priority === "High"
                ? "rgba(231,76,60,0.97)"
                : task.priority === "Medium"
                ? "rgba(243,156,18,0.92)"
                : "rgba(46,204,113,0.9)"
            }`,
            boxShadow: "0 6px 26px #5ac8fa33",
            display: "flex",
            flexDirection: "column",
            gap: 5,
            position: "relative",
            backdropFilter: "blur(1.5px)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
            <span style={{
              fontSize: 19,
              fontWeight: 800,
              color: "#3a8efd",
              marginRight: 2,
              textShadow: "0 1px 7px #43e97baa"
            }}>
              {task.type === "Work" ? "💼"
                : task.type === "Personal" ? "🏡"
                : task.type === "Learning" ? "📚"
                : "✨"}
            </span>
            <span style={{
              fontWeight: 900,
              fontSize: 18,
              color: "#003ba7",
              letterSpacing: 0.5,
              textShadow: "0 1.5px 10px #8fd3f4b8"
            }}>
              {task.name}
            </span>
            <span style={{
              marginLeft: "auto",
              fontSize: 13,
              fontWeight: 900,
              color:
                task.priority === "High" ? "#fff" :
                task.priority === "Medium" ? "#fff" :
                "#fff",
              background:
                task.priority === "High" ? "linear-gradient(100deg,#e74c3c,#ff8585)" :
                task.priority === "Medium" ? "linear-gradient(100deg,#f39c12,#ffe594)" :
                "linear-gradient(100deg,#2ecc71,#a0ffd1)",
              padding: "2px 16px",
              borderRadius: 99,
              marginRight: 6,
              boxShadow: "0 2px 8px #e74c3c22",
              border: "2.5px solid #fff",
              textShadow: "0 1px 3px #0004"
            }}>
              {task.priority}
            </span>
          </div>
          <div style={{
            color: "#3776db",
            fontWeight: 600,
            fontSize: 15,
            marginTop: 2,
            textShadow: "0 1px 6px #b0e7ff56"
          }}>
            <span style={{marginRight: 11}}>
              <span style={{fontWeight: 700, fontSize: 15}}>⏰</span> {task.time ? task.time : "—"}
            </span>
            | {task.status}
          </div>
          {task.notes &&
            <div style={{
              background: "linear-gradient(90deg,#f8fdff 60%,#e9e6ff 100%)",
              borderRadius: 10,
              padding: "9px 12px 7px 12px",
              fontSize: 14,
              color: "#41487a",
              fontStyle: "italic",
              border: "1.5px solid #eaf2ff",
              marginTop: 6,
              fontWeight: 600,
              boxShadow: "0 1.5px 5px #ded0fe2b"
            }}>
              <span style={{color: "#1976d2", fontWeight: 900}}>Notes: </span>
              {task.notes}
            </div>
          }
          {/* --- Actions --- */}
          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            {onToggle && (
              <button
                onClick={() => onToggle(task._id)}
                style={{
                  background: task.status === "Complete"
                    ? "linear-gradient(90deg,#e74c3c,#ff8585)"
                    : "linear-gradient(90deg,#43e97b,#1976d2)",
                  color: "#fff",
                  fontWeight: 700,
                  border: "none",
                  borderRadius: 99,
                  padding: "7px 19px",
                  fontSize: 15,
                  cursor: "pointer",
                  boxShadow: "0 1px 7px #a9e0fa25"
                }}
              >
                Mark as {task.status === "Complete" ? "Incomplete" : "Complete"}
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(task)}
                style={{
                  background: "linear-gradient(90deg,#eaf2ff,#f8fdff)",
                  color: "#1976d2",
                  fontWeight: 800,
                  border: "2px solid #b7d7f6",
                  borderRadius: 99,
                  padding: "7px 18px",
                  fontSize: 15,
                  cursor: "pointer",
                  boxShadow: "0 1px 7px #a9e0fa25"
                }}
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(task._id)}
                style={{
                  background: "#fff",
                  color: "#e74c3c",
                  fontWeight: 700,
                  border: "2px solid #ffd6db",
                  borderRadius: 99,
                  padding: "7px 18px",
                  fontSize: 15,
                  cursor: "pointer",
                  boxShadow: "0 1px 7px #ff3a3a11"
                }}
              >
                Delete
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

// --- Main UpcomingTasks page ---
export default function UpcomingTasks() {
  const [tasks, setTasks] = useState([]);
  const [editing, setEditing] = useState(null);

  async function loadTasks() {
    const res = await getUpcomingTasks();
    setTasks(res);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleEditSave(updatedTask) {
    await updateTask(editing._id, updatedTask);
    setEditing(null);
    await loadTasks();
  }

  async function handleDelete(id) {
    if (window.confirm("Delete this task?")) {
      await deleteTask(id);
      await loadTasks();
    }
  }

  async function handleToggle(id) {
    await toggleTaskStatus(id);
    await loadTasks();
  }

  return (
    <div style={{
      padding: 34,
      minHeight: "90vh",
      background: "linear-gradient(110deg,#fafdff 80%,#f6eaff 100%)"
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        marginBottom: 26,
        gap: 15
      }}>
        <svg width="46" height="46" viewBox="0 0 46 46">
          <circle cx="23" cy="23" r="22" fill="#43e97b" opacity="0.12" />
          <circle cx="23" cy="19" r="9" fill="#1976d2" opacity="0.14" />
          <rect x="15" y="27" width="16" height="7" rx="3.5" fill="#1976d2" opacity="0.21" />
        </svg>
        <h2 style={{
          margin: 0,
          fontSize: 28,
          fontWeight: 900,
          color: "#003ba7",
          letterSpacing: 0.7,
          textShadow: "0 1.5px 14px #b8e5ff55"
        }}>
          Upcoming Tasks
        </h2>
      </div>
      {editing && (
        <TaskForm
          initialData={editing}
          onSave={handleEditSave}
          onCancel={() => setEditing(null)}
        />
      )}
      <TaskList
        tasks={tasks}
        emptyText="No upcoming tasks. Plan something great!"
        onEdit={setEditing}
        onDelete={handleDelete}
        onToggle={handleToggle}
      />
    </div>
  );
}
