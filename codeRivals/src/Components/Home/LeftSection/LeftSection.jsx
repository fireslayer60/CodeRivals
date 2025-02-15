import React, { useState,useEffect } from "react";
import socket from '../../../socket.js'; 
import styles from "./LeftStyels.module.css";
import bronze from "../../../assets/bronze.png"; 
import pfp from "../../../assets/meme.jpg"; 
import { useNavigate } from 'react-router-dom';

const recentGames = [
    { opponent: "Player123", result: "Win", rankChange: "+10" },
    { opponent: "ShadowKnight", result: "Loss", rankChange: "-5" },
    { opponent: "MysticWarrior", result: "Win", rankChange: "+8" },
  ];

function LeftSection() {
  const navigate = useNavigate(); 
  const [rank, setRank] = useState("Bronze");
  const [rankProgress, setRankProgress] = useState(60); // Example progress in %
  const [statust, setStatus] = useState('Click "Find Match" to start');
    
        

        useEffect(() => {
            
            socket.on('match_found', ({ room, player1, player2 }) => {
              
              setStatus(`Matched! Room: ${room} | ${player1} vs ${player2} i am ${socket.id}`);
              navigate(`/duel?room=${room}`);

            });
        
        
            return () => {
              socket.off('match_found');
            };
          }, []);
    
    const findMatch = () => {
        setStatus('Searching for a match...');
        
        socket.emit('join_queue');
      };

 

  return (
    <div className={styles.leftSection}>
      <p>Current Rank:</p>
      <p>{rank}</p>

      {/* Rank Image */}
      <div className={styles.rankImage}>
        <img src={bronze} alt={`${rank} Rank`} />
      </div>

      {/* Progress Bar */}
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${rankProgress}%` }}
          ></div>
        </div>
        <span className={styles.progressText}>{rankProgress}% to next rank</span>
      </div>

      <button className={styles.findMatchBtn} onClick={findMatch}>
        Find Match
      </button>
      <p>{statust}</p>
      {/* Recent Games List */}
      <div className={styles.recentGames}>
        <h3>Recent Games</h3>
        <ul>
          {recentGames.map((game, index) => (
            <li key={index} className={styles.gameItem}>
                <div className={styles.versus}>
                    <img
                                  src={pfp}
                                  alt="us"
                                  className={styles.usImage}
                                />
                <span className={styles.opponent}>Starzeus</span>
                <img src={bronze} className={styles.rankimg}  alt={`${rank} Rank`} />
                <span className={styles.vs}>vs</span>
                <img
                              src={pfp}
                              alt={game.opponent}
                              className={styles.enemyImage}
                            />
                <span className={styles.opponent}>{game.opponent}</span>
                <img src={bronze} className={styles.rankimg} alt={`${rank} Rank`} />
                </div>
              
              <span className={`${styles.result} ${game.result === "Win" ? styles.win : styles.loss}`}>
                {game.result}
              </span>
              <span className={`${styles.rankChange} ${game.result === "Win" ? styles.rankChangeWin : styles.rankChangeLoss}`}>{game.rankChange}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default LeftSection;
