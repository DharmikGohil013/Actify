import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../utils/api";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) {
      setError("Please fill all fields");
      return;
    }
    const res = await register(form.name, form.email, form.password);
    if (res.token && res.user) {
      loginUser(res.user, res.token);
      navigate("/");
    } else {
      setError(res.message || "Registration failed");
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "60px auto" }}>
      <h2>Register</h2>
      {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />
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
        <button type="submit" style={{ width: "100%" }}>Register</button>
      </form>
      <div style={{ marginTop: 16 }}>
        Already have an account? <Link to="/login">Login here</Link>
      </div>
    </div>
  );
}
