// src/app.js
const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const dotenv=require("dotenv");
dotenv.config(); // Load env variables first
const express = require("express");
const connectDb = require("./config/db.js"); // Import the function
const User=require("./models/user.js");
const {validateSignupData}=require("./utils/validation.js");
const bcrypt=require("bcrypt");
const app = express();
const PORT = 3000;
const cookieParser=require("cookie-parser");
const jwt=require("jsonwebtoken");
const validator=require("validator");

// Connect to Database (This is the ONLY place this should run)
connectDb();
app.use(express.json());
app.use(cookieParser());
app.post("/signup",async(req,res)=>{
    try{ 
        //validating the data

        validateSignupData(req);

        // Hashing the password
        const {firstName,lastName,emailId,password}=req.body;

        const hashedPassword=await bcrypt.hash(password,10);

        const user=new User({
            firstName,
            lastName,
            emailId,
            password:hashedPassword
        });
        await user.save();
        res.send("user signup successful");

    }catch(err){
        res.status(400).send("Some error occured while saving the data to database : "+err.message);
    }

});

app.post("/login",async(req,res)=>{
    try{
        const {emailId,password}=req.body;

        if(!validator.isEmail(emailId)){
            throw new Error("Please enter a valid email");
        }
        if(!password){
            throw new Error("No password is provided");
        }
     
         const user=await User.findOne({emailId});
         if(!user){
            throw new Error("Invalid credentials");
         }
         
        const isPasswordValid=await bcrypt.compare(password,user.password);

        if(isPasswordValid){
            
        const token=await jwt.sign({_id:user._id},process.env.JWT_SECRET);

        res.cookie("token",token);
            res.status(200).send("Login successful");
        }else{
            throw new Error("password is not correct");
        }


    }catch(err){
        res.status(401).send("Failed to login : "+err.message);
    }
})

app.get("/profile",async(req,res)=>{
      try{
        const cookies=req.cookies;
        const {token}=cookies;
        
        if(!token){
            throw new Error("Invalid token");
        }

        const decodedMessage=await jwt.verify(token,process.env.JWT_SECRET);

        const {_id}=decodedMessage;
        const user=await User.findById(_id);
        if(!user){
            throw new Error("User not found");
        }
        res.send("cookie read successfully");

      }catch(err){
        res.status(400).send("Error occured : "+err.message);
      }
})


app.get("/feed",async(req,res)=>{
    try{
          const users=await User.find({});
          res.status(200).send(users);
    }catch(err){
        res.status(404).send("users not found"+err);
    }
})

app.patch("/user/:userId",async(req,res)=>{
   
    try{
         const userId=req.params?.userId;
    const data=req.body;
    const allowed_updates=["photourl","about","gender","age","skills"];

    const isUpdateAllowed=Object.keys(data).every((k)=>allowed_updates.includes(k));

    if(!isUpdateAllowed){
        throw new Error ("update not allowed")
    }
    if(data?.skills.length>10){
        throw new Error("Skills cannot be more than 10");
    }
     const user =await User.findByIdAndUpdate({_id:userId},data,{runValidators:true});
     res.send("user updated Successfully");
    }catch(err){
        res.status(400).send("Update failed : "+err.message);
    }
})

app.listen(PORT, () => {
    console.log(`Listening to port number : ${PORT}`)
});