import React, { useEffect, useState } from "react";
import {
  getTodayTasks,
  addTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
} from "../utils/api";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

export default function DailyTasks() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState({ type: "All", status: "All" });
  const [editing, setEditing] = useState(null);

  async function loadTasks() {
    const res = await getTodayTasks();
    setTasks(res);
  }

  useEffect(() => { loadTasks(); }, []);

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

  const filtered = tasks.filter(
    (t) =>
      (filter.type === "All" || t.type === filter.type) &&
      (filter.status === "All" || t.status === filter.status)
  );

  const completedCount = tasks.filter(t => t.status === "Complete").length;
  const totalCount = tasks.length;

  return (
    <div className="page-container" style={{ animation: "pageEnter .4s ease-out" }}>
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 style={{ margin: 0, fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
             Daily Tasks
          </h1>
          <p style={{ margin: "4px 0 0", color: "var(--text-secondary)" }}>
            Plan. Focus. Win your day, one step at a time.
          </p>
        </div>
        {totalCount > 0 && (
          <div className="badge badge-primary" style={{ fontSize: 14, padding: "6px 16px" }}>
            {completedCount}/{totalCount} done
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex-row flex-wrap" style={{ gap: 12, marginBottom: 20 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, fontSize: 14, color: "var(--text-secondary)" }}>
          Type
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
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, fontSize: 14, color: "var(--text-secondary)" }}>
          Status
          <select
            value={filter.status}
            onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value }))}
          >
            <option>All</option>
            <option>Complete</option>
            <option>Incomplete</option>
          </select>
        </label>
      </div>

      {/* Task Form */}
      {editing ? (
        <TaskForm initialData={editing} onSave={handleEditSave} onCancel={() => setEditing(null)} />
      ) : (
        <TaskForm onSave={handleAdd} />
      )}

      {/* Task List */}
      <TaskList
        tasks={filtered}
        emptyText="No tasks for today. Add one above!"
        onEdit={setEditing}
        onDelete={handleDelete}
        onToggle={handleToggle}
      />
    </div>
  );
}
