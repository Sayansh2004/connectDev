const jwt=require("jsonwebtoken");
const User=require("../models/user.js");
const userAuth=async(req,res,next)=>{
    try{
        const {token}=req.cookies;
        
        if(!token){
            throw new Error("Invalid token");
        }

       const decodedObject=await jwt.verify(token,process.env.JWT_SECRET);

       const {_id}=decodedObject;


       const user=await User.findById(_id).select("-password");

       if(!user){
        throw new Error("User not found");
       }
    req.user=user;
       next();

    }catch(err){
        res.status(400).send("Error : "+err.message);
    }
       
}

module.exports={userAuth};