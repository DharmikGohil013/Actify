import React, { useEffect, useState } from "react";
import {
  getUpcomingTasks,
  updateTask,
  deleteTask,
  toggleTaskStatus,
} from "../utils/api";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

export default function UpcomingTasks() {
  const [tasks, setTasks] = useState([]);
  const [editing, setEditing] = useState(null);

  async function loadTasks() {
    const res = await getUpcomingTasks();
    setTasks(res);
  }

  useEffect(() => { loadTasks(); }, []);

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
    <div className="page-container" style={{ animation: "pageEnter .4s ease-out" }}>
      <div className="page-header">
        <div>
          <h1 style={{ margin: 0, fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
             Upcoming Tasks
          </h1>
          <p style={{ margin: "4px 0 0", color: "var(--text-secondary)" }}>
            Stay ahead — plan something great!
          </p>
        </div>
        {tasks.length > 0 && (
          <div className="badge badge-primary" style={{ fontSize: 14, padding: "6px 16px" }}>
            {tasks.length} upcoming
          </div>
        )}
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
