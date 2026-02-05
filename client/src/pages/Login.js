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
          {/* LEFT SECTION - MINIMAL BRANDING */}
          <div className="hero-section">
            <div className="brand-showcase">
              <img src="w..png" alt="Actify" className="brand-logo" />
              <h1 className="brand-title">Actify</h1>
              <p className="brand-subtitle">Manage your tasks efficiently</p>
            </div>
          </div>

          {/* RIGHT SECTION - MINIMAL LOGIN FORM */}
          <div className="login-form-wrapper">
            <div className="login-form-container">
              <h2 className="login-title">Sign In</h2>
              
              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleSubmit} className="login-form">
                <input
                  id="email"
                  name="email"
                  autoComplete="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  required
                />

                <input
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  required
                />

                <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>

                <button type="submit" className="submit-btn" disabled={submitting}>
                  {submitting ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <div className="signup-link">
                Don't have an account? <Link to="/register">Sign up</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}