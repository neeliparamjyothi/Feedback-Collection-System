
const express = require('express');
const router = express.Router();
const Form = require('../models/form.js');
const wrapAsync=require("../utils/wrapAsync.js");
const formController=require("../controller/forms.js");
const responseController=require("../controller/responses.js");
const {isadminLoggedIn,isformauthor}=require("../middleware.js");
const { Parser } = require('json2csv');
router.route("/forms")
.get(formController.forms)

router.route('/admin/forms/new')
.get(isadminLoggedIn,formController.newForm);

router.route('/admin/forms')
.post(wrapAsync(formController.postForm))

router.route('/form/:id/results')
.get(formController.results);
// Export to CSV
router.route('/results/:id/export') 
.get(formController.export);


router.route("/form/:id/delete")
.get(isadminLoggedIn,isformauthor,formController.deleteForm);
module.exports = router;
