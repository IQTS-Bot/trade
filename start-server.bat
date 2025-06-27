@echo off
echo Starting IQTS Bot Web Server...
echo.
echo Access your IQTS Bot at:
echo http://localhost:8000
echo http://YOUR-IP-ADDRESS:8000
echo.
echo Press Ctrl+C to stop the server
echo.
python -m http.server 8000
pause
