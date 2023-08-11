const mongoose = require('mongoose');

const { model, Schema } = mongoose;

const Todo = new Schema({
  username: String,
  reminder: String,
  completed: Boolean,
});

module.exports = model('Todo', Todo);