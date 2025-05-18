import pool from "../db.js";


function calculateElo(winnerElo, loserElo, k = 32) {
  const expectedScoreWinner = 1 / (1 + Math.pow(10, (loserElo - winnerElo) / 400));
  const expectedScoreLoser = 1 - expectedScoreWinner;

  const newWinnerElo = Math.round(winnerElo + k * (1 - expectedScoreWinner));
  const newLoserElo = Math.round(loserElo + k * (0 - expectedScoreLoser));

  return { newWinnerElo, newLoserElo };
}

const   getElo = async (winner_user,loser_user)=>{
    try{
        const winnerElo = await pool.query("SELECT elo FROM leaderbaord WHERE username = $1",[winner_user]);
        const loserElo = await pool.query("SELECT elo FROM leaderbaord WHERE username = $1",[loser_user]);

        const {newWinnerElo,newLoserElo} = calculateElo(winnerElo,loserElo);

        await pool.query("UPDATE leaderboard SET elo = $1, wins = wins + 1 WHERE username = $2", [newWinnerElo, winner_user]);
        await pool.query("UPDATE leaderboard SET elo = $1, losses = losses + 1 WHERE username = $2", [newLoserElo, loser_user]);

        return {newWinnerElo,newLoserElo};
    }
    catch(err){
        console.log(err);
    }
}

export default getElo;