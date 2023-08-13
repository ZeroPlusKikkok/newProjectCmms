const mongoose = require('mongoose');

const { model, Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema({
  username: String,
  email: String,
  firstName: String,
  lastName: String,
  passwordReset: { type: String, select: false }
},{
  timestamps: true
});

User.plugin(passportLocalMongoose);

module.exports = model('User', User);