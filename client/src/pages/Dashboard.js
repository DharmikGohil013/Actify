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
