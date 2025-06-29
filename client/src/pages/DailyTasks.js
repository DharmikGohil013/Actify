import React, { useEffect, useState } from "react";
import {
  getTodayTasks,
  addTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
} from "../utils/api";

// Animated SVG at top for motivation
function MotivationSVG() {
  return (
    <svg width="160" height="84" viewBox="0 0 170 80" fill="none" style={{ marginBottom: 6 }}>
      {/* Blue sunrise arc */}
      <ellipse cx="85" cy="74" rx="75" ry="18" fill="#1976d2" fillOpacity="0.14" />
      {/* Sun */}
      <circle cx="85" cy="48" r="15" fill="#fff500" fillOpacity="0.84" />
      {/* Rays */}
      <g stroke="#ffb300" strokeWidth="3" opacity="0.55">
        <line x1="85" y1="18" x2="85" y2="6"/>
        <line x1="55" y1="50" x2="38" y2="38"/>
        <line x1="115" y1="50" x2="132" y2="38"/>
      </g>
      {/* Text */}
      <text x="85" y="78" textAnchor="middle" fontFamily="Arial" fontSize="14" fontWeight="bold" fill="#1976d2" opacity="0.85">
        One task at a time!
      </text>
    </svg>
  );
}

// TaskForm: expensive & clean
function TaskForm({ onSave, onCancel, initialData }) {
  const defaultTask = {
    name: "",
    type: "Work",
    time: "",
    duration: "",
    notes: "",
    priority: "Medium",
  };
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
    if (!form.name || !form.time) return alert("Task Name and Time required");
    onSave(form);
    setForm(defaultTask);
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginBottom: 28,
        background: "linear-gradient(90deg,#fafdff 60%,#e9f7f7 100%)",
        padding: 24,
        borderRadius: 20,
        boxShadow: "0 2px 12px #1976d20a",
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <input
          name="name"
          placeholder="Task Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{
            flex: 2,
            padding: "10px 14px",
            borderRadius: 9,
            border: "1.5px solid #d6e6f7",
            fontSize: 15,
            fontWeight: 600,
            boxShadow: "0 1.5px 7px #c9e8ff09",
          }}
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          style={{
            padding: "8px",
            borderRadius: 9,
            border: "1.5px solid #d6e6f7",
            fontSize: 15,
            fontWeight: 600,
            minWidth: 100,
            background: "#fafdff",
          }}
        >
          <option>Work</option>
          <option>Personal</option>
          <option>Learning</option>
          <option>Other</option>
        </select>
        {/* TIME - Modern, with icon and floating label */}
<div style={{
  flex: "1 1 110px", 
  minWidth: 95, 
  position: "relative"
}}>
  <input
    name="time"
    type="time"
    value={form.time}
    onChange={handleChange}
    required
    style={{
      width: "100%",
      border: "none",
      borderRadius: 16,
      fontSize: 17,
      fontWeight: 700,
      background: "#eef6ff",
      padding: "19px 8px 8px 40px",
      boxShadow: "0 2px 10px #b8e5ff13",
      outline: "none",
      color: "#1976d2",
      transition: "box-shadow 0.18s"
    }}
    onFocus={e => (e.target.style.boxShadow = "0 4px 24px #1976d220")}
    onBlur={e => (e.target.style.boxShadow = "0 2px 10px #b8e5ff13")}
  />
  {/* Time Icon */}
  <span style={{
    position: "absolute",
    left: 14,
    top: 17,
    fontSize: 20,
    color: "#1976d2",
    pointerEvents: "none"
  }}>
    ⏰
  </span>
  {/* Floating label */}
  <label
    style={{
      position: "absolute",
      left: 38,
      top: 13,
      fontSize: 14,
      color: "#1976d2",
      fontWeight: 700,
      opacity: form.time ? 0.5 : 1,
      pointerEvents: "none",
      transform: form.time ? "translateY(-10px) scale(0.9)" : "none",
      transition: "all .2s cubic-bezier(.4,0,.2,1)"
    }}
  >
    Time
  </label>
