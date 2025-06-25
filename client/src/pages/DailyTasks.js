import React, { useEffect, useState } from "react";
import {
  getTodayTasks,
  addTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
} from "../utils/api";

// Form for adding/editing a task
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
        marginBottom: 24,
        background: "#f6f8fa",
        padding: 16,
        borderRadius: 8,
      }}
    >
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
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
        <button type="submit">
          {initialData ? "Update Task" : "Add Task"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

// List of tasks with actions
function TaskList({ tasks, emptyText, onEdit, onDelete, onToggle }) {
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
          {(onEdit || onDelete || onToggle) && (
            <div style={{ marginTop: 8 }}>
              {onToggle && (
                <button onClick={() => onToggle(task._id)}>
                  Mark as{" "}
                  {task.status === "Complete" ? "Incomplete" : "Complete"}
                </button>
              )}
              {onEdit && <button onClick={() => onEdit(task)}>Edit</button>}
              {onDelete && (
                <button
                  onClick={() => onDelete(task._id)}
                  style={{ color: "red" }}
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
    <div style={{ padding: 24 }}>
      <h2>Today's Tasks ({new Date().toLocaleDateString()})</h2>
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <label>
          Type:
          <select
            value={filter.type}
            onChange={(e) => setFilter((f) => ({ ...f, type: e.target.value }))}
          >
            <option>All</option>
            <option>Work</option>
            <option>Personal</option>
            <option>Learning</option>
            <option>Other</option>
          </select>
        </label>
        <label>
          Status:
          <select
            value={filter.status}
            onChange={(e) =>
              setFilter((f) => ({ ...f, status: e.target.value }))
            }
          >
            <option>All</option>
            <option>Complete</option>
            <option>Incomplete</option>
          </select>
        </label>
      </div>
      {editing ? (
        <TaskForm
          initialData={editing}
          onSave={handleEditSave}
          onCancel={() => setEditing(null)}
        />
      ) : (
        <TaskForm onSave={handleAdd} />
      )}
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
