import React, { useEffect, useState } from "react";
import axios from "axios";
import "./dashboard.css";

export default function StudentDashboard({ user }) {
  const [allCourses, setAllCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loadingEnroll, setLoadingEnroll] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses`);
  const token = localStorage.getItem("token");
  const enrollments = await axios.get(`${import.meta.env.VITE_API_URL}/api/enrollments/mine`, {
     headers: { Authorization: token ? "Bearer " + token : "" }
     } );


  useEffect(() => {
    fetchCourses();
  }, []);

  // ✅ Fetch course materials + assignments when a course is selected
  const fetchCourseDetails = async (courseId) => {
    try {
      setLoadingDetails(true);
      const token = localStorage.getItem("token");

      const [matRes, assignRes] = await Promise.allSettled([
        axios.get(`http://localhost:5000/api/courses/${courseId}/materials`, {
          headers: { Authorization: "Bearer " + token },
        }),
        axios.get(`http://localhost:5000/api/courses/${courseId}/assignments`, {
          headers: { Authorization: "Bearer " + token },
        }),
      ]);

      setMaterials(matRes.value?.data || []);
      setAssignments(assignRes.value?.data || []);
    } catch (err) {
      console.error("Error fetching course details:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      setLoadingEnroll(courseId);
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/enrollments/${courseId}`,
        {},
        { headers: { Authorization: "Bearer " + token } }
      );
      await fetchCourses();
      setLoadingEnroll(null);
    } catch (err) {
      console.error("Error enrolling:", err);
      setLoadingEnroll(null);
    }
  };

  const isEnrolled = (id) => enrolledCourses.some(c => c._id === id);

  const logout = () => {
    localStorage.clear();
    window.location = "/login";
  };

  const handleCourseClick = (course) => {
    if (!isEnrolled(course._id)) {
      alert("You must enroll first to access materials.");
      return;
    }
    setSelectedCourse(course);
    fetchCourseDetails(course._id);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Student Dashboard</h1>
        <div className="user-info">
          <span>{user.name} ({user.role})</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <section className="courses-section">
        <h2>All Courses</h2>
        <div className="course-grid">
          {allCourses.map(course => (
            <div
              key={course._id}
              className="course-card"
              onClick={() => handleCourseClick(course)}
            >
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p className="course-meta">By {course.teacher?.name || "Unknown"}</p>
              <button
                className="enroll-btn"
                disabled={isEnrolled(course._id) || loadingEnroll === course._id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEnroll(course._id);
                }}
              >
                {isEnrolled(course._id)
                  ? "Enrolled"
                  : loadingEnroll === course._id
                  ? "Enrolling..."
                  : "Enroll"}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="my-courses-section">
        <h2>Enrolled Courses</h2>
        <div className="course-grid">
          {enrolledCourses.map(course => (
            <div
              key={course._id}
              className="course-card my-course"
              onClick={() => handleCourseClick(course)}
            >
              <h3>{course.title}</h3>
              <p>{course.description}</p>
            </div>
          ))}
        </div>
      </section>

      {selectedCourse && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setSelectedCourse(null)}>
              ✕
            </button>

            <h2>{selectedCourse.title}</h2>

            {loadingDetails ? (
              <p>Loading course details...</p>
            ) : (
              <>
                <h3>📘 Materials</h3>
                {materials.length > 0 ? (
                  <ul>
                    {materials.map((m) => (
                      <li key={m._id}>
                        <a href={m.fileUrl} target="_blank" rel="noreferrer">
                          {m.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No materials uploaded yet.</p>
                )}

                <h3>📝 Assignments</h3>
                {assignments.length > 0 ? (
                  <ul>
                    {assignments.map((a) => (
                      <li key={a._id}>
                        <strong>{a.title}</strong>{" "}
                        {a.dueDate && `— Due: ${new Date(a.dueDate).toLocaleDateString()}`}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No assignments yet.</p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
