const express=require("express");
const User=require("../models/user.js");
const profileRouter=express.Router()
const {userAuth}=require("../middlewares/auth.js");
const {validateEditProfileData}=require("../utils/validation.js");
const bcrypt=require("bcrypt");
const validator=require("validator");


profileRouter.get("/profile/view",userAuth,async(req,res)=>{
      try{
        const user=req.user;     // this user is coming since I have attached the user already by MW.
        res.send(user);

      }catch(err){
        res.status(400).send("Error occured : "+err.message);
      }
})

profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
  try{
    
    if(!validateEditProfileData(req)){
      throw new Error("Invalid edit request");
    };

    const loggedinUser=req.user;

    Object.keys(req.body).forEach((key)=>(loggedinUser[key]=req.body[key]));

    await loggedinUser.save();

    res.status(200).json({success:true,message:`${loggedinUser.firstName} , your profile edited successfully`});
  
  }catch(err){
    console.error(err.message);
    res.status(400).json({success:false,message:"failed to update profile data"});
  }
})

profileRouter.patch("/profile/forgetpassword",async(req,res)=>{
  try{

     const {emailId}=req.body;

     const {newPassword}=req.body;
     const user=await User.findOne({emailId});

     if(!user){
      return res.status(400).send({success:false,message:"user does not exists"})
     }
     if(!validator.isStrongPassword(newPassword)){
       throw new Error("password is not strong enough");
     }
     
     const hashedPassword=await bcrypt.hash(newPassword,10);
    
     await User.findByIdAndUpdate(user._id,{password:hashedPassword});

     res.status(200).send({success:true,message:"password changed successfully"});

  }catch(err){
    res.status(400).json({success:false,message:err.message})
  }
})


module.exports=profileRouter;