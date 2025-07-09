import React, { useEffect, useState } from "react";
import LoaderOverlay from "../components/Loader";
import {
  getTodayTasks,
  getUpcomingTasks,
  getMissedTasks,
  getNotifications,
  getUserProfile,
} from "../utils/api";
import "./Dashboard.css";

// --- Avatar using user's initials ---
function Avatar({ name }) {
  const letters = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return <div className="avatar">{letters}</div>;
}

// --- StatCard ---
function StatCard({ label, value, icon, color }) {
  return (
    <div className="stat-card" style={{ background: `linear-gradient(135deg, ${color} 40%, rgba(248, 249, 251, 0.9) 100%)` }}>
      <div style={{ fontSize: 44, fontWeight: 900, marginBottom: 8 }}>
        {icon}
        <span style={{ marginLeft: 8 }}>{value}</span>
      </div>
      <div style={{ fontSize: 18, fontWeight: 600 }}>{label}</div>
    </div>
  );
}

// --- Task List ---
function TaskList({ tasks, emptyText }) {
  if (!tasks || tasks.length === 0)
    return <div style={{ color: "#A3B1C6", padding: 20, fontWeight: 600 }}>{emptyText}</div>;

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {tasks.map((task) => (
        <li
          key={task._id}
          className="task-card"
          style={{ borderLeft: `8px solid ${
            task.priority === "High" ? "#C58080" :
            task.priority === "Medium" ? "#D4A017" :
            "#2A8C82"
          }` }}
        >
          <div className="task-title">{task.name}</div>
          <div className="task-sub">
            {task.time || "—"} &nbsp;|&nbsp; {task.type}
          </div>
          <div className="task-meta">
            {task.status} · {new Date(task.date).toLocaleDateString()}
          </div>
        </li>
      ))}
    </ul>
  );
}

// --- Greeting message ---
function getGreeting() {
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();
  const timeInMinutes = hour * 60 + minute;

  if (timeInMinutes >= 300 && timeInMinutes < 720) {
    return "Rise and shine! Today is a fresh start to chase your dreams!";
  } else if (timeInMinutes >= 721 && timeInMinutes < 780) {
    return "Keep pushing forward! Your afternoon is full of possibilities!";
  } else {
    return "Rest well! Tomorrow brings new opportunities to succeed!";
  }
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
      setNotifications((notifs || []).slice(0, 3));
      setProfile(prof);
      setLoading(false);
    }

    fetchData();
  }, []);

  const incomplete = todayTasks.filter((t) => t.status === "Incomplete");

  if (loading) return <LoaderOverlay />;

  return (
    <div className="exp-dash-container" style={{
      background: "linear-gradient(135deg, #F8F9FB 40%, #E8F0F5 100%)",
      minHeight: "100vh",
      boxShadow: "inset 0 0 20px rgba(26, 42, 92, 0.05)"
    }}>
      {/* Header */}
      <div className="exp-dash-greeting" style={{ display: "flex", alignItems: "center", marginBottom: 44 }}>
        <Avatar name={profile.name} />
        <div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#1A2A5C", letterSpacing: 0.5 }}>
            {getGreeting()}{profile?.name ? `, ${profile.name}` : "!"}
          </div>
          <div style={{
            color: "#2A8C82",
            fontSize: 18,
            fontWeight: 700,
            marginTop: 6,
            textShadow: "0 2px 10px rgba(42, 140, 130, 0.2)",
            letterSpacing: 0.5
          }}>
            Achieve something extraordinary today.
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="exp-dash-row" style={{ display: "flex", gap: 30, marginBottom: 44 }}>
        <StatCard label="Today's Tasks" value={todayTasks.length} color="#1A2A5C" icon={<span role="img" aria-label="tasks">📝</span>} />
        <StatCard label="Upcoming" value={upcoming.length} color="#2A8C82" icon={<span role="img" aria-label="upcoming">⏰</span>} />
        <StatCard label="Incomplete" value={incomplete.length} color="#D4A017" icon={<span role="img" aria-label="incomplete">🔄</span>} />
        <StatCard label="Missed" value={missed.length} color="#B91C1C" icon={<span role="img" aria-label="missed">⚠️</span>} />
      </div>

      {/* Task Sections */}
      <div className="exp-dash-row" style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
        {/* Today */}
        <section className="exp-dash-section">
          <div style={{ fontSize: 22, fontWeight: 800, color: "#1A2A5C", marginBottom: 14 }}>
            🌞 Today's Tasks
          </div>
          <TaskList tasks={todayTasks} emptyText="No tasks for today." />
        </section>

        {/* Next Task */}
        <section className="exp-dash-section">
          <div style={{ fontSize: 20, fontWeight: 800, color: "#1A2A5C", marginBottom: 14 }}>
            🚀 Next Task
          </div>
          <TaskList tasks={upcoming.slice(0, 1)} emptyText="No upcoming task." />
        </section>

        {/* Incomplete */}
        <section className="exp-dash-section" style={{
          background: "linear-gradient(135deg, rgba(255, 248, 236, 0.95) 50%, rgba(255, 245, 224, 0.9) 100%)",
          border: "1px solid rgba(255, 245, 224, 0.8)"
        }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#D4A017", marginBottom: 14 }}>
            🔄 Incomplete Tasks (Today)
          </div>
          <TaskList tasks={incomplete} emptyText="All done for today!" />
        </section>

        {/* Missed */}
        <section className="exp-dash-section" style={{
          background: "linear-gradient(135deg, rgba(255, 241, 244, 0.95) 50%, rgba(255, 228, 233, 0.9) 100%)",
          border: "1px solid rgba(255, 228, 233, 0.8)"
        }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#B91C1C", marginBottom: 14 }}>
            ⏳ Missed Tasks (Past)
          </div>
          <TaskList tasks={missed} emptyText="No missed tasks!" />
        </section>
      </div>

      {/* Notifications */}
      <section className="exp-dash-section" style={{
        background: "rgba(255, 255, 255, 0.95)",
        marginTop: 40
      }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#1A2A5C", marginBottom: 14 }}>
          🔔 Notifications
        </div>
        {notifications.length === 0 ? (
          <p style={{ color: "#A3B1C6", margin: 0, fontWeight: 600 }}>No new notifications.</p>
        ) : (
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {notifications.map((notif) => (
              <li key={notif._id} className="notification-card">
                <span><b>{notif.type}</b>: {notif.message}</span>
                <span className="notification-date">{new Date(notif.date).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
