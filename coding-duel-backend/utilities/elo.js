function calculateElo(winnerElo, loserElo, k = 32) {
  const expectedScoreWinner = 1 / (1 + Math.pow(10, (loserElo - winnerElo) / 400));
  const expectedScoreLoser = 1 - expectedScoreWinner;

  const newWinnerElo = Math.round(winnerElo + k * (1 - expectedScoreWinner));
  const newLoserElo = Math.round(loserElo + k * (0 - expectedScoreLoser));

  return { newWinnerElo, newLoserElo };
}

export default calculateElo;