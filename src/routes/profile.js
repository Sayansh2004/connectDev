const express=require("express");
const User=require("../models/user.js");
const profileRouter=express.Router()
const {userAuth}=require("../middlewares/auth.js");
const {validateEditProfileData}=require("../utils/validation.js");


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

    res.status(200).send(`${loggedinUser.firstName} , your profile edited successfully`);

    await loggedinUser.save();
  
  }catch(err){
    res.status(400).send("Error occured while editing the profile  : "+err.message);
  }
})


module.exports=profileRouter;