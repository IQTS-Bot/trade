// Replace mock tradingCycle() with:
async tradingCycle() {
    const signals = await this.getSignals();
    await this.executeRealTrades(signals);
}