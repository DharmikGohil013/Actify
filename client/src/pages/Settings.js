import React, { useEffect, useState } from "react";
import { getSettings, updateSettings } from "../utils/api";

// Aesthetic toggle switch
function Toggle({ checked, onChange, name, label, color = "#1976d2" }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontWeight: 700 }}>
      <span style={{ color }}>{label}</span>
      <span style={{
        display: "inline-block",
        width: 42,
        height: 24,
        position: "relative"
      }}>
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          style={{ opacity: 0, width: 42, height: 24, position: "absolute", zIndex: 2, cursor: "pointer" }}
        />
        <span style={{
          display: "block",
          width: 42,
          height: 24,
          borderRadius: 14,
          background: checked
            ? "linear-gradient(90deg,#43e97b 60%,#1976d2 100%)"
            : "#d4e4fa",
          transition: "background .23s"
        }} />
        <span style={{
          position: "absolute",
          left: checked ? 21 : 3,
          top: 3,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: checked ? "#fff" : "#fff",
          boxShadow: checked ? "0 2px 8px #43e97b44" : "0 2px 6px #b7d7f622",
          transition: "left .23s"
        }} />
      </span>
    </label>
  );
}

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      const res = await getSettings();
      setSettings(res);
    }
    fetchSettings();
  }, []);

  function handleChange(e) {
    const { name, type, value, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    await updateSettings(settings);
    setSaving(false);
    alert("Settings saved!");
  }

  if (!settings)
    return (
      <div style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#1976d2",
        fontWeight: 800
      }}>
        Loading settings...
      </div>
    );

  return (
    <div
      style={{
        padding: "38px 10px",
        minHeight: "95vh",
        background: "linear-gradient(110deg,#fafdff 70%,#f5eaff 100%)"
      }}
    >
      {/* Banner */}
      <div
        style={{
          background: "linear-gradient(90deg,#1976d2 80%,#43e97b 120%)",
          padding: "24px 0 16px 0",
          borderRadius: 22,
          color: "#fff",
          margin: "0 auto 38px auto",
          maxWidth: 480,
          textAlign: "center",
          boxShadow: "0 7px 28px #1976d230"
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 31, letterSpacing: 2, marginBottom: 2 }}>
          <span role="img" aria-label="settings" style={{ marginRight: 7 }}>⚙️</span>
          Settings
        </div>
        <div style={{ fontWeight: 700, fontSize: 17, color: "#e3fffb" }}>
          Tailor Actify for your perfect workflow.
        </div>
        <div style={{
          fontSize: 13,
          color: "#d7f7f2",
          fontWeight: 600,
          marginTop: 3,
          opacity: 0.87
        }}>
          “Success is built on daily habits—set your tools, set your future.” 💪
        </div>
      </div>

      {/* Card settings */}
      <form
        onSubmit={handleSave}
        style={{
          background: "rgba(255,255,255,0.96)",
          borderRadius: 22,
          boxShadow: "0 6px 32px #b8e5ff55",
          maxWidth: 480,
          margin: "0 auto",
          padding: "38px 30px 30px 30px",
          display: "flex",
          flexDirection: "column",
          gap: 24
        }}
      >
        {/* Theme */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontWeight: 700, fontSize: 17, color: "#1976d2" }}>Theme:</span>
          <select
            name="theme"
            value={settings.theme}
            onChange={handleChange}
            style={{
              fontWeight: 800,
              fontSize: 15,
              borderRadius: 12,
              border: "2px solid #c8e3f8",
              padding: "9px 18px",
              background: "#f4faff",
              color: settings.theme === "Dark" ? "#222" : "#1976d2",
              boxShadow: "0 2px 8px #b7d7f622"
            }}
          >
            <option value="Light">🌞 Light</option>
            <option value="Dark">🌙 Dark</option>
          </select>
        </div>
        {/* Reminder Default */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 17, color: "#1976d2" }}>
            Default Reminder
          </span>
          <input
            type="number"
            name="reminderDefault"
            value={settings.reminderDefault}
            onChange={handleChange}
            min={0}
            style={{
              width: 76,
              fontWeight: 700,
              fontSize: 16,
              borderRadius: 11,
              border: "2px solid #c8e3f8",
              padding: "9px 0 9px 11px",
              background: "#f4faff"
            }}
          />
          <span style={{ fontWeight: 600, color: "#888" }}>minutes before</span>
        </div>
        {/* Calendar sync */}
        <Toggle
          checked={!!settings.calendarSync}
          onChange={handleChange}
          name="calendarSync"
          label="Calendar Sync (Google)"
          color="#1976d2"
        />
        <Toggle
          checked={!!settings.pushNotifications}
          onChange={handleChange}
          name="pushNotifications"
          label="Push Notifications"
          color="#43e97b"
        />
        <Toggle
          checked={!!settings.sound}
          onChange={handleChange}
          name="sound"
          label="Sound"
          color="#003ba7"
        />
        <Toggle
          checked={!!settings.vibration}
          onChange={handleChange}
          name="vibration"
          label="Vibration"
          color="#f1c40f"
        />

        <button
          type="submit"
          disabled={saving}
          style={{
            background: "linear-gradient(90deg,#1976d2 50%,#43e97b 100%)",
            color: "#fff",
            fontWeight: 900,
            fontSize: 18,
            border: "none",
            borderRadius: 99,
            padding: "15px 0",
            marginTop: 12,
            cursor: "pointer",
            boxShadow: "0 2px 12px #1976d218"
          }}
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
