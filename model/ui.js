exports.formatWinningPercent = function(pct) {
  var winningPercent = Math.round(pct * 1000);
  if (winningPercent == 0) {
    winningPercent = "000";
  } else if (winningPercent < 100) {
    winningPercent = "0" + winningPercent;
  }
  return "." + winningPercent;
}
