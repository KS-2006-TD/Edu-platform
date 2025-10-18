import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { email, password }
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid credentials, please try again.");
    }
  };

  return (
    <div className="login-wrapper">
      {/* Left gradient panel */}
      <div className="login-side">
        <h1 className="brand-title">EduTile</h1>
        <p className="brand-text">
          Empowering teachers and students with smart, easy-to-use tools for learning.
        </p>
      </div>

      {/* Right form panel */}
      <div className="login-form-panel">
        <div className="login-card">
          <h2>Welcome Back 👋</h2>
          <p className="subtitle">Log in to continue your journey</p>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
          <p className="register-link">
            New here? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
