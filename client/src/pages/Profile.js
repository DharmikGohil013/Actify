import React, { useEffect, useState } from "react";
import {
  getUserProfile,
  getTodayTasks,
  getUpcomingTasks,
  searchUsers
} from "../utils/api";

// --- Avatar Helper ---
function getInitials(name = "") {
  return name.slice(0, 2).toUpperCase();
}

// --- Progress Circle ---
function ProgressCircle({ percent, size = 94, stroke = 11, color = "#43e97b" }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;
  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5ecfb" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={circ - dash}
        style={{ transition: "stroke-dashoffset 1s" }}
      />
      <text x="50%" y="56%" textAnchor="middle" dominantBaseline="middle" fontSize={25} fontWeight={900} fill="#1976d2">
        {percent}%
      </text>
    </svg>
  );
}

// --- Task Stats ---
const typeIcons = { Work: "💼", Personal: "🏠", Learning: "📚", Other: "⭐" };
function TaskStats({ tasks }) {
  const types = ["Work", "Personal", "Learning", "Other"];
  const total = tasks.length || 1;
  return (
    <div style={{ display: "flex", gap: 20, margin: "18px 0" }}>
      {types.map((type) => {
        const count = tasks.filter((t) => t.type === type).length;
        return (
          <div key={type}
            style={{
              background: "#fafdff",
              padding: "16px 12px",
              borderRadius: 13,
              flex: 1,
              textAlign: "center",
              fontWeight: 700,
              boxShadow: "0 2px 10px #1976d216"
            }}>
            <div style={{ fontSize: 23 }}>{typeIcons[type]}</div>
            <div style={{ fontSize: 22, color: "#43e97b" }}>{count}</div>
            <div style={{ fontSize: 12, color: "#888" }}>{Math.round((count / total) * 100)}%</div>
          </div>
        );
      })}
    </div>
  );
}

// --- Motivational Quotes ---
const quotes = [
  "Success is the sum of small efforts, repeated.",
  "Each day is a new opportunity to improve.",
  "Stay focused, stay positive, keep moving.",
  "Small progress is still progress!",
  "You got this. Today is your day."
];

