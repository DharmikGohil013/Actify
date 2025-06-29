import React, { useEffect, useState } from "react";
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
        width: 54,
        height: 54,
        background: "linear-gradient(135deg,#253e83,#49e4c3 80%)",
        borderRadius: "50%",
        color: "#fff",
        fontWeight: 900,
        fontSize: 26,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 18,
        boxShadow: "0 4px 20px #30cfd022, 0 2px 8px #15304c22",
        letterSpacing: 2,
        border: "3px solid #fff",
      }}
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
        minWidth: 170,
        background: `linear-gradient(120deg,${color} 80%,#fafdff 100%)`,
        borderRadius: 22,
        boxShadow: "0 8px 30px #253e8322, 0 1.5px 6px #b1b8c622",
        padding: "36px 0 24px 0",
        textAlign: "center",
        margin: "0 10px",
        color: "#fff",
        fontWeight: 700,
        fontSize: 22,
        backdropFilter: "blur(3px)",
        border: "1.5px solid #e8f0fc",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ fontSize: 40, fontWeight: 900, marginBottom: 7, textShadow: "0 2px 8px #1838721b" }}>
        {icon}
        <span style={{ marginLeft: 6 }}>{value}</span>
      </div>
      <div style={{ fontSize: 17, color: "#f3f8fb", fontWeight: 700 }}>{label}</div>
    </div>
  );
}

// --- TaskList: luxury colors, glassy ---
function TaskList({ tasks, emptyText }) {
  if (!tasks || tasks.length === 0)
    return <div style={{ color: "#bbc3d1", padding: 18, fontWeight: 700 }}>{emptyText}</div>;
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {tasks.map((task) => (
        <li
          key={task._id}
          style={{
            background: "rgba(255,255,255,0.88)",
            marginBottom: 18,
            padding: "22px 20px 13px 24px",
            borderRadius: 18,
            borderLeft: `7px solid ${
              task.priority === "High"
                ? "#e03053"
                : task.priority === "Medium"
                ? "#ff9100"
                : "#2eb872"
            }`,
            boxShadow: "0 4px 16px #1976d210, 0 1.5px 8px #c9e8ff15",
            transition: "box-shadow .18s",
            backdropFilter: "blur(1.5px)",
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 19, color: "#253e83" }}>
            {task.name}
          </div>
          <div style={{ color: "#6383b7", marginTop: 2, fontWeight: 600, fontSize: 14 }}>
            {task.time ? task.time : "—"} &nbsp;|&nbsp; {task.type}
          </div>
          <div style={{ color: "#9bb1ce", fontSize: 13, marginTop: 3, fontWeight: 600 }}>
            {task.status} &middot; {new Date(task.date).toLocaleDateString()}
          </div>
        </li>
      ))}
    </ul>
  );
}

