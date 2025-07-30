const mongoose = require('mongoose');

const ProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  platform: { type: String, required: true },
  difficulty: { type: String },
  status: { type: String },
  link: { type: String },
  tags: { type: String },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Problem', ProblemSchema); 