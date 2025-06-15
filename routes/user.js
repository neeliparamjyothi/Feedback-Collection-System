const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../controller/users.js");

router.route("/user/signup")
.get(userController.signUp);
router.route("/user/signup")
.post(wrapAsync(userController.postSignup));

router.route("/user/login")
.get(userController.login);
router.route("/user/login")
.post(
     saveRedirectUrl,
        passport.authenticate("customer-local",
        {
        failureRedirect:'/user/login',
        failureFlash:true}),userController.postLogin);

router.route("/user/logout")
.get(userController.logout);
module.exports=router;