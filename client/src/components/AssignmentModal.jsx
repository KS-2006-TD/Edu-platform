import React, { useState } from "react";
import axios from "axios";
import "./AssignmentModal.css";

export default function AssignmentModal({ course, onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [dueDate, setDueDate] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // ✅ Use your Render backend URL from .env
      const API_URL = import.meta.env.VITE_API_URL;

      const res = await axios.post(
        `${API_URL}/api/assignments`,
        {
          courseId: course._id,
          title,
          description: desc,
          dueDate,
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      console.log("✅ Assignment created:", res.data);
      alert("Assignment created successfully!");
      setTitle("");
      setDesc("");
      setDueDate("");
      onCreated?.(); // refresh dashboard if provided
      onClose();
    } catch (err) {
      console.error("❌ Failed to create assignment:", err.response?.data || err);
      alert("Failed to create assignment");
    }
  };

  return (
    <div className="assign-overlay">
      <div className="assign-card">
        <h3>Create Assignment</h3>
        <form onSubmit={submit}>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "flex-end",
              marginTop: 8,
            }}
          >
            <button className="btn primary" type="submit">
              Create
            </button>
            <button className="btn ghost" type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
