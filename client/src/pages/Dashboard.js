import React, { useEffect, useState } from "react";
import LoaderOverlay from "../components/Loader";

import {
  getTodayTasks,
  getUpcomingTasks,
  getMissedTasks,
  getNotifications,
  getUserProfile,
} from "../utils/api";

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
  return (
    <div
      style={{
        width: 60,
        height: 60,
        background: "linear-gradient(135deg, #1A2A5C 30%, #2A8C82 100%)",
        borderRadius: "50%",
        color: "#F8F9FB",
        fontWeight: 800,
        fontSize: 28,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 20,
        boxShadow: "0 6px 24px rgba(26, 42, 92, 0.2), 0 2px 10px rgba(42, 140, 130, 0.2)",
        letterSpacing: 2,
        border: "2px solid rgba(255, 255, 255, 0.9)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {letters}
    </div>
  );
}

// --- StatCard: rich gradients, glassy look ---
function StatCard({ label, value, icon, color }) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 180,
        background: `linear-gradient(135deg, ${color} 40%, rgba(248, 249, 251, 0.9) 100%)`,
        borderRadius: 24,
        boxShadow: "0 10px 40px rgba(26, 42, 92, 0.15), 0 2px 12px rgba(42, 140, 130, 0.1)",
        padding: "40px 0 28px 0",
        textAlign: "center",
        margin: "0 12px",
        color: "#F8F9FB",
        fontWeight: 700,
        fontSize: 24,
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255, 255, 255, 0.8)",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 12px 48px rgba(26, 42, 92, 0.25), 0 3px 16px rgba(42, 140, 130, 0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 10px 40px rgba(26, 42, 92, 0.15), 0 2px 12px rgba(42, 140, 130, 0.1)";
      }}
    >
      <div style={{ fontSize: 44, fontWeight: 900, marginBottom: 8, textShadow: "0 3px 12px rgba(26, 42, 92, 0.2)" }}>
        {icon}
        <span style={{ marginLeft: 8 }}>{value}</span>
      </div>
      <div style={{ fontSize: 18, color: "rgba(248, 249, 251, 0.95)", fontWeight: 600 }}>{label}</div>
    </div>
  );
}

// --- TaskList: luxury colors, glassy ---
function TaskList({ tasks, emptyText }) {
  if (!tasks || tasks.length === 0)
    return <div style={{ color: "#A3B1C6", padding: 20, fontWeight: 600 }}>{emptyText}</div>;
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {tasks.map((task) => (
        <li
          key={task._id}
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            marginBottom: 20,
            padding: "24px 22px 14px 26px",
            borderRadius: 20,
            borderLeft: `8px solid ${
              task.priority === "High"
                ? "#C58080FF"
                : task.priority === "Medium"
                ? "#D4A017"
                : "#2A8C82"
            }`,
            boxShadow: "0 6px 20px rgba(26, 42, 92, 0.1), 0 2px 10px rgba(42, 140, 130, 0.05)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            backdropFilter: "blur(6px)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(26, 42, 92, 0.15), 0 3px 12px rgba(42, 140, 130, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(26, 42, 92, 0.1), 0 2px 10px rgba(42, 140, 130, 0.05)";
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 20, color: "#1A2A5C" }}>
            {task.name}
          </div>
          <div style={{ color: "#6383B7", marginTop: 3, fontWeight: 600, fontSize: 15 }}>
            {task.time ? task.time : "—"}  |  {task.type}
          </div>
          <div style={{ color: "#A3B1C6", fontSize: 14, marginTop: 4, fontWeight: 600 }}>
            {task.status} · {new Date(task.date).toLocaleDateString()}
          </div>
        </li>
      ))}
    </ul>
  );
}

// --- Responsive style ---
const responsiveCSS = `
@media (max-width: 900px) {
  .exp-dash-row { flex-direction: column !important; gap: 24px !important;}
}
@media (max-width: 600px) {
  .exp-dash-container { padding: 12px !important;}
  .exp-dash-section { padding: 12px 6px !important;}
  .exp-dash-greeting { font-size: 20px !important; }
}
`;

