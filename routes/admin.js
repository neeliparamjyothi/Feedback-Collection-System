const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const adminController=require("../controller/admins.js");

router.route("/admin/signup")
.get(adminController.signUp);
router.route("/admin/signup")
.post(wrapAsync(adminController.postSignup));

router.route("/admin/login")
.get(adminController.login);
router.route("/admin/login")
.post(
     saveRedirectUrl,
        passport.authenticate("admin-local",
        {
        failureRedirect:'/admin/login',
        failureFlash:true}),adminController.postLogin);

router.route("/admin/logout")
.get(adminController.logout);
module.exports=router;