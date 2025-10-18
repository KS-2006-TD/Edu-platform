const mongoose = require('mongoose');
const DiscussionSchema = new mongoose.Schema({
  course:{type:mongoose.Schema.Types.ObjectId, ref:'Course'},
  user:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
  message:String,
  createdAt:{type:Date, default:Date.now}
});
module.exports = mongoose.model('Discussion', DiscussionSchema);
