import React, { useEffect , useState} from "react";
import SignUp from "./Components/Signup/SignUp.jsx";
import socket from "./socket.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Home from "./Components/Home/Home.jsx";
import DuelPage from "./Components/Duel/DuelPage.jsx";
import Login from "./Components/Login/Login.jsx";
import Profile from "./Components/Profile/Profile.jsx";
import Leaderboard from "./Components/LeaderBoard/LeaderBoard.jsx";

function App() {
  useEffect(() => {
    socket.on("connect", () => {

      console.log("User connected: ", socket.id);
    });
    socket.on("incoming-challenge", ({ fromUsername }) => {
  toast.info(
    ({ closeToast }) => (
      <div>
        <p><strong>{fromUsername}</strong> challenged you to a match!</p>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
          <button
            style={{ backgroundColor: "#4CAF50", color: "white", border: "none", padding: "6px 10px", borderRadius: "4px" }}
            onClick={() => {
              socket.emit("respond-challenge", { fromUsername, accepted: true });
              closeToast();
            }}
          >
            Accept ✅
          </button>
          <button
            style={{ backgroundColor: "#f44336", color: "white", border: "none", padding: "6px 10px", borderRadius: "4px" }}
            onClick={() => {
              socket.emit("respond-challenge", { fromUsername, accepted: false });
              closeToast();
            }}
          >
            Reject ❌
          </button>
        </div>
      </div>
    ),
    {
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: false,
    }
  );
});

    socket.on("disconnect", () => {
      console.log("User disconnected: ", socket.id);
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("incoming-challenge");
    };
  });
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} /> {/* SignUp page */}
        <Route path="/Login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/duel" element={<DuelPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
}

export default App;
