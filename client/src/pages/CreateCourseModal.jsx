import React, { useState } from 'react';
import axios from 'axios';
import './Modal.css';

export default function CreateCourseModal({ teacher, onClose, onCourseCreated }) {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post('http://localhost:5000/api/courses', {
      title, duration, description, createdBy: teacher.name
    });
    onCourseCreated(res.data);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Create New Course</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Course Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input type="text" placeholder="Duration (weeks)" value={duration} onChange={(e) => setDuration(e.target.value)} required />
          <textarea placeholder="Course Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
          <button type="submit">Create Course</button>
          <button type="button" className="close" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
}
