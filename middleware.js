const Form=require("./models/form.js");
module.exports.isuserLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to submit feedback");
         return res.redirect("/user/login");
    }
    next();
}
module.exports.isadminLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to create form");
         return res.redirect("/admin/login");
    }
    next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}
module.exports.isformauthor=async(req,res,next)=>{
    let form=await Form.findById(req.params.id);
    if (!res.locals.currUser || !form.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not author of this form..");
        return res.redirect("/forms");
    }
    next();
}
