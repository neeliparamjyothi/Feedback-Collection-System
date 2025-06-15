const Response=require("../models/response.js");
const Form=require("../models/form.js");

module.exports.getFeedback=async (req, res) => {
   const form = await Form.findById(req.params.id);
  res.render('./feedback.ejs', { form });
};
module.exports.postFeedback=async (req, res) => {
  const { answers } = req.body;
  const response = new Response({ form: req.params.id, answers });
  await response.save();
  req.flash("success","Thanks for giving feedback!")
  res.redirect('/forms');
};