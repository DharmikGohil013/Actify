import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
// import "./";
import { getTasksForDate, addTask } from "../utils/api";

// ---- Modern, Colorful Task List ----
function TaskList({ tasks, emptyText }) {
  if (!tasks || tasks.length === 0)
    return <div style={{ color: "#cad6ef", fontWeight: 600, padding: 26, textAlign: "center" }}>{emptyText}</div>;
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {tasks.map((task) => (
        <li
          key={task._id}
          style={{
            background: "linear-gradient(100deg,#e6f0ff 65%,#fff0fa 100%)",
            marginBottom: 16,
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
        </li>
      ))}
    </ul>
  );
}

// ---- Luxury Task Form ----
function TaskForm({ onSave, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    type: "Work",
    time: "",
    duration: "",
    notes: "",
    priority: "Medium",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.time) return alert("Task Name and Time required");
    onSave(form);
    setForm({
      name: "",
      type: "Work",
      time: "",
      duration: "",
      notes: "",
      priority: "Medium",
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginBottom: 26,
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
      {/* Glowy Time Input */}
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
          Add Task
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

export default function CalendarView() {
  const [date, setDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);

  async function loadTasks(selected) {
    const data = await getTasksForDate(selected.toISOString().split("T")[0]);
    setTasks(data);
  }

  useEffect(() => {
    loadTasks(date);
  }, [date]);

  async function handleAddTask(task) {
    await addTask({ ...task, date: date.toISOString().split("T")[0] });
    await loadTasks(date);
    setShowForm(false);
  }

  // Responsive layout
  const containerStyle = {
    display: "flex",
    gap: 38,
    alignItems: "flex-start",
    flexWrap: "wrap"
  };

  // Luxury calendar box
  const calendarStyle = {
    background: "linear-gradient(130deg,#e4f6ff 68%,#f6eaff 100%)",
    borderRadius: 26,
    boxShadow: "0 8px 40px #5ac8fa33",
    padding: 15,
    minWidth: 330,
    maxWidth: 400,
    border: "2px solid #c7e8ff"
  };

  return (
    <div style={{
      padding: 32,
      maxWidth: 1180,
      margin: "0 auto",
      minHeight: "92vh",
      background: "linear-gradient(115deg, #fafdff 80%, #f6eaff 100%)"
    }}>
      {/* Header and quote */}
      <div style={{
        display: "flex",
        alignItems: "center",
        marginBottom: 26,
        gap: 16
      }}>
        <svg width="62" height="62" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="30" fill="#1976d2" opacity="0.12" />
          <circle cx="32" cy="26" r="14" fill="#1976d2" opacity="0.18" />
          <rect x="24" y="40" width="16" height="8" rx="4" fill="#43e97b" opacity="0.21" />
        </svg>
        <div>
          <h2 style={{
            margin: 0,
            fontSize: 30,
            fontWeight: 900,
            color: "#003ba7",
            letterSpacing: 0.7,
            textShadow: "0 1.5px 14px #b8e5ff55"
          }}>Calendar View</h2>
          <div style={{ color: "#7e8fa9", fontWeight: 800, fontSize: 17 }}>
            Your whole journey at a glance—plan with color and joy!
          </div>
        </div>
      </div>
      {/* Layout */}
      <div style={containerStyle}>
        <div style={calendarStyle}>
          <Calendar value={date} onChange={setDate} />
        </div>
        <div style={{
          flex: 1,
          minWidth: 355,
          maxWidth: 630,
          background: "linear-gradient(103deg,#fff,#e8f4ff 70%,#ffe6fa 120%)",
          borderRadius: 28,
          boxShadow: "0 2px 30px #b6e4ff33",
          padding: "28px 25px",
          border: "2px solid #e3e9fa"
        }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{
              margin: 0,
              fontWeight: 900,
              color: "#0047c0",
              fontSize: 23,
              letterSpacing: 0.5,
              textShadow: "0 1px 6px #b0e7ff36"
            }}>
              Tasks for {date.toLocaleDateString()}
            </h3>
            <button
              onClick={() => setShowForm((f) => !f)}
              style={{
                marginLeft: 20,
                background: showForm
                  ? "linear-gradient(90deg,#ffdce0 45%,#fff 100%)"
                  : "linear-gradient(93deg,#1976d2 55%,#43e97b 100%)",
                color: showForm ? "#e74c3c" : "#fff",
                fontWeight: 900,
                fontSize: 16,
                padding: "11px 29px",
                borderRadius: 50,
                border: "none",
                boxShadow: "0 2px 10px #b8e5ff14",
                cursor: "pointer",
                transition: "all .16s",
                letterSpacing: 0.2
              }}
            >
              {showForm ? "Close" : "+ Add Task"}
            </button>
          </div>
          {showForm && (
            <TaskForm
              onSave={handleAddTask}
              onCancel={() => setShowForm(false)}
            />
          )}
          <TaskList tasks={tasks} emptyText="No tasks for this date." />
        </div>
      </div>
    </div>
  );
}
