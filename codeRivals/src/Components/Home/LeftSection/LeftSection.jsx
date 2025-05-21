import React, { useState, useEffect } from "react";
import socket from "../../../socket.js";
import styles from "./LeftStyels.module.css";
import bronze from "../../../assets/bronze.png";
import pfp from "../../../assets/meme.jpg";
import ratingToRank from "./getRating.js";
import { useNavigate } from "react-router-dom";
import Rank_img from "./Rank_img/Rank_img.jsx";

const recentGames = [
  { opponent: "Player123", result: "Win", rankChange: "+10" },
  { opponent: "NikmanGT", result: "Loss", rankChange: "-5" },
  { opponent: "MysticWarrior", result: "Win", rankChange: "+8" },
];

function LeftSection() {
  const navigate = useNavigate();
  
  const [rankProgress, setRankProgress] = useState(60); // Example progress in %
  const [statust, setStatus] = useState('Click "Find Match" to start');
  const [elo,setElo] = useState();
  const [rank, setRank] = useState("Unrated");
  const [subRank, setSubRank] = useState(null);

useEffect(() => {
  const storedElo = parseInt(localStorage.getItem("elo")) || 0;
  setElo(storedElo);
  setrank(storedElo);
   const { rank: calculatedRank, subRank: calculatedSubRank } = ratingToRank(storedElo);
  setRank(calculatedRank);
  setSubRank(calculatedSubRank);

}, [navigate]);

const setrank = (elo) => {
  setRankProgress(elo % 100);
  
};


  const findMatch = () => {
    setStatus("Searching for a match...");

    socket.emit("join_queue");
  };

  return (
    <div className={styles.leftSection}>
      <p>Current Rank:</p>
      <p>{rank} {subRank}</p>

      {/* Rank Image */}
      <div className={styles.rankImage}>
        <Rank_img rank={rank} subRank={subRank}/>
      </div>
      <div>
        <p>{elo}/{(elo-rankProgress+100)}</p>
      </div>

      {/* Progress Bar */}
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${rankProgress}%` }}
          ></div>
        </div>
        <span className={styles.progressText}>
          {rankProgress}% to next rank
        </span>
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
                <img src={pfp} alt="us" className={styles.usImage} />
                <span className={styles.opponent}>Starzeus</span>
                <img
                  src={bronze}
                  className={styles.rankimg}
                  alt={`${rank} Rank`}
                />
                <span className={styles.vs}>vs</span>
                <img
                  src={pfp}
                  alt={game.opponent}
                  className={styles.enemyImage}
                />
                <span className={styles.opponent}>{game.opponent}</span>
                <img
                  src={bronze}
                  className={styles.rankimg}
                  alt={`${rank} Rank`}
                />
              </div>

              <span
                className={`${styles.result} ${
                  game.result === "Win" ? styles.win : styles.loss
                }`}
              >
                {game.result}
              </span>
              <span
                className={`${styles.rankChange} ${
                  game.result === "Win"
                    ? styles.rankChangeWin
                    : styles.rankChangeLoss
                }`}
              >
                {game.rankChange}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default LeftSection;
