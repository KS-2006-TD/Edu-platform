import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StudentList.css';
import AssignmentModal from './AssignmentModal';

export default function StudentList({ course, onClose }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssign, setShowAssign] = useState(false);

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line
  }, [course._id]);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/enrollments/course/${course._id}`, {
        headers: { Authorization: token ? 'Bearer ' + token : '' }
      });
      setStudents(res.data);
    } catch (err) {
      console.error(err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="studentlist-overlay">
      <div className="studentlist-card">
        <div className="studentlist-head">
          <h3>{course.title} — Enrolled Students</h3>
          <div>
            <button className="btn" onClick={() => setShowAssign(true)}>Add Assignment</button>
            <button className="btn ghost" onClick={onClose}>Close</button>
          </div>
        </div>

        {loading ? <p>Loading...</p> : (
          <div className="studentlist-body">
            {students.length ? students.map(s => (
              <div key={s._id} className="student-row">
                <div><strong>{s.student.name}</strong><div className="small">{s.student.email}</div></div>
                <div className="small">{new Date(s.enrolledAt).toLocaleString()}</div>
              </div>
            )) : <p>No students enrolled yet.</p>}
          </div>
        )}

        {showAssign && <AssignmentModal courseId={course._id} onClose={() => { setShowAssign(false); }} />}
      </div>
    </div>
  );
}
