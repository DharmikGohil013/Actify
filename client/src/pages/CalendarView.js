// src/pages/CalendarView.js
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { getTasksForDate, addTask } from "../utils/api";
import toast from "react-hot-toast"; // Optional for feedback (install with npm i react-hot-toast)

// ---- Task Card ----
function TaskList({ tasks }) {
  if (!tasks || tasks.length === 0) {
    return <div style={{ color: "#bbb", fontWeight: 600, padding: 22 }}>No tasks yet.</div>;
  }
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {tasks.map((task) => (
        <li
          key={task._id}
          style={{
            background: task.status === "Complete" ? "#e1fce8" : "#f8f9ff",
            marginBottom: 14,
            padding: "16px 18px",
            borderRadius: 14,
            boxShadow: "0 3px 14px #1976d219",
            borderLeft: `6px solid ${
              task.priority === "High" ? "#e74c3c"
              : task.priority === "Medium" ? "#f39c12"
              : "#2ecc71"
            }`,
            opacity: task.status === "Complete" ? 0.6 : 1,
            transition: "all .2s"
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 17 }}>{task.name}</div>
          <div style={{ fontSize: 14, color: "#666" }}>
            ⏰ {task.time || "—"} | {task.type} | <strong>{task.priority}</strong>
          </div>
          {task.notes && <div style={{ marginTop: 6, fontStyle: "italic", color: "#444" }}>{task.notes}</div>}
          <div style={{ fontSize: 13, color: "#999", marginTop: 4 }}>{task.status}</div>
        </li>
      ))}
    </ul>
  );
}

// ---- Task Form ----
function TaskForm({ onSave, onCancel }) {
  const [form, setForm] = useState({
    name: "", type: "Work", time: "", duration: "", notes: "", priority: "Medium"
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.time.trim()) {
      toast.error("Task name and time are required!");
      return;
    }
    onSave(form);
    setForm({ name: "", type: "Work", time: "", duration: "", notes: "", priority: "Medium" });
  }

  return (
    <form onSubmit={handleSubmit} style={{
      background: "#f2f8ff",
      padding: 18,
      borderRadius: 16,
      marginBottom: 22,
      boxShadow: "0 4px 12px #1976d210",
      display: "flex",
      flexWrap: "wrap",
      gap: 12
    }}>
      <input name="name" placeholder="Task Name" value={form.name} onChange={handleChange} required style={inputStyle} />
      <select name="type" value={form.type} onChange={handleChange} style={selectStyle}>
        <option>Work</option><option>Personal</option><option>Learning</option><option>Other</option>
      </select>
      <input name="time" type="time" value={form.time} onChange={handleChange} required style={inputStyle} />
      <input name="duration" type="number" placeholder="Duration (min)" min={1} value={form.duration} onChange={handleChange} style={inputStyle} />
      <select name="priority" value={form.priority} onChange={handleChange} style={selectStyle}>
        <option>High</option><option>Medium</option><option>Low</option>
      </select>
      <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes (optional)" style={{ ...inputStyle, width: "100%", minHeight: 50 }} />
      <div style={{ display: "flex", gap: 10 }}>
        <button type="submit" style={primaryBtn}>Save Task</button>
        {onCancel && <button type="button" onClick={onCancel} style={secondaryBtn}>Cancel</button>}
      </div>
    </form>
  );
}

// ---- Main CalendarView Page ----
export default function CalendarView() {
  const [date, setDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);

  async function loadTasks(selected) {
    const d = selected.toISOString().split("T")[0];
    const data = await getTasksForDate(d);
    setTasks(data || []);
  }

  useEffect(() => { loadTasks(date); }, [date]);

  async function handleAdd(task) {
    await addTask({ ...task, date: date.toISOString().split("T")[0] });
    await loadTasks(date);
    setShowForm(false);
    toast.success("Task added!");
  }

  return (
    <div style={{ padding: "30px 24px", maxWidth: 1100, margin: "0 auto" }}>
      <h2 style={{ fontSize: 28, fontWeight: 900, color: "#1976d2", marginBottom: 14 }}>
        📅 Calendar View — {date.toLocaleDateString()}
      </h2>

      <div style={{
        display: "flex", gap: 30, flexWrap: "wrap", alignItems: "flex-start"
      }}>
        <div style={{
          background: "#fff", padding: 12, borderRadius: 20,
          boxShadow: "0 8px 40px #1976d211", border: "2px solid #cde6ff"
        }}>
          <Calendar value={date} onChange={setDate} />
        </div>

        <div style={{
          flex: 1, minWidth: 380, background: "#f9fbff", borderRadius: 20,
          boxShadow: "0 4px 18px #1976d218", padding: "24px 22px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: "#003ba7" }}>Your Tasks</h3>
            <button onClick={() => setShowForm((prev) => !prev)} style={primaryBtn}>
              {showForm ? "Close" : "+ Add"}
            </button>
          </div>
          {showForm && <TaskForm onSave={handleAdd} onCancel={() => setShowForm(false)} />}
          <TaskList tasks={tasks} />
        </div>
      </div>
    </div>
  );
}

// --- Styles
const inputStyle = {
  padding: "10px 14px", borderRadius: 12, border: "1px solid #ccc",
  fontSize: 15, flex: 1, minWidth: 120
};

const selectStyle = {
  ...inputStyle,
  background: "#f5faff", color: "#1976d2", fontWeight: 700
};

const primaryBtn = {
  background: "linear-gradient(90deg,#1976d2,#43e97b)",
  color: "#fff", padding: "10px 18px", borderRadius: 99,
  fontWeight: 800, fontSize: 15, border: "none", cursor: "pointer"
};

const secondaryBtn = {
  ...primaryBtn,
  background: "#fff", color: "#1976d2", border: "2px solid #1976d2"
};
