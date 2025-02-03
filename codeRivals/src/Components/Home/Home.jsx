import React,{useEffect,useState} from 'react';
import socket from '../../socket.js'; 
import styles from "./HomeStyles.module.css";
import Navbar from './Navbar/Navbar.jsx';
import bronze from "../../assets/bronze.png" ;
import Leaderboard from './LeaderBoard/Leaderboard.jsx';
import FriendsList from './FriendList/FriendList.jsx';
import LeftSection from './LeftSection/LeftSection.jsx';

function Home() {
    
      
  return (
    <div className={styles.homeContainer}>
      <Navbar/>
      <div className={styles.homeContent}>
        <div className={styles.leftSection}>
          <LeftSection/>
        </div>
        <div className={styles.rightSection}>
          {/* Leaderboard */}
          <Leaderboard/>
          {/* Friends List */}
          <FriendsList/>
        </div>
      </div>
    </div>
  )
}

export default Home
