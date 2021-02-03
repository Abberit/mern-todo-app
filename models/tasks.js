const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema for tasks
const TasksSchema = new Schema({
  action: {
    type: String,
    required: [true, 'The action text field is required'],
  }
})

//create model for tasks
const Tasks = mongoose.model('tasks', TasksSchema);

module.exports = Tasks;