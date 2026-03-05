import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { getTasksForDate, addTask } from "../utils/api";
import toast from "react-hot-toast";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import "../Calendar.css";

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
    <div className="page-container" style={{ animation: "pageEnter .4s ease-out" }}>
      <div className="page-header">
        <h1 style={{ margin: 0, fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
           Calendar View
        </h1>
        <span className="badge badge-primary" style={{ fontSize: 14, padding: "6px 16px" }}>
          {date.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
        </span>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: 24,
        alignItems: "start",
      }}>
        {/* Calendar */}
        <div className="card" style={{ padding: 16 }}>
          <Calendar value={date} onChange={setDate} />
        </div>

        {/* Tasks panel */}
        <div className="card" style={{ padding: 24, minWidth: 0 }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: 16, flexWrap: "wrap", gap: 8
          }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>
              Tasks for this day
            </h3>
            <button
              onClick={() => setShowForm(prev => !prev)}
              className={showForm ? "btn-outline btn-sm btn-pill" : "btn-primary btn-sm btn-pill"}
            >
              {showForm ? "Close" : "+ Add Task"}
            </button>
          </div>

          {showForm && <TaskForm onSave={handleAdd} onCancel={() => setShowForm(false)} />}

          <TaskList tasks={tasks} emptyText="No tasks for this day." />
        </div>
      </div>
    </div>
  );
}
