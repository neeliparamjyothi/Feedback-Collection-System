const express = require('express');
const router = express.Router();
const Form = require('../models/form.js');
const wrapAsync=require("../utils/wrapAsync.js");
const responseController=require("../controller/responses.js");
const {isuserLoggedIn,}=require("../middleware.js");
router.route('/feedback/:id')
.get(isuserLoggedIn,responseController.getFeedback)
router.route('/feedback/:id')
.post(isuserLoggedIn,wrapAsync(responseController.postFeedback))

module.exports = router;
