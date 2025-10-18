import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./MaterialUploadModal.css";

export default function MaterialUploadModal({ course, onClose, onUploaded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pdf, setPdf] = useState(null);
  const [youtube, setYoutube] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append("title", title);
      form.append("description", description);
      if (pdf) form.append("pdf", pdf);
      if (youtube) form.append("youtubeLink", youtube);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/courses/${course._id}/materials`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      alert("✅ Material uploaded successfully!");
      onUploaded();
    } catch (err) {
      console.error("Upload failed:", err);
      alert("❌ Failed to upload material");
    }
  };

  return (
    <div className="modal-overlay">
      <motion.div
        className="modal-card"
        initial={{ opacity: 0, scale: 0.9, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="modal-title">📘 Upload Material for: {course.title}</h2>

        <form onSubmit={handleSubmit} className="modal-form">
          <label>Material Title</label>
          <input
            type="text"
            placeholder="Enter material title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Description</label>
          <textarea
            placeholder="Brief description of this material"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <label>PDF File (optional)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdf(e.target.files[0])}
          />

          <label>YouTube Link (optional)</label>
          <input
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={youtube}
            onChange={(e) => setYoutube(e.target.value)}
          />

          <div className="modal-actions">
            <button type="submit" className="btn primary">
              Upload
            </button>
            <button type="button" className="btn secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
