// src/pages/Course.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function Course() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/courses/${id}`);
        setCourse(res.data.course || res.data); // depends on your API shape
        // fetch materials & assignments
        const [matRes, asgRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/courses/${id}/materials`),
          axios.get(`http://localhost:5000/api/courses/${id}/assignments`)
        ]);
        setMaterials(matRes.data || []);
        setAssignments(asgRes.data || []);
      } catch (err) {
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading) return <p>Loading course...</p>;
  if (!course) return <p>Course not found.</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      <p><strong>Duration:</strong> {course.duration}</p>
      <p><strong>Teacher:</strong> {course.teacher?.name}</p>

      <section style={{ marginTop: 20 }}>
        <h3>Materials</h3>
        {materials.length === 0 ? <p>No materials uploaded yet.</p> : (
          <div>
            {materials.map(m => (
              <div key={m._id} style={{ padding: 12, border: '1px solid #eee', marginBottom: 12, borderRadius: 8 }}>
                <h4>{m.title || (m.youtube ? 'YouTube Link' : 'PDF')}</h4>
                {m.description && <p>{m.description}</p>}

                {m.pdfUrl && (
                  <p>
                    <a href={m.pdfUrl} target="_blank" rel="noreferrer">Open PDF</a>
                  </p>
                )}

                {m.youtube && (
                  <div style={{ maxWidth: 560 }}>
                    <iframe
                      title={`yt-${m._id}`}
                      width="560"
                      height="315"
                      src={`https://www.youtube.com/embed/${extractYouTubeId(m.youtube)}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

                <small>Uploaded by: {m.uploadedBy?.name || 'Teacher'}</small>
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={{ marginTop: 20 }}>
        <h3>Assignments</h3>
        {assignments.length === 0 ? <p>No assignments yet.</p> : (
          <div>
            {assignments.map(a => (
              <div key={a._id} style={{ padding: 12, border: '1px solid #eee', marginBottom: 12, borderRadius: 8 }}>
                <h4>{a.title}</h4>
                <p>{a.description}</p>
                <p><strong>Due:</strong> {a.dueDate ? new Date(a.dueDate).toLocaleString() : 'No due date'}</p>
                {a.fileUrl && <p><a href={a.fileUrl} target="_blank" rel="noreferrer">Download attachment</a></p>}
                {/* optionally show submission UI here */}
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}

function extractYouTubeId(url) {
  if (!url) return '';
  // common patterns: youtu.be/<id>, youtube.com/watch?v=<id>, youtube.com/embed/<id>
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : '';
}
