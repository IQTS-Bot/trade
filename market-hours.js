module.exports = ({ alpaca, telegram }) => {
  let isRunning = false;
  let interval;

  const tradingCycle = async () => {
    const signals = await generateSignals();
    await executeTrades(signals);
    telegram.sendTradeUpdate(signals);
  };

  const executeTrades = async (signals) => {
    for(const [symbol, signal] of Object.entries(signals)) {
      if(signal.confidence > 0.7) {
        await alpaca.createOrder({
          symbol,
          qty: calculateSize(signal),
          side: signal.action,
          type: 'limit',
          limit_price: calculateLimitPrice(signal)
        });
        playAudio('trade-executed');
      }
    }
  };

  return {
    start: () => {
      isRunning = true;
      interval = setInterval(tradingCycle, 300000); // 5 min
    },
    stop: () => {
      clearInterval(interval);
      isRunning = false;
    },
    generateDailyReport: async () => {
      // Report generation logic
    }
  };
};