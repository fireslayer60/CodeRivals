import React,{useEffect} from 'react';
import SignUp from './Components/Signup/SignUp.jsx';
import socket from './socket.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home/Home.jsx';
import DuelPage from './Components/Duel/DuelPage.jsx';
import Login from './Components/Login/Login.jsx';


function App() {
  useEffect(()=>{
    socket.on("connect",()=>{
      console.log("User connected: ",socket.id);
    });
    socket.on("disconnect",()=>{
      console.log("User disconnected: ",socket.id);
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  });
  return (
    
    <Router>
    <Routes>
      <Route path="/" element={<SignUp />} /> {/* SignUp page */}
      <Route path="/Login" element={<Login />} />
      <Route path="/home" element={<Home />} /> 
      <Route path="/duel" element={<DuelPage />} /> 
    </Routes>
  </Router>
    
    
  )
}

export default App
