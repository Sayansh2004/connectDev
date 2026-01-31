// src/app.js
const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const dotenv=require("dotenv");
dotenv.config(); // Load env variables first
const express = require("express");
const connectDb = require("./config/db.js"); // Import the function
const User=require("./models/user.js");

const app = express();
const PORT = 3000;

// Connect to Database (This is the ONLY place this should run)
connectDb();
app.use(express.json());
app.post("/users/signup",async(req,res)=>{
    const user=new User(req.body);
    try{ 
        await user.save();
        res.send("user signup successful");

    }catch(err){
        res.status(400).send("Some error occured while saving the data to database",err.message);
    }

});

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