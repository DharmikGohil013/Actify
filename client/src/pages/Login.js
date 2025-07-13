import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import LoaderOverlay from "../components/Loader";
import "./styles.css"; // Import the CSS file


export default function Login() {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Page load
  const [submitting, setSubmitting] = useState(false); // Form submit

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timeout);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const res = await login(form.email, form.password);
    setSubmitting(false);
    if (res.token && res.user) {
      loginUser(res.user, res.token);
      navigate("/");
    } else {
      setError(res.msg || res.message || "Invalid credentials");
    }
  }

  if (loading) return <LoaderOverlay />;

  return (
    <>
      {submitting && <LoaderOverlay />}
      <div className="login-container">
        <div className="main-content">
          {/* LEFT MOTIVATION SECTION */}
          <div className="motivation-section">
            <div className="brand-header">
            <img src="w..png" alt="Actify Logo" />
            <span className="brand-name">Actify</span>
          </div>
            <svg
              width="320"
              height="220"
              viewBox="0 0 320 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="motivation-svg"
            >
              {/* Background Elements */}
              <defs>
                <linearGradient id="loginGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1976d2" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#61dafb" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="loginGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#61dafb" />
                  <stop offset="50%" stopColor="#21d4fd" />
                  <stop offset="100%" stopColor="#1976d2" />
                </linearGradient>
                <filter id="loginGlow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Background Circles */}
              <circle cx="80" cy="60" r="25" fill="url(#loginGradient1)" opacity="0.3" />
              <circle cx="240" cy="50" r="15" fill="#61dafb" opacity="0.2" />
              <circle cx="280" cy="140" r="20" fill="url(#loginGradient1)" opacity="0.25" />
              <circle cx="40" cy="160" r="18" fill="#1976d2" opacity="0.15" />

              {/* Main Laptop/Computer Illustration */}
              <g transform="translate(60, 80)">
                {/* Laptop Base */}
                <rect x="20" y="80" width="160" height="8" rx="4" fill="#334155" />
                <rect x="30" y="70" width="140" height="6" rx="3" fill="#475569" />
                
                {/* Laptop Screen */}
                <rect x="40" y="20" width="120" height="75" rx="8" fill="#1e293b" stroke="url(#loginGradient2)" strokeWidth="2" />
                <rect x="45" y="25" width="110" height="65" rx="4" fill="#0f172a" />
                
                {/* Screen Content - Dashboard */}
                <rect x="50" y="30" width="100" height="8" rx="2" fill="url(#loginGradient2)" opacity="0.8" />
                <rect x="50" y="42" width="70" height="4" rx="1" fill="#61dafb" opacity="0.6" />
                <rect x="50" y="50" width="85" height="4" rx="1" fill="#21d4fd" opacity="0.5" />
                <rect x="50" y="58" width="60" height="4" rx="1" fill="#1976d2" opacity="0.7" />
                
                {/* Task Cards */}
                <rect x="125" y="42" width="20" height="15" rx="2" fill="#61dafb" opacity="0.3" />
                <rect x="125" y="60" width="20" height="15" rx="2" fill="#21d4fd" opacity="0.3" />
                
                {/* Productivity Icons */}
                <circle cx="70" cy="75" r="3" fill="#61dafb" />
                <circle cx="85" cy="75" r="3" fill="#21d4fd" />
                <circle cx="100" cy="75" r="3" fill="#1976d2" />
              </g>

              {/* Floating Task Elements */}
              <g filter="url(#loginGlow)">
                {/* Checkmark Icons */}
                <circle cx="45" cy="120" r="8" fill="#10b981" opacity="0.8" />
                <path d="M41 120 L44 123 L49 116" stroke="white" strokeWidth="1.5" fill="none" />
                
                <circle cx="275" cy="90" r="8" fill="#10b981" opacity="0.8" />
                <path d="M271 90 L274 93 L279 86" stroke="white" strokeWidth="1.5" fill="none" />
                
                {/* Calendar Icon */}
                <rect x="250" y="160" width="20" height="18" rx="2" fill="#1976d2" opacity="0.8" />
                <rect x="252" y="162" width="16" height="14" rx="1" fill="white" />
                <line x1="254" y1="158" x2="254" y2="162" stroke="#1976d2" strokeWidth="1" />
                <line x1="266" y1="158" x2="266" y2="162" stroke="#1976d2" strokeWidth="1" />
                <rect x="254" y="166" width="3" height="2" fill="#61dafb" />
                <rect x="259" y="166" width="3" height="2" fill="#61dafb" />
                <rect x="264" y="166" width="3" height="2" fill="#21d4fd" />
                
                {/* Clock Icon */}
                <circle cx="30" cy="90" r="10" fill="#f59e0b" opacity="0.8" />
                <circle cx="30" cy="90" r="7" fill="white" />
                <line x1="30" y1="90" x2="30" y2="85" stroke="#f59e0b" strokeWidth="1.5" />
                <line x1="30" y1="90" x2="33" y2="92" stroke="#f59e0b" strokeWidth="1" />
              </g>

              {/* Motivational Text */}
              <text
                x="50%"
                y="30"
                textAnchor="middle"
                fontFamily="Inter, Arial, sans-serif"
                fontSize="20"
                fontWeight="700"
                fill="url(#loginGradient2)"
                opacity="0.95"
              >
                Welcome Back, Achiever!
              </text>
              <text
                x="50%"
                y="50"
                textAnchor="middle"
                fontFamily="Inter, Arial, sans-serif"
                fontSize="13"
                fill="#1976d2"
                opacity="0.8"
              >
                Your productivity dashboard awaits
              </text>
            </svg>
            <h2 className="motivation-title">Take Control of Your Day</h2>
            <p className="motivation-text">
              Welcome back! Every great day starts with action.<br />
              <span>
                Stay productive, track your growth, and make every moment count.
              </span>
            </p>
          </div>

          {/* RIGHT LOGIN FORM */}
          <div className="login-form-container">
            <h2 className="login-title">Login</h2>
            <div className="login-subtitle">Let's get things done together!</div>
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="login-form">
              <input
                name="email"
                autoComplete="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
              <input
                name="password"
                autoComplete="current-password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                required
              />
              <button type="submit" disabled={submitting}>
                {submitting ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="register-link">
              No account?{" "}
              <Link to="/register">Register here</Link>
            </div>

            <div className="forgot-password-link">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
          </div>
        </div>

        <footer className="footer">
          <div>Actify © {new Date().getFullYear()}</div>
          <div>
            Empowering your daily success —{" "}
            <a href="https://dharmikgohil.fun/">Actify Productivity Platform</a>
          </div>
        </footer>
      </div>
    </>
  );
}