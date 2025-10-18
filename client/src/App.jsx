import React from "react";
import "./App.css";

function App() {
  return (
    <div className="login-page">
      <nav className="navbar">
        <div className="logo">EduMe</div>
        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#">Dashboard</a>
          <a href="#">Login</a>
          <a href="#">Register</a>
        </div>
      </nav>

      <div className="main-content">
        <div className="left-section">
          <h1>EduMe</h1>
          <p>
            Empowering teachers and students with smart, easy-to-use tools for
            learning.
          </p>
        </div>

        <div className="right-section">
          <div className="login-card">
            <h2>Welcome Back 👋</h2>
            <p>Log in to continue your journey</p>

            <form>
              <input type="email" placeholder="Email address" required />
              <input type="password" placeholder="Password" required />
              <button type="submit">Login</button>
            </form>

            <p className="register-text">
              New here? <a href="#">Create an account</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
