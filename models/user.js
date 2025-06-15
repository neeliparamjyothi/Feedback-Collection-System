const mongoose=require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose");

const customerSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    }
})
customerSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("Customer",customerSchema);