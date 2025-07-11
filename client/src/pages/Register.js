import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { sendOTP, verifyOTP, createAccount } from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import LoaderOverlay from "../components/Loader";
import "./Register.css";

export default function Register() {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true); // splash loader
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = email, 2 = OTP, 3 = details
  const [error, setError] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timeout);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (step === 1) {
      if (!form.email) return setError("Please enter your email");
      setSubmitting(true);
      const res = await sendOTP(form.email);
      setSubmitting(false);
      if (res.success) {
        setStep(2);
      } else {
        setError(res.msg || "Failed to send OTP");
      }
    }

    else if (step === 2) {
      if (!otp) return setError("Enter the OTP sent to your email");
      setSubmitting(true);
      const res = await verifyOTP(form.email, otp);
      setSubmitting(false);
      if (res.success) {
        setStep(3);
      } else {
        setError(res.msg || "Invalid OTP");
      }
    }

    else if (step === 3) {
      if (!form.name || !form.password) return setError("All fields required");
      setSubmitting(true);
      const res = await createAccount(form.name, form.email, form.password);
      setSubmitting(false);
      if (res.token && res.user) {
        loginUser(res.user, res.token);
        navigate("/");
      } else {
        setError(res.msg || "Account creation failed");
      }
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

          <svg width="300" height="200" viewBox="0 0 300 200">
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
          <p>
            {step === 1 && "Enter your email to receive an OTP"}
            {step === 2 && "Enter the OTP sent to your email"}
            {step === 3 && "Complete your account setup"}
          </p>

          {error && <div style={{ color: "#e74c3c", marginBottom: 12, textAlign: "center" }}>{error}</div>}

          <form onSubmit={handleSubmit} className="register-form">
            {step === 1 && (
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
            )}

            {step === 2 && (
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            )}

            {step === 3 && (
              <>
                <input
                  type="text"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  required
                />
              </>
            )}

            <button type="submit">
              {step === 1 ? "Send OTP" : step === 2 ? "Verify OTP" : "Create Account"}
            </button>
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
