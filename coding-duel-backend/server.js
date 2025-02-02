import express from "express";
import http from "http";
import {Server} from "socket.io";
import cors from "cors";


const app = express();

const PORT = 5000;

const server = http.createServer(app);

app.use(cors());
const io = new Server(server,{
    cors: {origin:"*",methods:["GET","POST"]},
});
const queue = [];

io.on("connection",(socket)=>{
    console.log(`User connected: ${socket.id}`);

    socket.on("join_queue",()=>{
        console.log(`User ${socket.id} joined the queue.`);
        queue.push(socket);

        if(queue.length>=2){
            const player1 = queue.shift();
            const player2 = queue.shift();

            const room = `match_${player1.id}_${player2.id}`;

            player1.join(room);
            player2.join(room);

            io.to(room).emit("match_found", { room, player1: player1.id, player2: player2.id });
            console.log(`Match started: ${player1.id} vs ${player2.id} in room ${room}`);
        }
        else{
            console.log("Not enough players");
        }
    });

    socket.on("disconnect",()=>{
        console.log(`User disconnected: ${socket.id}`);
        const index = queue.indexOf(socket);
        if (index !== -1) {
            queue.splice(index, 1);
          }
    });
});
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
