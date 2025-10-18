const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req,res)=>{
  const {name,email,password,role} = req.body;
  if(!name||!email||!password||!role) return res.status(400).json({error:'Missing fields'});
  try{
    let user = await User.findOne({email});
    if(user) return res.status(400).json({error:'Email exists'});
    const hashed = await bcrypt.hash(password,10);
    user = new User({name,email,password:hashed,role});
    await user.save();
    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET || 'secretkey', {expiresIn:'7d'});
    res.json({token, user:{id:user._id,name:user.name,email:user.email,role:user.role}});
  }catch(e){res.status(500).json({error:e.message});}
});

// Login
router.post('/login', async (req,res)=>{
  const {email,password} = req.body;
  if(!email||!password) return res.status(400).json({error:'Missing'});
  try{
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({error:'Invalid'});
    const ok = await bcrypt.compare(password, user.password);
    if(!ok) return res.status(400).json({error:'Invalid'});
    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET || 'secretkey', {expiresIn:'7d'});
    res.json({token, user:{id:user._id,name:user.name,email:user.email,role:user.role}});
  }catch(e){res.status(500).json({error:e.message});}
});

module.exports = router;
