import React, { useEffect, useState } from "react";
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
  useEffect(() => {
    if (location.state?.successMessage) {
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
      navigate(".", { replace: true, state: {} });
    }
  }, [location, navigate]);
  return (
    <div className={styles.homeContainer}>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Slide}
      />
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
