import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <h2>EduTile</h2>
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/course/1">Courses</Link></li>
        <li><Link to="/assignments">Assignments</Link></li>
        <li><Link to="/students">Students</Link></li>
        <li><button onClick={handleLogout}>Logout</button></li>
      </ul>
    </aside>
  );
}
