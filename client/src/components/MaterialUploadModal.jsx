// src/components/MaterialUploadModal.jsx
import React, { useState } from 'react';
import axios from 'axios';

export default function MaterialUploadModal({ course, onClose, onUploaded }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [youtube, setYoutube] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const handleSubmit = async e => {
    e.preventDefault();
    if (!pdfFile && !youtube) {
      alert('Provide a PDF or a YouTube link (or both).');
      return;
    }

    try {
      setLoading(true);
      const form = new FormData();
      form.append('title', title);
      form.append('description', description);
      if (pdfFile) form.append('pdf', pdfFile);
      if (youtube) form.append('youtube', youtube);

      const API_URL = import.meta.env.VITE_API_URL;

      await axios.post(
        `${API_URL}/api/courses/${course._id}/materials`,
        form,
       {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: token ? `Bearer ${token}` : '',
         },
       }
     );


      setLoading(false);
      onUploaded && onUploaded();
    } catch (err) {
      console.error('Upload error:', err);
      setLoading(false);
      alert('Failed to upload material.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>Upload Material for: {course.title}</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div>
            <label>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div>
            <label>PDF file (optional)</label>
            <input type="file" accept="application/pdf" onChange={e => setPdfFile(e.target.files[0])} />
          </div>
          <div>
            <label>YouTube link (optional)</label>
            <input value={youtube} onChange={e => setYoutube(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
          </div>

          <div style={{ marginTop: 12 }}>
            <button type="submit" disabled={loading}>{loading ? 'Uploading...' : 'Upload'}</button>
            <button type="button" onClick={onClose} style={{ marginLeft: 8 }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
