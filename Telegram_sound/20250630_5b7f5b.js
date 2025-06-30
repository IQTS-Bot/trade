playTradeSuccess(profit) {
  if (profit >= this.thresholds.bigProfit) {
    this.playSound('cashRegister'); // Big win
  } else {
    this.playSound('coin'); // Small win
  }
}