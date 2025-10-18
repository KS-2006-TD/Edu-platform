import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Course from "./pages/Course";
import Sidebar from "./components/Sidebar";
import "./App.css";

export default function App() {
  const location = useLocation();
  const isAuthPage = ["/login", "/register"].includes(location.pathname);
  const isLoggedIn = localStorage.getItem("token");

  return (
    <div className="app">
      {!isAuthPage && isLoggedIn && <Sidebar />}

      <div className="main-content">
        <header className="topbar">
          <div className="logo">EduTile</div>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/dashboard">Dashboard</Link>
            {!isLoggedIn && (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/course/:id" element={<Course />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

