const express =require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();
const port =3000;
const cors=require('cors');
const http = require("http").createServer(app);
const io = require("socket.io")(http);
app.use(cors());

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


const jwt = require("jsonwebtoken");
const User = require("./models/user");
const Chat = require("./models/message");
mongoose.connect("mongodb+srv://geonheechoi:geonheechoi@cluster0.7ck5gen.mongodb.net/").then(()=>{

    console.log("connected to mongoDB");
}).catch((e)=>{
    console.log("error while connecting to mongoDB");
})

app.listen(port,()=>{
    console.log("server is running on port "+port);
})


//endpoint to register a user to the backend
app.post("/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      //check if the email is already registered
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log("Email already registered");
        return res.status(400).json({ message: "Email already registered" });
      }
  
      //create a new User
      const newUser = new User({
        name,
        email,
        password,
      });
  
      //generate the verification token
      newUser.verificationToken = crypto.randomBytes(20).toString("hex");
  
      //save the user to the database
      await newUser.save();
  
      //send the verification email to the registered user
      sendVerificationEmail(newUser.email, newUser.verificationToken);
  
      res
        .status(200)
        .json({ message: "User registered successfully", userId: newUser._id });
    } catch (error) {
      console.log("Error registering user", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

const sendVerificationEmail = async (email,verificationToken)=>{
    const transpoter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:"fear5579@gmail.com",
            pass:"cfymoqzpvekoeaic",
        }
    })

    const mailOptions = {
        from:"matchmake.com",
        to: email,
        subject:"Email vertification",
        text:`Please click on the link below to vertify your email : http://:3000/vertify/${verificationToken}`

   };
   try{
    await transpoter.sendMail(mailOptions);
    console.log("email sent successfully")
   }catch(e){
    console.log("error to send vertification email")
   }
   

};


//verify the user
app.get("/vertify/:token", async (req, res) => {
    try {
      const token = req.params.token;
      console.log(token);
  
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

const generateSecretKey = () => {
    const secretKey= crypto.randomBytes(64).toString("hex");

    return secretKey
  };

const secretKey = generateSecretKey();

//end point to login a user
app.post("/login", async (req, res) =>{

  try{

    const {email,password} = req.body;
    const user = await User.findOne({ email});
    if(!user){
      return res.status(404).json({message:"Invalid email or password"});
    }
    if (user.password!==password){
        return res.status(401).json({ message: "Invalid password" });
    }
    
    const token = jwt.sign({ userId: user._id }, secretKey);
    res.status(200).json({token});
    
  } catch(error){
    res.status(500).json({message:"login failed"});
  }
})

app.put("/users/:userId/gender", async (req, res) =>{

    try{
        const {userId} = req.params;
        const {gender} = req.body;
        
        const user = await User.findByIdAndUpdate(
            userId,
            {gender:gender},
            {new:true}
        );
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        return res.status(200).json({message:"User gender updated successfully"});
    }catch(error){
        res.status(500).json({message:"Errpr updating user",error});

    }
});

//endpoint to update user descrtiption

app.put("/users/:userId/description", async (req, res) => {
  try {
    const { userId } = req.params;
    const { description } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { description: description },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User description updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
});


//fetch users data
app.get("/users/:userId",async (req, res) =>{
  try{
    const { userId } = req.params;

    const user =await User.findById(userId);
    if(!user){
      return res.status(500).json({message:"User not found"});
    }

    return res.status(200).json({user});
  }catch(error){
    res.status(500).json({message:"Error fetching user details"})
  }
})



//endpoint to add turnon for a user in the hackedn
// Endpoint to add a turn-on for a user in the hackedn
app.put("/users/:userId/turn-ons/add", async (req, res) => {
  try {
    const { userId } = req.params;
    const { turnOn } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { turnOns: turnOn } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Turn-on added successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Error adding turn-on" });
  }
});

// Endpoint to remove a turn-on for a user in the backend
// Endpoint to remove a turn-on for a user in the hackedn
app.put("/users/:userId/turn-ons/remove", async (req, res) => {
  try {
    const { userId } = req.params;
    const { turnOn } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { turnOns: turnOn } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Turn-on removed successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Error removing turn-on", error: error.message });
  }
});

  
app.put("/users/:userId/looking-for", async (req, res) => {
  try
  {

   const {userId} =req.params;
   const {lookingFor} = req.body;
   const user = await User.findByIdAndUpdate(
    userId,
    {
      $addToSet:{lookingFor:lookingFor},
    },
    {new:true}
   );
   if(!user){
    return res.status(404).json({message:"User not found"});
   }

   return res.status(200).json({message:"looking for updated successfully".user});
  } catch (error) {
    return res.status(500).json({ message: "Error updating user", error });
  }
});


app.put("/users/:userId/looking-for/remove", async (req, res) => {
  try
  {

   
   
   const {userId} =req.params;
   const {lookingFor} = req.body;
   const user = await User.findByIdAndUpdate(
    userId,
    {
      $pull:{lookingFor:lookingFor},
    },
    {new:true}
   );
   if(!user){
    return res.status(404).json({message:"User not found"});
   }
   return res.status(200).json({message:"looking for updated successfully".user});
  } catch (error) {
    return res.status(500).json({ message: "Error updating user", error });
  }
})

app.post("/users/:userId/profile-images",async (req, res) =>{

  try{
    const {userId} = req.params;
    const {imageUrl} = req.body;
    const user = await User.findById(userId);
    if(!user){
      return res.status(404).json({message:"User not found"});
    }
    user.profileImages.push(imageUrl);

    await user.save();

    return res.status(200).json({message:"Profile image added successfully",user});

  }catch(error){
    res.status(500).json({message:"Error adding profile image",error});

  }


})