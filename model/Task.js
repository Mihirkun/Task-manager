const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    reuired: [true, 'must have aname'],
    trim: true,
    maxlength: [20, 'name can not be more than 20 char'],
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

module.exports= mongoose.model('Task',TaskSchema)