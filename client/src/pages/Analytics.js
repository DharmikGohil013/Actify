import React, { useEffect, useState } from "react";
import LoaderOverlay from "../components/Loader";
import { getMyAnalytics } from "../utils/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart, Legend
} from "recharts";
import "./Analytics.css";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];
const PERIODS = [
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
];

function StatBox({ label, value, sub, color, icon, delay = 0 }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div className="an-stat" style={{ borderTopColor: color, opacity: vis ? 1 : 0, animation: vis ? "fadeInUp .5s ease-out both" : "none" }}>
      <div className="an-stat__icon" style={{ color }}>{icon}</div>
      <div className="an-stat__value" style={{ color }}>{value}</div>
      <div className="an-stat__label">{label}</div>
      {sub && <div className="an-stat__sub">{sub}</div>}
    </div>
  );
}

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("month");

  useEffect(() => {
    setLoading(true);
    getMyAnalytics(period)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [period]);

  if (loading) return <LoaderOverlay />;
  if (!data || data.msg) return <div className="an-page"><div className="an-empty">No analytics data available yet. Start completing tasks!</div></div>;

  const { summary, byType, byPriority, hourlyProductivity, dailyTrend, weeklyTrend, dayOfWeekBreakdown, topTags } = data;

  const typeData = Object.entries(byType).map(([name, v]) => ({ name, total: v.total, completed: v.completed, rate: v.total ? Math.round((v.completed / v.total) * 100) : 0 }));
  const priorityData = Object.entries(byPriority).map(([name, v]) => ({ name, total: v.total, completed: v.completed }));
  const hourlyFiltered = hourlyProductivity.filter(h => h.total > 0);

  return (
    <div className="an-page">
      <div className="an-blob an-blob--1" />
      <div className="an-blob an-blob--2" />

      <div className="an-inner">
        {/* Header */}
        <div className="an-header">
          <div>
            <h1 className="an-title">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" /></svg>
              Analytics
            </h1>
            <p className="an-subtitle">Deep insights into your productivity</p>
          </div>
          <div className="an-period-toggle">
            {PERIODS.map(p => (
              <button key={p.value} className={`an-period-btn ${period === p.value ? "active" : ""}`} onClick={() => setPeriod(p.value)}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="an-stats-grid">
          <StatBox label="Total Tasks" value={summary.total} color="var(--primary)" delay={100}
            icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>} />
          <StatBox label="Completed" value={summary.completed} sub={`${summary.completionRate}% rate`} color="var(--accent-green)" delay={200}
            icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>} />
          <StatBox label="Current Streak" value={`${summary.currentStreak}d`} sub={`Best: ${summary.longestStreak}d`} color="var(--accent-orange)" delay={300}
            icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>} />
          <StatBox label="Productivity Score" value={summary.score} sub={summary.bestDay ? `Best day: ${summary.bestDay}` : ""} color="var(--accent-purple)" delay={400}
            icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>} />
          <StatBox label="Avg Tasks/Day" value={summary.avgTasksPerDay} color="#06b6d4" delay={500}
            icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>} />
          <StatBox label="Incomplete" value={summary.incomplete} color="var(--accent-red)" delay={600}
            icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>} />
        </div>

        {/* Completion Rate Ring */}
        <div className="an-charts-row">
          <div className="an-card an-card--ring">
            <h3 className="an-card__title">Completion Rate</h3>
            <div className="an-ring-container">
              <svg viewBox="0 0 120 120" className="an-ring-svg">
                <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border-color)" strokeWidth="10" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="var(--accent-green)" strokeWidth="10"
                  strokeDasharray={`${summary.completionRate * 3.14} ${314 - summary.completionRate * 3.14}`}
                  strokeDashoffset="78.5" strokeLinecap="round" className="an-ring-progress" />
              </svg>
              <div className="an-ring-text">
                <span className="an-ring-value">{summary.completionRate}%</span>
                <span className="an-ring-label">Complete</span>
              </div>
            </div>
          </div>

          {/* Task Type Breakdown Pie */}
          <div className="an-card">
            <h3 className="an-card__title">Task Types</h3>
            {typeData.length === 0 ? <div className="an-empty-sm">No data</div> : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={typeData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="total" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {typeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Priority Breakdown */}
          <div className="an-card">
            <h3 className="an-card__title">By Priority</h3>
            {priorityData.length === 0 ? <div className="an-empty-sm">No data</div> : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="name" tick={{ fill: "var(--text-secondary)", fontSize: 12 }} />
                  <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: 8 }} />
                  <Bar dataKey="total" fill="var(--primary)" radius={[4, 4, 0, 0]} name="Total" />
                  <Bar dataKey="completed" fill="var(--accent-green)" radius={[4, 4, 0, 0]} name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Daily Trend + Weekly Trend */}
        <div className="an-charts-row an-charts-row--2">
          <div className="an-card an-card--wide">
            <h3 className="an-card__title">Daily Activity</h3>
            {dailyTrend.length === 0 ? <div className="an-empty-sm">No daily data</div> : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={dailyTrend}>
                  <defs>
                    <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradDone" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-green)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--accent-green)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="date" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} tickFormatter={v => v.slice(5)} />
                  <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: 8 }} />
                  <Legend />
                  <Area type="monotone" dataKey="total" stroke="var(--primary)" fill="url(#gradTotal)" name="Total" />
                  <Area type="monotone" dataKey="completed" stroke="var(--accent-green)" fill="url(#gradDone)" name="Completed" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="an-card">
            <h3 className="an-card__title">Weekly Trend</h3>
            {weeklyTrend.length === 0 ? <div className="an-empty-sm">No weekly data</div> : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="week" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} tickFormatter={v => v.slice(5)} />
                  <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: 8 }} />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="var(--primary)" strokeWidth={2} dot={{ r: 4 }} name="Total" />
                  <Line type="monotone" dataKey="completed" stroke="var(--accent-green)" strokeWidth={2} dot={{ r: 4 }} name="Completed" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Hourly Productivity + Day of Week */}
        <div className="an-charts-row an-charts-row--2">
          <div className="an-card an-card--wide">
            <h3 className="an-card__title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              Hourly Productivity
            </h3>
            {hourlyFiltered.length === 0 ? <div className="an-empty-sm">No hourly data</div> : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={hourlyFiltered}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="label" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: 8 }} />
                  <Bar dataKey="completed" fill="var(--accent-green)" radius={[4, 4, 0, 0]} name="Completed" />
                  <Bar dataKey="total" fill="var(--primary)" radius={[4, 4, 0, 0]} name="Total" opacity={0.5} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="an-card">
            <h3 className="an-card__title">Day of Week</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dayOfWeekBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="day" tick={{ fill: "var(--text-secondary)", fontSize: 12 }} />
                <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: 8 }} />
                <Bar dataKey="completed" fill="var(--accent-purple)" radius={[4, 4, 0, 0]} name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tags Cloud */}
        {topTags.length > 0 && (
          <div className="an-card">
            <h3 className="an-card__title">Top Tags</h3>
            <div className="an-tags">
              {topTags.map((t, i) => (
                <span key={t.tag} className="an-tag" style={{ background: COLORS[i % COLORS.length] + "22", color: COLORS[i % COLORS.length], borderColor: COLORS[i % COLORS.length] + "44" }}>
                  #{t.tag} <strong>{t.count}</strong>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
