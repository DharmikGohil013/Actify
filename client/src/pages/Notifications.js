import React, { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "../utils/api";

const typeConfig = {
  Reminder: { color: "var(--accent-green)", icon: "", badge: "badge-success" },
  DueSoon: { color: "var(--accent-orange)", icon: "", badge: "badge-warning" },
  Missed: { color: "var(--accent-red)", icon: "", badge: "badge-danger" },
  Review: { color: "var(--primary)", icon: "", badge: "badge-primary" },
};

export default function Notifications() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadNotifications() {
    setLoading(true);
    const res = await getNotifications();
    setNotifs(res);
    setLoading(false);
  }

  useEffect(() => { loadNotifications(); }, []);

  async function handleMarkRead(id) {
    await markNotificationRead(id);
    await loadNotifications();
  }

  async function handleMarkAllRead() {
    await markAllNotificationsRead();
    await loadNotifications();
  }

  async function handleDelete(id) {
    if (window.confirm("Delete this notification?")) {
      await deleteNotification(id);
      await loadNotifications();
    }
  }

  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <div className="page-container" style={{ animation: "pageEnter .4s ease-out" }}>
      <div className="page-header">
        <div>
          <h1 style={{ margin: 0, fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
             Notifications
          </h1>
          {unreadCount > 0 && (
            <p style={{ margin: "4px 0 0", color: "var(--text-secondary)" }}>
              {unreadCount} unread
            </p>
          )}
        </div>
        <button
          className="btn-primary btn-sm btn-pill"
          onClick={handleMarkAllRead}
          disabled={notifs.length === 0 || unreadCount === 0}
        >
           Mark All Read
        </button>
      </div>

      {loading ? (
        <div className="empty-state">Loading notifications...</div>
      ) : notifs.length === 0 ? (
        <div className="empty-state">No notifications yet. You're all caught up!</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
          {notifs.map((notif, idx) => {
            const cfg = typeConfig[notif.type] || { color: "var(--text-muted)", icon: "", badge: "badge-primary" };
            return (
              <li
                key={notif._id}
                style={{
                  background: notif.read ? "var(--bg-tertiary)" : "var(--bg-secondary)",
                  padding: "16px 20px",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border-color)",
                  borderLeft: "4px solid " + cfg.color,
                  opacity: notif.read ? 0.7 : 1,
                  transition: "all var(--transition-base)",
                  animation: "fadeInUp 0.3s ease-out " + (idx * 0.04) + "s both",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start", flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 20 }}>{cfg.icon}</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                        <span className={"badge " + cfg.badge}>{notif.type}</span>
                        {!notif.read && <span className="badge badge-warning" style={{ fontSize: 10 }}>NEW</span>}
                      </div>
                      <p style={{ margin: "6px 0 0", fontWeight: 500, color: "var(--text-primary)", wordBreak: "break-word" }}>
                        {notif.message}
                      </p>
                      <span style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4, display: "block" }}>
                        {new Date(notif.date).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    {!notif.read && (
                      <button className="btn-sm btn-pill btn-outline" onClick={() => handleMarkRead(notif._id)}>
                        Read
                      </button>
                    )}
                    <button
                      className="btn-sm btn-pill btn-outline"
                      style={{ color: "var(--accent-red)", borderColor: "var(--accent-red)" }}
                      onClick={() => handleDelete(notif._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
