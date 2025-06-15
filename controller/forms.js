const Form=require("../models/form.js");
const Response=require("../models/response.js");
const Admin=require("../models/admin.js");
const { Parser } = require('json2csv');

module.exports.forms=async(req,res)=>{
    const Forms=await Form.find({});
    const isAdmin = req.user instanceof Admin;
    res.render("./index.ejs",{Forms,isAdmin});
}
module.exports.results= async (req, res) => { 
    const form = await Form.findById(req.params.id);

  if (!form) {
    req.flash("error", "Feedback form not found.");
    return res.redirect("/forms"); // or render an error page
  }

  const responses = await Response.find({ form: req.params.id });

  const ratings = Array(form.questions.length).fill(0);
  let commentList = [];
  let count = 0;

  responses.forEach(r => {
    form.questions.forEach((q, i) => {
      if (q.type === 'rating') {
        ratings[i] += parseInt(r.answers[i]) || 0;
      } else if (q.type === 'comment') {
        commentList.push(r.answers[i]);
      }
    });
    count++;
  });

  const avgRatings = ratings.map(total => (count > 0 ? total / count : 0));
  const chartData = {
    labels: form.questions.filter(q => q.type === 'rating').map(q => q.text),
    datasets: [{
      label: 'Average Ratings',
      data: avgRatings,
      backgroundColor: 'rgba(75, 192, 192, 0.6)'
    }]
  };
    res.render("./results.ejs",{ form, chartData, commentList})
};
module.exports.export=async (req, res) => {
  try {
    const responses = await Response.find({ form: req.params.id }).lean();
    
    if (!responses || responses.length === 0) {
      req.flash("error","No responses found to export");
      return res.redirect("/forms");
    }

    const csvData = responses.map((r, index) => {
      const answerObj = {};
      r.answers.forEach((ans, i) => {
        answerObj[`Answer ${i + 1}`] = ans;
      });
      return {
        ID:index+1,
        ...answerObj,
        SubmittedAt: new Date(r.createdAt).toLocaleString()
      };
    });

    const { Parser } = require('json2csv');
    const parser = new Parser();
    const csv = parser.parse(csvData);

    res.header('Content-Type', 'text/csv');
    res.attachment(`feedback_${req.params.id}.csv`);
    res.send(csv);
    req.flash("success","Feedback Exported");
  } catch (err) {
    console.error("CSV export error:", err);
    res.status(500).send("Error generating CSV.");
  }
}
module.exports.newForm=async(req, res) => {
  res.render('./form.ejs');
};

module.exports.postForm=async(req, res) => {
  const { title, questions } = req.body;
  const form = new Form({ title, questions });
  form.author=req.user._id;
  await form.save();
  req.flash("success","form saved successfully")
  res.redirect("/forms");
};
module.exports.deleteForm=async(req,res)=>{
    let {id}=req.params;
    let form=await Form.findByIdAndDelete(id);
    req.flash("success","form deleted successfully")
    res.redirect("/forms");
}