</div>

        <input
          name="duration"
          type="number"
          placeholder="Duration (min)"
          value={form.duration}
          onChange={handleChange}
          min={1}
          style={{
            width: 110,
            padding: "10px 6px",
            borderRadius: 9,
            border: "1.5px solid #d6e6f7",
            fontSize: 15,
            fontWeight: 600,
            background: "#fafdff",
          }}
        />
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          style={{
            padding: "8px",
            borderRadius: 9,
            border: "1.5px solid #d6e6f7",
            fontSize: 15,
            fontWeight: 700,
            minWidth: 90,
            background: "#fafdff",
            color:
              form.priority === "High"
                ? "#e74c3c"
                : form.priority === "Medium"
                ? "#f39c12"
                : "#2ecc71",
          }}
        >
          <option style={{ color: "#e74c3c" }}>High</option>
          <option style={{ color: "#f39c12" }}>Medium</option>
          <option style={{ color: "#2ecc71" }}>Low</option>
        </select>
      </div>
      <div>
        <textarea
          name="notes"
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={handleChange}
          style={{
            width: "100%",
            borderRadius: 10,
            border: "1.5px solid #d6e6f7",
            fontSize: 14,
            padding: 10,
            fontWeight: 500,
            background: "#fafdff",
            minHeight: 40,
          }}
          rows={2}
        />
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        <button
          type="submit"
          style={{
            background: "linear-gradient(90deg,#1976d2 55%,#43e97b 100%)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 16,
            padding: "11px 32px",
            border: "none",
            borderRadius: 99,
            boxShadow: "0 2px 8px #1976d212",
            cursor: "pointer",
            transition: "background 0.18s",
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
              border: "1.5px solid #b6d9f7",
              padding: "11px 26px",
              borderRadius: 99,
              cursor: "pointer",
              boxShadow: "0 1px 3px #1976d210",
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

// List of tasks with actions, with icons and “expensive” look
function TaskList({ tasks, emptyText, onEdit, onDelete, onToggle }) {
  if (!tasks || tasks.length === 0)
    return (
      <div style={{ color: "#bbc3d1", padding: 18, fontWeight: 700 }}>
        {emptyText}
      </div>
    );
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {tasks.map((task) => (
        <li
          key={task._id}
          style={{
            background: "linear-gradient(100deg,#fff,#fafdff 80%)",
            marginBottom: 15,
            padding: "19px 18px 12px 20px",
            borderRadius: 16,
            borderLeft: `7px solid ${
              task.priority === "High"
                ? "#e74c3c"
                : task.priority === "Medium"
                ? "#f39c12"
                : "#2ecc71"
            }`,
            boxShadow: "0 3px 14px #1976d210, 0 1px 4px #c9e8ff13",
            display: "flex",
            flexDirection: "column",
            gap: 5,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {task.status === "Complete" ? (
              <span
                style={{
                  color: "#43e97b",
                  fontSize: 20,
                  fontWeight: 700,
                  marginRight: 6,
                }}
                title="Completed"
              >
                ✔️
              </span>
            ) : (
              <span
                style={{
                  color: "#ff9100",
                  fontSize: 20,
                  fontWeight: 700,
                  marginRight: 6,
                }}
                title="Incomplete"
              >
                ⏳
              </span>
            )}
            <span style={{ fontWeight: 800, fontSize: 17, color: "#1976d2" }}>
              {task.name}
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontWeight: 600,
                fontSize: 12,
                color: "#888",
              }}
            >
              {task.duration ? `${task.duration} min` : ""}
            </span>
          </div>
          <div style={{ color: "#6383b7", fontWeight: 600, fontSize: 14 }}>
            {task.time ? task.time : "—"} &nbsp;|&nbsp; {task.type} &nbsp;|&nbsp;{" "}
            <span
              style={{
                color:
                  task.priority === "High"
                    ? "#e74c3c"
                    : task.priority === "Medium"
                    ? "#f39c12"
                    : "#2ecc71",
                fontWeight: 800,
              }}
            >
              {task.priority}
            </span>
          </div>
          <div style={{ color: "#9bb1ce", fontSize: 13 }}>
            {task.status} &middot; {new Date(task.date).toLocaleDateString()}
          </div>
          {(onEdit || onDelete || onToggle) && (
            <div style={{ marginTop: 8, display: "flex", gap: 9 }}>
              {onToggle && (
                <button
                  onClick={() => onToggle(task._id)}
                  style={{
                    background:
                      task.status === "Complete"
                        ? "linear-gradient(90deg,#e74c3c20 70%,#fff 100%)"
                        : "linear-gradient(90deg,#43e97b20 70%,#fff 100%)",
                    color: "#1976d2",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: 50,
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  Mark as{" "}
                  {task.status === "Complete" ? "Incomplete" : "Complete"}
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(task)}
                  style={{
                    background: "linear-gradient(90deg,#3a8efd22 70%,#fff 100%)",
                    color: "#1976d2",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: 50,
                    fontWeight: 700,
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
                    background: "linear-gradient(90deg,#ffdce0 70%,#fff 100%)",
                    color: "#e74c3c",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: 50,
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          )}
          {task.notes && (
            <div
              style={{
                marginTop: 7,
                background: "#fafdff",
                borderRadius: 8,
                padding: "8px 10px",
                fontSize: 14,
                color: "#60687a",
                fontStyle: "italic",
                border: "1px solid #f0f3fa",
              }}
            >
              <span style={{ color: "#1976d2", fontWeight: 700 }}>Notes: </span>
              {task.notes}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function DailyTasks() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState({ type: "All", status: "All" });
  const [editing, setEditing] = useState(null);

  async function loadTasks() {
    const res = await getTodayTasks();
    setTasks(res);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleAdd(task) {
    await addTask({ ...task, date: new Date().toISOString().split("T")[0] });
    await loadTasks();
  }

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

  // Filtering
  const filtered = tasks.filter(
    (t) =>
      (filter.type === "All" || t.type === filter.type) &&
      (filter.status === "All" || t.status === filter.status)
  );

  return (
    <div
      style={{
        padding: "30px 0 30px 0",
        maxWidth: 900,
        margin: "0 auto",
        minHeight: "90vh",
      }}
    >
      {/* Motivational banner */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background:
            "linear-gradient(120deg,#e3f0ff 75%,#fff7ea 100%)",
          borderRadius: 22,
          padding: "24px 36px 20px 24px",
          boxShadow: "0 2px 12px #1976d214",
          marginBottom: 22,
        }}
      >
        <MotivationSVG />
        <div style={{ marginLeft: 24 }}>
          <h2
            style={{
              fontSize: 26,
              fontWeight: 900,
              margin: 0,
              color: "#1976d2",
              letterSpacing: 0.5,
            }}
          >
            Daily Tasks
          </h2>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#888",
              marginTop: 5,
            }}
          >
            Plan. Focus. Win your day, one step at a time.
          </div>
        </div>
      </div>
      {/* Filters */}
      <div style={{ display: "flex", gap: 18, marginBottom: 20, flexWrap: "wrap" }}>
        <label style={{ fontWeight: 700, color: "#1976d2", fontSize: 15 }}>
          Type:&nbsp;
          <select
            value={filter.type}
            onChange={(e) => setFilter((f) => ({ ...f, type: e.target.value }))}
            style={{
              borderRadius: 9,
              padding: "7px 12px",
              fontWeight: 700,
              border: "1.5px solid #d6e6f7",
              background: "#fafdff",
              fontSize: 15,
            }}
          >
            <option>All</option>
            <option>Work</option>
            <option>Personal</option>
            <option>Learning</option>
            <option>Other</option>
          </select>
        </label>
        <label style={{ fontWeight: 700, color: "#1976d2", fontSize: 15 }}>
          Status:&nbsp;
          <select
            value={filter.status}
            onChange={(e) =>
              setFilter((f) => ({ ...f, status: e.target.value }))
            }
            style={{
              borderRadius: 9,
              padding: "7px 12px",
              fontWeight: 700,
              border: "1.5px solid #d6e6f7",
              background: "#fafdff",
              fontSize: 15,
            }}
          >
            <option>All</option>
            <option>Complete</option>
            <option>Incomplete</option>
          </select>
        </label>
      </div>
      {/* Task Form */}
      {editing ? (
        <TaskForm
          initialData={editing}
          onSave={handleEditSave}
          onCancel={() => setEditing(null)}
        />
      ) : (
        <TaskForm onSave={handleAdd} />
      )}
      {/* Task List */}
      <TaskList
        tasks={filtered}
        emptyText="No tasks for today."
        onEdit={setEditing}
        onDelete={handleDelete}
        onToggle={handleToggle}
      />
    </div>
  );
}
