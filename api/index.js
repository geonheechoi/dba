const express =require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();
const port =3000;
const cors=require('cors');

app.use(cors());

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const jwt = require('jsonwebtoken');

mongoose.connect("mongodb+srv://geonheechoi:geonheechoi@cluster0.7ck5gen.mongodb.net/").then(()=>{

    console.log("connected to mongoDB");
}).catch((e)=>{
    console.log("error while connecting to mongoDB");
})

app.listen(port,()=>{
    console.log("server is running on port "+port);
})

//end point for user registration

app.post('/register',async(req,res)=>{
    try{
        const {name,email,password} = req.body;

        //check if email alewady exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }

        //create a new user
        const newUser =new User({
            name,
            email,
            password
        })

        newUser.vertificationToken = crypto.randomBytes(64).toString('hex');

        await newUser.save();

        sendVertificationEmail(newUser.email,newUser.vertificationToken)

    }catch(e){
        console.log(e,"error while registering new user");
        res.status(500).json({message:"Registration failed"});
    }


})

const sendVertificationEmail = async (email,vertificationToken)=>{
    const transpoter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:"fear5579@gmail.com",
            pass:"cfymoqzpvekoeaic",
        }
    })

    const mailOptions = {
        from:"matchmake.com",
        to:email,
        subject:"Email vertification",
        text:`Please click on the link below to vertify your email : http://192.168.219.102:3000/vertify-email/${vertificationToken}`

   };
   try{
    await transpoter.sendMail(mailOptions);
   }catch(e){
    console.log("error to send vertification email")
   }
   

};


//verify the user
app.get("/verify/:token", async (req, res) => {
    try {
      const token = req.params.token;
  
      const user = await User.findOne({ verificationToken: token });
      if (!user) {
        return res.status(404).json({ message: "Invalid verification token" });
      }
  
      //mark the user as verified
      user.verified = true;
      user.verificationToken = undefined;
  
      await user.save();
  
      res.status(200).json({ message: "Email verified Sucesfully" });
    } catch (error) {
      console.log("errror", error);
      res.status(500).json({ message: "Email verification failed" });
    }
  });
