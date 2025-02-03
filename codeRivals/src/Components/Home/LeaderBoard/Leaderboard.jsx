import React from "react";
import styles from "./LdStyles.module.css"; // Import CSS Module
import bronze from "../../../assets/bronze.png";

// Placeholder leaderboard data
const leaderboardData = [
  { rank: 1, name: "Player 1", points: 1500, tier: "Master" },
  { rank: 2, name: "Player 2", points: 1200, tier: "Master" },
  { rank: 3, name: "Player 3", points: 1000, tier: "Master" },
  { rank: 4, name: "Player 4", points: 900, tier: "Diamond" },
  { rank: 5, name: "Player 5", points: 850, tier: "Diamond" },
];

function Leaderboard() {
  return (
    <div className={styles.leaderboardContainer}>
      <h2 className={styles.leaderboardTitle}>Leaderboard</h2>
      <div className={styles.leaderboardList}>
        {leaderboardData.map((player) => (
          <div key={player.rank} className={styles.leaderboardItem}>
            <span className={styles.rank}>#{player.rank}</span>
            <span className={styles.playerName}>{player.name}</span>
            <span className={styles.playerPoints}>{player.points} pts  </span>
            <span className={styles.tier}><img src={bronze} className={styles.rankimg}/></span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Leaderboard;
