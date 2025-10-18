const mongoose = require('mongoose');
const CourseSchema = new mongoose.Schema({
  title:String,
  description:String,
  duration:String,
  teacher:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
  materials:[{filename:String, originalName:String, url:String}],
  createdAt:{type:Date, default:Date.now}
});
module.exports = mongoose.model('Course', CourseSchema);
