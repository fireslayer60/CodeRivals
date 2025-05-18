import pool from "../db.js";

function calculateElo(winnerElo, loserElo, k = 32) {
  const expectedScoreWinner = 1 / (1 + Math.pow(10, (loserElo - winnerElo) / 400));
  const expectedScoreLoser = 1 - expectedScoreWinner;

  const newWinnerElo = Math.round(winnerElo + k * (1 - expectedScoreWinner));
  const newLoserElo = Math.round(loserElo + k * (0 - expectedScoreLoser));

  return { newWinnerElo, newLoserElo };
}

const getElo = async (winner_user, loser_user) => {
  try {
    const winnerRes = await pool.query("SELECT elo FROM leaderboard WHERE username = $1", [winner_user]);
    const loserRes = await pool.query("SELECT elo FROM leaderboard WHERE username = $1", [loser_user]);

    // Check if both users exist
    if (winnerRes.rows.length === 0 || loserRes.rows.length === 0) {
      throw new Error("One or both users not found in leaderboard.");
    }

    const winnerElo = winnerRes.rows[0].elo;
    const loserElo = loserRes.rows[0].elo;

    const { newWinnerElo, newLoserElo } = calculateElo(winnerElo, loserElo);

    await pool.query("UPDATE leaderboard SET elo = $1, wins = wins + 1 WHERE username = $2", [newWinnerElo, winner_user]);
    await pool.query("UPDATE leaderboard SET elo = $1, losses = losses + 1 WHERE username = $2", [newLoserElo, loser_user]);

    return { newWinnerElo, newLoserElo };
  } catch (err) {
    console.error("Elo update error:", err);
    return null; // Or throw again if you want it to fail hard
  }
};

export default getElo;