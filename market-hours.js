module.exports = ({ alpaca, telegram }) => {
  let isRunning = false;
  let interval;
  let trades = [];

  const generateSignals = async () => {
    // Simulate signal generation
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA'];
    const signals = {};
    
    for (const symbol of symbols) {
      signals[symbol] = {
        action: Math.random() > 0.5 ? 'buy' : 'sell',
        confidence: Math.random(),
        price: 100 + Math.random() * 200
      };
    }
    
    return signals;
  };

  const calculateSize = (signal) => {
    // Simple position sizing based on confidence
    return Math.floor(signal.confidence * 100);
  };

  const calculateLimitPrice = (signal) => {
    // Add small buffer to current price
    const buffer = signal.action === 'buy' ? 0.01 : -0.01;
    return signal.price + buffer;
  };

  const playAudio = (soundType) => {
    console.log(`🔊 Playing audio: ${soundType}`);
  };

  const isMarketOpen = () => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 6 = Saturday
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    // Market is closed on weekends
    if (day === 0 || day === 6) return false;
    
    // Market hours: 9:30 AM - 4:00 PM ET (simplified)
    const isWeekday = day >= 1 && day <= 5;
    const isMarketHours = (hours === 9 && minutes >= 30) || (hours >= 10 && hours < 16);
    
    return isWeekday && isMarketHours;
  };

  const tradingCycle = async () => {
    if (!isMarketOpen()) {
      console.log('Market is closed, skipping trading cycle');
      return;
    }

    try {
      const signals = await generateSignals();
      await executeTrades(signals);
      telegram.sendTradeUpdate(signals);
    } catch (error) {
      console.error('Error in trading cycle:', error);
    }
  };

  const executeTrades = async (signals) => {
    for(const [symbol, signal] of Object.entries(signals)) {
      if(signal.confidence > 0.7) {
        try {
          const order = await alpaca.createOrder({
            symbol,
            qty: calculateSize(signal),
            side: signal.action,
            type: 'limit',
            limit_price: calculateLimitPrice(signal)
          });
          
          trades.push({
            ...order,
            timestamp: new Date().toISOString(),
            signal: signal
          });
          
          playAudio('trade-executed');
          console.log(`✅ Trade executed: ${signal.action} ${symbol} at ${signal.price}`);
        } catch (error) {
          console.error(`❌ Failed to execute trade for ${symbol}:`, error);
        }
      }
    }
  };

  return {
    start: () => {
      if (isRunning) return;
      console.log('Starting market hours trading...');
      isRunning = true;
      interval = setInterval(tradingCycle, 300000); // 5 min
      
      // Run initial cycle
      tradingCycle();
    },
    stop: () => {
      if (!isRunning) return;
      console.log('Stopping market hours trading...');
      clearInterval(interval);
      isRunning = false;
    },
    generateDailyReport: async () => {
      const today = new Date().toDateString();
      const todayTrades = trades.filter(trade => 
        new Date(trade.timestamp).toDateString() === today
      );
      
      return {
        date: today,
        totalTrades: todayTrades.length,
        trades: todayTrades,
        summary: {
          buys: todayTrades.filter(t => t.side === 'buy').length,
          sells: todayTrades.filter(t => t.side === 'sell').length
        }
      };
    },
    isRunning: () => isRunning,
    getTrades: () => trades
  };
};