// src/components/TaskForm.js
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
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.time) return alert("Task Name and Time required");
    onSave(form);
    setForm(defaultTask);
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 24, background: "#f6f8fa", padding: 16, borderRadius: 8 }}>
      <div style={{ display: "flex", gap: 16 }}>
        <input name="name" placeholder="Task Name" value={form.name} onChange={handleChange} required style={{ flex: 2 }} />
        <select name="type" value={form.type} onChange={handleChange}>
          <option>Work</option>
          <option>Personal</option>
          <option>Learning</option>
          <option>Other</option>
        </select>
        <input name="time" type="time" value={form.time} onChange={handleChange} required />
        <input name="duration" type="number" placeholder="Duration (min)" value={form.duration} onChange={handleChange} min={1} style={{ width: 100 }} />
        <select name="priority" value={form.priority} onChange={handleChange}>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>
      <div style={{ marginTop: 8 }}>
        <textarea name="notes" placeholder="Notes (optional)" value={form.notes} onChange={handleChange} style={{ width: "100%" }} rows={2} />
      </div>
      <div style={{ marginTop: 8, display: "flex", gap: 12 }}>
        <button type="submit">{initialData ? "Update Task" : "Assssssssssssssdd Task"}</button>
        {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
