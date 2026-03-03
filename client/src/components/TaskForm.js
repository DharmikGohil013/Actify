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

  const priorityColor = form.priority === "High" ? "var(--accent-red)" : form.priority === "Medium" ? "var(--accent-orange)" : "var(--accent-green)";

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginBottom: 24,
        background: "var(--bg-secondary)",
        padding: "24px",
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--border-color)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Fields grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
        <div style={{ gridColumn: "span 2", minWidth: 0 }}>
          <input
            name="name"
            placeholder="Task Name"
            value={form.name}
            onChange={handleChange}
            required
            style={{ width: "100%", fontWeight: 600 }}
          />
        </div>
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
        />
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          style={{ color: priorityColor, fontWeight: 700 }}
        >
          <option style={{ color: "var(--accent-red)" }}>High</option>
          <option style={{ color: "var(--accent-orange)" }}>Medium</option>
          <option style={{ color: "var(--accent-green)" }}>Low</option>
        </select>
      </div>

      {/* Notes */}
      <div style={{ marginTop: 12 }}>
        <textarea
          name="notes"
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={handleChange}
          rows={2}
          style={{ width: "100%", minHeight: 60 }}
        />
      </div>

      {/* Actions */}
      <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
        <button type="submit" className="btn-primary btn-pill">
          {initialData ? "Update Task" : "Add Task"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-outline btn-pill"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
