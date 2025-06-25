import React, { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "../utils/api";

export default function Notifications() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadNotifications() {
    setLoading(true);
    const res = await getNotifications();
    setNotifs(res);
    setLoading(false);
  }

  useEffect(() => {
    loadNotifications();
  }, []);

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

  return (
    <div style={{ padding: 24 }}>
      <h2>Notifications</h2>
      <div style={{ marginBottom: 16 }}>
        <button onClick={handleMarkAllRead} disabled={notifs.length === 0}>
          Mark All as Read
        </button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : notifs.length === 0 ? (
        <div style={{ color: "#aaa" }}>No notifications.</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {notifs.map((notif) => (
            <li
              key={notif._id}
              style={{
                background: notif.read ? "#f8f9fa" : "#e8f4fa",
                marginBottom: 8,
                padding: 16,
                borderRadius: 8,
                borderLeft: `5px solid ${
                  notif.type === "Reminder"
                    ? "#00b894"
                    : notif.type === "DueSoon"
                    ? "#e17055"
                    : notif.type === "Missed"
                    ? "#d63031"
                    : notif.type === "Review"
                    ? "#0984e3"
                    : "#636e72"
                }`,
              }}
            >
              <div style={{ fontWeight: 600 }}>
                {notif.type}: {notif.message}
              </div>
              <div style={{ color: "#888", fontSize: 12, marginTop: 2 }}>
                {new Date(notif.date).toLocaleString()}
              </div>
              <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                {!notif.read && (
                  <button onClick={() => handleMarkRead(notif._id)}>
                    Mark as Read
                  </button>
                )}
                <button
                  style={{ color: "red" }}
                  onClick={() => handleDelete(notif._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
