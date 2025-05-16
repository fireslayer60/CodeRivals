import React, { useEffect, useState, useRef } from "react";
import socket from "../../socket.js";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./HomeStyles.module.css";
import Navbar from "./Navbar/Navbar.jsx";
import bronze from "../../assets/bronze.png";
import Leaderboard from "./LeaderBoard/Leaderboard.jsx";
import FriendsList from "./FriendList/FriendList.jsx";
import LeftSection from "./LeftSection/LeftSection.jsx";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const hasShownToast = useRef(false);
  useEffect(() => {
     if (location.state?.successMessage && !hasShownToast.current) {
    toast.success(location.state.successMessage, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Slide,
    });

    hasShownToast.current = true;
      navigate(".", { replace: true, state: {} });
    }
  }, [location, navigate]);
  return (
    <div className={styles.homeContainer}>
      
      <Navbar />
      <div className={styles.homeContent}>
        <div className={styles.leftSection}>
          <LeftSection />
        </div>
        <div className={styles.rightSection}>
          <Leaderboard />
          <FriendsList />
        </div>
      </div>
    </div>
  );
}

export default Home;
