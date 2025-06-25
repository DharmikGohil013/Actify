import React, { useEffect, useState } from "react";
import { getUserProfile, getTodayTasks, getUpcomingTasks } from "../utils/api";

// Simple stats chart (text-based, not a real chart lib)
function TaskStats({ tasks }) {
  const types = ["Work", "Personal", "Learning", "Other"];
  const countByType = types.map(
    (type) => tasks.filter((t) => t.type === type).length
  );
  const total = tasks.length || 1;

  return (
    <div style={{ display: "flex", gap: 16, margin: "16px 0" }}>
      {types.map((type, idx) => (
        <div
          key={type}
          style={{
            background: "#f7f7fa",
            padding: 16,
            borderRadius: 8,
            flex: 1,
            textAlign: "center",
          }}
        >
          <div style={{ fontWeight: 700 }}>{type}</div>
          <div style={{ fontSize: 28, color: "#2d72d9" }}>
            {countByType[idx]}
          </div>
          <div style={{ fontSize: 12, color: "#888" }}>
            {Math.round((countByType[idx] / total) * 100)}%
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [todayTasks, setTodayTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setProfile(await getUserProfile());
      setTodayTasks(await getTodayTasks());
      setUpcomingTasks(await getUpcomingTasks());
    }
    fetchData();
  }, []);

  if (!profile) return <div>Loading profile...</div>;

  // Productivity calculations
  const completed = todayTasks.filter((t) => t.status === "Complete").length;
  const total = todayTasks.length || 1;
  const completionRate = Math.round((completed / total) * 100);

  return (
    <div style={{ padding: 24, maxWidth: 600 }}>
      <h2>Profile & Stats</h2>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          margin: "16px 0",
        }}
      >
        <img
          src={
            profile.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              profile.name || "User"
            )}&background=222e3a&color=fff`
          }
          alt="avatar"
          width={64}
          height={64}
          style={{
            borderRadius: "50%",
            border: "2px solid #1976d2",
            background: "#fff",
          }}
        />
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{profile.name}</div>
          <div style={{ color: "#555" }}>{profile.email}</div>
        </div>
      </div>

      <div style={{ margin: "18px 0" }}>
        <b>Productivity Today:</b> {completed} / {todayTasks.length} completed (
        {completionRate}%)
      </div>

      <div style={{ margin: "18px 0" }}>
        <b>Most Common Task Types (today):</b>
        <TaskStats tasks={todayTasks} />
      </div>

      <div>
        <b>Upcoming Tasks:</b>
        <ul>
          {upcomingTasks.slice(0, 3).map((task) => (
            <li key={task._id}>
              {task.name} – {new Date(task.date).toLocaleDateString()} (
              {task.status})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
