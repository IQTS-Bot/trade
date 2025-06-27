// Configuration
const config = {
    alpaca: {
        paper: true,
        keyId: 'YOUR_PAPER_KEY',
        secretKey: 'YOUR_PAPER_SECRET'
    },
    symbols: ['AAPL', 'TSLA', 'NVDA'],
    telegram: {
        botToken: 'YOUR_BOT_TOKEN',
        chatId: 'YOUR_CHAT_ID'
    }
};

// Chart Setup
const ctx = document.getElementById('priceChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: Array(20).fill().map((_, i) => i),
        datasets: [{
            label: 'Price',
            data: Array(20).fill().map(() => 150 + Math.random() * 10),
            borderColor: '#00ffaa',
            tension: 0.1,
            pointRadius: 0
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: false,
                grid: {
                    color: 'rgba(255,255,255,0.1)'
                },
                ticks: {
                    color: '#a0a0a0'
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    display: false
                }
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    }
});

// Trading Engine
class TradingEngine {
    constructor() {
        this.isRunning = false;
        this.positions = [];
    }

    async start() {
        this.isRunning = true;
        this.addActivity('AI trading started', 'system');
        this.updateUI();
        
        // Main trading loop
        this.interval = setInterval(() => this.tradingCycle(), 5000);
    }

    stop() {
        clearInterval(this.interval);
        this.isRunning = false;
        this.addActivity('AI trading stopped', 'system');
        this.updateUI();
    }

    // --- Telegram Config (Enable Telegram Alerts.js) ---
    sendTelegram(type, payload) {
        // Placeholder: Integrate with Telegram API here
        console.log(`[TELEGRAM] ${type}:`, payload);
    }

    // --- Proactive Telegram Reminders ---
    // 2.1 Market Open Reminder
    setupMarketOpenReminder() {
        const now = new Date();
        const nextOpen = this.getNextMarketOpen ? this.getNextMarketOpen(now) : new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 30, 0, 0); // Default 14:30 UTC
        const timeUntilOpen = nextOpen - now;
        setTimeout(() => {
            if (this.isRunning) {
                this.sendTelegram('MARKET_OPEN_REMINDER', {
                    message: `🔔 Market opens in 30 minutes!\nCurrent status: ${this.isRunning ? '✅ Active' : '⏸ Paused'}\nPositions: ${this.positions.length}`
                });
            }
            this.setupMarketOpenReminder();
        }, timeUntilOpen - (30 * 60 * 1000));
    }

    // 2.2 Daily Prep Checklist Reminder
    setupDailyPrepReminder() {
        const now = new Date();
        const reminderTime = new Date();
        reminderTime.setHours(8, 30, 0, 0);
        if (now > reminderTime) reminderTime.setDate(reminderTime.getDate() + 1);
        setTimeout(() => {
            this.sendTelegram('DAILY_PREP', {
                message: `📋 Daily Trading Prep Checklist:\n1. Review overnight news\n2. Check pre-market movers\n3. Verify risk settings\n4. Review open positions (${this.positions.length})\n5. Confirm system status: ${this.isRunning ? '✅ Active' : '⏸ Paused'}\n\nMarket opens in 1 hour!`
            });
            this.setupDailyPrepReminder();
        }, reminderTime - now);
    }

    // 2.3 Inactivity Reminder
    setupInactivityReminder() {
        let lastTradeTime = Date.now();
        const origBuy = this.executeBuy;
        const origSell = this.executeSell;
        this.executeBuy = (...args) => { lastTradeTime = Date.now(); return origBuy.apply(this, args); };
        this.executeSell = (...args) => { lastTradeTime = Date.now(); return origSell.apply(this, args); };
        setInterval(() => {
            const hoursSinceLastTrade = (Date.now() - lastTradeTime) / (1000 * 60 * 60);
            if (this.isRunning && hoursSinceLastTrade >= 4) {
                this.sendTelegram('INACTIVITY', {
                    message: `⏳ No trades in ${Math.floor(hoursSinceLastTrade)} hours\nActive positions: ${this.positions.length}`
                });
            }
        }, 60 * 60 * 1000);
    }

    // 2.4 Important Event Notifications
    setupEventNotifications() {
        const earningsCalendar = {
            'AAPL': '2025-06-28',
            'TSLA': '2025-07-01',
            'NVDA': '2025-07-10'
        };
        setInterval(() => {
            const today = new Date().toISOString().split('T')[0];
            const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            for (const [symbol, date] of Object.entries(earningsCalendar)) {
                if (date === today) {
                    this.sendTelegram('EARNINGS_TODAY', { message: `📢 Earnings Today: ${symbol}` });
                } else if (date === tomorrow) {
                    this.sendTelegram('EARNINGS_TOMORROW', { message: `📢 Earnings Tomorrow: ${symbol}` });
                }
            }
        }, 24 * 60 * 60 * 1000);
    }

    // --- Real API Integration.js ---
    async tradingCycle() {
        // Replace with real API integration as needed
        // const signals = await this.getSignals();
        // await this.executeRealTrades(signals);
        // For now, keep mock logic:
        const symbol = config.symbols[Math.floor(Math.random() * config.symbols.length)];
        const action = Math.random() > 0.5 ? 'BUY' : 'SELL';
        const price = (150 + Math.random() * 10).toFixed(2);
        if(action === 'BUY') {
            this.positions.push({ symbol, price, time: new Date(), profit: (Math.random() * 5).toFixed(2) });
            this.sendTelegram('TRADE_EXECUTED', { symbol, action, price });
        } else if(this.positions.length > 0) {
            this.positions.pop();
            this.sendTelegram('TRADE_EXECUTED', { symbol, action, price });
        }
        this.addActivity(`${action} ${symbol} @ $${price}`, action.toLowerCase());
        this.updateUI();
    }

    addActivity(message, type) {
        const log = document.getElementById('activityLog');
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.innerHTML = `[${new Date().toLocaleTimeString()}] ${message}`;
        log.prepend(entry);
    }

    updateUI() {
        // Update positions
        const positionsList = document.getElementById('positionsList');
        positionsList.innerHTML = '';
        
        if(this.positions.length === 0) {
            positionsList.innerHTML = '<div class="empty-state">No active positions</div>';
        } else {
            this.positions.forEach(pos => {
                const posEl = document.createElement('div');
                posEl.className = 'position-item';
                posEl.innerHTML = `
                    <span>${pos.symbol} @ $${pos.price}</span>
                    <span class="position-profit">+$${pos.profit}</span>
                `;
                positionsList.appendChild(posEl);
            });
        }
        
        document.getElementById('positionsCount').textContent = this.positions.length;
        
        // Update chart with random data
        chart.data.datasets[0].data = chart.data.datasets[0].data.slice(1).concat(150 + Math.random() * 10);
        chart.update();
    }
}

// Initialize
const tradingEngine = new TradingEngine();

document.getElementById('startBtn').addEventListener('click', () => tradingEngine.start());
document.getElementById('stopBtn').addEventListener('click', () => tradingEngine.stop());

// Simulate market updates
setInterval(() => {
    if(!tradingEngine.isRunning) {
        chart.data.datasets[0].data = chart.data.datasets[0].data.slice(1).concat(150 + Math.random() * 10);
        chart.update();
    }
}, 1000);

// --- Initialization of reminders ---
tradingEngine.setupMarketOpenReminder();
tradingEngine.setupDailyPrepReminder();
tradingEngine.setupInactivityReminder();
tradingEngine.setupEventNotifications();