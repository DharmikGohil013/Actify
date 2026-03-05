import React, { useEffect, useState } from "react";
import LoaderOverlay from "../components/Loader";
import {
  getTodayTasks,
  getUpcomingTasks,
  getMissedTasks,
  getNotifications,
  getUserProfile,
  checkServerHealth,
} from "../utils/api";
import "./Dashboard.css";

/* ---- Error Toast ---- */
function ErrorNotification({ errors, onDismiss }) {
  const [serverStatus, setServerStatus] = useState(null);
  const [checkingServer, setCheckingServer] = useState(false);
  if (!errors || Object.keys(errors).length === 0) return null;

  const checkServer = async () => {
    setCheckingServer(true);
    try { setServerStatus(await checkServerHealth()); }
    catch (e) { setServerStatus({ status: "error", message: "Failed to reach server" }); }
    finally { setCheckingServer(false); }
  };
  const dot = (s) => s === "online" ? "var(--accent-green)" : s === "timeout" ? "var(--accent-orange)" : "var(--accent-red)";

  return (
    <div className="dash-error-toast">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <strong>⚠ {Object.keys(errors).length === 1 ? "Connection Issue" : "Multiple Issues"}</strong>
        {onDismiss && <button onClick={onDismiss} className="btn-ghost btn-sm">×</button>}
      </div>
      {Object.values(errors).map((e, i) => <div key={i} style={{ fontSize: 13, opacity: .9 }}>• {e}</div>)}
      <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,.2)", display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={checkServer} disabled={checkingServer} className="btn-sm btn-outline" style={{ color: "#fff", borderColor: "rgba(255,255,255,.3)" }}>
          {checkingServer ? "Checking…" : "Check Server"}
        </button>
        {serverStatus && <span style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: dot(serverStatus.status), display: "inline-block" }} />
          {serverStatus.message}
        </span>}
      </div>
    </div>
  );
}

/* ---- Avatar ---- */
function Avatar({ name }) {
  const initials = (() => {
    if (!name?.trim()) return "U";
    const p = name.trim().split(/\s+/);
    return p.length === 1 ? p[0].slice(0, 2).toUpperCase() : p.slice(0, 2).map(w => w[0]).join("").toUpperCase();
  })();
  return <div className="dash-avatar" title={name || "User"}>{initials}</div>;
}

/* ---- Inline Stat Card (dashboard-specific) ---- */
function DashStatCard({ label, value, icon, color, delay = 0 }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div className="dash-stat" style={{ borderTopColor: color, opacity: vis ? 1 : 0, animation: vis ? "fadeInUp .5s ease-out both" : "none" }}>
      <div className="dash-stat__value" style={{ color }}>{icon}<span>{value}</span></div>
      <div className="dash-stat__label">{label}</div>
    </div>
  );
}

/* ---- Task Item ---- */
function DashTaskItem({ task, index }) {
  const pc = task.priority === "High" ? "var(--accent-red)" : task.priority === "Medium" ? "var(--accent-orange)" : "var(--accent-green)";
  return (
    <li className="dash-task-item" style={{ borderLeftColor: pc, animationDelay: `${index * .06}s` }}>
      <div className="dash-task-item__name">{task.name}</div>
      <div className="dash-task-item__meta">{task.time || "—"} · {task.type}</div>
      <div className="dash-task-item__extra">
        <span className={`badge ${task.status === "Complete" ? "badge-success" : "badge-warning"}`}>{task.status}</span>
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{new Date(task.date).toLocaleDateString()}</span>
      </div>
    </li>
  );
}

/* ---- Task List (dashboard-specific with error handling) ---- */
function DashTaskList({ tasks, emptyText, errorMessage }) {
  if (errorMessage) return <div className="dash-section-error">⚠ {errorMessage}</div>;
  if (!tasks?.length) return <div className="empty-state">{emptyText}</div>;
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
      {tasks.map((t, i) => <DashTaskItem key={t._id} task={t} index={i} />)}
    </ul>
  );
}

/* ---- SVG Icon Components ---- */
function TaskIcon({ color = "currentColor", size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }}>
      <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}
function ClockIcon({ color = "currentColor", size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }}>
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function RefreshIcon({ color = "currentColor", size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }}>
      <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}
