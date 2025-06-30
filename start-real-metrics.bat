@echo off
echo 🔥 Starting REAL System Metrics Server...
echo 📊 This will provide LIVE CPU, Memory, and Network data to your IQTS Bot
echo.
echo ⚠️  Keep this window open while using the bot
echo 💡 Press Ctrl+C to stop the server
echo.
powershell -ExecutionPolicy Bypass -File "real-metrics.ps1"
pause 