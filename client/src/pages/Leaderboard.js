import React, { useEffect, useState } from "react";
import LoaderOverlay from "../components/Loader";
import { getLeaderboard, compareWithUser } from "../utils/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import "./Leaderboard.css";

const PERIODS = [
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
];

const MEDAL = ["#FFD700", "#C0C0C0", "#CD7F32"];

function Avatar({ name, size = 40 }) {
  const initials = (() => {
    if (!name?.trim()) return "?";
    const p = name.trim().split(/\s+/);
    return p.length === 1 ? p[0].slice(0, 2).toUpperCase() : p.slice(0, 2).map(w => w[0]).join("").toUpperCase();
  })();
  return (
    <div className="lb-avatar" style={{ width: size, height: size, fontSize: size * 0.38 }} title={name}>
      {initials}
    </div>
  );
}

function RankBadge({ rank }) {
  if (rank <= 3) {
    return <span className="lb-medal" style={{ color: MEDAL[rank - 1] }}>
      {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
    </span>;
  }
  return <span className="lb-rank">#{rank}</span>;
}

// ── Comparison Modal ──
function CompareModal({ data, onClose, period }) {
  if (!data) return null;
  const { me, them } = data;

  const comparisonBars = [
    { metric: "Tasks", me: me.total, them: them.total },
    { metric: "Completed", me: me.completed, them: them.completed },
    { metric: "Rate %", me: me.completionRate, them: them.completionRate },
    { metric: "Streak", me: me.streak, them: them.streak },
    { metric: "Score", me: me.score, them: them.score },
  ];

  const radarData = [
    { subject: "Tasks", A: me.total, B: them.total },
    { subject: "Completed", A: me.completed, B: them.completed },
    { subject: "Rate", A: me.completionRate, B: them.completionRate },
    { subject: "Streak", A: me.streak, B: them.streak },
    { subject: "Score", A: Math.min(me.score, 500), B: Math.min(them.score, 500) },
  ];

  const meWins = comparisonBars.filter(c => c.me > c.them).length;
  const themWins = comparisonBars.filter(c => c.them > c.me).length;

  return (
    <div className="lb-modal-overlay" onClick={onClose}>
      <div className="lb-modal" onClick={e => e.stopPropagation()}>
        <button className="lb-modal-close" onClick={onClose}>×</button>
        <h2 className="lb-modal-title">Head to Head</h2>

        <div className="lb-vs">
          <div className="lb-vs-person">
            <Avatar name={me.name} size={56} />
            <span className="lb-vs-name">You</span>
            <span className="lb-vs-score" style={{ color: "var(--primary)" }}>{me.score} pts</span>
          </div>
          <div className="lb-vs-badge">
            <span className="lb-vs-emoji">{meWins > themWins ? "🏆" : meWins === themWins ? "🤝" : "💪"}</span>
            <span className="lb-vs-result">
              {meWins > themWins ? "You're ahead!" : meWins === themWins ? "It's a tie!" : "Keep pushing!"}
            </span>
          </div>
          <div className="lb-vs-person">
            <Avatar name={them.name} size={56} />
            <span className="lb-vs-name">{them.name}</span>
            <span className="lb-vs-score" style={{ color: "var(--accent-purple)" }}>{them.score} pts</span>
          </div>
        </div>

        {/* Side-by-side bars */}
        <div className="lb-compare-chart">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={comparisonBars} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis type="number" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
              <YAxis type="category" dataKey="metric" tick={{ fill: "var(--text-secondary)", fontSize: 12 }} width={80} />
              <Tooltip contentStyle={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: 8 }} />
              <Legend />
              <Bar dataKey="me" fill="var(--primary)" name="You" radius={[0, 4, 4, 0]} />
              <Bar dataKey="them" fill="var(--accent-purple)" name={them.name} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar comparison */}
        <div className="lb-compare-chart">
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--border-color)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--text-secondary)", fontSize: 12 }} />
              <PolarRadiusAxis angle={30} tick={{ fill: "var(--text-muted)", fontSize: 10 }} />
              <Radar name="You" dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.25} strokeWidth={2} />
              <Radar name={them.name} dataKey="B" stroke="var(--accent-purple)" fill="var(--accent-purple)" fillOpacity={0.15} strokeWidth={2} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Stat Comparison Grid */}
        <div className="lb-compare-grid">
          {comparisonBars.map(c => {
            const better = c.me > c.them ? "me" : c.them > c.me ? "them" : "tie";
            return (
              <div key={c.metric} className="lb-compare-item">
                <span className={`lb-compare-val ${better === "me" ? "lb-win" : ""}`}>{c.me}</span>
                <span className="lb-compare-label">{c.metric}</span>
                <span className={`lb-compare-val ${better === "them" ? "lb-win" : ""}`}>{c.them}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Leaderboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("month");
  const [compareData, setCompareData] = useState(null);
  const [comparing, setComparing] = useState(false);

  useEffect(() => {
    setLoading(true);
    getLeaderboard(period)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [period]);

  const handleCompare = async (userId) => {
    setComparing(true);
    try {
      const result = await compareWithUser(userId, period);
      setCompareData(result);
    } catch (err) {
      console.error("Compare failed:", err);
    }
    setComparing(false);
  };

  if (loading) return <LoaderOverlay />;
  if (!data || data.msg) return <div className="lb-page"><div className="lb-empty">Leaderboard is loading... Start completing tasks to rank up!</div></div>;

  const { leaderboard, myRank, myScore, totalUsers } = data;

  return (
    <div className="lb-page">
      <div className="lb-blob lb-blob--1" />
      <div className="lb-blob lb-blob--2" />

      <div className="lb-inner">
        {/* Header */}
        <div className="lb-header">
          <div>
            <h1 className="lb-title">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
              Leaderboard
            </h1>
            <p className="lb-subtitle">Compete with others. Stay motivated. Rise to the top!</p>
          </div>
          <div className="an-period-toggle">
            {PERIODS.map(p => (
              <button key={p.value} className={`an-period-btn ${period === p.value ? "active" : ""}`} onClick={() => setPeriod(p.value)}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* My Rank Banner */}
        <div className="lb-my-rank card-glass">
          <div className="lb-my-rank__left">
            <span className="lb-my-rank__label">Your Rank</span>
            <span className="lb-my-rank__number">#{myRank || "—"}</span>
          </div>
          <div className="lb-my-rank__mid">
            <span className="lb-my-rank__score">{myScore} pts</span>
            <span className="lb-my-rank__of">of {totalUsers} users</span>
          </div>
          <div className="lb-my-rank__right">
            {myRank && myRank <= 3 && <span style={{ fontSize: 48 }}>{myRank === 1 ? "🥇" : myRank === 2 ? "🥈" : "🥉"}</span>}
            {myRank && myRank > 3 && myRank <= 10 && <span style={{ fontSize: 36 }}>🔥</span>}
            {(!myRank || myRank > 10) && <span style={{ fontSize: 36 }}>💪</span>}
          </div>
        </div>

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div className="lb-podium">
            {[1, 0, 2].map(idx => {
              const user = leaderboard[idx];
              if (!user) return null;
              const podPos = idx === 0 ? "first" : idx === 1 ? "second" : "third";
              return (
                <div key={user._id} className={`lb-podium__item lb-podium--${podPos}`}>
                  <div className="lb-podium__medal">{idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}</div>
                  <Avatar name={user.name} size={idx === 0 ? 64 : 52} />
                  <span className="lb-podium__name">{user.name}</span>
                  <span className="lb-podium__score">{user.score} pts</span>
                  <span className="lb-podium__stat">{user.completed}/{user.total} tasks · {user.streak}d streak</span>
                  {!user.isMe && (
                    <button className="lb-compare-btn" onClick={() => handleCompare(user._id)} disabled={comparing}>
                      Compare
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Full Table */}
        <div className="lb-table-wrapper">
          <table className="lb-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>User</th>
                <th>Score</th>
                <th>Completed</th>
                <th>Rate</th>
                <th>Streak</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user) => (
                <tr key={user._id} className={`${user.isMe ? "lb-row-me" : ""} ${user.isFriend ? "lb-row-friend" : ""}`}>
                  <td><RankBadge rank={user.rank} /></td>
                  <td>
                    <div className="lb-user-cell">
                      <Avatar name={user.name} size={32} />
                      <div>
                        <span className="lb-user-name">
                          {user.name}
                          {user.isMe && <span className="lb-badge-you">YOU</span>}
                          {user.isFriend && !user.isMe && <span className="lb-badge-friend">FRIEND</span>}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td><strong style={{ color: "var(--primary)" }}>{user.score}</strong></td>
                  <td>{user.completed}/{user.total}</td>
                  <td>
                    <div className="lb-rate-bar">
                      <div className="lb-rate-fill" style={{ width: `${user.completionRate}%`, background: user.completionRate >= 70 ? "var(--accent-green)" : user.completionRate >= 40 ? "var(--accent-orange)" : "var(--accent-red)" }} />
                      <span>{user.completionRate}%</span>
                    </div>
                  </td>
                  <td>
                    <span className="lb-streak">{user.streak > 0 ? `🔥 ${user.streak}d` : "—"}</span>
                  </td>
                  <td>
                    {!user.isMe && (
                      <button className="lb-compare-btn-sm" onClick={() => handleCompare(user._id)} disabled={comparing}>
                        ⚔ Compare
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compare Modal */}
      {compareData && <CompareModal data={compareData} onClose={() => setCompareData(null)} period={period} />}
      {comparing && <div className="lb-comparing-overlay"><div className="lb-comparing-text">Loading comparison...</div></div>}
    </div>
  );
}
