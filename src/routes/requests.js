const express=require("express");;

const requestRouter=express.Router();

const User=require("../models/user.js");
const {userAuth}=require("../middlewares/auth.js");
const ConnectionRequest=require("../models/connectionRequest.js");

requestRouter.post("/request/send/:status/:touserId",userAuth,async(req,res)=>{
    try{
        // Now since I have used MW therefore this API is secured and only verified user can send connection request.
        // and not only this I can also get the user since I have attatched that in MW.
       const user=req.user;
       const fromUserId=user._id;
       const toUserId=req.params.touserId;
       const status=req.params.status;


       const allowedStatus=["ignored","interested"];

       if(!allowedStatus.includes(status)){
        return res.status(400).json({success:false,message:"Invalid status type : "+status});
       }


        const toUser=await User.findById(toUserId);
        if(!toUser){
            throw new Error("user does not exists");
        }

    //    check if there is an existing ConnectionRequest

    const existingConnectionRequest=await ConnectionRequest.findOne({
        $or:[
            {fromUserId,toUserId},
            {fromUserId:toUserId,toUserId:fromUserId}
        ]
    })

    if(existingConnectionRequest){
        throw new Error("connection request status is already pending");
    }

       if(toUserId!=fromUserId){
        const connectionRequest= new ConnectionRequest({
        fromUserId,
        toUserId,
        status
       })

       const data=await connectionRequest.save();

       res.status(200).json({success:true,message:req.user.firstName+ " is "+ status+ " in "+toUser.firstName,
        data});
       }else{

        throw new Error("You cannot send request to yourself");
       }
       

    }catch(err){
        res.status(400).send("Some error occured : "+err.message);
    }
});

requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
    try{
        
        const {status,requestId}=req.params;
        const allowedStatus=["accepted","rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({success:false,message:"Invalid status type"});
        }

        // const toUser=await User.findById(requestId);
        // if(!toUser){
        //     return res.status(400).json({success:false,message:"No such user exists"});
        // } 

        // this is wrong because the request id is the id of document here not any user's id.
        const loggedInUser=req.user;

        const connectionRequest=await ConnectionRequest.findOne({
            _id:requestId,
             toUserId:loggedInUser._id,
             status:"interested"
        })

        if(!connectionRequest){
            return  res.status(400).json({success:false,message:"Connection request not found"});
        }

        connectionRequest.status=status;

        const data=await connectionRequest.save();

        return res.status(200).json({success:true,message:"connection request : "+status,data});

    }catch(err){
        return res.status(400).json({success:false,message:err.message});
    }
})


module.exports=requestRouter;