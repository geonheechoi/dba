const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
   gender:{
    type:String,
    enum:["male", "female","other"],
   },
   vertified:{
       type:Boolean,
       default:false,
   },
   verificationToken: String,
   crushes:[{
       type:mongoose.Schema.Types.ObjectId,
       ref:"User",
   }],
  receivedLikes:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
   ],
   matches:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
   ],
    profileImages:
    {
        type:String,
    },
   description:{
    type:String,
   },
   trunOns:[
    {
    type:String,
    },
   ],
   lookingFor:
   [
   {
    type:String,
   },
],
});

const User =mongoose.model("User",userSchema);

module.exports = User;