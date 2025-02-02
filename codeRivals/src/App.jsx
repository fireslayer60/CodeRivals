import React,{useEffect} from 'react';
import SignUp from './Components/Signup/SignUp.jsx';
import socket from './socket.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home/Home.jsx';


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
      <Route path="/home" element={<Home />} /> {/* Dashboard page */}
    </Routes>
  </Router>
    
    
  )
}

export default App
