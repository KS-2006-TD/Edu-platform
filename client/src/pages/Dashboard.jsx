// src/pages/Dashboard.jsx
import React, { useEffect } from "react";
import TeacherDashboard from "./TeacherDashboard";
import StudentDashboard from "./StudentDashboard";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user) window.location = "/login";
  }, [user]);

  if (!user) return null;

  return user.role === "Teacher" ? (
    <TeacherDashboard user={user} />
  ) : (
    <StudentDashboard user={user} />
  );
}
