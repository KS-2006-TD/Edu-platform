// =====================
// 🌿 Environment Setup
// =====================
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const app = express();

// =====================
// ⚙️ Middleware Setup
// =====================
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(morgan('dev')); // HTTP logger

// =====================
// 🧩 Import Models
// =====================
require('./models/User');
require('./models/Course');
require('./models/Enrollment');
require('./models/Assignment');
require('./models/Submission');
require('./models/Notification');

// =====================
// 🚏 Import Routes
// =====================
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const enrollmentRoutes = require('./routes/enrollments');
const assignmentRoutes = require('./routes/assignments');
const submissionRoutes = require('./routes/submissions');
const materialRoutes = require('./routes/materials');
const discussionRoutes = require('./routes/discussions');
const notificationRoutes = require('./routes/notifications');

// =====================
// 🔗 Use Routes
// =====================
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/notifications', notificationRoutes);

// =====================
// 🩺 Health Check
// =====================
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    status: '✅ OK',
    message: '🎓 Edu-Platform API is running successfully!',
    environment: process.env.NODE_ENV || 'development',
  });
});

// =====================
// ❌ Global Error Handler
// =====================
app.use((err, req, res, next) => {
  console.error('❌ Global Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// =====================
// 💾 MongoDB Connection
// =====================
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('❌ Missing MONGO_URI in .env file!');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// =====================
// 🚀 Start Server
// =====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
