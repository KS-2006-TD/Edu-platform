import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password,
        role,
      });
      alert("🎉 Registration successful! You can now log in.");
      navigate("/login");
    } catch (err) {
      console.error("❌ Registration failed:", err);
      alert("Registration failed. Please check your details and try again.");
    }
  };

  return (
    <div className="register-page">
      <div className="register-left">
        <h1>EduMe</h1>
        <p>
          Empowering teachers and students with smart, easy-to-use tools for
          learning.
        </p>
      </div>

      <div className="register-right">
        <div className="register-card">
          <h2>Create an Account ✨</h2>
          <p>Join EduMe and start your learning journey</p>

          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email Address"
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

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
            </select>

            <button type="submit">Register</button>
          </form>

          <p className="login-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
