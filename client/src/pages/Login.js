import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../utils/api";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const res = await login(form.email, form.password);
    if (res.token && res.user) {
      loginUser(res.user, res.token);
      navigate("/");
    } else {
      setError(res.msg || res.message || "Invalid credentials");
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      background: "linear-gradient(90deg, #e3f0ff 0%, #fafcff 100%)"
    }}>
      {/* Main content */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {/* Left Side: SVG, Motivation, Features */}
        <div style={{
          flex: 1.1,
          minWidth: 320,
          maxWidth: 540,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 36,
        }}>
          {/* Brand logo and name */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12, marginBottom: 28, alignSelf: "flex-start"
          }}>
            <img src="w..png" alt="Actify Logo" style={{ width: 40, height: 40 }} />
            <span className="brand-font" style={{
              fontSize: 32, color: "#1976d2", fontWeight: 800, letterSpacing: 2,
              fontFamily: "'CuboWide','Orbitron','Arial Black',Arial,sans-serif"
            }}>
              Actify
            </span>
          </div>
          {/* Motivational SVG */}
          <svg width="300" height="200" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display: 'block', margin: '0 auto'}}>
            {/* Hill */}
            <ellipse cx="150" cy="170" rx="110" ry="30" fill="#1976d2" fillOpacity="0.09"/>
            {/* Sun */}
            <circle cx="150" cy="125" r="28" fill="#fff500" fillOpacity="0.7" />
            {/* Sun rays */}
            <g stroke="#fff500" strokeWidth="3" opacity="0.6">
              <line x1="150" y1="82" x2="150" y2="50"/>
              <line x1="120" y1="110" x2="90" y2="90"/>
              <line x1="180" y1="110" x2="210" y2="90"/>
              <line x1="135" y1="140" x2="110" y2="150"/>
              <line x1="165" y1="140" x2="190" y2="150"/>
            </g>
            {/* Path up the hill */}
            <path d="M150 170 Q153 150 170 140 Q200 120 150 125 Q100 130 130 140 Q147 150 150 170" stroke="#1976d2" strokeWidth="2" fill="none" opacity="0.4"/>
            {/* Motivational Quote */}
            <text x="50%" y="45" textAnchor="middle" fontFamily="Arial" fontSize="22" fontWeight="bold" fill="#1976d2" opacity="0.92">
              New Day, New Goals!
            </text>
            <text x="50%" y="67" textAnchor="middle" fontFamily="Arial" fontSize="14" fill="#1976d2" opacity="0.72">
              Start now. Small steps = big change.
            </text>
          </svg>
          {/* Motivational Text */}
          <h2 style={{
            marginTop: 18,
            color: "#1976d2",
            fontWeight: 700,
            textAlign: "center"
          }}>
            Take Control of Your Day
          </h2>
          <p style={{
            fontSize: 16,
            color: "#444",
            maxWidth: 330,
            margin: "10px auto 0",
            textAlign: "center"
          }}>
            Welcome back! Every great day starts with action.<br />
            <span style={{ color: "#1976d2", fontWeight: 600 }}>
              Stay productive, track your growth, and make every moment count.
            </span>
          </p>
          {/* Feature Highlights */}
          <div style={{
            width: "100%",
            marginTop: 30,
            marginBottom: 14,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
            <div style={{
              fontWeight: 800,
              fontSize: 22,
              color: "#1976d2",
              marginBottom: 8,
              letterSpacing: 1
            }}>
              Why you'll love Actify
            </div>
            <div style={{
              display: "flex",
              gap: 22,
              flexWrap: "wrap",
              justifyContent: "center",
              marginTop: 8,
              width: "100%",
              maxWidth: 410,
            }}>
              {/* Feature 1: Dashboard */}
              <div style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 12px #1976d212",
                width: 120,
                minHeight: 120,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 16,
                marginBottom: 10
              }}>
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                  <rect x="4" y="10" width="36" height="25" rx="6" fill="#1976d2" fillOpacity=".10"/>
                  <rect x="12" y="18" width="8" height="10" rx="2" fill="#43e97b"/>
                  <rect x="25" y="14" width="8" height="14" rx="2" fill="#1976d2" fillOpacity=".38"/>
                </svg>
                <div style={{
                  fontWeight: 600, fontSize: 14, marginTop: 8, color: "#1976d2"
                }}>Dashboard</div>
                <div style={{ fontSize: 11, color: "#888", textAlign: "center" }}>
                  Overview of your day and progress at a glance
                </div>
              </div>
              {/* Feature 2: Daily Tasks */}
              <div style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 12px #1976d212",
                width: 120,
                minHeight: 120,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 16,
                marginBottom: 10
              }}>
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                  <rect x="8" y="8" width="28" height="28" rx="6" fill="#43e97b" fillOpacity=".17"/>
                  <rect x="16" y="17" width="12" height="4" rx="2" fill="#1976d2" />
                  <rect x="16" y="25" width="8" height="4" rx="2" fill="#1976d2" />
                </svg>
                <div style={{
                  fontWeight: 600, fontSize: 14, marginTop: 8, color: "#1976d2"
                }}>Daily Tasks</div>
                <div style={{ fontSize: 11, color: "#888", textAlign: "center" }}>
                  Organize, add & complete your daily goals
                </div>
              </div>
              {/* Feature 3: Calendar */}
              <div style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 12px #1976d212",
                width: 120,
                minHeight: 120,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 16,
                marginBottom: 10
              }}>
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                  <rect x="7" y="13" width="30" height="22" rx="6" fill="#1976d2" fillOpacity=".12"/>
                  <rect x="17" y="21" width="4" height="8" rx="2" fill="#43e97b"/>
                  <rect x="24" y="21" width="4" height="8" rx="2" fill="#43e97b"/>
                  <rect x="14" y="17" width="16" height="3" rx="1.5" fill="#1976d2" fillOpacity=".4"/>
                </svg>
                <div style={{
                  fontWeight: 600, fontSize: 14, marginTop: 8, color: "#1976d2"
                }}>Calendar View</div>
                <div style={{ fontSize: 11, color: "#888", textAlign: "center" }}>
                  Visualize tasks & reminders for your week
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right Login Form */}
        <div style={{
          flex: 1,
          minWidth: 320,
          maxWidth: 440,
          margin: "32px 0",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 4px 24px #1976d220",
          padding: "40px 36px 36px 36px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}>
          <h2 style={{
            color: "#1976d2",
            fontWeight: 800,
            textAlign: "center",
            marginBottom: 12,
            fontSize: 28
          }}>Login</h2>
          <div style={{
            textAlign: "center",
            color: "#888",
            fontSize: 15,
            marginBottom: 18,
            fontWeight: 500
          }}>
            Let's get things done together!
          </div>
          {error && <div style={{ color: "#e74c3c", marginBottom: 12, textAlign: "center" }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
              style={{ width: "100%", marginBottom: 14 }}
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
              style={{ width: "100%", marginBottom: 18 }}
            />
            <button type="submit" style={{
              width: "100%",
              background: "linear-gradient(90deg,#1976d2,#3a8efd)",
              fontWeight: 700,
              fontSize: 16,
              padding: "12px 0",
              borderRadius: 8,
              border: "none"
            }}>
              Login
            </button>
          </form>
          <div style={{ marginTop: 18, textAlign: "center", color: "#777" }}>
            No account?{" "}
            <Link to="/register" style={{ color: "#1976d2", fontWeight: 700 }}>
              Register here
            </Link>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer style={{
        padding: "22px 0 14px 0",
        background: "none",
        textAlign: "center",
        fontSize: 15,
        color: "#888"
      }}>
        <div style={{ marginBottom: 2, fontWeight: 600 }}>
          Actify &copy; {new Date().getFullYear()}
        </div>
        <div>
          <span>Empowering your daily success &mdash; <a href="https://dharmikgohil.fun/" style={{ color: "#1976d2" }}>Actify Productivity Platform</a></span>
        </div>
      </footer>
    </div>
  );
}
