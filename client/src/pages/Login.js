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
            <div className="logo-container">
              <img src="w..png" alt="Actify Logo" className="logo" />
              <span className="brand-font">Actify</span>
            </div>
            <svg
              width="300"
              height="200"
              viewBox="0 0 300 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="motivation-svg"
            >
              <ellipse cx="150" cy="170" rx="110" ry="30" fill="#1976d2" fillOpacity="0.09" />
              <circle cx="150" cy="125" r="28" fill="#fff500" fillOpacity="0.7" />
              <g stroke="#fff500" strokeWidth="3" opacity="0.6">
                <line x1="150" y1="82" x2="150" y2="50" />
                <line x1="120" y1="110" x2="90" y2="90" />
                <line x1="180" y1="110" x2="210" y2="90" />
                <line x1="135" y1="140" x2="110" y2="150" />
                <line x1="165" y1="140" x2="190" y2="150" />
              </g>
              <path
                d="M150 170 Q153 150 170 140 Q200 120 150 125 Q100 130 130 140 Q147 150 150 170"
                stroke="#1976d2"
                strokeWidth="2"
                fill="none"
                opacity="0.4"
              />
              <text
                x="50%"
                y="45"
                textAnchor="middle"
                fontFamily="Arial"
                fontSize="22"
                fontWeight="bold"
                fill="#1976d2"
                opacity="0.92"
              >
                New Day, New Goals!
              </text>
              <text
                x="50%"
                y="67"
                textAnchor="middle"
                fontFamily="Arial"
                fontSize="14"
                fill="#1976d2"
                opacity="0.72"
              >
                Start now. Small steps = big change.
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