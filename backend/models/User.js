const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  codeforces: { type: String },
  codechef: { type: String },
  leetcode: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);