// --- Main Profile Component ---
export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [todayTasks, setTodayTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [quote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  useEffect(() => {
    async function fetchData() {
      const user = await getUserProfile();
      setProfile(user);
      setTodayTasks(await getTodayTasks());
      setUpcomingTasks(await getUpcomingTasks());

      const res = await searchUsers("");
      const allUsers = Array.isArray(res) ? res : res.users || [];

      // ✅ Show only users *I* follow
      const friends = allUsers.filter(
        u => Array.isArray(user.friends) && user.friends.includes(u._id)
      );
      setFollowers(friends);
    }
    fetchData();
  }, []);

  if (!profile) return <div style={{ padding: 40, textAlign: "center", fontWeight: 800 }}>Loading profile...</div>;

  const completed = todayTasks.filter((t) => t.status === "Complete").length;
  const total = todayTasks.length || 1;
  const productiveToday = completed === todayTasks.length && total > 0;
  const completionRate = Math.round((completed / total) * 100);

  return (
    <div style={{
      minHeight: "95vh",
      padding: "40px 20px",
      background: "linear-gradient(105deg,#fafdff 80%,#d7f4fe 120%)",
      display: "flex",
      flexWrap: "wrap",
      gap: 40,
      justifyContent: "center",
      alignItems: "flex-start"
    }}>

      {/* --- Profile Card --- */}
      <div style={{
        maxWidth: 420,
        width: "100%",
        background: "#fff",
        borderRadius: 28,
        boxShadow: "0 6px 36px #b8e5ff44",
        padding: "36px 32px 28px 32px",
        textAlign: "center"
      }}>
        <div style={{
          width: 90, height: 90, borderRadius: "50%",
          background: "#1976d2", color: "#fff",
          fontWeight: 900, fontSize: 34,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 18px"
        }}>
          {getInitials(profile.name)}
        </div>

        <div style={{ fontSize: 28, fontWeight: 900, color: "#1976d2" }}>{profile.name}</div>
        <div style={{ color: "#555", fontWeight: 600, fontSize: 15, marginBottom: 20 }}>{profile.email}</div>

        <div style={{
          background: productiveToday
            ? "linear-gradient(90deg,#43e97b,#1976d2)"
            : "linear-gradient(90deg,#f1c40f,#f0f4fa)",
          color: productiveToday ? "#fff" : "#888",
          padding: "7px 24px",
          borderRadius: 999,
          fontWeight: 900,
          fontSize: 16,
          marginBottom: 16,
        }}>
          {productiveToday ? "🔥 All Tasks Done Today!" : "⚡ Productivity: Keep Going!"}
        </div>

        <ProgressCircle percent={completionRate} />
        <div style={{ fontWeight: 800, color: "#1976d2", marginTop: 12 }}>
          {completed} of {total} Tasks Done
        </div>
      </div>

      {/* --- Right Section --- */}
      <div style={{ flex: 1, maxWidth: 640, width: "100%" }}>
        {/* --- Quote --- */}
        <div style={{
          background: "linear-gradient(93deg,#dbeafe,#e6fffa 80%)",
          borderRadius: 17,
          boxShadow: "0 4px 17px #1976d213",
          padding: "24px",
          fontSize: 18,
          color: "#1976d2",
          fontWeight: 800,
          textAlign: "center",
          marginBottom: 24
        }}>
          💡 {quote}
        </div>

        {/* --- Task Stats --- */}
        <div style={{
          background: "#fff",
          borderRadius: 17,
          boxShadow: "0 4px 22px #1976d210",
          padding: "28px",
          marginBottom: 24
        }}>
          <div style={{ fontSize: 21, fontWeight: 800, color: "#1976d2", marginBottom: 10 }}>
            Task Types (Today)
          </div>
          <TaskStats tasks={todayTasks} />
        </div>

        {/* --- Upcoming Tasks --- */}
        <div style={{
          background: "linear-gradient(93deg,#fffde7 60%,#e3fceb 140%)",
          borderRadius: 17,
          boxShadow: "0 4px 16px #fffde744",
          padding: "26px",
          marginBottom: 24
        }}>
          <div style={{ fontWeight: 800, color: "#43e97b", fontSize: 18, marginBottom: 12 }}>
            ⏳ Upcoming Tasks
          </div>
          <ul style={{ listStyle: "none", padding: 0, color: "#2d72d9", fontWeight: 600, fontSize: 16 }}>
            {upcomingTasks.slice(0, 4).map((task) => (
              <li key={task._id} style={{ marginBottom: 8 }}>
                📝 {task.name} — {new Date(task.date).toLocaleDateString()}
                <span style={{ fontSize: 13, color: "#888", marginLeft: 12 }}>({task.status})</span>
              </li>
            ))}
            {upcomingTasks.length === 0 && <li style={{ color: "#bbb" }}>No upcoming tasks.</li>}
          </ul>
        </div>

        {/* --- Friends I Follow --- */}
        <div style={{
          background: "#fff",
          borderRadius: 17,
          boxShadow: "0 4px 22px #1976d210",
          padding: "24px"
        }}>
          <div style={{ fontWeight: 800, fontSize: 18, color: "#1976d2", marginBottom: 12 }}>
            👥 Friends I Follow
          </div>
          {followers.length > 0 ? (
            <ul style={{ listStyle: "none", padding: 0, color: "#1976d2", fontWeight: 700 }}>
              {followers.map((f) => (
                <li key={f._id} style={{ marginBottom: 10 }}>
                  {getInitials(f.name)} — {f.name}
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ color: "#888", fontWeight: 600 }}>You're not following anyone yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
