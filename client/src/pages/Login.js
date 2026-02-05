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
        <div className="login-split-layout">
          {/* LEFT SIDE - HERO IMAGE */}
          <div className="login-hero">
            <div className="hero-overlay">
              <div className="hero-content">
                <h1 className="hero-brand">Actify</h1>
                <p className="hero-tagline">
                  Task management is the only tool that helps you achieve more
                  in ways beyond your imagination
                </p>
              </div>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop&q=80" 
              alt="Task Management"
              className="hero-image"
            />
          </div>

          {/* RIGHT SIDE - LOGIN FORM */}
          <div className="login-panel">
            <div className="login-panel-content">
              <div className="welcome-header">
                <div className="plane-icon">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                    <path d="M9 11H3v2h6v6h2v-6h6v-2h-6V5H9v6z"/>
                    <circle cx="18" cy="6" r="2"/>
                  </svg>
                </div>
                <h1 className="welcome-title">Welcome</h1>
                <p className="welcome-subtitle">Login with Email</p>
              </div>

              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="email">Email Id</label>
                  <div className="input-with-icon">
                    <svg className="input-icon" viewBox="0 0 24 24" width="18" height="18">
                      <path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    <input
                      id="email"
                      name="email"
                      autoComplete="email"
                      type="email"
                      placeholder="thisuix@mail.com"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="input-with-icon">
                    <svg className="input-icon" viewBox="0 0 24 24" width="18" height="18">
                      <path fill="currentColor" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                    </svg>
                    <input
                      id="password"
                      name="password"
                      autoComplete="current-password"
                      type="password"
                      placeholder="••••••••••••••••"
                      value={form.password}
                      onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="forgot-password-row">
                  <Link to="/forgot-password" className="forgot-link">Forgot your password?</Link>
                </div>

                <button type="submit" className="login-btn" disabled={submitting}>
                  {submitting ? "LOGGING IN..." : "LOGIN"}
                </button>
              </form>

              <div className="divider">
                <span>OR</span>
              </div>

              <div className="social-login-buttons">
                <button type="button" className="social-btn google">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </button>

                <button type="button" className="social-btn facebook">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>

                <button type="button" className="social-btn apple">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="#000000" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                </button>
              </div>

              <div className="register-prompt">
                Don't have account? <Link to="/register" className="register-link">Register Now</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}