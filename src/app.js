const express=require("express");
const app=express();

const PORT=3000;

app.use("/users",(rq,res,next)=>{
    console.log("first response");
    next();
    // this finds a res.send() function to send a response and if we send multiple response then it will run correctly 
    // i.e. response will be sent but server gets crashed 
},

(req,res,next)=>{
    console.log("second response");
    next();
},
(req,res,next)=>{
    console.log("third response");
    // next();  writing next here will throw an error here because we have not defined any next route handler
}
)

// app.get("/user",(req,res)=>{
//     res.send("user data");
// })

app.use("/dummy",(req,res)=>{
    res.send("Hello from the server");
})
app.listen(PORT,()=>{
    console.log(`Listening to port number : ${PORT}`)
});

