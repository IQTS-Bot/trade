# VPS Deployment Guide for IQTS Bot

## 🚀 Deploy Your IQTS Bot to VPS with Custom Domain

### Prerequisites
- VPS server (Ubuntu 20.04+ recommended)
- Domain name pointing to your VPS IP
- SSH access to your server

---

## 📋 **Method 1: Nginx + Static Hosting (Recommended)**

### Step 1: Prepare Your VPS
```bash
# SSH into your VPS
ssh root@your-server-ip

# Run the deployment script
bash Deploy\ to\ VPS.sh
```

### Step 2: Upload Your IQTS Bot
```bash
# From your local machine
scp IQTS-Bot-Complete.html root@your-server-ip:/var/www/iqts-bot/index.html

# Or upload via SFTP/FileZilla to: /var/www/iqts-bot/index.html
```

### Step 3: Configure Your Domain
```bash
# On your VPS, edit the Nginx config
sudo nano /etc/nginx/sites-available/iqts-bot

# Replace 'your-domain.com' with your actual domain
# Example: tradingbot.yourdomain.com
```

### Step 4: Get SSL Certificate
```bash
# Install free SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Choose option 2 (redirect HTTP to HTTPS)
```

### Step 5: Restart Services
```bash
sudo systemctl restart nginx
sudo systemctl status nginx
```

---

## 🔧 **Method 2: Docker Deployment**

### Create Dockerfile
```dockerfile
FROM nginx:alpine
COPY IQTS-Bot-Complete.html /usr/share/nginx/html/index.html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
```

### Docker Commands
```bash
# Build image
docker build -t iqts-bot .

# Run container
docker run -d -p 80:80 --name iqts-bot-container iqts-bot

# With SSL (using reverse proxy)
docker run -d -p 443:443 -p 80:80 \
  -v /etc/letsencrypt:/etc/letsencrypt \
  --name iqts-bot-ssl iqts-bot
```

---

## 🌐 **Method 3: Apache Hosting**

### Install Apache
```bash
sudo apt update
sudo apt install apache2 -y
```

### Configure Site
```bash
# Create site config
sudo nano /etc/apache2/sites-available/iqts-bot.conf

# Add configuration:
<VirtualHost *:80>
    ServerName yourdomain.com
    ServerAlias www.yourdomain.com
    DocumentRoot /var/www/iqts-bot
    
    <Directory /var/www/iqts-bot>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>

# Enable site
sudo a2ensite iqts-bot.conf
sudo systemctl restart apache2
```

---

## 🔒 **Security Configuration**

### 1. Firewall Setup
```bash
# Ubuntu UFW
sudo ufw allow 22      # SSH
sudo ufw allow 80      # HTTP
sudo ufw allow 443     # HTTPS
sudo ufw enable
```

### 2. Basic Authentication (Optional)
```bash
# Create password file
sudo htpasswd -c /etc/nginx/.htpasswd admin

# Add to Nginx config:
auth_basic "Restricted Access";
auth_basic_user_file /etc/nginx/.htpasswd;
```

### 3. IP Whitelist (Optional)
```bash
# Add to Nginx server block:
allow YOUR_IP_ADDRESS;
deny all;
```

---

## 📱 **Domain Configuration**

### DNS Records Setup
```
Type: A
Name: @ (or your subdomain)
Value: YOUR_VPS_IP
TTL: 300

Type: CNAME  
Name: www
Value: yourdomain.com
TTL: 300
```

### Subdomain Examples
- `trading.yourdomain.com`
- `bot.yourdomain.com`
- `iqts.yourdomain.com`

---

## 🚀 **Quick Deploy Commands**

### One-Line Deploy
```bash
# Complete deployment in one command
curl -sSL https://raw.githubusercontent.com/your-repo/iqts-bot/main/deploy.sh | bash
```

### File Upload Options
```bash
# SCP (secure copy)
scp IQTS-Bot-Complete.html user@server:/var/www/iqts-bot/index.html

# RSYNC (with progress)
rsync -avP IQTS-Bot-Complete.html user@server:/var/www/iqts-bot/index.html

# SFTP
sftp user@server
put IQTS-Bot-Complete.html /var/www/iqts-bot/index.html
```

---

## 🔍 **Troubleshooting**

### Check Nginx Status
```bash
sudo systemctl status nginx
sudo nginx -t
tail -f /var/log/nginx/error.log
```

### Check SSL Certificate
```bash
sudo certbot certificates
sudo certbot renew --dry-run
```

### File Permissions
```bash
sudo chown -R www-data:www-data /var/www/iqts-bot
sudo chmod -R 755 /var/www/iqts-bot
```

### Test Domain Resolution
```bash
nslookup yourdomain.com
dig yourdomain.com
```

---

## 📊 **Performance Optimization**

### Enable Caching
```nginx
# Add to Nginx config
location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Enable Compression
```nginx
gzip on;
gzip_types text/plain text/css application/javascript application/json;
```

### Add Security Headers
```nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-XSS-Protection "1; mode=block";
add_header X-Content-Type-Options "nosniff";
```

---

## 🎯 **Success Checklist**

- [ ] VPS server accessible via SSH
- [ ] Domain pointing to VPS IP
- [ ] Nginx/Apache installed and running
- [ ] IQTS Bot file uploaded
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] Site accessible via HTTPS
- [ ] Trading bot functions working
- [ ] Audio notifications enabled
- [ ] API connections working

---

## 📞 **Support Commands**

```bash
# Check if site is live
curl -I https://yourdomain.com

# Test SSL
openssl s_client -connect yourdomain.com:443

# Monitor logs
tail -f /var/log/nginx/access.log
```

Your IQTS Bot will be available at: **https://yourdomain.com**