// --- Responsive style ---
const responsiveCSS = `
@media (max-width: 900px) {
  .exp-dash-row { flex-direction: column !important; gap: 22px !important;}
}
@media (max-width: 600px) {
  .exp-dash-container { padding: 10px !important;}
  .exp-dash-section { padding: 10px 5px !important;}
  .exp-dash-greeting { font-size: 19px !important; }
}
`;

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

  if (loading)
    return (
      <div style={{ padding: 32, color: "#253e83", fontWeight: 700 }}>
        Loading your Dashboard...
      </div>
    );

  return (
    <div
      className="exp-dash-container"
      style={{
        padding: 34,
        background: "linear-gradient(120deg, #eef6ff 55%, #e9f7f7 100%)",
        minHeight: "100vh",
      }}
    >
      {/* Greeting Header */}
      <div
        className="exp-dash-greeting"
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 38,
        }}
      >
        <Avatar name={profile && profile.name} />
        <div>
          <div style={{ fontSize: 29, fontWeight: 900, color: "#253e83" }}>
            {getGreeting()}
            {profile && profile.name ? `, ${profile.name}` : "!"}
          </div>
          <div
            style={{
              color: "#49e4c3",
              fontSize: 17,
              fontWeight: 800,
              marginTop: 5,
              textShadow: "0 2px 8px #15304c11",
              letterSpacing: 0.5,
            }}
          >
            Achieve something awesome today.
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div
        className="exp-dash-row"
        style={{ display: "flex", gap: 27, marginBottom: 38 }}
      >
        <StatCard
          label="Today's Tasks"
          value={todayTasks.length}
          color="#253e83"
          icon={<span role="img" aria-label="tasks">📝 </span>}
        />
        <StatCard
          label="Upcoming"
          value={upcoming.length}
          color="#3eada7"
          icon={<span role="img" aria-label="upcoming">⏰ </span>}
        />
        <StatCard
          label="Incomplete"
          value={incomplete.length}
          color="#ff9100"
          icon={<span role="img" aria-label="incomplete">🔄 </span>}
        />
        <StatCard
          label="Missed"
          value={missed.length}
          color="#e03053"
          icon={<span role="img" aria-label="missed">⚠️ </span>}
        />
      </div>

      <div
        className="exp-dash-row"
        style={{ display: "flex", gap: 35, flexWrap: "wrap" }}
      >
        {/* Today's Tasks */}
        <section
          className="exp-dash-section"
          style={{
            flex: 1.2,
            minWidth: 340,
            background: "linear-gradient(110deg,#fafdff 60%,#e9f7f7 100%)",
            borderRadius: 20,
            padding: 26,
            marginBottom: 25,
            boxShadow: "0 2px 10px #b1b8c629",
            border: "1.5px solid #e8f0fc",
          }}
        >
          <div style={{ fontSize: 20, color: "#253e83", fontWeight: 900, marginBottom: 12 }}>
            <span role="img" aria-label="today">🌞</span> Today's Tasks
          </div>
          <TaskList tasks={todayTasks} emptyText="No tasks for today." />
        </section>
        {/* Next Task */}
        <section
          className="exp-dash-section"
          style={{
            flex: 1,
            minWidth: 270,
            background: "linear-gradient(120deg,#fafdff 70%,#e7eefb 100%)",
            borderRadius: 20,
            padding: 26,
            marginBottom: 25,
            boxShadow: "0 2px 10px #b1b8c629",
            border: "1.5px solid #e8f0fc",
          }}
        >
          <div style={{ fontSize: 18, color: "#253e83", fontWeight: 800, marginBottom: 12 }}>
            <span role="img" aria-label="next">🚀</span> Next Task
          </div>
          <TaskList tasks={upcoming.slice(0, 1)} emptyText="No upcoming task." />
        </section>
        {/* Incomplete */}
        <section
          className="exp-dash-section"
          style={{
            flex: 1,
            minWidth: 270,
            background: "linear-gradient(110deg,#fff8ec 80%,#fff7ea 100%)",
            borderRadius: 20,
            padding: 26,
            marginBottom: 25,
            boxShadow: "0 2px 10px #ffe5c3",
            border: "1.5px solid #ffe5c3",
          }}
        >
          <div style={{ fontSize: 18, color: "#ff9100", fontWeight: 900, marginBottom: 12 }}>
            <span role="img" aria-label="incomplete">🔄</span> Incomplete Tasks (Today)
          </div>
          <TaskList tasks={incomplete} emptyText="All done for today!" />
        </section>
        {/* Missed */}
        <section
          className="exp-dash-section"
          style={{
            flex: 1,
            minWidth: 270,
            background: "linear-gradient(115deg,#fff1f4 60%,#ffe4e9 100%)",
            borderRadius: 20,
            padding: 26,
            marginBottom: 25,
            boxShadow: "0 2px 10px #ffc4d6",
            border: "1.5px solid #ffc4d6",
          }}
        >
          <div style={{ fontSize: 18, color: "#e03053", fontWeight: 900, marginBottom: 12 }}>
            <span role="img" aria-label="missed">⏳</span> Missed Tasks (Past)
          </div>
          <TaskList tasks={missed} emptyText="No missed tasks!" />
        </section>
      </div>

      {/* Notifications */}
      <section
        className="exp-dash-section"
        style={{
          background: "rgba(255,255,255,0.92)",
          borderRadius: 20,
          padding: 22,
          margin: "34px 0 0 0",
          boxShadow: "0 2px 8px #253e8322",
          border: "1.5px solid #e8f0fc",
        }}
      >
        <div style={{ fontSize: 17, fontWeight: 900, color: "#253e83", marginBottom: 12 }}>
          <span role="img" aria-label="notif">🔔</span> Notifications
        </div>
        {notifications.length === 0 ? (
          <p style={{ color: "#bbc3d1", margin: 0, fontWeight: 700 }}>No new notifications.</p>
        ) : (
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {notifications.map((notif) => (
              <li
                key={notif._id}
                style={{
                  marginBottom: 13,
                  background: "linear-gradient(120deg,#fafdff 70%,#e7eefb 100%)",
                  borderRadius: 10,
                  padding: "13px 16px",
                  color: "#253e83",
                  fontWeight: 800,
                  boxShadow: "0 1px 6px #b1b8c629",
                  fontSize: 15,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>
                  <b>{notif.type}</b>: {notif.message}
                </span>
                <span style={{ color: "#90a4c7", fontSize: 12, fontWeight: 700 }}>
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
