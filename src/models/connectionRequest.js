const mongoose=require("mongoose");

const connectionRequestSchema=new mongoose.Schema({

    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User", // reference to user collection
        required:true
    },
    toUserId:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"User",
          required:true
    },
    status:{
        type:String,
        enum:{
            values:["ignore","interested","accepted","rejected"],
            message:"{VALUE} is incorrect action type"
        },
        required:true
    }
         
       

},{timestamps:true})

//creating a compound index such that search operation becomes faster when DB is scaled
connectionRequestSchema.index({fromUserId:1},{toUserId:1})

// connectionRequestSchema.pre("save",function(){  // this function does not meant to be an arrow function
//     const connectionRequest=this;

//     check if from fromUserId is same as toUserId

//     if(connectionRequest.fromUserId.equal  s(mongoose.connectionRequest.toUserId)){
//         throw new Error("cannot send connection request to yourself");
//     }

//     next();

// })

// we can add this validation in app.js that which i have implemented even

const ConnectionRequestModel=mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports=ConnectionRequestModel;