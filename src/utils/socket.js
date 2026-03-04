const socket=require("socket.io");

const initialiseSocket=(server)=>{
    const io=socket(server,{
        cors:{
            origin:"http://localhost:5173",
            credentials:"true"
        }
    });

    io.on("connection",(socket)=>{
        // event handling
        
        socket.on("joinChat",({targetUserId,userId})=>{
            const room=[targetUserId,userId].sort().join("_");
            socket.join(room);
            console.log("joined room : "+ room);

        });
        socket.on("sendMessage",({firstName,userId,targetUserId,newMessage})=>{
            const roomId=[userId,targetUserId].sort().join("_");
            console.log(firstName+ " "+ newMessage);
            io.to(roomId).emit("messageRecieved",{firstName,newMessage});
        });
        socket.on("disconnect",()=>{});
    })
}

module.exports=initialiseSocket;