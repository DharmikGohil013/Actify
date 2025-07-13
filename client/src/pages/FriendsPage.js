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
    <div style={{
      minHeight: "100vh",
      padding: "40px 24px",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif',
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background Blur Elements */}
      <div style={{
        position: "absolute",
        top: "-50%",
        left: "-20%",
        width: "140%",
        height: "200%",
        background: "radial-gradient(circle at 30% 20%, rgba(0, 122, 255, 0.08) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(52, 199, 89, 0.08) 0%, transparent 50%)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      <div style={{
        maxWidth: "900px",
        margin: "0 auto",
        position: "relative",
        zIndex: 1
      }}>
        {/* Header */}
        <div style={{
          textAlign: "center",
          marginBottom: "40px"
        }}>
          <h1 style={{
            fontSize: "48px",
            fontWeight: "800",
            background: "linear-gradient(135deg, #007AFF, #5856D6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "12px",
            letterSpacing: "-1px"
          }}>
            Find Friends
          </h1>
          <p style={{
            fontSize: "20px",
            color: "#86868B",
            fontWeight: "500",
            margin: 0
          }}>
            Connect with others and grow together
          </p>
        </div>

        {/* Neumorphic Search Bar */}
        <div style={{
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          borderRadius: "24px",
          padding: "8px",
          marginBottom: "40px",
          boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.1), 0 16px 64px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            position: "relative",
            display: "flex",
            alignItems: "center"
          }}>
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none"
              style={{
                position: "absolute",
                left: "20px",
                zIndex: 2,
                opacity: query ? 0.6 : 0.4,
                transition: "opacity 0.3s ease"
              }}
            >
              <circle cx="11" cy="11" r="8" stroke="#86868B" strokeWidth="2"/>
              <path d="m21 21-4.35-4.35" stroke="#86868B" strokeWidth="2"/>
            </svg>
            
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by name..."
              style={{
                width: "100%",
                padding: "20px 20px 20px 56px",
                fontSize: "18px",
                fontWeight: "500",
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#1D1D1F",
                fontFamily: 'inherit'
              }}
              onFocus={(e) => {
                e.target.parentElement.parentElement.style.boxShadow = "inset 0 2px 8px rgba(0, 0, 0, 0.1), 0 16px 64px rgba(0, 122, 255, 0.2), 0 0 0 4px rgba(0, 122, 255, 0.1)";
                e.target.parentElement.parentElement.style.borderColor = "rgba(0, 122, 255, 0.3)";
              }}
              onBlur={(e) => {
                e.target.parentElement.parentElement.style.boxShadow = "inset 0 2px 8px rgba(0, 0, 0, 0.1), 0 16px 64px rgba(0, 0, 0, 0.1)";
                e.target.parentElement.parentElement.style.borderColor = "rgba(255, 255, 255, 0.3)";
              }}
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "60px",
            background: "rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            borderRadius: "24px",
            border: "1px solid rgba(255, 255, 255, 0.3)"
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              border: "3px solid rgba(0, 122, 255, 0.2)",
              borderTop: "3px solid #007AFF",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }} />
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
          </div>
        )}

        {/* No Results */}
        {!loading && Object.keys(results).length === 0 && query && (
          <div style={{
            textAlign: "center",
            padding: "60px 40px",
            background: "rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            borderRadius: "24px",
            border: "1px solid rgba(255, 255, 255, 0.3)"
          }}>
            <div style={{
              fontSize: "48px",
              marginBottom: "16px",
              opacity: 0.5
            }}>
              🔍
            </div>
            <div style={{
              fontSize: "20px",
              color: "#86868B",
              fontWeight: "600"
            }}>
              No users found for "{query}"
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && Object.keys(results).map(letter => (
          <div key={letter} style={{ marginBottom: "32px" }}>
            {/* Section Header */}
            <div style={{
              background: "rgba(255, 255, 255, 0.5)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderRadius: "16px",
              padding: "16px 24px",
              marginBottom: "16px",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)"
            }}>
              <h3 style={{
                margin: 0,
                fontSize: "24px",
                fontWeight: "700",
                color: "#1D1D1F",
                letterSpacing: "-0.5px"
              }}>
                {letter}
              </h3>
            </div>

            {/* User Cards */}
            <div style={{
              display: "grid",
              gap: "16px"
            }}>
              {results[letter].map((user, index) => (
                <div
                  key={user._id}
                  style={{
                    background: "rgba(255, 255, 255, 0.7)",
                    backdropFilter: "blur(40px)",
                    WebkitBackdropFilter: "blur(40px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "20px",
                    padding: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)",
                    cursor: "pointer",
                    animation: `slideIn 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) ${index * 0.1}s both`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 16px 64px rgba(0, 0, 0, 0.15)";
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.9)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.1)";
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.7)";
                  }}
                >
                  <style>
                    {`
                      @keyframes slideIn {
                        from {
                          opacity: 0;
                          transform: translateY(20px);
                        }
                        to {
                          opacity: 1;
                          transform: translateY(0);
                        }
                      }
                    `}
                  </style>

                  <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    {/* Avatar */}
                    <div style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #007AFF, #5856D6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: "20px",
                      fontWeight: "700",
                      boxShadow: "0 8px 24px rgba(0, 122, 255, 0.3)",
                      position: "relative"
                    }}>
                      {user.name?.[0]?.toUpperCase() || "?"}
                      <div style={{
                        position: "absolute",
                        top: "8px",
                        left: "8px",
                        width: "12px",
                        height: "12px",
                        background: "rgba(255, 255, 255, 0.3)",
                        borderRadius: "50%",
                        filter: "blur(4px)"
                      }} />
                    </div>

                    {/* User Info */}
                    <div>
                      <div style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "#1D1D1F",
                        marginBottom: "4px",
                        letterSpacing: "-0.3px"
                      }}>
                        {user.name}
                      </div>
                      <div style={{
                        fontSize: "15px",
                        color: "#86868B",
                        fontWeight: "500",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M9 12L11 14L15 10" stroke="#34C759" strokeWidth="2" strokeLinecap="round"/>
                          <circle cx="12" cy="12" r="9" stroke="#34C759" strokeWidth="2"/>
                        </svg>
                        {user.completedTasks || 0} tasks completed
                      </div>
                      {user.isBlocked && (
                        <div style={{
                          fontSize: "14px",
                          color: "#FF3B30",
                          fontWeight: "600",
                          marginTop: "4px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="15" y1="9" x2="9" y2="15" stroke="white" strokeWidth="2"/>
                            <line x1="9" y1="9" x2="15" y2="15" stroke="white" strokeWidth="2"/>
                          </svg>
                          Blocked
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div>
                    {!user.isFriend && !user.isBlocked && (
                      <button
                        onClick={() => handleFollow(user._id)}
                        style={{
                          background: "rgba(0, 122, 255, 0.9)",
                          backdropFilter: "blur(20px)",
                          WebkitBackdropFilter: "blur(20px)",
                          color: "#fff",
                          fontWeight: "600",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          borderRadius: "50px",
                          padding: "12px 24px",
                          fontSize: "16px",
                          cursor: "pointer",
                          transition: "all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)",
                          boxShadow: "0 8px 32px rgba(0, 122, 255, 0.3)",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.05)";
                          e.currentTarget.style.background = "rgba(0, 122, 255, 1)";
                          e.currentTarget.style.boxShadow = "0 12px 48px rgba(0, 122, 255, 0.4)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.background = "rgba(0, 122, 255, 0.9)";
                          e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 122, 255, 0.3)";
                        }}
                        onMouseDown={(e) => {
                          e.currentTarget.style.transform = "scale(0.98)";
                        }}
                        onMouseUp={(e) => {
                          e.currentTarget.style.transform = "scale(1.05)";
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2"/>
                          <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        Follow
                      </button>
                    )}
                    
                    {user.isFriend && (
                      <div style={{
                        background: "rgba(52, 199, 89, 0.1)",
                        color: "#34C759",
                        fontWeight: "600",
                        padding: "12px 24px",
                        borderRadius: "50px",
                        fontSize: "16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        border: "1px solid rgba(52, 199, 89, 0.2)"
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        Following
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
