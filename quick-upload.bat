@echo off
echo 🚀 IQTS Bot Windows VPS Upload
echo ===============================

REM Check if file exists
if not exist "IQTS-Bot-Complete.html" (
    echo ❌ IQTS-Bot-Complete.html not found
    echo Please run this from the IQTS Bot folder
    pause
    exit /b 1
)

REM Get VPS details
set /p VPS_IP="Enter your VPS IP address: "
set /p VPS_USER="Enter your VPS username (root/ubuntu): "
set /p DOMAIN="Enter your domain name: "

echo.
echo 📋 Uploading IQTS Bot to VPS...

REM Upload using SCP (requires OpenSSH on Windows 10+)
scp IQTS-Bot-Complete.html %VPS_USER%@%VPS_IP%:/tmp/

echo.
echo ✅ File uploaded!
echo 🌐 Your bot will be at: http://%DOMAIN%
echo.
echo 📋 Next steps on your VPS:
echo 1. ssh %VPS_USER%@%VPS_IP%
echo 2. sudo mv /tmp/IQTS-Bot-Complete.html /var/www/iqts-bot/index.html
echo 3. sudo chown -R www-data:www-data /var/www/iqts-bot
echo 4. sudo systemctl restart nginx
echo 5. sudo certbot --nginx -d %DOMAIN%
echo.
pause
