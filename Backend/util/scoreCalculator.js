exports.scoreCalculator = (EC, FC, VG, PT, FB, CK, injury, pain, steriotype) => {
  let score = 0;

  if (EC <= 3 || EC >= 7) score += 1 * 0.75;
  if (FC >= 50) score += 1 * 1;
  if (VG < 0.28) score += 1 * 0.75;
  if (PT < 5.5 || PT > 8.5) score += 1 * 1.1;
  if (FB > 400) score += 1 * 1.2;
  if (CK > 450) score += 1 * 1.2;
  if (injury) score += 1;
  if (pain) score += 1;
  if (steriotype) score += 1;

  return score;
};
