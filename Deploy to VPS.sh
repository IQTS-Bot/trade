#!/bin/bash

# IQTS Bot VPS Deployment Script
# Run this script on your VPS to deploy the trading bot

echo "🚀 IQTS Bot VPS Deployment Starting..."
echo "========================================="

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Nginx
echo "🌐 Installing Nginx..."
sudo apt install nginx -y

# Install SSL (Let's Encrypt)
echo "🔒 Installing SSL certificates..."
sudo apt install certbot python3-certbot-nginx -y

# Create web directory
echo "📁 Creating web directory..."
sudo mkdir -p /var/www/iqts-bot
sudo chown -R $USER:$USER /var/www/iqts-bot
sudo chmod -R 755 /var/www/iqts-bot

# Copy HTML file (you'll need to upload it first)
echo "📋 Copy your IQTS-Bot-Complete.html to /var/www/iqts-bot/index.html"
echo "You can use: scp IQTS-Bot-Complete.html user@your-server:/var/www/iqts-bot/index.html"

# Create Nginx configuration
echo "⚙️ Creating Nginx configuration..."
sudo tee /etc/nginx/sites-available/iqts-bot > /dev/null <<EOF
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    root /var/www/iqts-bot;
    index index.html;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    location / {
        try_files \$uri \$uri/ =404;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable site
echo "🔗 Enabling site..."
sudo ln -sf /etc/nginx/sites-available/iqts-bot /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
echo "🧪 Testing Nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid"
    sudo systemctl restart nginx
    sudo systemctl enable nginx
else
    echo "❌ Nginx configuration error!"
    exit 1
fi

echo ""
echo "🎉 Basic deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Upload your IQTS-Bot-Complete.html file:"
echo "   scp IQTS-Bot-Complete.html user@your-server:/var/www/iqts-bot/index.html"
echo ""
echo "2. Update domain in Nginx config:"
echo "   sudo nano /etc/nginx/sites-available/iqts-bot"
echo "   Replace 'your-domain.com' with your actual domain"
echo ""
echo "3. Get SSL certificate:"
echo "   sudo certbot --nginx -d your-domain.com -d www.your-domain.com"
echo ""
echo "4. Restart Nginx:"
echo "   sudo systemctl restart nginx"
echo ""
echo "🌐 Your IQTS Bot will be available at: https://your-domain.com"