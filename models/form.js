const mongoose = require('mongoose');
const User=require("./admin.js");
const formSchema = new mongoose.Schema({
  title: String,
  questions: [
    {
      text: String,
      type: { type: String, enum: ['rating', 'comment'], required: true }
    }
  ],
  author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
});

module.exports=mongoose.model("Form",formSchema);