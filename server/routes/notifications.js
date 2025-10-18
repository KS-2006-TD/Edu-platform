const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');

router.get('/', auth, async (req,res)=>{
  const notes = await Notification.find({user:req.user._id}).sort({createdAt:-1});
  res.json(notes);
});

router.post('/:id/read', auth, async (req,res)=>{
  const n = await Notification.findById(req.params.id);
  if(!n) return res.status(404).json({error:'Not found'});
  n.read = true;
  await n.save();
  res.json(n);
});

module.exports = router;
