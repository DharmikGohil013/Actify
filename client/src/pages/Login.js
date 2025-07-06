import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../utils/api";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await login(form.email, form.password);
    setLoading(false);
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
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {/* LEFT MOTIVATION SECTION */}
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
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28, alignSelf: "flex-start" }}>
            <img src="w..png" alt="Actify Logo" style={{ width: 40, height: 40 }} />
            <span className="brand-font" style={{
              fontSize: 32, color: "#1976d2", fontWeight: 800, letterSpacing: 2,
              fontFamily: "'CuboWide','Orbitron','Arial Black',Arial,sans-serif"
            }}>
              Actify
            </span>
          </div>
          <svg width="300" height="200" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', margin: '0 auto' }}>
            <ellipse cx="150" cy="170" rx="110" ry="30" fill="#1976d2" fillOpacity="0.09" />
            <circle cx="150" cy="125" r="28" fill="#fff500" fillOpacity="0.7" />
            <g stroke="#fff500" strokeWidth="3" opacity="0.6">
              <line x1="150" y1="82" x2="150" y2="50" />
              <line x1="120" y1="110" x2="90" y2="90" />
              <line x1="180" y1="110" x2="210" y2="90" />
              <line x1="135" y1="140" x2="110" y2="150" />
              <line x1="165" y1="140" x2="190" y2="150" />
            </g>
            <path d="M150 170 Q153 150 170 140 Q200 120 150 125 Q100 130 130 140 Q147 150 150 170" stroke="#1976d2" strokeWidth="2" fill="none" opacity="0.4" />
            <text x="50%" y="45" textAnchor="middle" fontFamily="Arial" fontSize="22" fontWeight="bold" fill="#1976d2" opacity="0.92">
              New Day, New Goals!
            </text>
            <text x="50%" y="67" textAnchor="middle" fontFamily="Arial" fontSize="14" fill="#1976d2" opacity="0.72">
              Start now. Small steps = big change.
            </text>
          </svg>
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
        </div>

        {/* RIGHT LOGIN FORM */}
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
              name="email"
              autoComplete="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
              style={{ width: "100%", marginBottom: 14 }}
            />
            <input
              name="password"
              autoComplete="current-password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
              style={{ width: "100%", marginBottom: 18 }}
            />
            <button type="submit" disabled={loading} style={{
              width: "100%",
              background: "linear-gradient(90deg,#1976d2,#3a8efd)",
              fontWeight: 700,
              fontSize: 16,
              padding: "12px 0",
              borderRadius: 8,
              border: "none"
            }}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div style={{ marginTop: 18, textAlign: "center", color: "#777" }}>
            No account?{" "}
            <Link to="/register" style={{ color: "#1976d2", fontWeight: 700 }}>
              Register here
            </Link>
          </div>

          <div style={{ marginTop: 8, textAlign: "center" }}>
            <Link to="/forgot-password" style={{ fontSize: 14, color: "#1976d2" }}>
              Forgot password?
            </Link>
          </div>
        </div>
      </div>

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
          Empowering your daily success — <a href="https://dharmikgohil.fun/" style={{ color: "#1976d2" }}>Actify Productivity Platform</a>
        </div>
      </footer>
    </div>
  );
}
