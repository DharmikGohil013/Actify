import React, { useEffect, useState } from "react";
import { getSettings, updateSettings } from "../utils/api";

// Premium Apple-style iOS toggle switch with advanced glassmorphism
function Toggle({ checked, onChange, name, label, color = "#007AFF", accentColor = "#34C759" }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <label 
      style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        gap: 16, 
        cursor: "pointer", 
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif",
        fontWeight: 600,
        fontSize: 16,
        padding: "18px 24px",
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(30px)",
        WebkitBackdropFilter: "blur(30px)",
        borderRadius: 18,
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: isHovered 
          ? `0 12px 40px ${color}20, 0 8px 20px rgba(0, 0, 0, 0.08)`
          : "0 6px 20px rgba(0, 0, 0, 0.06)",
        transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        transform: isPressed ? "scale(0.98)" : isHovered ? "scale(1.01)" : "scale(1)",
        width: "100%"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
    >
      <span style={{ 
        color: color,
        display: "flex",
        alignItems: "center",
        gap: 12,
        letterSpacing: "-0.2px"
      }}>
        {name === 'calendarSync' && (
          <span style={{ fontSize: 22, filter: "drop-shadow(0 2px 4px rgba(0, 122, 255, 0.3))" }}>📅</span>
        )}
        {name === 'pushNotifications' && (
          <span style={{ fontSize: 22, filter: "drop-shadow(0 2px 4px rgba(52, 199, 89, 0.3))" }}>🔔</span>
        )}
        {name === 'sound' && (
          <span style={{ fontSize: 22, filter: "drop-shadow(0 2px 4px rgba(88, 86, 214, 0.3))" }}>🔊</span>
        )}
        {name === 'vibration' && (
          <span style={{ fontSize: 22, filter: "drop-shadow(0 2px 4px rgba(255, 149, 0, 0.3))" }}>📳</span>
        )}
        {label}
      </span>
      <div style={{
        display: "inline-block",
        width: 56,
        height: 34,
        position: "relative",
        flexShrink: 0
      }}>
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          style={{ opacity: 0, width: 56, height: 34, position: "absolute", zIndex: 2, cursor: "pointer" }}
        />
        <div style={{
          display: "block",
          width: 56,
          height: 34,
          borderRadius: 17,
          background: checked
            ? accentColor
            : "rgba(120, 120, 128, 0.16)",
          transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          border: checked ? "none" : "1px solid rgba(120, 120, 128, 0.32)",
          boxShadow: checked 
            ? `0 0 25px ${accentColor}50, inset 0 2px 4px rgba(0, 0, 0, 0.1)`
            : "inset 0 2px 4px rgba(0, 0, 0, 0.1)"
        }} />
        <div style={{
          position: "absolute",
          left: checked ? 24 : 2,
          top: 2,
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: "#FFFFFF",
          boxShadow: checked 
            ? "0 6px 15px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1)"
            : "0 4px 10px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.2)",
          transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          transform: isPressed ? "scale(0.95)" : "scale(1)"
        }} />
      </div>
    </label>
  );
}

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      const res = await getSettings();
      setSettings(res);
    }
    fetchSettings();
  }, []);

  // Handle ResizeObserver errors specifically for this component
  useEffect(() => {
    const handleResizeObserverError = (e) => {
      if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
        e.stopImmediatePropagation();
        return false;
      }
    };

    window.addEventListener('error', handleResizeObserverError);
    
    return () => {
      window.removeEventListener('error', handleResizeObserverError);
    };
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
    
    // Premium Apple-style success feedback
    const successNotification = document.createElement('div');
    successNotification.style.cssText = `
      position: fixed;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(52, 199, 89, 0.95);
      backdrop-filter: blur(40px);
      color: white;
      padding: 18px 28px;
      border-radius: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
      font-weight: 600;
      font-size: 16px;
      box-shadow: 0 12px 40px rgba(52, 199, 89, 0.4);
      z-index: 1000;
      animation: slideInFromTop 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    successNotification.textContent = '✓ Settings saved successfully';
    document.body.appendChild(successNotification);
    
    setTimeout(() => {
      successNotification.style.animation = 'slideOutToTop 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      setTimeout(() => document.body.removeChild(successNotification), 500);
    }, 2500);
  }

  if (!settings)
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 50%, #667eea 100%)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif"
      }}>
        <div style={{
          background: "rgba(255, 255, 255, 0.3)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          borderRadius: 24,
          padding: "50px 70px",
          textAlign: "center",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 16px 60px rgba(0, 0, 0, 0.1)"
        }}>
          <div style={{
            width: 48,
            height: 48,
            border: "4px solid rgba(255, 255, 255, 0.8)",
            borderTop: "4px solid #007AFF",
            borderRadius: "50%",
            margin: "0 auto 24px auto",
            animation: "spin 1s linear infinite"
          }} />
          <div style={{
            color: "#1d1d1f",
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: "-0.3px"
          }}>
            Loading Settings...
          </div>
        </div>
      </div>
    );

  return (
    <>
      {/* CSS Animations */}
      <style>{`
        @keyframes settingsSlideIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gearRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulseGlow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(0, 122, 255, 0.3), 0 8px 32px rgba(0, 0, 0, 0.1);
          }
          50% { 
            box-shadow: 0 0 40px rgba(0, 122, 255, 0.5), 0 12px 40px rgba(0, 0, 0, 0.15);
          }
        }

        @keyframes buttonPress {
          0% { transform: scale(1); }
          50% { transform: scale(0.98); }
          100% { transform: scale(1); }
        }

        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes slideInFromTop {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        @keyframes slideOutToTop {
          0% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .settings-container {
          animation: settingsSlideIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .gear-icon {
          animation: gearRotate 8s linear infinite;
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));
        }

        .settings-card {
          animation: fadeInUp 0.6s ease-out 0.2s both;
        }

        .apple-input:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.2), 0 4px 20px rgba(0, 122, 255, 0.1);
          transform: scale(1.02);
        }

        .apple-select:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.2), 0 8px 25px rgba(0, 122, 255, 0.15);
        }

        .save-button {
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .save-button:hover {
          transform: scale(1.02);
          box-shadow: 0 12px 40px rgba(0, 122, 255, 0.35), 0 6px 20px rgba(52, 199, 89, 0.25);
        }

        .save-button:active {
          animation: buttonPress 0.2s ease-out;
        }

        .save-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s;
        }

        .save-button:hover::before {
          left: 100%;
        }

        @media (max-width: 640px) {
          .settings-container {
            padding: 20px 16px !important;
          }
          
          .settings-card {
            padding: 28px 20px !important;
            margin: 0 8px !important;
          }
          
          .settings-banner {
            padding: 24px 20px !important;
            margin: 0 8px 32px 8px !important;
          }
        }
      `}</style>

      <div
        className="settings-container"
        style={{
          minHeight: "100vh",
          padding: "40px 20px",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 50%, #667eea 100%)",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Background Blur Circles */}
        <div style={{
          position: "absolute",
          top: "10%",
          right: "15%",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(0, 122, 255, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(40px)",
          zIndex: 0
        }} />
        <div style={{
          position: "absolute",
          bottom: "20%",
          left: "10%",
          width: "250px",
          height: "250px",
          background: "radial-gradient(circle, rgba(52, 199, 89, 0.08) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(50px)",
          zIndex: 0
        }} />

        {/* Premium Header Banner */}
        <div
          className="settings-banner"
          style={{
            position: "relative",
            zIndex: 1,
            background: "rgba(255, 255, 255, 0.25)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: 28,
            padding: "32px 24px",
            margin: "0 auto 40px auto",
            maxWidth: 540,
            textAlign: "center",
            boxShadow: "0 8px 40px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.05)",
            animation: "pulseGlow 3s ease-in-out infinite"
          }}
        >
          <div style={{ 
            fontWeight: 700, 
            fontSize: 34, 
            letterSpacing: "-0.5px", 
            marginBottom: 8,
            color: "#1d1d1f",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12
          }}>
            <span 
              className="gear-icon" 
              role="img" 
              aria-label="settings"
              style={{ 
                fontSize: 32,
                display: "inline-block"
              }}
            >
              ⚙️
            </span>
            Settings
          </div>
          <div style={{ 
            fontWeight: 500, 
            fontSize: 18, 
            color: "#424245",
            marginBottom: 6,
            opacity: 0.9
          }}>
            Tailor Actify for your perfect workflow
          </div>
          <div style={{
            fontSize: 14,
            color: "#6e6e73",
            fontWeight: 400,
            fontStyle: "italic",
            opacity: 0.8
          }}>
            "Success is built on daily habits—set your tools, set your future." 💪
          </div>
        </div>

        {/* Premium Settings Card */}
        <form
          className="settings-card"
          onSubmit={handleSave}
          style={{
            position: "relative",
            zIndex: 1,
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(60px)",
            WebkitBackdropFilter: "blur(60px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: 24,
            boxShadow: "0 16px 60px rgba(0, 0, 0, 0.1), 0 8px 30px rgba(0, 0, 0, 0.05)",
            maxWidth: 540,
            margin: "0 auto",
            padding: "40px 32px",
            display: "flex",
            flexDirection: "column",
            gap: 28
          }}
        >
          {/* Theme Selector */}
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            padding: "18px 24px",
            background: "rgba(0, 122, 255, 0.05)",
            borderRadius: 18,
            border: "1px solid rgba(0, 122, 255, 0.1)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 22, filter: "drop-shadow(0 2px 4px rgba(0, 122, 255, 0.3))" }}>🎨</span>
              <span style={{ 
                fontWeight: 600, 
                fontSize: 17, 
                color: "#007AFF",
                letterSpacing: "-0.2px"
              }}>
                Theme
              </span>
            </div>
            <select
              className="apple-select"
              name="theme"
              value={settings.theme}
              onChange={handleChange}
              style={{
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
                fontWeight: 600,
                fontSize: 16,
                borderRadius: 12,
                border: "1px solid rgba(0, 122, 255, 0.2)",
                padding: "10px 16px",
                background: "rgba(255, 255, 255, 0.9)",
                color: "#007AFF",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                appearance: "none",
                WebkitAppearance: "none",
                backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23007AFF' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                backgroundPosition: "right 12px center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "16px",
                paddingRight: "40px"
              }}
            >
              <option value="Light">🌞 Light</option>
              <option value="Dark">🌙 Dark</option>
            </select>
          </div>

          {/* Reminder Default */}
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            padding: "18px 24px",
            background: "rgba(52, 199, 89, 0.05)",
            borderRadius: 18,
            border: "1px solid rgba(52, 199, 89, 0.1)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 22, filter: "drop-shadow(0 2px 4px rgba(52, 199, 89, 0.3))" }}>⏰</span>
              <span style={{ 
                fontWeight: 600, 
                fontSize: 17, 
                color: "#34C759",
                letterSpacing: "-0.2px"
              }}>
                Default Reminder
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                className="apple-input"
                type="number"
                name="reminderDefault"
                value={settings.reminderDefault}
                onChange={handleChange}
                min={0}
                style={{
                  width: 80,
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
                  fontWeight: 600,
                  fontSize: 16,
                  borderRadius: 10,
                  border: "1px solid rgba(52, 199, 89, 0.2)",
                  padding: "8px 12px",
                  background: "rgba(255, 255, 255, 0.9)",
                  color: "#34C759",
                  textAlign: "center",
                  transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                }}
              />
              <span style={{ 
                fontWeight: 500, 
                color: "#8e8e93", 
                fontSize: 15 
              }}>
                min
              </span>
            </div>
          </div>

          {/* Toggles */}
          <Toggle
            checked={!!settings.calendarSync}
            onChange={handleChange}
            name="calendarSync"
            label="Calendar Sync"
            color="#007AFF"
            accentColor="#007AFF"
          />
          <Toggle
            checked={!!settings.pushNotifications}
            onChange={handleChange}
            name="pushNotifications"
            label="Push Notifications"
            color="#34C759"
            accentColor="#34C759"
          />
          <Toggle
            checked={!!settings.sound}
            onChange={handleChange}
            name="sound"
            label="Sound Effects"
            color="#5856D6"
            accentColor="#5856D6"
          />
          <Toggle
            checked={!!settings.vibration}
            onChange={handleChange}
            name="vibration"
            label="Haptic Feedback"
            color="#FF9500"
            accentColor="#FF9500"
          />

          {/* Save Button */}
          <button
            className="save-button"
            type="submit"
            disabled={saving}
            onMouseDown={() => setButtonPressed(true)}
            onMouseUp={() => setButtonPressed(false)}
            onMouseLeave={() => setButtonPressed(false)}
            style={{
              background: saving 
                ? "linear-gradient(135deg, #8e8e93 0%, #aeaeb2 100%)"
                : "linear-gradient(135deg, #007AFF 0%, #34C759 100%)",
              color: "#FFFFFF",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
              fontWeight: 600,
              fontSize: 18,
              letterSpacing: "-0.2px",
              border: "none",
              borderRadius: 16,
              padding: "18px 36px",
              marginTop: 20,
              cursor: saving ? "not-allowed" : "pointer",
              transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              transform: buttonPressed ? "scale(0.98)" : "scale(1)",
              opacity: saving ? 0.7 : 1,
              boxShadow: saving 
                ? "0 4px 20px rgba(0, 0, 0, 0.1)"
                : "0 12px 40px rgba(0, 122, 255, 0.35), 0 6px 20px rgba(52, 199, 89, 0.25)"
            }}
          >
            {saving ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <div style={{
                  width: 18,
                  height: 18,
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  borderTop: "2px solid #ffffff",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite"
                }} />
                Saving...
              </div>
            ) : (
              "Save Settings"
            )}
          </button>
        </form>
      </div>
    </>
  );
}
