import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getSettings, updateSettings } from "../utils/api";
import LoaderOverlay from "../components/Loader";

const toggleIcons = { calendarSync: "\uD83D\uDCC5", pushNotifications: "\uD83D\uDD14", sound: "\uD83D\uDD0A", vibration: "\uD83D\uDCF3" };

function Toggle({ checked, onChange, name, label }) {
  return (
    <label className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", cursor: "pointer", transition: "all var(--transition-base)" }}>
      <span style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 600, color: "var(--text-primary)" }}>
        <span style={{ fontSize: 20 }}>{toggleIcons[name] || ""}</span>
        {label}
      </span>
      <div style={{ position: "relative", width: 50, height: 28, flexShrink: 0 }}>
        <input type="checkbox" name={name} checked={checked} onChange={onChange}
          style={{ opacity: 0, width: 50, height: 28, position: "absolute", zIndex: 2, cursor: "pointer", margin: 0 }} />
        <div style={{
          width: 50, height: 28, borderRadius: 14,
          background: checked ? "var(--primary)" : "var(--border-color)",
          transition: "all .3s ease"
        }} />
        <div style={{
          position: "absolute", top: 2, left: checked ? 24 : 2, width: 24, height: 24,
          borderRadius: "50%", background: "#fff",
          boxShadow: "0 2px 6px rgba(0,0,0,.15)",
          transition: "all .3s ease"
        }} />
      </div>
    </label>
  );
}

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  function handleChange(e) {
    const { name, type, value, checked } = e.target;
    setSettings(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    await updateSettings(settings);
    setSaving(false);
    toast.success("Settings saved successfully");
  }

  if (!settings) return <LoaderOverlay />;

  return (
    <div className="page-container" style={{ animation: "pageEnter .5s ease" }}>
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p style={{ color: "var(--text-muted)", margin: 0 }}>Customize your Actify experience</p>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ maxWidth: 600, display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Theme */}
        <div className="card">
          <h3 style={{ margin: "0 0 4px" }}>Appearance</h3>
          <p style={{ color: "var(--text-muted)", margin: "0 0 16px", fontSize: 14 }}>Choose your preferred theme</p>
          <select name="theme" value={settings.theme || "light"} onChange={handleChange}
            style={{
              width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-color)", background: "var(--bg-secondary)",
              color: "var(--text-primary)", fontSize: 15, outline: "none",
              transition: "border-color var(--transition-base)"
            }}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>

        {/* Reminder */}
        <div className="card">
          <h3 style={{ margin: "0 0 4px" }}>Default Reminder</h3>
          <p style={{ color: "var(--text-muted)", margin: "0 0 16px", fontSize: 14 }}>Minutes before a task is due</p>
          <input type="number" name="reminderDefault" value={settings.reminderDefault || 15} onChange={handleChange}
            min="1" max="120"
            style={{
              width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-color)", background: "var(--bg-secondary)",
              color: "var(--text-primary)", fontSize: 15, outline: "none",
              transition: "border-color var(--transition-base)"
            }} />
        </div>

        {/* Toggles */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Toggle name="calendarSync" label="Calendar Sync" checked={!!settings.calendarSync} onChange={handleChange} />
          <Toggle name="pushNotifications" label="Push Notifications" checked={!!settings.pushNotifications} onChange={handleChange} />
          <Toggle name="sound" label="Sound" checked={!!settings.sound} onChange={handleChange} />
          <Toggle name="vibration" label="Vibration" checked={!!settings.vibration} onChange={handleChange} />
        </div>

        {/* Save */}
        <button type="submit" className="btn-primary btn-pill" disabled={saving}
          style={{ padding: "14px 0", fontSize: 16, fontWeight: 700, width: "100%" }}>
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
