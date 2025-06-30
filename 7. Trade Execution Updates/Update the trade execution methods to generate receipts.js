executeBuy(symbol, quantity, price) {
    // Existing code...
    
    // Generate trade receipt
    const trade = {
        id: position.id,
        symbol,
        quantity,
        price,
        action: 'BUY',
        timestamp: new Date()
    };
    this.addTradeReceipt(trade);
}

executeSell(symbol, quantity, price) {
    // Existing code...
    
    // Generate trade receipt
    const trade = {
        id: Date.now(),
        symbol,
        quantity,
        price,
        action: 'SELL',
        pnl,
        timestamp: new Date()
    };
    this.addTradeReceipt(trade);
}

// Also update executeRealBuy and executeRealSell similarly