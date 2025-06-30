@echo off
echo Testing PowerShell Metrics Server...
echo.

echo Starting server in background...
start /min "Metrics Server" powershell -NoProfile -ExecutionPolicy Bypass -File real-metrics.ps1

echo Waiting 5 seconds for server to start...
timeout /t 5 /nobreak >nul

echo Testing server response...
powershell -NoProfile -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:8080/' -TimeoutSec 5; Write-Host 'SUCCESS: Server is responding!' -ForegroundColor Green; Write-Host 'CPU:' $response.cpu.usage'%' -ForegroundColor Yellow; Write-Host 'Memory:' $response.memory.usagePercent'%' -ForegroundColor Yellow } catch { Write-Host 'FAILED: Server not responding -' $_.Exception.Message -ForegroundColor Red }"

echo.
 