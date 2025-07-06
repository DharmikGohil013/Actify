import React, { useState } from "react";

const defaultTask = {
  name: "",
  type: "Work",
  time: "",
  duration: "",
  notes: "",
  priority: "Medium",
};

export default function TaskForm({ onSave, onCancel, initialData }) {
  const [form, setForm] = useState(initialData || defaultTask);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.time) {
      alert("Task Name and Time are required.");
      return;
    }
    onSave(form);
    setForm(defaultTask);
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginBottom: 24,
        background: "#f9f9f9",
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}
    >
      {/* Top row fields */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <input
          name="name"
          placeholder="Task Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{
            flex: 2,
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
            minWidth: 180,
          }}
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          style={{
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
            minWidth: 140,
          }}
        >
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
          style={{
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
            minWidth: 120,
          }}
        />
        <input
          name="duration"
          type="number"
          placeholder="Duration (min)"
          value={form.duration}
          onChange={handleChange}
          min={1}
          style={{
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
            width: 140,
          }}
        />
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          style={{
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
            minWidth: 120,
          }}
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>

      {/* Notes */}
      <div style={{ marginTop: 12 }}>
        <textarea
          name="notes"
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={handleChange}
          rows={3}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
            fontFamily: "inherit",
          }}
        />
      </div>

      {/* Actions */}
      <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
        <button
          type="submit"
          style={{
            background: "#1976d2",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: 8,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {initialData ? "Update Task" : "Add Task"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: "#eee",
              color: "#333",
              border: "1px solid #ccc",
              padding: "10px 20px",
              borderRadius: 8,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
