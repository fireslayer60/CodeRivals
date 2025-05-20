import pool from "../db.js";

const avg_elo = async (user1_id,user2_id)=>{
    try {
    const user1_res = await pool.query("SELECT elo FROM leaderboard WHERE username = $1", [user1_id]);
    const user2_res = await pool.query("SELECT elo FROM leaderboard WHERE username = $1", [user2_id]);

    // Check if both users exist
    if (user1_res.rows.length === 0 || user2_res.rows.length === 0) {
      throw new Error("One or both users not found in leaderboard.");
    }

    const user1_elo = user1_res.rows[0].elo;
    const user2_elo = user2_res.rows[0].elo;

    const avgElo = Math.round((user1_elo + user2_elo) / 2);
    console.log(avgElo);

    return { avgElo };
  } catch (err) {
    console.error("Elo calculate error:", err);
    return null; // Or throw again if you want it to fail hard
  }


}

export default avg_elo;