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

const inputs = [];
const outputs = [];
const problem = [];
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
      inputs.push(row.inputs); // Adjust column name as needed
      outputs.push(row.outputs); // Adjust column name as needed
      problem.push(row.question);
    },
    complete: () => {},
    error: (err) => {
      console.error("Error parsing the file:", err.message);
    },
  });
};

// Call the function with the path to your CSV file
extractData("test.csv");
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
      const q_id = Math.floor(Math.random() * problem.length);

      // Emit the match with the selected question and cases
      const questionData = {
        room,
        player1: player1.id,
        player2: player2.id,
        question_id: {
          problem: problem[q_id],
          input_cases: inputs[q_id],
          output_cases: outputs[q_id],
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

  socket.on("Won", ({ room_id, winner }) => {
    io.to(room_id).emit("Match Over", { winner });
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
