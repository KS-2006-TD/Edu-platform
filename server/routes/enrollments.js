const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

/**
 * @desc Enroll a student into a course
 * @route POST /api/enrollments/:courseId
 * @access Student only
 */
router.post('/:courseId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Student') {
      return res.status(403).json({ message: 'Only students can enroll in courses' });
    }

    const { courseId } = req.params;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const existing = await Enrollment.findOne({
      course: courseId,
      student: req.user._id
    });
    if (existing) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Create enrollment
    const enrollment = new Enrollment({
      course: courseId,
      student: req.user._id
    });
    await enrollment.save();

    // Optional: update enrolled count in Course (if your Course model tracks this)
    // await Course.findByIdAndUpdate(courseId, { $inc: { enrolledCount: 1 } });

    res.status(201).json({
      message: 'Enrolled successfully',
      enrollment
    });
  } catch (err) {
    console.error('Enroll Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @desc Get all courses a student is enrolled in
 * @route GET /api/enrollments/mine
 * @access Student only
 */
router.get('/mine', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Student') {
      return res.status(403).json({ message: 'Only students can view enrolled courses' });
    }

    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({
        path: 'course',
        populate: { path: 'teacher', select: 'name' }
      });

    res.json(enrollments);
  } catch (err) {
    console.error('Fetch Enrolled Courses Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @desc Get all students enrolled in a specific course
 * @route GET /api/enrollments/course/:courseId
 * @access Teacher only (must own the course)
 */
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Only the teacher of this course (or admin, if you add that role) can view
    if (String(course.teacher) !== String(req.user._id) && req.user.role !== 'Teacher') {
      return res.status(403).json({ message: 'Not authorized to view this course’s enrollments' });
    }

    const enrollments = await Enrollment.find({ course: courseId })
      .populate('student', 'name email');

    res.json(enrollments);
  } catch (err) {
    console.error('Fetch Course Students Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
