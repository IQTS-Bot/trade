# PROJECT STRUCTURE
trading-bot/
├── server/                  # Node.js backend
│   ├── services/
│   │   ├── alpaca.js        # Broker communication
│   │   ├── telegram.js      # Notification service
│   │   └── analyzer.js      # AI learning engine
│   ├── workers/
│   │   ├── market-hours.js  # Core trading
│   │   └── after-hours.js   # Analysis tasks
│   └── server.js           # Main entry point
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js
│   │   │   └── Alerts.js
│   │   └── App.js
│   └── public/             # Audio files here
├── config/
│   ├── production.json
│   └── security.js         # HSM config
└── docker-compose.yml      # For easy deployment