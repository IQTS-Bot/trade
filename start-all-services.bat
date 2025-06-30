@echo off
echo.
echo ==========================================
echo   IQTS Bot - Starting All Services
echo ==========================================
echo.

echo 1. Starting PowerShell Metrics Server (Port 8080)...
start "Metrics Server" powershell -ExecutionPolicy Bypass -File "real-metrics.ps1"
timeout /t 3 >nul

echo 2. Starting Node.js System Monitor (Port 8081)...
start "System Monitor" cmd /c "node system-monitor.js"
timeout /t 2 >nul

echo 3. Starting Main Server (Port 3000)...
start "Main Server" cmd /c "node server.js"
timeout /t 2 >nul

echo.
echo ==========================================
echo   All Services Started!
echo ==========================================
echo.
echo Services running on:
echo   - Metrics Server:  http://localhost:8080
echo   - System Monitor:  ws://localhost:8081  
echo   - Main Server:     http://localhost:3000
echo   - Web Interface:   index.html
echo.
echo Press any key to open the web interface...
pause >nul

echo.
echo Opening web interface...
start index.html

echo.
echo ==========================================
echo   Services are running in background
echo ==========================================
echo.
echo To stop all services, close this window or
echo press Ctrl+C and then close the opened windows.
echo.
pause 