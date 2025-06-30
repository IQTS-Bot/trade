# IQTS Trading Bot - Cleaned & Optimized

A lightweight intelligent quantitative trading system with real-time market monitoring and automated trading capabilities.

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   - Copy `.env` file and add your API keys:
     - Alpaca API credentials
     - Telegram bot token and chat ID

3. **Run the Application**
   ```bash
   npm start
   ```

4. **Open Browser**
   - Navigate to `http://localhost:3000`
   - Start trading with the web interface

## 📂 Project Structure

```
├── index.html          # Main trading interface
├── server.js           # Backend server
├── market-hours.js     # Market hours logic
├── system-monitor.js   # System monitoring
├── package.json        # Dependencies
├── .env               # Environment variables
├── services/          # External API services
│   ├── alpaca.js      # Alpaca trading API
│   └── telegram.js    # Telegram notifications
├── workers/           # Background workers
│   └── after-hours.js # After-hours analysis
└── middleware/        # Security middleware
    └── security.js    # Security hardening
```

## ✨ Features

- **Real-time Trading**: Execute buy/sell orders with live market data
- **Multiple Chart Types**: Candlestick, Heikin-Ashi, Renko, and Tick charts
- **System Monitoring**: CPU, memory, and performance tracking
- **Telegram Alerts**: Real-time notifications for trades and system status
- **Paper Trading**: Safe testing environment before live trading
- **Responsive UI**: Works on desktop and mobile devices

## 🔧 Fixed Issues

- ✅ Added missing trade execution functions (`executeBuy`, `executeSell`)
- ✅ Fixed Chart.js implementation for proper chart rendering
- ✅ Removed audio file dependencies to reduce app size
- ✅ Cleaned up unnecessary files and folders
- ✅ Added proper error handling and notifications
- ✅ Implemented audio notifications using Web Audio API

## 🔒 Security

- Environment variables for sensitive data
- Security middleware for request validation
- Secure WebSocket connections for real-time updates

## 📱 Usage

1. Start the server with `npm start`
2. Click "Start Trading" to begin
3. Use quick trade buttons or manual orders
4. Monitor performance in real-time
5. View trades and positions in the activity panel

## ⚠️ Note

This is a demo/educational trading system. For live trading, ensure proper API configuration and risk management. 