function ratingToRank(rating) {
  if (rating == null) return { rank: "Unrated", subRank: null };

  const thresholds = [
    {max:800,base:"Urated"},
    { max: 1000, base: "Bronze" },
    { max: 1200, base: "Silver" },
    { max: 1400, base: "Gold" },
    { max: 1600, base: "Platinum" },
    { max: 1800, base: "Diamond" },
    { max: 2000, base: "Elite" },
    { max: Infinity, base: "Master" },
  ];

  for (let i = 0; i < thresholds.length; i++) {
    if (rating < thresholds[i].max) {
      const { base } = thresholds[i];
      if (base === "Master" || base === "Unrated") return { rank: base, subRank: null };

      // Sub-rank logic: split the 200-point band into two parts
      const lowerBound = i === 0 ? 0 : thresholds[i - 1].max;
      const midPoint = lowerBound + (thresholds[i].max - lowerBound) / 2;
      const subRank = rating < midPoint ? 1 : 2;

      return { rank: base, subRank };
    }
  }
}

export default ratingToRank;