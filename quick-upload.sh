#!/bin/bash

# Quick IQTS Bot Upload Script
# Run this from your local machine to upload to VPS

echo "🚀 IQTS Bot Quick Upload to VPS"
echo "================================"

# Check if file exists
if [ ! -f "IQTS-Bot-Complete.html" ]; then
    echo "❌ IQTS-Bot-Complete.html not found in current directory"
    echo "Please run this script from the IQTS Bot folder"
    exit 1
fi

# Get VPS details from user
read -p "Enter your VPS IP address: " VPS_IP
read -p "Enter your VPS username (e.g., root, ubuntu): " VPS_USER
read -p "Enter your domain name (e.g., yourdomain.com): " DOMAIN

echo ""
echo "📋 Uploading IQTS Bot to VPS..."

# Upload the file
scp IQTS-Bot-Complete.html $VPS_USER@$VPS_IP:/tmp/

# SSH into VPS and set up
ssh $VPS_USER@$VPS_IP << EOF
echo "📁 Setting up web directory..."
sudo mkdir -p /var/www/iqts-bot
sudo mv /tmp/IQTS-Bot-Complete.html /var/www/iqts-bot/index.html
sudo chown -R www-data:www-data /var/www/iqts-bot
sudo chmod -R 755 /var/www/iqts-bot

echo "⚙️ Updating Nginx configuration..."
sudo sed -i 's/your-domain.com/$DOMAIN/g' /etc/nginx/sites-available/iqts-bot

echo "🔄 Restarting Nginx..."
sudo systemctl restart nginx

echo "✅ Upload complete!"
echo "🌐 Your IQTS Bot should be available at: http://$DOMAIN"
echo ""
echo "🔒 Next step: Get SSL certificate"
echo "Run: sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
EOF

echo ""
echo "🎉 Upload completed!"
echo "📱 Test your bot at: http://$DOMAIN"
echo ""
echo "🔒 Don't forget to set up SSL:"
echo "ssh $VPS_USER@$VPS_IP"
echo "sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
