import { useState, useEffect } from "react";
import styles from "./Leaderboard.module.css";
import pfp from "../../assets/defpfp.png";

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);

  // Mock data for now (Replace with API later)
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/getleaderboard")
      .then((response) => response.json())
      .then((data) => {
        const updatedData = data.map((player, index) => ({
          ...player, 
          pfp: pfp, 
          rank: index + 1
        }));
        setLeaderboard(updatedData);
      })
      .catch((error) => console.error("Error fetching leaderboard:", error));
  }, []);
  

  return (
    <div className={styles.leaderboard_container}>
      <h2 className={styles.title}>🏆 Leaderboard</h2>
      <table className={styles.leaderboard_table}>
        <thead>
          <tr>
            <th className={styles.th}>Rank</th>
            <th className={styles.th}>Profile</th>
            <th className={styles.th}>Username</th>
            <th className={styles.th}>ELO</th>
            <th className={styles.th}>Wins</th>
            <th className={styles.th}>Losses</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((player) => (
            <tr key={player.username}>
              <td className={`${styles.td} ${styles.rank}`}>#{player.rank}</td>
              <td className={styles.td}>
                <img src={player.pfp} alt="PFP" className={styles.pfp} />
              </td>
              <td className={`${styles.td} ${styles.username}`}>{player.username}</td>
              <td className={`${styles.td} ${styles.elo}`}>{player.elo}</td>
              <td className={`${styles.td} ${styles.wins}`}>{player.wins}</td>
              <td className={`${styles.td} ${styles.losses}`}>{player.losses}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
