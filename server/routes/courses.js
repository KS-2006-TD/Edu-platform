const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// Create course (teacher)
router.post('/', auth, async (req,res)=>{
  if(req.user.role !== 'Teacher') return res.status(403).json({error:'Only teachers'});
  const {title,description,duration} = req.body;
  const course = new Course({title,description,duration,teacher:req.user._id});
  await course.save();
  res.json(course);
});

// List all courses
router.get('/', async (req,res)=>{
  const courses = await Course.find().populate('teacher','name email');
  res.json(courses);
});

// Get course details including enrollments
router.get('/:id', async (req,res)=>{
  const course = await Course.findById(req.params.id).populate('teacher','name email');
  if(!course) return res.status(404).json({error:'Not found'});
  const enrollments = await Enrollment.find({course:course._id}).populate('student','name email');
  res.json({course,enrollments});
});

module.exports = router;
