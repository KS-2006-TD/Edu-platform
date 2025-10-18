import React, { useEffect, useState } from "react";
import axios from "axios";
import CreateCourseModal from "../components/CreateCourseModal";
import MaterialUploadModal from "../components/MaterialUploadModal";
import AssignmentModal from "../components/AssignmentModal";
import StudentList from "../components/StudentList";
import "./dashboard.css";

export default function TeacherDashboard({ user }) {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showStudents, setShowStudents] = useState(false);

  // =============================
  // Fetch teacher courses
  // =============================
  const fetchCourses = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses`);
    const mine = res.data.filter((c) => c.teacher?._id === user.id);
    setCourses(mine);
  } catch (err) {
    console.error("❌ Error fetching teacher courses:", err);
  }
};


  useEffect(() => {
    fetchCourses();
  }, []);

  // =============================
  // Handlers for course, assignment, material
  // =============================
  const handleCourseCreated = (newCourse) => {
    setCourses((prev) => [newCourse, ...prev]);
    setShowCreateModal(false);
  };

  const handleMaterialUploaded = () => {
    fetchCourses();
    setShowMaterialModal(false);
    setSelectedCourse(null);
  };

  const handleAssignmentCreated = () => {
    fetchCourses();
    setShowAssignmentModal(false);
    setSelectedCourse(null);
  };

  const handleCloseAllModals = () => {
    setShowCreateModal(false);
    setShowMaterialModal(false);
    setShowAssignmentModal(false);
    setShowStudents(false);
    setSelectedCourse(null);
  };

  // =============================
  // Logout
  // =============================
  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-container">
      {/* ===== HEADER ===== */}
      <header className="dashboard-header">
        <h1 className="dashboard-title">Teacher Dashboard</h1>
        <div className="user-info">
          <span className="user-name">{user.name}</span>
          <span className="user-role small">({user.role})</span>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {/* ===== ACTION BAR ===== */}
      <div className="dashboard-actions">
        <button
          className="action-btn create"
          onClick={() => setShowCreateModal(true)}
        >
          + Create New Course
        </button>
      </div>

      {/* ===== COURSES ===== */}
      <section className="courses-section">
        <h2>My Courses</h2>
        <div className="course-grid">
          {courses.length > 0 ? (
            courses.map((course) => (
              <div key={course._id} className="course-card my">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <p className="course-meta">
                  👥 Students: {course.enrolledStudents?.length || 0}
                </p>

                {/* ===== ASSIGNMENTS LIST ===== */}
                {course.assignments && course.assignments.length > 0 && (
                  <div className="assignment-list">
                    <strong>Assignments:</strong>
                    <ul>
                      {course.assignments.map((a) => (
                        <li key={a._id}>📘 {a.title}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* ===== COURSE BUTTONS ===== */}
                <div className="teacher-btn-group">
                  <button
                    className="teacher-btn material"
                    onClick={() => {
                      setSelectedCourse(course);
                      setShowMaterialModal(true);
                    }}
                  >
                    Upload Material
                  </button>
                  <button
                    className="teacher-btn assignment"
                    onClick={() => {
                      setSelectedCourse(course);
                      setShowAssignmentModal(true);
                    }}
                  >
                    Create Assignment
                  </button>
                  <button
                    className="teacher-btn view"
                    onClick={() => {
                      setSelectedCourse(course);
                      setShowStudents(true);
                    }}
                  >
                    View Students
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-text">You haven’t created any courses yet.</p>
          )}
        </div>
      </section>

      {/* ===== MODALS ===== */}
      {showCreateModal && (
        <CreateCourseModal
          teacher={user}
          onClose={handleCloseAllModals}
          onCourseCreated={handleCourseCreated}
        />
      )}

      {showMaterialModal && selectedCourse && (
        <MaterialUploadModal
          course={selectedCourse}
          onClose={handleCloseAllModals}
          onUploaded={handleMaterialUploaded}
        />
      )}

      {showAssignmentModal && selectedCourse && (
        <AssignmentModal
          course={selectedCourse}
          onClose={handleCloseAllModals}
          onCreated={handleAssignmentCreated}
        />
      )}

      {showStudents && selectedCourse && (
        <StudentList
          course={selectedCourse}
          onClose={handleCloseAllModals}
        />
      )}
    </div>
  );
}
