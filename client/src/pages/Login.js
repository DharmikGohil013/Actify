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
      setError(res.message || "Invalid credentials");
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "60px auto" }}>
      <h2>Login</h2>
      {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />
        <button type="submit" style={{ width: "100%" }}>Login</button>
      </form>
      <div style={{ marginTop: 16 }}>
        No account? <Link to="/register">Register here</Link>
      </div>
    </div>
  );
}
