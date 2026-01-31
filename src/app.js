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

app.get("/feed",(req,res)=>{
    
})

app.listen(PORT, () => {
    console.log(`Listening to port number : ${PORT}`)
});