const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const Course = require('../models/Course');

const storage = multer.diskStorage({
  destination:function(req,file,cb){ cb(null,'uploads/');},
  filename:function(req,file,cb){ cb(null,Date.now() + '_' + file.originalname); }
});
const upload = multer({storage});

router.post('/:courseId', auth, upload.single('file'), async (req,res)=>{
  const course = await Course.findById(req.params.courseId);
  if(!course) return res.status(404).json({error:'Course not found'});
  if(String(course.teacher)!==String(req.user._id)) return res.status(403).json({error:'Only teacher'});
  const file = {filename:req.file.filename, originalName:req.file.originalname, url:`/uploads/${req.file.filename}`};
  course.materials.push(file);
  await course.save();
  res.json(course);
});

module.exports = router;
