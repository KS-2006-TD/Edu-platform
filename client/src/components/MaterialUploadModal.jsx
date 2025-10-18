import React, { useState } from "react";
import "./MaterialUploadModal.css";

function MaterialUploadModal({ course, onClose, onUpload }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pdf, setPdf] = useState(null);
  const [youtubeLink, setYoutubeLink] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (pdf) formData.append("pdf", pdf);
    if (youtubeLink) formData.append("youtubeLink", youtubeLink);
    onUpload(course._id, formData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>📚 Upload Material for: <span>{course.title}</span></h2>
        <form onSubmit={handleSubmit} className="upload-form">
          <label>Title</label>
          <input
            type="text"
            placeholder="Enter material title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Description</label>
          <textarea
            placeholder="Add a short description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label>Upload PDF (optional)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setPdf(e.target.files[0])}
          />

          <label>YouTube Link (optional)</label>
          <input
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
          />

          <div className="button-row">
            <button type="submit" className="btn upload">Upload</button>
            <button type="button" className="btn cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MaterialUploadModal;