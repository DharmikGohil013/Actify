import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import LoaderOverlay from "../components/Loader";
import "./Register.css"; // Import the CSS file

export default function Register() {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true); // Splash loader
  const [submitting, setSubmitting] = useState(false); // Form submit state
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timeout);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("Please fill all fields");
      return;
    }

    setSubmitting(true);
    const res = await register(form.name, form.email, form.password);
    setSubmitting(false);

    if (res.token && res.user) {
      loginUser(res.user, res.token);
      navigate("/");
    } else {
      setError(res.msg || res.message || "Registration failed");
    }
  }

  if (loading || submitting) return <LoaderOverlay />;

  return (
    <div className="register-page">
      <div className="register-wrapper">
        <div className="register-left">
          <div className="brand-header">
            <img src="w..png" alt="Actify Logo" />
            <span className="brand-name">Actify</span>
          </div>

          <svg
            width="300"
            height="200"
            viewBox="0 0 300 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block", margin: "0 auto" }}
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

          <h2>Start Your Journey</h2>
          <p>
            Your best days begin with small steps. <br />
            <span style={{ color: "#1976d2", fontWeight: 600 }}>
              Join Actify today and turn every task into a win!
            </span>
          </p>
        </div>

        <div className="register-form-container">
          <h2>Register</h2>
          <p>Let's build your productive life, together!</p>
          {error && <div style={{ color: "#e74c3c", marginBottom: 12, textAlign: "center" }}>{error}</div>}

          <form onSubmit={handleSubmit} className="register-form">
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              required
            />
            <button type="submit">Register</button>
          </form>

          <div className="login-redirect">
            Already have an account? <Link to="/login">Login here</Link>
          </div>
        </div>
      </div>

      <footer className="register-footer">
        <div>Actify &copy; {new Date().getFullYear()}</div>
        <div>
          Empowering your daily success —{" "}
          <a href="https://dharmikgohil.fun/">Actify Productivity Platform</a>
        </div>
      </footer>
    </div>
  );
}
