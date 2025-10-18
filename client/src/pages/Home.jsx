import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/courses");
        setCourses(res.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <p>Loading courses...</p>;

  return (
    <div className="courses-container">
      {courses.length === 0 ? (
        <p>No courses available.</p>
      ) : (
        courses.map((course) => (
          <div key={course._id} className="course-tile">
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <p><strong>Duration:</strong> {course.duration}</p>
            <p><strong>Teacher:</strong> {course.teacher?.name}</p>
            <Link to={`/course/${course._id}`}>
              <button>View / Enroll</button>
            </Link>
          </div>
        ))
      )}
    </div>
  );
}
