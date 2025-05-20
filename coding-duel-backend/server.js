import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import pool from "./db.js"; // PostgreSQL connection
import { Console } from "console";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import friendsRoutes from "./routes/friend.js";
import { redis } from './redisClient.js';
import change_user from "./redis/redis_login_change.js";
import getElo from "./utilities/elo.js";
import avg_elo from "./utilities/avg_elo.js";
import fs from "fs";
import Papa from "papaparse";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/friends", friendsRoutes);

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

const allQuestions = [];
// Function to process CSV using streams
const extractData = (filePath) => {
  // Create a readable stream for the CSV file
  const fileStream = fs.createReadStream(filePath, { encoding: "utf8" });

  // Use PapaParse's stream API to parse the file line by line
  Papa.parse(fileStream, {
    header: true, // First row is treated as header
    dynamicTyping: true, // Automatically convert numbers/booleans
    step: (result) => {
      const row = result.data;
      if(row.rating){
        allQuestions.push({
          question:row.question,
          inputs:row.inputs,
          output: row.outputs,
          rating: Number(row.rating),
        })
        

      }
      
    },
    complete: () => {
       console.log("Loaded", allQuestions.length, "questions.");
    },
    error: (err) => {
      console.error("Error parsing the file:", err.message);
    },
  });
};

// Call the function with the path to your CSV file
extractData("test2.csv");
const queue = [];

io.on("connection", async (socket) => {
  let username = socket.handshake.query.username;
  console.log("User connected:", socket.id, "Username:", username);
  if (username) {
    // Set in Redis
    await redis.set(`socket:${username}`, socket.id);

    // Optional: expire after 5 mins (e.g. in case of unexpected disconnect)
    // await redis.expire(`socket:${username}`, 300); // 300 seconds = 5 mins
  }
  socket.on("send_match_request", async ({ toUsername }) => {
    // Find friend's socket ID from Redis
    const friendSocketId = await redis.get(`socket:${toUsername}`);
    
    if (!friendSocketId) {
      socket.emit("challenge-response", { success: false, message: `${toUsername} is offline.` });
      return;
    }

    // Use Socket.IO's adapter to get rooms friend is in
    const friendSocket = io.sockets.sockets.get(friendSocketId);
    if (!friendSocket) {
      socket.emit("challenge-response", { success: false, message: `${toUsername} is offline.` });
      return;
    }

    // Check if friend is already in any "match:" room
    const friendRooms = friendSocket.rooms;
    // socket.rooms always includes the socket.id by default, so filter that out
    const isInMatch = [...friendRooms].some(room => room.startsWith("match_"));
    if (isInMatch) {
      socket.emit("challenge-response", { success: false, message: `${toUsername} is currently in a match.` });
      return;
    }

    

    // Send challenge event
    io.to(friendSocketId).emit("incoming-challenge", { fromUsername: username });
    socket.emit("challenge-response", { success: true, message: `Challenge sent to ${toUsername}` });
  });

  socket.on("respond-challenge", async ({ fromUsername, accepted }) => {
    const fromSocketId = await redis.get(`socket:${fromUsername}`);
    if (!fromSocketId) {
      socket.emit("challenge-status", { success: false, message: `${fromUsername} went offline.` });
      return;
    }

    const fromSocket = io.sockets.sockets.get(fromSocketId);
    if (!fromSocket) {
      socket.emit("challenge-status", { success: false, message: `${fromUsername} went offline.` });
      return;
    }

    if (accepted) {
      // Create room name deterministically (sorted usernames to avoid duplicates)
      const players = [username, fromUsername].sort();
      const roomName = `match_${socket.id}_${fromSocketId}`;

      // Join both sockets to the room
      socket.join(roomName);
      fromSocket.join(roomName);

      const q_id = Math.floor(Math.random() * allQuestions.length);

      // Emit the match with the selected question and cases
      const questionData = {
        room : roomName,
        player1: {
          player1_id:socket.id,
          player1_user: socket.handshake.query.username},
        player2: {
          player2_id:fromSocketId,
          player2_user: fromSocket.handshake.query.username},
        question_id: {
          problem: allQuestions[q_id].question,
          input_cases: allQuestions[q_id].inputs,
          output_cases: allQuestions[q_id].output,
        },
      };
      console.log(roomName);
      io.to(roomName).emit("match_found", questionData);

    } else {
      io.to(fromSocketId).emit("challenge-status", { success: false, message: `${username} rejected your challenge.` });
    }
  });

  socket.on("join_queue", async () => {
    console.log(`User ${socket.id} joined the queue.`);
    
    queue.push(socket);

    if (queue.length >= 2) {
      const player1 = queue.shift();
      const player2 = queue.shift();

      const room = `match_${player1.id}_${player2.id}`;
      player1.join(room);
      player2.join(room);
      const avgElo = await avg_elo(player1.handshake.query.username,player2.handshake.query.username);
      console.log(avgElo);
      const getQuestionNearElo = (avgElo, range = 200) => {
        const candidates = allQuestions.filter(
          (q) => Math.abs(q.rating - elo) <= range
        );

        if (candidates.length === 0) {
          console.warn("No questions near Elo", elo);
          return null;
        }

        const randomIndex = Math.floor(Math.random() * candidates.length);
        return candidates[randomIndex];
      };
      const candidate = getQuestionNearElo(avgElo);
      

      // Emit the match with the selected question and cases
      const questionData = {
        room,
        player1: {
          player1_id:player1.id,
          player1_user: player1.handshake.query.username},
        player2: {
          player2_id:player2.id,
          player2_user: player2.handshake.query.username},
        question_id: {
          problem: candidate.question,
          input_cases: candidate.inputs,
          output_cases: candidate.output,
        },
      };

      io.to(room).emit("match_found", questionData);

      console.log(
        `Match started: ${player1.id} vs ${
          player2.id
        } in room ${room}  question ${JSON.stringify(questionData.question_id)}`
      );
    } else {
      console.log("Not enough players");
    }
  });

  socket.on("new_Login",async ({old_User,new_User})=>{
    if(!(old_User===new_User)){
      await change_user({old_User,new_User});
      username = new_User;
      socket.handshake.query.username = username;
    }
    
  });

  socket.on("Won", async ({ room_id, winner ,loser}) => {
    const {winner_id,winner_user} = winner;
    const {loser_id,loser_user} = loser;
    const sockets = Array.from(io.sockets.adapter.rooms.get(room_id) || []);
    const {newWinnerElo,newLoserElo} = await getElo(winner_user,loser_user);
    console.log("Emitting Match Over to:"+room_id, sockets);



  sockets.forEach((id) => {
    io.to(id).emit("Match Over", { winner: winner_id ,winnerElo:newWinnerElo,loserElo:newLoserElo});
  });

  // Give clients time to receive event before leaving
  setTimeout(() => {
    io.socketsLeave(room_id);
  }, 500);
});


  socket.on("disconnect", async() => {
    console.log(`User disconnected: ${socket.id}`);
    if (username) {
      await redis.del(`socket:${username}`);
     
    }
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
