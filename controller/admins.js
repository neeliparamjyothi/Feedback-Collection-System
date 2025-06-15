const Admin=require("../models/admin.js");

module.exports.signUp=async(req,res)=>{
    res.render('admin/signup.ejs');
}
module.exports.postSignup=async(req,res)=>{
     try{
            let {username,email,password}=req.body;
            const newUser=new Admin({username,email});
            const registeredUser=await Admin.register(newUser,password);
            req.login(registeredUser,(err)=>{
                if(err){
                    return next(err);
                }
                req.flash("success","Signed as admin successfully");
                res.redirect("/forms");
            })
            }
            catch(e){
                res.redirect("/forms");
            }
}
module.exports.login=async(req,res)=>{
    res.render('admin/login.ejs');
}
module.exports.postLogin=async(req,res)=>{
     req.flash("success","Welcome back to feedbacksystem!");
    let redirectUrl=res.locals.redirectUrl || "/forms";
    res.redirect(redirectUrl);
}
module.exports.logout=(req,res,next)=>{
     req.logout((err)=>{
            if(err){
               return next(err);
            }
            req.flash("success","you are logged out now");
            res.redirect("/forms");
        })
}