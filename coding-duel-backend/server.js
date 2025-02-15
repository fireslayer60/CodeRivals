import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import pool from "./db.js"; // PostgreSQL connection
import { Console } from "console";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Adjust frontend URL
app.use(morgan("dev"));
app.use(cookieParser());

// ✅ Test Database Connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Database connected at:", res.rows[0].now);
  }
});

// ✅ Basic API Route
app.get("/", (req, res) => {
  res.send("Server is running with Socket.IO & PostgreSQL!");
});

// ✅ SOCKET.IO LOGIC
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

const queue = [];

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join_queue", () => {
    console.log(`User ${socket.id} joined the queue.`);
    queue.push(socket);

    if (queue.length >= 2) {
      const player1 = queue.shift();
      const player2 = queue.shift();

      const room = `match_${player1.id}_${player2.id}`;
      player1.join(room);
      player2.join(room);

      io.to(room).emit("match_found", {
        room,
        player1: player1.id,
        player2: player2.id,
      });
      console.log(
        `Match started: ${player1.id} vs ${player2.id} in room ${room}`
      );
    } else {
      console.log("Not enough players");
    }
  });

  socket.on("Won",({room_id,winner})=>{
    io.to(room_id).emit("Match Over",{winner});
    io.socketsLeave(room_id);

  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    const index = queue.indexOf(socket);
    if (index !== -1) {
      queue.splice(index, 1);
    }
  });
});

// ✅ Start Server
server.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
