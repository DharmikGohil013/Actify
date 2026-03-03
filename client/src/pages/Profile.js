import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LoaderOverlay from "../components/Loader";
import { getUserProfile, getTodayTasks, getUpcomingTasks, getFriends } from "../utils/api";

function getInitials(name) {
  if (!name) return "";
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

const quotes = [
  "Success is the sum of small efforts, repeated.",
  "Each day is a new opportunity to improve.",
  "Stay focused, stay positive, keep moving.",
  "Small progress is still progress!",
  "You got this. Today is your day.",
];

function ProgressRing({ percent, size = 110, stroke = 8 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border-color)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--primary)" strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ - dash}
          style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <span style={{ position: "absolute", fontWeight: 800, fontSize: 22, color: "var(--text-primary)" }}>
        {percent}%
      </span>
    </div>
  );
}

export default function Profile() {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [todayTasks, setTodayTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const userProfile = await getUserProfile();
        let p = userProfile.data || userProfile;
        if (p.name && p.email && p.name.includes("@") && !p.email.includes("@")) {
          [p.name, p.email] = [p.email, p.name];
        }
        p = { name: p.name || "User", email: p.email || "No email", ...p };
        setProfile(p);

        const today = await getTodayTasks();
        setTodayTasks(today);
        await new Promise(r => setTimeout(r, 200));

        const upcoming = await getUpcomingTasks();
        setUpcomingTasks(upcoming);
        await new Promise(r => setTimeout(r, 200));

        const friends = await getFriends();
        setFollowers(Array.isArray(friends) ? friends.filter(f => f._id && f.name) : []);
      } catch (err) {
        setError(err.message || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    }
    const t = setTimeout(fetchData, 100);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <LoaderOverlay />;
  if (error || !profile) return (
    <div className="page-container"><div className="empty-state">{error || "Failed to load profile"}</div></div>
  );

  const completed = todayTasks.filter(t => t.status === "Complete").length;
  const total = todayTasks.length || 1;
  const allDone = completed === todayTasks.length && todayTasks.length > 0;
  const pct = Math.round((completed / total) * 100);

  const displayName = (profile.name && !profile.name.includes("@")) ? profile.name
    : (profile.email && profile.email.includes("@")) ? "User" : profile.name || user?.name || "User";
  const displayEmail = (profile.email && profile.email.includes("@")) ? profile.email
    : (profile.name && profile.name.includes("@")) ? profile.name : profile.email || user?.email || "";
  const initials = getInitials(displayName);

  const typeColors = { Work: "var(--primary)", Personal: "var(--accent-green)", Learning: "var(--accent-orange)", Other: "var(--accent-purple)" };
  const types = ["Work", "Personal", "Learning", "Other"];

  return (
    <div className="page-container" style={{ animation: "pageEnter .5s ease" }}>
      {/* Quote Banner */}
      <div className="card-glass" style={{ textAlign: "center", padding: "24px 32px", marginBottom: 28 }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>
          {String.fromCodePoint(0x1F4A1)} {quote}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 28, alignItems: "start" }}>
        {/* Profile Card */}
        <div className="card" style={{ textAlign: "center", padding: "36px 28px", position: "relative" }}>
          <button onClick={() => { logoutUser(); navigate("/login"); }}
            className="btn-danger btn-sm btn-pill"
            style={{ position: "absolute", top: 16, right: 16 }}>
            Logout
          </button>

          <div style={{
            width: 100, height: 100, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--primary), var(--accent-purple))",
            color: "#fff", fontWeight: 800, fontSize: 38,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px", boxShadow: "0 12px 40px rgba(79,70,229,.3)"
          }}>
            {initials}
          </div>

          <h2 style={{ margin: "0 0 4px", fontSize: "1.5rem" }}>{displayName}</h2>
          <p style={{ color: "var(--text-muted)", margin: "0 0 24px", fontSize: 15 }}>{displayEmail}</p>

          <span className={allDone ? "badge badge-success" : "badge badge-warning"}
            style={{ fontSize: 14, padding: "8px 20px", fontWeight: 700 }}>
            {allDone ? "All Tasks Complete!" : "Keep Going!"}
          </span>

          <div style={{ margin: "28px 0 16px" }}>
            <ProgressRing percent={pct} />
          </div>
          <p style={{ fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
            {completed} of {todayTasks.length} Tasks Done
          </p>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Task Type Stats */}
          <div className="card">
            <h3 style={{ margin: "0 0 4px" }}>Task Overview</h3>
            <p style={{ color: "var(--text-muted)", margin: "0 0 20px", fontSize: 14 }}>Today's activity breakdown</p>
            <div className="grid-4">
              {types.map(type => {
                const count = todayTasks.filter(t => t.type === type).length;
                return (
                  <div key={type} className="card" style={{ textAlign: "center", padding: "20px 12px", borderTop: `3px solid ${typeColors[type]}` }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: "var(--text-primary)" }}>{count}</div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: .5 }}>{type}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="card">
            <h3 style={{ margin: "0 0 4px" }}>Upcoming Tasks</h3>
            <p style={{ color: "var(--text-muted)", margin: "0 0 16px", fontSize: 14 }}>Your scheduled activities</p>
            {upcomingTasks.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {upcomingTasks.slice(0, 4).map(task => (
                  <div key={task._id} className="card" style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>{task.name}</div>
                      <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                        {new Date(task.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                      </div>
                    </div>
                    <span className="badge badge-primary">{task.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">No upcoming tasks scheduled</div>
            )}
          </div>

          {/* Friends */}
          <div className="card">
            <h3 style={{ margin: "0 0 4px" }}>Friends</h3>
            <p style={{ color: "var(--text-muted)", margin: "0 0 16px", fontSize: 14 }}>People you're following</p>
            {followers.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {followers.map(f => (
                  <div key={f._id} className="card" style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: "50%",
                      background: "linear-gradient(135deg, var(--primary), var(--accent-purple))",
                      color: "#fff", fontWeight: 700, fontSize: 15,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                    }}>
                      {getInitials(f.name)}
                    </div>
                    <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{f.name || "Unnamed"}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">Not following anyone yet</div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .page-container > div:nth-child(2) { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .page-container > div:nth-child(2) { gap: 16px !important; }
        }
      `}</style>
    </div>
  );
}
