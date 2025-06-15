const mongoose = require('mongoose');
const Form=require("./form.js");

const responseSchema = new mongoose.Schema({
  form: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'Form' },
  answers: [String],
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Response', responseSchema);