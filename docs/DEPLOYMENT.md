# Production Deployment Guide

## Prerequisites

- Linux server (Ubuntu 20.04+ recommended)
- Node.js 18+ installed
- Nginx (for reverse proxy)
- SSL certificate (Let's Encrypt recommended)
- Domain name pointing to your server

## Production Setup

### 1. Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (using NodeSource repository)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Nginx
sudo apt install nginx -y

# Install PM2 for process management
sudo npm install -g pm2
```

### 2. Application Deployment

```bash
# Create application directory
sudo mkdir -p /opt/accounts-receivable
sudo chown $USER:$USER /opt/accounts-receivable

# Copy your application files
cd /opt/accounts-receivable
# Upload your project files here

# Install dependencies
cd backend
npm ci --production

cd ../frontend
npm ci
npm run build
```

### 3. Environment Configuration

```bash
# Create production environment file
cd /opt/accounts-receivable/backend
cp .env.example .env.production

# Edit with production values
nano .env.production
```

**Production .env values:**
```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your-very-secure-random-secret-min-32-chars
DB_PATH=/opt/accounts-receivable/data/accounts_receivable.db
CORS_ORIGIN=https://yourdomain.com
BCRYPT_ROUNDS=12
```

### 4. Database Setup

```bash
# Create data directory
mkdir -p /opt/accounts-receivable/data
mkdir -p /opt/accounts-receivable/logs

# Set permissions
chmod 755 /opt/accounts-receivable/data
chmod 755 /opt/accounts-receivable/logs
```

### 5. PM2 Configuration

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'accounts-receivable-api',
    script: './server.js',
    cwd: '/opt/accounts-receivable/backend',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    env_file: '.env.production',
    instances: 'max',
    exec_mode: 'cluster',
    error_file: '../logs/err.log',
    out_file: '../logs/out.log',
    log_file: '../logs/combined.log',
    time: true
  }]
};
```

Start with PM2:
```bash
cd /opt/accounts-receivable
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

### 6. Nginx Configuration

Create `/etc/nginx/sites-available/accounts-receivable`:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Serve React app
    root /opt/accounts-receivable/frontend/build;
    index index.html;

    # Handle React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Payment page direct access
    location /payment {
        try_files $uri $uri/ /index.html;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/accounts-receivable /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 7. SSL Certificate with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### 8. Firewall Configuration

```bash
# Configure UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 9. Backup Setup

Create backup script `/opt/accounts-receivable/backup.sh`:
```bash
#!/bin/bash
BACKUP_DIR="/opt/backups/accounts-receivable"
DB_FILE="/opt/accounts-receivable/data/accounts_receivable.db"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

mkdir -p $BACKUP_DIR

# Database backup
if [ -f "$DB_FILE" ]; then
    cp "$DB_FILE" "$BACKUP_DIR/backup_${TIMESTAMP}.db"
    gzip "$BACKUP_DIR/backup_${TIMESTAMP}.db"
    
    # Keep only last 30 days
    find $BACKUP_DIR -name "backup_*.db.gz" -mtime +30 -delete
fi

# Application backup
tar -czf "$BACKUP_DIR/app_backup_${TIMESTAMP}.tar.gz" \
    --exclude='node_modules' \
    --exclude='logs' \
    --exclude='data' \
    /opt/accounts-receivable
```

Add to crontab:
```bash
sudo crontab -e

# Add this line for daily backups at 2 AM
0 2 * * * /opt/accounts-receivable/backup.sh
```

### 10. Monitoring Setup

Create health check script `/opt/accounts-receivable/health-check.sh`:
```bash
#!/bin/bash
HEALTH_URL="https://yourdomain.com/api/health"
LOG_FILE="/opt/accounts-receivable/logs/health-check.log"

if ! curl -f -s $HEALTH_URL > /dev/null; then
    echo "$(date): Health check failed - restarting application" >> $LOG_FILE
    pm2 restart accounts-receivable-api
    
    # Send alert (configure your notification method)
    # mail -s "Accounts Receivable Service Restarted" admin@yourdomain.com < /dev/null
fi
```

Add to crontab for every 5 minutes:
```bash
*/5 * * * * /opt/accounts-receivable/health-check.sh
```

## Security Checklist

- [ ] Strong JWT secret (minimum 32 characters)
- [ ] Database file permissions (600)
- [ ] Application running as non-root user
- [ ] Firewall configured
- [ ] SSL certificate installed and auto-renewal enabled
- [ ] Security headers configured in Nginx
- [ ] Regular security updates scheduled
- [ ] Backup system configured and tested
- [ ] Monitoring and alerting set up
- [ ] Default admin password changed

## Maintenance

### Regular Tasks

1. **Update dependencies:**
```bash
cd /opt/accounts-receivable/backend
npm audit fix
npm update
pm2 restart accounts-receivable-api
```

2. **Check logs:**
```bash
pm2 logs accounts-receivable-api
tail -f /opt/accounts-receivable/logs/combined.log
```

3. **Monitor disk space:**
```bash
df -h
du -sh /opt/accounts-receivable/logs/*
```

4. **Test backups:**
```bash
# Restore backup to test environment
# Verify data integrity
```

### Scaling Considerations

For high-traffic deployments:

1. **Database Migration:**
   - Move from SQLite to PostgreSQL/MySQL
   - Implement connection pooling
   - Add database replication

2. **Load Balancing:**
   - Multiple application instances
   - Redis for session storage
   - CDN for static assets

3. **Monitoring:**
   - Application Performance Monitoring (APM)
   - Server monitoring (CPU, RAM, disk)
   - Error tracking and alerting

This deployment guide provides a production-ready setup with security, monitoring, and backup considerations.
