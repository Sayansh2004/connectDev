const express=require("express");
const userRouter=express.Router();
const ConnectionRequest=require("../models/connectionRequest.js");
const {userAuth}=require("../middlewares/auth.js");

userRouter.get("/user/requests/recieved",userAuth,async(req,res)=>{
    try{

        const loggedInUser=req.user;
        const connectionRequests=await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"pending"
        }).populate("fromUserId",["firstName","lastName","photoUrl","gender","about","skills"]); // we can pass on the array based on which we want to filter the information.



       return res.status(200).json({success:true,message:"pending requests fetched successfully"});

    }catch(err){
        return res.status(400).json({success:false,message:err.message});
    }
});

userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user;

        const trueConnections=await ConnectionRequest.find({
           $or:[
            {toUserId:loggedInUser._id,status:"accepted"},
            {fromUserId:loggedInUser._id,status:"accepted"}
           ]
        }).populate("fromUserId",["firstName","lastName","photoUrl","gender","about","skills"])
        .populate("toUserId",["firstName","lastName","photoUrl","gender","about","skills"])
        ;

        return res.status(200).json({success:true,trueConnections});

    }catch(err){
        return res.status(400).json({success:false,message:err.message});
    }
})

module.exports=userRouter;