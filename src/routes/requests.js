const express=require("express");;

const requestRouter=express.Router();

const {userAuth}=require("../middlewares/auth.js");

requestRouter.post("/sendConnectionRequest",userAuth,async(req,res)=>{
    try{
        // Now since I have used MW therefore this API is secured and only verified user can send connection request.
        // and not only this I can also get the user since I have attatched that in MW.
        console.log("sending conncetion request");

    }catch(err){
        res.status(400).send("Some error occured : "+err.message);
    }
})

module.exports=requestRouter;