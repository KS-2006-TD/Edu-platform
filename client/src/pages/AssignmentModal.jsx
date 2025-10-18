import React, { useState } from "react";
import axios from "axios";

export default function AssignmentModal({ course, onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Please enter a title");

    try {
      setLoading(true);
      const form = new FormData();
      form.append("title", title);
      form.append("description", description);
      if (dueDate) form.append("dueDate", dueDate);
      if (file) form.append("file", file);

      await axios.post(
        `http://localhost:5000/api/courses/${course._id}/assignments`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      setLoading(false);
      alert("✅ Assignment created successfully!");
      onCreated && onCreated();
    } catch (err) {
      console.error("Assignment create error:", err);
      setLoading(false);
      alert("❌ Failed to create assignment.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>Create Assignment — {course.title}</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
            />
          </div>
          <div>
            <label>Due Date</label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div>
            <label>Attachment (optional)</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <div style={{ marginTop: 12 }}>
            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Assignment"}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{ marginLeft: 8 }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
