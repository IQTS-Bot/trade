// Telegram message types
telegram.send('TRADE_EXECUTED', { symbol, action, price });
telegram.send('DAILY_REPORT', performanceData);
telegram.send('CIRCUIT_BREAKER', { reason });