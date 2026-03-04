const express=require("express");
const userRouter=express.Router();
const ConnectionRequest=require("../models/connectionRequest.js");
const {userAuth}=require("../middlewares/auth.js");
const User=require("../models/user.js");

userRouter.get("/user/requests/recieved",userAuth,async(req,res)=>{
    try{

        const loggedInUser=req.user;
        const connectionRequests=await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId",["firstName","lastName","photoUrl","gender","about","skills"]); // we can pass on the array based on which we want to filter the information.



       return res.status(200).json({success:true,message:"pending requests fetched successfully",requests:connectionRequests});

    }catch(err){
        return res.status(400).json({success:false,message:err.message});
    }
});

// userRouter.get("/user/connections",userAuth,async(req,res)=>{
//     try{
//         const loggedInUser=req.user;

//         const trueConnections=await ConnectionRequest.find({
//            $or:[
//             {toUserId:loggedInUser._id,status:"accepted"},
//             {fromUserId:loggedInUser._id,status:"accepted"}
//            ]
//         }).populate("fromUserId",["firstName","lastName","photoUrl","gender","about","skills"])
//         .populate("toUserId",["firstName","lastName","photoUrl","gender","about","skills"])
//         ;

//         return res.status(200).json({success:true,trueConnections});

//     }catch(err){
//         console.error(err.message);
//         return res.status(400).json({success:false,message:"failed to fetch connections"});
//     }
// });

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {

    const loggedInUser = req.user;

    const connections = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" }
      ]
    })
    .populate("fromUserId", ["firstName","lastName","photoUrl","gender","about","skills"])
    .populate("toUserId", ["firstName","lastName","photoUrl","gender","about","skills"]);

    const trueConnections = connections.map(conn => {

      if (conn.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return conn.toUserId;
      } else {
        return conn.fromUserId;
      }

    });

    return res.status(200).json({
      success: true,
      trueConnections
    });

  } catch (err) {
    console.error(err.message);
    return res.status(400).json({
      success: false,
      message: "failed to fetch connections"
    });
  }
});


userRouter.get("/user/feed",userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user;

        const page=parseInt(req.query.page) || 1;
        let limit=parseInt(req.query.limit)||10;
        limit=limit>50?50:limit;

         //connection request which is sent or recieved
        const allConncections=await ConnectionRequest.find({
          $or:[
            {toUserId:loggedInUser._id},
            {fromUserId:loggedInUser._id}
          ]


        }).select("fromUserId toUserId");

        const hiddenUsersFromFeed=new Set();

         hiddenUsersFromFeed.add(loggedInUser._id.toString());

        allConncections.forEach(req=>{
            hiddenUsersFromFeed.add(req.fromUserId.toString());
            hiddenUsersFromFeed.add(req.toUserId.toString());
        })

        const users=await User.find({
            $and:[
                {_id:{$nin:Array.from(hiddenUsersFromFeed)}},
                {_id:{$ne:loggedInUser._id}}
            ]
            
        }).select("-password -email").limit(limit).skip((page-1)*limit);

        return res.status(200).send({success:true,users});

    }catch(err){
        return res.status(400).json({success:false,message:err.message});
    }
})
module.exports=userRouter;