function AlertIcon({ color = "currentColor", size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
function SunIcon({ color = "currentColor", size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }}>
      <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}
function RocketIcon({ color = "currentColor", size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }}>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 3 0 3 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-3 0-3" />
    </svg>
  );
}
function HourglassIcon({ color = "currentColor", size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }}>
      <path d="M5 22h14" /><path d="M5 2h14" /><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" /><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
    </svg>
  );
}
function BellIcon({ color = "currentColor", size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

/* ---- Greeting ---- */
function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return { msg: "Good morning", emoji: "☀️", sub: "Rise and shine! A fresh start awaits." };
  if (h >= 12 && h < 18) return { msg: "Good afternoon", emoji: "⚡", sub: "Keep the momentum going!" };
  return { msg: "Good evening", emoji: "🌙", sub: "Rest well, tomorrow brings new opportunities." };
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [todayTasks, setTodayTasks] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [missed, setMissed] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [errors, setErrors] = useState({});

  const fetchAll = async (isRetry = false) => {
    setLoading(true);
    setErrors({});
    try {
      const todayData = await getTodayTasks();
      setTodayTasks(Array.isArray(todayData) ? todayData : []);
      await new Promise(r => setTimeout(r, 150));

      const upData = await getUpcomingTasks();
      setUpcoming(Array.isArray(upData) ? upData : []);
      await new Promise(r => setTimeout(r, 150));

      const missedData = await getMissedTasks();
      setMissed(Array.isArray(missedData) ? missedData : []);
      await new Promise(r => setTimeout(r, 150));

      const notifData = await getNotifications();
      setNotifications(Array.isArray(notifData) ? notifData : []);
      await new Promise(r => setTimeout(r, 150));

      const profileData = await getUserProfile();
      setProfile(profileData || { name: "User", email: "", _id: null, error: true });
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      if (isRetry) setErrors({ general: "Failed to reload data. Please try again." });
      setTodayTasks([]);
      setUpcoming([]);
      setMissed([]);
      setNotifications([]);
      setProfile({ name: "User", email: "", _id: null, error: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = setTimeout(() => fetchAll(), 100);
    return () => clearTimeout(id);
  }, []);

  const incomplete = todayTasks.filter(t => t.status === "Incomplete");
  const greeting = getGreeting();

  if (loading) return <LoaderOverlay />;

  return (
    <>
      <ErrorNotification errors={errors} onDismiss={() => setErrors({})} />

      <div className="dash-page">
        {/* decorative blobs */}
        <div className="dash-blob dash-blob--1" />
        <div className="dash-blob dash-blob--2" />

        <div className="dash-inner">
          {/* ── Hero Greeting ── */}
          <section className="dash-hero card-glass">
            <Avatar name={profile?.name} />
            <div style={{ flex: 1 }}>
              <h1 className="dash-hero__title">
                <span style={{ fontSize: 36 }}>{greeting.emoji}</span>
                {greeting.msg}{profile?.name ? `, ${profile.name}` : ""}!
              </h1>
              <p className="dash-hero__sub">{greeting.sub}</p>
              {Object.keys(errors).length > 0 && (
                <button onClick={() => fetchAll(true)} disabled={loading} className="btn-primary btn-sm" style={{ marginTop: 12 }}>
                  {loading ? "Retrying…" : "↻ Retry Loading"}
                </button>
              )}
            </div>
          </section>

          {/* ── Stats Grid ── */}
          <div className="dash-stats-grid">
            <DashStatCard label="Today's Tasks" value={todayTasks.length} color="var(--primary)" icon={<TaskIcon color="var(--primary)" size={28} />} delay={100} />
            <DashStatCard label="Upcoming" value={upcoming.length} color="var(--accent-green)" icon={<ClockIcon color="var(--accent-green)" size={28} />} delay={200} />
            <DashStatCard label="Incomplete" value={incomplete.length} color="var(--accent-orange)" icon={<RefreshIcon color="var(--accent-orange)" size={28} />} delay={300} />
            <DashStatCard label="Missed" value={missed.length} color="var(--accent-red)" icon={<AlertIcon color="var(--accent-red)" size={28} />} delay={400} />
          </div>

          {/* ── Task Sections ── */}
          <div className="dash-tasks-grid">
            <section className="dash-section card">
              <h2 className="dash-section__title"><SunIcon color="var(--primary)" size={24} /> Today's Tasks</h2>
              <DashTaskList tasks={todayTasks} emptyText="No tasks for today." errorMessage={errors.todayTasks} />
            </section>

            <section className="dash-section card">
              <h2 className="dash-section__title"><RocketIcon color="var(--accent-green)" size={24} /> Next Up</h2>
              <DashTaskList tasks={upcoming.slice(0, 1)} emptyText="No upcoming task." errorMessage={errors.upcoming} />
            </section>

            <section className="dash-section card" style={{ borderTop: "3px solid var(--accent-orange)" }}>
              <h2 className="dash-section__title" style={{ color: "var(--accent-orange)" }}><RefreshIcon color="var(--accent-orange)" size={24} /> Incomplete</h2>
              <DashTaskList tasks={incomplete} emptyText="All done for today!" errorMessage={errors.todayTasks} />
            </section>

            <section className="dash-section card" style={{ borderTop: "3px solid var(--accent-red)" }}>
              <h2 className="dash-section__title" style={{ color: "var(--accent-red)" }}><HourglassIcon color="var(--accent-red)" size={24} /> Missed</h2>
              <DashTaskList tasks={missed} emptyText="No missed tasks!" errorMessage={errors.missed} />
            </section>
          </div>

          {/* ── Notifications ── */}
          <section className="dash-section card">
            <h2 className="dash-section__title"><BellIcon color="var(--accent-purple)" size={22} /> Notifications</h2>
            {errors.notifications ? (
              <div className="dash-section-error">⚠ {errors.notifications}</div>
            ) : !notifications.length ? (
              <div className="empty-state">No new notifications.</div>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {notifications.map((n, i) => (
                  <li key={n._id} className="dash-notif" style={{ animationDelay: `${i * .06}s` }}>
                    <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>
                      <span className="badge badge-primary" style={{ marginRight: 8 }}>{n.type}</span>
                      {n.message}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{new Date(n.date).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
