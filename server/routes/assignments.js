const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const Submission = require('../models/Submission');

/**
 * @route   POST /api/assignments
 * @desc    Create a new assignment (only for the course teacher)
 * @access  Private (Teacher)
 */
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Teacher') {
      return res.status(403).json({ error: 'Access denied. Teachers only.' });
    }

    const { courseId, title, description, dueDate } = req.body;

    if (!courseId || !title) {
      return res.status(400).json({ error: 'Course ID and title are required.' });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found.' });

    if (String(course.teacher) !== String(req.user._id)) {
      return res.status(403).json({ error: 'You are not the teacher of this course.' });
    }

    const assignment = new Assignment({
      course: courseId,
      title,
      description,
      dueDate,
    });

    await assignment.save();
    res.status(201).json({
      message: 'Assignment created successfully.',
      assignment,
    });
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ error: 'Server error while creating assignment.' });
  }
});

/**
 * @route   GET /api/assignments/course/:courseId
 * @desc    Get all assignments for a specific course
 * @access  Private (Student or Teacher)
 */
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId })
      .sort({ createdAt: -1 });

    res.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ error: 'Server error while fetching assignments.' });
  }
});

/**
 * @route   GET /api/assignments/:id/submissions
 * @desc    Get all submissions for a specific assignment (teacher only)
 * @access  Private (Teacher)
 */
router.get('/:id/submissions', auth, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate('course');
    if (!assignment) return res.status(404).json({ error: 'Assignment not found.' });

    if (
      req.user.role !== 'Teacher' ||
      String(assignment.course.teacher) !== String(req.user._id)
    ) {
      return res.status(403).json({ error: 'Access denied. Only the course teacher can view submissions.' });
    }

    const submissions = await Submission.find({ assignment: assignment._id })
      .populate('student', 'name email');

    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Server error while fetching submissions.' });
  }
});

module.exports = router;
