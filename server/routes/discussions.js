const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Discussion = require('../models/Discussion');

router.post('/:courseId', auth, async (req,res)=>{
  const {message} = req.body;
  const d = new Discussion({course:req.params.courseId, user:req.user._id, message});
  await d.save();
  res.json(d);
});

router.get('/:courseId', auth, async (req,res)=>{
  const list = await Discussion.find({course:req.params.courseId}).populate('user','name email');
  res.json(list);
});

module.exports = router;
