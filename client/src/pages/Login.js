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
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

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
        {/* Animated Background Elements */}
        <div className="background-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
          <div className="orb orb-4"></div>
          <div className="orb orb-5"></div>
        </div>

        <div className="main-content">
          {/* LEFT SECTION - MODERN HERO */}
          <div className="hero-section">
            <div className="floating-badge">
              <span className="badge-icon">✨</span>
              <span className="badge-text">Productivity Reimagined</span>
            </div>

            <div className="hero-content">
              <div className="brand-showcase">
                <div className="brand-logo-wrapper">
                  <div className="logo-pulse"></div>
                  <img src="w..png" alt="Actify Logo" className="brand-logo-img" />
                </div>
                <h1 className="brand-title">
                  <span className="brand-actify">Actify</span>
                  <span className="brand-tagline">Where Tasks Meet Action</span>
                </h1>
              </div>

              <div className="hero-illustration">
                <div className="illustration-card card-1">
                  <div className="card-icon">📊</div>
                  <div className="card-content">
                    <div className="card-stat">2,847</div>
                    <div className="card-label">Tasks Completed</div>
                  </div>
                  <div className="card-graph">
                    <div className="graph-bar" style={{height: '60%'}}></div>
                    <div className="graph-bar" style={{height: '80%'}}></div>
                    <div className="graph-bar" style={{height: '45%'}}></div>
                    <div className="graph-bar" style={{height: '90%'}}></div>
                    <div className="graph-bar" style={{height: '70%'}}></div>
                  </div>
                </div>

                <div className="illustration-card card-2">
                  <div className="card-icon">🎯</div>
                  <div className="card-content">
                    <div className="card-stat">95%</div>
                    <div className="card-label">Goal Achievement</div>
                  </div>
                  <div className="progress-ring">
                    <svg viewBox="0 0 36 36" className="circular-chart">
                      <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path className="circle" strokeDasharray="95, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                  </div>
                </div>

                <div className="illustration-card card-3">
                  <div className="card-header">
                    <span className="card-title">Today's Focus</span>
                    <span className="card-time">⏰ 14:30</span>
                  </div>
                  <div className="task-items">
                    <div className="task-item completed">
                      <div className="task-check">✓</div>
                      <span>Review project proposal</span>
                    </div>
                    <div className="task-item completed">
                      <div className="task-check">✓</div>
                      <span>Team sync meeting</span>
                    </div>
                    <div className="task-item active">
                      <div className="task-check"></div>
                      <span>Update dashboard</span>
                    </div>
                  </div>
                </div>

                <div className="floating-icons">
                  <div className="float-icon icon-1">🚀</div>
                  <div className="float-icon icon-2">⚡</div>
                  <div className="float-icon icon-3">💡</div>
                  <div className="float-icon icon-4">🎨</div>
                </div>
              </div>

              <div className="hero-features">
                <div className="feature-item">
                  <div className="feature-icon">🔒</div>
                  <div className="feature-text">
                    <strong>Secure</strong>
                    <span>End-to-end encryption</span>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">⚡</div>
                  <div className="feature-text">
                    <strong>Fast</strong>
                    <span>Lightning-quick sync</span>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🌐</div>
                  <div className="feature-text">
                    <strong>Anywhere</strong>
                    <span>Access from any device</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION - MODERN LOGIN FORM */}
          <div className="login-form-wrapper">
            <div className="login-form-container">
              <div className="form-header">
                <div className="welcome-back">
                  <h2 className="login-title">Welcome Back!</h2>
                  <p className="login-subtitle">Sign in to continue your journey</p>
                </div>
                
                {/* Social Login Buttons */}
                <div className="social-login">
                  <button className="social-btn google-btn" type="button">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                  
                  <button className="social-btn github-btn" type="button">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span>Continue with GitHub</span>
                  </button>
                </div>

                <div className="divider">
                  <span>Or continue with email</span>
                </div>
              </div>

              {error && (
                <div className="error-message">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="login-form">
                <div className={`input-group ${focusedInput === 'email' ? 'focused' : ''} ${form.email ? 'filled' : ''}`}>
                  <label htmlFor="email">Email Address</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    <input
                      id="email"
                      name="email"
                      autoComplete="email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      onFocus={() => setFocusedInput('email')}
                      onBlur={() => setFocusedInput(null)}
                      required
                    />
                  </div>
                </div>

                <div className={`input-group ${focusedInput === 'password' ? 'focused' : ''} ${form.password ? 'filled' : ''}`}>
                  <label htmlFor="password">Password</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                    </svg>
                    <input
                      id="password"
                      name="password"
                      autoComplete="current-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                      onFocus={() => setFocusedInput('password')}
                      onBlur={() => setFocusedInput(null)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex="-1"
                    >
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                          <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="form-options">
                  <label className="remember-me">
                    <input type="checkbox" />
                    <span className="checkmark"></span>
                    <span>Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
                </div>

                <button type="submit" className="submit-btn" disabled={submitting}>
                  {submitting ? (
                    <>
                      <span className="spinner"></span>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                      </svg>
                    </>
                  )}
                </button>
              </form>

              <div className="signup-link">
                <span>Don't have an account?</span>{" "}
                <Link to="/register" className="signup-link-btn">
                  Sign up for free
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                  </svg>
                </Link>
              </div>

              <div className="terms-privacy">
                <p>By continuing, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a></p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="trust-bar">
          <div className="trust-item">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
            <span>256-bit SSL Encrypted</span>
          </div>
          <div className="trust-item">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span>GDPR Compliant</span>
          </div>
          <div className="trust-item">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span>24/7 Support Available</span>
          </div>
        </div>
      </div>
    </>
  );
}
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