const express=require("express");

const profileRouter=express.Router()
const {userAuth}=require("../middlewares/auth.js");


profileRouter.get("/profile",userAuth,async(req,res)=>{
      try{
        const user=req.user;     // this user is coming since I have attached the user already by MW.
        res.send(user);

      }catch(err){
        res.status(400).send("Error occured : "+err.message);
      }
})


module.exports=profileRouter;