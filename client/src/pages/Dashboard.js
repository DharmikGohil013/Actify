import React, { useEffect, useState } from "react";
import {
  getTodayTasks,
  getUpcomingTasks,
  getMissedTasks,
  getNotifications,
  getUserProfile,
} from "../utils/api";

// StatCard component for quick stats
function StatCard({ label, value }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 1px 4px #0001",
        padding: 24,
        minWidth: 160,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 32, fontWeight: 700 }}>{value}</div>
      <div style={{ color: "#666", marginTop: 8 }}>{label}</div>
    </div>
  );
}

// TaskList component for displaying tasks
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

// Greeting logic
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [todayTasks, setTodayTasks] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [missed, setMissed] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [tasks, upc, missed, notifs, prof] = await Promise.all([
        getTodayTasks(),
        getUpcomingTasks(),
        getMissedTasks(),
        getNotifications(),
        getUserProfile(),
      ]);
      setTodayTasks(tasks);
      setUpcoming(upc);
      setMissed(missed);
      setNotifications(notifs.slice(0, 3));
      setProfile(prof);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div>Loading Dashboard...</div>;

  return (
    <div className="dashboard-container" style={{ padding: 24 }}>
      <h1>
        {getGreeting()}
        {profile && profile.name ? `, ${profile.name}` : "!"}
      </h1>
      <div style={{ display: "flex", gap: 24, margin: "24px 0" }}>
        <StatCard label="Today's Tasks" value={todayTasks.length} />
        <StatCard label="Upcoming Tasks" value={upcoming.length} />
        <StatCard label="Missed Tasks" value={missed.length} />
      </div>
      <section style={{ marginBottom: 32 }}>
        <h2>Today's Tasks</h2>
        <TaskList tasks={todayTasks} emptyText="No tasks for today." />
      </section>
      <section style={{ marginBottom: 32 }}>
        <h2>Next Task</h2>
        <TaskList tasks={upcoming.slice(0, 1)} emptyText="No upcoming task." />
      </section>
      <section style={{ marginBottom: 32 }}>
        <h2>Missed/Incomplete Tasks</h2>
        <TaskList tasks={missed} emptyText="No missed tasks!" />
      </section>
      <section>
        <h2>Notifications</h2>
        {notifications.length === 0 ? (
          <p>No new notifications.</p>
        ) : (
          <ul>
            {notifications.map((notif) => (
              <li key={notif._id} style={{ marginBottom: 8 }}>
                <span>
                  <b>{notif.type}</b>: {notif.message}
                </span>
                <span
                  style={{
                    float: "right",
                    color: "#888",
                    fontSize: 12,
                  }}
                >
                  {new Date(notif.date).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