function getGreeting() {
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();
  const timeInMinutes = hour * 60 + minute;

  if (timeInMinutes >= 300 && timeInMinutes < 720) {
    // 5:00 AM to 11:59 AM
    return "Rise and shine! Today is a fresh start to chase your dreams!";
  } else if (timeInMinutes >= 721 && timeInMinutes < 780) {
    // 12:01 PM to 12:59 PM
    return "Keep pushing forward! Your afternoon is full of possibilities!";
  } else {
    // 12:00 PM to 4:59 AM (next day)
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
    if (!document.getElementById("exp-dash-responsive")) {
      const style = document.createElement("style");
      style.id = "exp-dash-responsive";
      style.innerHTML = responsiveCSS;
      document.head.appendChild(style);
    }
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

  // === Incomplete = today's tasks with status "Incomplete"
  const incomplete = todayTasks.filter((t) => t.status === "Incomplete");

  if (loading) return <LoaderOverlay />;
  

  return (
    <div
      className="exp-dash-container"
      style={{
        padding: 40,
        background: "linear-gradient(135deg, #F8F9FB 40%, #E8F0F5 100%)",
        minHeight: "100vh",
        boxShadow: "inset 0 0 20px rgba(26, 42, 92, 0.05)",
      }}
    >
      {/* Greeting Header */}
      <div
        className="exp-dash-greeting"
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 44,
        }}
      >
        <Avatar name={profile.name} />

        <div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#1A2A5C", letterSpacing: 0.5 }}>
            {getGreeting()}
            {profile && profile.name ? `, ${profile.name}` : "!"}
          </div>
          <div
            style={{
              color: "#2A8C82",
              fontSize: 18,
              fontWeight: 700,
              marginTop: 6,
              textShadow: "0 2px 10px rgba(42, 140, 130, 0.2)",
              letterSpacing: 0.5,
            }}
          >
            Achieve something extraordinary today.
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div
        className="exp-dash-row"
        style={{ display: "flex", gap: 30, marginBottom: 44 }}
      >
        <StatCard
          label="Today's Tasks"
          value={todayTasks.length}
          color="#1A2A5C"
          icon={<span role="img" aria-label="tasks">📝 </span>}
        />
        <StatCard
          label="Upcoming"
          value={upcoming.length}
          color="#2A8C82"
          icon={<span role="img" aria-label="upcoming">⏰ </span>}
        />
        <StatCard
          label="Incomplete"
          value={incomplete.length}
          color="#D4A017"
          icon={<span role="img" aria-label="incomplete">🔄 </span>}
        />
        <StatCard
          label="Missed"
          value={missed.length}
          color="#B91C1C"
          icon={<span role="img" aria-label="missed">⚠️ </span>}
        />
      </div>

      <div
        className="exp-dash-row"
        style={{ display: "flex", gap: 40, flexWrap: "wrap" }}
      >
        {/* Today's Tasks */}
        <section
          className="exp-dash-section"
          style={{
            flex: 1.2,
            minWidth: 360,
            background: "linear-gradient(135deg, rgba(248, 249, 251, 0.95) 50%, rgba(232, 240, 245, 0.9) 100%)",
            borderRadius: 24,
            padding: 30,
            marginBottom: 30,
            boxShadow: "0 8px 32px rgba(26, 42, 92, 0.1), 0 2px 12px rgba(42, 140, 130, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div style={{ fontSize: 22, color: "#1A2A5C", fontWeight: 800, marginBottom: 14 }}>
            <span role="img" aria-label="today">🌞</span> Today's Tasks
          </div>
          <TaskList tasks={todayTasks} emptyText="No tasks for today." />
        </section>
        {/* Next Task */}
        <section
          className="exp-dash-section"
          style={{
            flex: 1,
            minWidth: 280,
            background: "linear-gradient(135deg, rgba(248, 249, 251, 0.95) 50%, rgba(232, 240, 245, 0.9) 100%)",
            borderRadius: 24,
            padding: 30,
            marginBottom: 30,
            boxShadow: "0 8px 32px rgba(26, 42, 92, 0.1), 0 2px 12px rgba(42, 140, 130, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div style={{ fontSize: 20, color: "#1A2A5C", fontWeight: 800, marginBottom: 14 }}>
            <span role="img" aria-label="next">🚀</span> Next Task
          </div>
          <TaskList tasks={upcoming.slice(0, 1)} emptyText="No upcoming task." />
        </section>
        {/* Incomplete */}
        <section
          className="exp-dash-section"
          style={{
            flex: 1,
            minWidth: 280,
            background: "linear-gradient(135deg, rgba(255, 248, 236, 0.95) 50%, rgba(255, 245, 224, 0.9) 100%)",
            borderRadius: 24,
            padding: 30,
            marginBottom: 30,
            boxShadow: "0 8px 32px rgba(212, 160, 23, 0.15), 0 2px 12px rgba(212, 160, 23, 0.05)",
            border: "1px solid rgba(255, 245, 224, 0.8)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div style={{ fontSize: 20, color: "#D4A017", fontWeight: 800, marginBottom: 14 }}>
            <span role="img" aria-label="incomplete">🔄</span> Incomplete Tasks (Today)
          </div>
          <TaskList tasks={incomplete} emptyText="All done for today!" />
        </section>
        {/* Missed */}
        <section
          className="exp-dash-section"
          style={{
            flex: 1,
            minWidth: 280,
            background: "linear-gradient(135deg, rgba(255, 241, 244, 0.95) 50%, rgba(255, 228, 233, 0.9) 100%)",
            borderRadius: 24,
            padding: 30,
            marginBottom: 30,
            boxShadow: "0 8px 32px rgba(185, 28, 28, 0.15), 0 2px 12px rgba(185, 28, 28, 0.05)",
            border: "1px solid rgba(255, 228, 233, 0.8)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div style={{ fontSize: 20, color: "#B91C1C", fontWeight: 800, marginBottom: 14 }}>
            <span role="img" aria-label="missed">⏳</span> Missed Tasks (Past)
          </div>
          <TaskList tasks={missed} emptyText="No missed tasks!" />
        </section>
      </div>

      {/* Notifications */}
      <section
        className="exp-dash-section"
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: 24,
          padding: 26,
          margin: "40px 0 0 0",
          boxShadow: "0 6px 24px rgba(26, 42, 92, 0.1), 0 2px 10px rgba(42, 140, 130, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 800, color: "#1A2A5C", marginBottom: 14 }}>
          <span role="img" aria-label="notif">🔔</span> Notifications
        </div>
        {notifications.length === 0 ? (
          <p style={{ color: "#A3B1C6", margin: 0, fontWeight: 600 }}>No new notifications.</p>
        ) : (
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {notifications.map((notif) => (
              <li
                key={notif._id}
                style={{
                  marginBottom: 15,
                  background: "linear-gradient(135deg, rgba(248, 249, 251, 0.95) 50%, rgba(232, 240, 245, 0.9) 100%)",
                  borderRadius: 12,
                  padding: "15px 18px",
                  color: "#1A2A5C",
                  fontWeight: 700,
                  boxShadow: "0 2px 8px rgba(26, 42, 92, 0.1)",
                  fontSize: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(26, 42, 92, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(26, 42, 92, 0.1)";
                }}
              >
                <span>
                  <b>{notif.type}</b>: {notif.message}
                </span>
                <span style={{ color: "#A3B1C6", fontSize: 13, fontWeight: 600 }}>
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