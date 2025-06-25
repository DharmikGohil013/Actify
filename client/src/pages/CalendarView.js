import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { getTasksForDate, addTask } from "../utils/api";

// Task list for calendar view
function TaskList({ tasks, emptyText }) {
  if (!tasks || tasks.length === 0)
    return <div style={{ color: "#aaa" }}>{emptyText}</div>;
  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {tasks.map((task) => (
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
            }`,
          }}
        >
          <div style={{ fontWeight: 600 }}>{task.name}</div>
          <div style={{ color: "#777" }}>
            {task.time} &bull; {task.type}
          </div>
          <div style={{ color: "#888", fontSize: 12 }}>
            {task.status} | {new Date(task.date).toLocaleDateString()}
          </div>
        </li>
      ))}
    </ul>
  );
}

// Simple task form for calendar add
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
        marginBottom: 24,
        background: "#f6f8fa",
        padding: 16,
        borderRadius: 8,
      }}
    >
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <input
          name="name"
          placeholder="Task Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ flex: 2 }}
        />
        <select name="type" value={form.type} onChange={handleChange}>
          <option>Work</option>
          <option>Personal</option>
          <option>Learning</option>
          <option>Other</option>
        </select>
        <input
          name="time"
          type="time"
          value={form.time}
          onChange={handleChange}
          required
        />
        <input
          name="duration"
          type="number"
          placeholder="Duration (min)"
          value={form.duration}
          onChange={handleChange}
          min={1}
          style={{ width: 100 }}
        />
        <select name="priority" value={form.priority} onChange={handleChange}>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>
      <div style={{ marginTop: 8 }}>
        <textarea
          name="notes"
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={handleChange}
          style={{ width: "100%" }}
          rows={2}
        />
      </div>
      <div style={{ marginTop: 8, display: "flex", gap: 12 }}>
        <button type="submit">Add Task</button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
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

  return (
    <div style={{ padding: 24 }}>
      <h2>Calendar View</h2>
      <div style={{ display: "flex", gap: 32 }}>
        <Calendar value={date} onChange={setDate} />
        <div style={{ flex: 1 }}>
          <h3>
            Tasks for {date.toLocaleDateString()}
            <button
              onClick={() => setShowForm((f) => !f)}
              style={{ marginLeft: 16 }}
            >
              {showForm ? "Close" : "Add Task"}
            </button>
          </h3>
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
