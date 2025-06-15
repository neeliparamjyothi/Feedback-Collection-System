const express = require('express');
const app = express();
const port = 3030;
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.json());
const ejsMate=require("ejs-mate");
app.engine("ejs",ejsMate);
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local").Strategy;
const Admin=require("./models/admin.js");
const Customer=require("./models/user.js");
const mongoose=require('mongoose');
const session=require('express-session');
app.use(express.urlencoded({extended:true}));
const adminRouter=require("./routes/admin.js");
const userRouter=require("./routes/user.js");
const formRouter=require("./routes/form.js");
const responseRouter=require("./routes/response.js");
let mongourl='mongodb://127.0.0.1:27017/feedbacksystem';
main()
   .then(()=>{
      console.log("connection successfull");
})
.catch(err => console.log(err));
async function main() {
    await mongoose.connect(mongourl);
}
const sessionOptions={
    secret: 'secretkey',
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use('admin-local',new LocalStrategy(Admin.authenticate()));
passport.use('customer-local',new LocalStrategy(Customer.authenticate()));

passport.serializeUser((user, done) => {
  const userType = user instanceof Admin ? 'Admin' : 'Customer';
  done(null, { id: user._id, type: userType });
});

passport.deserializeUser(async (key, done) => {
  try {
    if (key.type === 'Admin') {
      const user = await Admin.findById(key.id);
      done(null, user);
    } else {
      const user = await Customer.findById(key.id);
      done(null, user);
    }
  } catch (e) {
    done(e);
  }
});
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; // also important for login checks
     
    res.locals.isAdmin = req.user instanceof Admin;
    next();
});

app.get("/",(req,res)=>{
    res.render('./index.ejs');
})
app.get('/admin', (req, res) => {
  res.render('./admin/index.ejs');
});
app.get("/user",(req,res)=>{
    res.render('./user/index.ejs');
})
app.use("/",adminRouter);
app.use("/",userRouter);
app.use("/",formRouter);
app.use("/",responseRouter);
app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
})