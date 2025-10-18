const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Notification = require('../models/Notification');

const storage = multer.diskStorage({
  destination:function(req,file,cb){ cb(null,'uploads/');},
  filename:function(req,file,cb){ cb(null,Date.now() + '_' + file.originalname); }
});
const upload = multer({storage});

router.post('/:assignmentId', auth, upload.single('file'), async (req,res)=>{
  const assignment = await Assignment.findById(req.params.assignmentId);
  if(!assignment) return res.status(404).json({error:'Assignment not found'});
  // ensure student enrolled
  const enrolled = await Enrollment.findOne({course:assignment.course, student:req.user._id});
  if(!enrolled && req.user.role!=='Teacher') return res.status(403).json({error:'Not enrolled'});
  const sub = new Submission({
    assignment:assignment._id,
    student:req.user._id,
    filename:req.file ? req.file.filename : null,
    originalName:req.file ? req.file.originalname : null,
    content: req.body.content || ''
  });
  await sub.save();
  // notification for teacher (simple)
  const course = await Course.findById(assignment.course);
  const note = new Notification({user:course.teacher, message:`New submission for ${assignment.title}`});
  await note.save();
  res.json(sub);
});

// Grade a submission
router.post('/:id/grade', auth, async (req,res)=>{
  const sub = await Submission.findById(req.params.id).populate({path:'assignment',populate:{path:'course'}});
  if(!sub) return res.status(404).json({error:'Not found'});
  const course = sub.assignment.course;
  if(String(course.teacher) !== String(req.user._id)) return res.status(403).json({error:'Only teacher'});
  const {grade,feedback} = req.body;
  sub.grade = grade;
  sub.feedback = feedback;
  await sub.save();
  // notify student
  const Notification = require('../models/Notification');
  const note = new Notification({user:sub.student, message:`Your submission for ${sub.assignment.title} was graded: ${grade}`});
  await note.save();
  res.json(sub);
});

// student: list own submissions
router.get('/mine', auth, async (req,res)=>{
  const subs = await Submission.find({student:req.user._id}).populate('assignment');
  res.json(subs);
});

module.exports = router;
