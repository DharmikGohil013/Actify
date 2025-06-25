import React, { useEffect, useState } from "react";
import { getSettings, updateSettings } from "../utils/api";

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

  if (!settings) return <div>Loading settings...</div>;

  return (
    <div style={{ padding: 24, maxWidth: 500 }}>
      <h2>Settings</h2>
      <form onSubmit={handleSave}>
        <div style={{ marginBottom: 16 }}>
          <label>
            Theme:{" "}
            <select
              name="theme"
              value={settings.theme}
              onChange={handleChange}
            >
              <option value="Light">Light</option>
              <option value="Dark">Dark</option>
            </select>
          </label>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>
            Default Reminder (minutes before):{" "}
            <input
              type="number"
              name="reminderDefault"
              value={settings.reminderDefault}
              onChange={handleChange}
              min={0}
              style={{ width: 70 }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>
            Calendar Sync (Google):{" "}
            <input
              type="checkbox"
              name="calendarSync"
              checked={settings.calendarSync}
              onChange={handleChange}
            />
          </label>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>
            Push Notifications:{" "}
            <input
              type="checkbox"
              name="pushNotifications"
              checked={settings.pushNotifications}
              onChange={handleChange}
            />
          </label>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>
            Sound:{" "}
            <input
              type="checkbox"
              name="sound"
              checked={settings.sound}
              onChange={handleChange}
            />
          </label>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>
            Vibration:{" "}
            <input
              type="checkbox"
              name="vibration"
              checked={settings.vibration}
              onChange={handleChange}
            />
          </label>
        </div>
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
    