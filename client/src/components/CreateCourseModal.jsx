import React, { useState } from "react";
import axios from "axios";
import "./CreateCourseModal.css";

export default function CreateCourseModal({ teacher, onClose, onCourseCreated }) {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const token = localStorage.getItem("token");

  // ✅ Use environment variable for backend URL
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_URL}/api/courses`,
        { title, duration, description },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      onCourseCreated(res.data);
      setTitle("");
      setDuration("");
      setDescription("");
      onClose();
    } catch (err) {
      console.error("❌ Failed to create course:", err);
      alert("Failed to create course. Please try again.");
    }
  };

  return (
    <div className="ccmodal-overlay">
      <div className="ccmodal-card">
        <h3>Create New Course</h3>
        <form onSubmit={handleSubmit} className="ccmodal-form">
          <input
            placeholder="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            placeholder="Duration (e.g., 6 weeks)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
          <textarea
            placeholder="Course Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <div className="ccmodal-actions">
            <button type="submit" className="btn primary">
              Create
            </button>
            <button type="button" className="btn ghost" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

