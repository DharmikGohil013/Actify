import React, { useState, useEffect } from "react";
import { searchUsers, followUser } from "../utils/api";
import LoaderOverlay from "../components/Loader"; // adjust path if needed


export default function FriendsPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults({});
      return;
    }
    const timeout = setTimeout(() => {
      fetchResults();
    }, 300); // debounce
    return () => clearTimeout(timeout);
  }, [query]);

  async function fetchResults() {
  setLoading(true);
  const res = await searchUsers(query);
  const raw = Array.isArray(res) ? res : res.users || [];

  const grouped = {};

  raw.forEach(user => {
    const initial = user.name?.[0]?.toUpperCase() || "#";
    if (!grouped[initial]) grouped[initial] = [];
    grouped[initial].push(user);
  });

  const sorted = Object.keys(grouped)
    .sort()
    .reduce((acc, key) => {
      acc[key] = grouped[key];
      return acc;
    }, {});

  setResults(sorted);
  setLoading(false);
}

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
    <div style={{ padding: 32, maxWidth: 800, margin: "0 auto" }}>
      <h2 style={{ fontWeight: 800, color: "#1976d2" }}>Find & Follow Friends</h2>

      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search by name..."
        style={{
          width: "100%",
          padding: "12px 16px",
          fontSize: 16,
          borderRadius: 10,
          border: "1.5px solid #ccc",
          margin: "16px 0 26px"
        }}
      />

      {loading && <LoaderOverlay />}

      {!loading && Object.keys(results).length === 0 && query && (
        <div style={{ color: "#999" }}>No users found.</div>
      )}

      {!loading &&
        Object.keys(results).map(letter => (
          <div key={letter} style={{ marginBottom: 24 }}>
            <h4
              style={{
                margin: "14px 0 10px",
                color: "#555",
                fontWeight: 800,
                borderBottom: "2px solid #d9e5ff",
                paddingBottom: 4
              }}
            >
              {letter}
            </h4>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {results[letter].map(user => (
                <li
  key={user._id}
  style={{
    background: "linear-gradient(90deg, #f2f6ff, #eef7ff)",
    border: "1px solid #d6e4ff",
    borderRadius: 14,
    padding: "18px 20px",
    marginBottom: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 4px 12px #1976d219",
    transition: "transform 0.2s ease",
  }}
>

                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{user.name}</div>
                    <div style={{ fontSize: 13, color: "#555" }}>
                      Completed Tasks: {user.completedTasks || 0}
                    </div>
                    {user.isBlocked && (
                      <div style={{ fontSize: 12, color: "red", fontWeight: 600 }}>
                        🚫 Blocked
                      </div>
                    )}
                  </div>

                  {!user.isFriend && !user.isBlocked && (
                   <button
  onClick={() => handleFollow(user._id)}
  style={{
    background: "linear-gradient(90deg,#1976d2,#3a8efd)",
    color: "#fff",
    fontWeight: 700,
    border: "none",
    borderRadius: 20,
    padding: "8px 20px",
    fontSize: 14,
    boxShadow: "0 2px 6px #1976d230",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
  }}
>
  + Follow
</button>

                  )}
                  {user.isFriend && (
                    <div style={{ color: "#43e97b", fontWeight: 700 }}>Following ✅</div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
}
