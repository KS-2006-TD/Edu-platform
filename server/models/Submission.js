const mongoose = require('mongoose');
const SubmissionSchema = new mongoose.Schema({
  assignment:{type:mongoose.Schema.Types.ObjectId, ref:'Assignment'},
  student:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
  filename:String,
  originalName:String,
  content:String,
  grade:{type:Number, default:null},
  feedback:{type:String, default:''},
  submittedAt:{type:Date, default:Date.now}
});
module.exports = mongoose.model('Submission', SubmissionSchema);
