const express=require("express");
const {validateSignupData}=require("../utils/validation.js");
const validator=require("validator");
const bcrypt=require("bcrypt");
const User=require("../models/user.js");

const authRouter=express.Router();

authRouter.post("/signup",async(req,res)=>{
    try{ 
       
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

authRouter.post("/login",async(req,res)=>{
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
         
        const isPasswordValid=await user.validatePassword(password);

        if(isPasswordValid){
            
            const token=await user.getJWT();  
        // const token=await jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"1d"});

        res.cookie("token",token,{expires: new Date(Date.now() + 8 * 3600000)});
            res.status(200).json({success:true,message:"Login successful"});
        }else{
            throw new Error("password is not correct");
        }


    }catch(err){
        console.log(err.message);
        res.status(401).json({success:false,message:"Failed to login"});
    }
})


authRouter.post("/logout",(req,res)=>{
    res.clearCookie("token");
    res.status(200).json({success:true,message:"Logged out successfully"});
})

module.exports=authRouter;