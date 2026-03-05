import React, { useState, useEffect } from "react";
import { searchUsers, followUser } from "../utils/api";
import LoaderOverlay from "../components/Loader";

export default function FriendsPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) { setResults({}); return; }
    const timeout = setTimeout(() => {
      (async () => {
        setLoading(true);
        const res = await searchUsers(query);
        const raw = Array.isArray(res) ? res : res.users || [];
        const grouped = {};
        raw.forEach(user => {
          const initial = user.name?.[0]?.toUpperCase() || "#";
          if (!grouped[initial]) grouped[initial] = [];
          grouped[initial].push(user);
        });
        const sorted = Object.keys(grouped).sort().reduce((acc, key) => { acc[key] = grouped[key]; return acc; }, {});
        setResults(sorted);
        setLoading(false);
      })();
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  async function handleFollow(userId) {
    await followUser(userId);
    setResults(prev => {
      const updated = { ...prev };
      for (const letter in updated) {
        updated[letter] = updated[letter].map(user =>
          user._id === userId ? { ...user, isFriend: true } : user
        );
      }
      return updated;
    });
  }

  return (
    <div className="page-container" style={{ animation: "pageEnter .4s ease-out" }}>
      <div className="page-header">
        <h1 style={{ margin: 0, fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
           Find & Follow Friends
        </h1>
      </div>

      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search by name..."
        style={{
          width: "100%",
          padding: "12px 16px",
          fontSize: 15,
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-color)",
          background: "var(--bg-secondary)",
          marginBottom: 24,
          transition: "all var(--transition-base)",
          outline: "none",
        }}
        onFocus={e => e.target.style.borderColor = "var(--primary)"}
        onBlur={e => e.target.style.borderColor = "var(--border-color)"}
      />

      {loading && <LoaderOverlay />}

      {!loading && Object.keys(results).length === 0 && query && (
        <div className="empty-state">No users found for "{query}"</div>
      )}

      {!loading && Object.keys(results).map(letter => (
        <div key={letter} style={{ marginBottom: 20 }}>
          <h4 style={{
            margin: "0 0 10px",
            color: "var(--text-muted)",
            fontWeight: 700,
            fontSize: 13,
            textTransform: "uppercase",
            letterSpacing: 1.5,
            borderBottom: "2px solid var(--border-color)",
            paddingBottom: 6,
          }}>
            {letter}
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {results[letter].map(user => (
              <div
                key={user._id}
                className="card"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 20px",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--primary), var(--accent-purple))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontWeight: 700, fontSize: 16, flexShrink: 0,
                  }}>
                    {user.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)" }}>{user.name}</div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                      {user.completedTasks || 0} tasks completed
                    </div>
                    {user.isBlocked && (
                      <span className="badge badge-danger" style={{ marginTop: 4 }}>Blocked</span>
                    )}
                  </div>
                </div>

                {!user.isFriend && !user.isBlocked && (
                  <button className="btn-primary btn-sm btn-pill" onClick={() => handleFollow(user._id)}>
                    + Follow
                  </button>
                )}
                {user.isFriend && (
                  <span className="badge badge-success">Following </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
