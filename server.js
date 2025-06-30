require('dotenv').config();
const express = require('express');
const WebSocket = require('ws');
const { AlpacaService } = require('./services/alpaca');
const { TelegramService } = require('./services/telegram');
const { AnalysisWorker } = require('./workers/after-hours');
const { SecurityMiddleware } = require('./middleware/security');

const app = express();
app.use(SecurityMiddleware.harden());

// Initialize services
const alpaca = new AlpacaService({
  keyId: process.env.ALPACA_KEY,
  secretKey: process.env.ALPACA_SECRET,
  paper: process.env.PAPER_TRADING === 'true'
});

const telegram = new TelegramService(
  process.env.TELEGRAM_TOKEN,
  process.env.TELEGRAM_CHAT_ID
);

// Start workers
const marketWorker = require('./market-hours')({ alpaca, telegram });
const analysisWorker = new AnalysisWorker({ alpaca, telegram });

// API endpoints
app.get('/api/performance', async (req, res) => {
  const report = await marketWorker.generateDailyReport();
  res.json(report);
});

app.post('/api/control', (req, res) => {
  if(req.body.action === 'start') marketWorker.start();
  if(req.body.action === 'stop') marketWorker.stop();
  res.sendStatus(200);
});

// Start the server
const server = app.listen(3000, async () => {
  console.log('Trading bot running on port 3000');
  
  // Initialize services
  await alpaca.connect();
  await telegram.connect();
  
  // Start workers
  marketWorker.start();
  analysisWorker.start();
  
  console.log('All services initialized and workers started');
});

// Secure WebSocket for real-time updates
const wss = new WebSocket.Server({ server });
wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  
  ws.on('message', (message) => {
    if (SecurityMiddleware.validateMessage(message.toString())) {
      // Handle client commands
      console.log('Received valid WebSocket message:', message.toString());
    }
  });
  
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});