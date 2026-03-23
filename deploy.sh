#!/bin/bash
# Synapsy Deploy Script — VPS Aruba
# Usage: bash deploy.sh

set -e

VPS_HOST="188.213.170.214"
VPS_USER="root"
SSH_KEY="$HOME/.ssh/aruba_vps"
REMOTE_DIR="/var/www/synapsy"
APP_NAME="synapsy"

echo "=== Synapsy Deploy ==="

# 1. Build locally
echo "[1/5] Building Next.js..."
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/synapsy npm run build

# 2. Sync to VPS
echo "[2/5] Syncing to VPS..."
ssh -i $SSH_KEY $VPS_USER@$VPS_HOST "mkdir -p $REMOTE_DIR/logs"

rsync -avz --delete \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=.env.local \
  --exclude=.next/cache \
  -e "ssh -i $SSH_KEY" \
  . $VPS_USER@$VPS_HOST:$REMOTE_DIR/

# 3. Install deps and setup on VPS
echo "[3/5] Installing dependencies on VPS..."
ssh -i $SSH_KEY $VPS_USER@$VPS_HOST << 'REMOTE_SCRIPT'
cd /var/www/synapsy

# Install Node.js deps
npm install --production

# Create .env.local if not exists
if [ ! -f .env.local ]; then
  cat > .env.local << 'ENV'
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/synapsy
BETTER_AUTH_SECRET=$(openssl rand -hex 32)
BETTER_AUTH_URL=https://synapsy.vibecanyon.com
NEXT_PUBLIC_APP_URL=https://synapsy.vibecanyon.com
NEXT_PUBLIC_APP_NAME=Synapsy
CRON_SECRET=$(openssl rand -hex 16)
NODE_ENV=production
ENV
  echo "Created .env.local"
fi

# Create database if not exists
sudo -u postgres psql -c "CREATE DATABASE synapsy;" 2>/dev/null || echo "DB already exists"

# Run migrations
node -e "
const { Pool } = require('pg');
const fs = require('fs');
const pool = new Pool({ connectionString: 'postgresql://postgres:postgres@localhost:5432/synapsy' });
const migDir = './drizzle';
const files = fs.readdirSync(migDir).filter(f => f.endsWith('.sql')).sort();
(async () => {
  for (const f of files) {
    const sql = fs.readFileSync(migDir + '/' + f, 'utf8');
    const stmts = sql.split('--> statement-breakpoint').map(s => s.trim()).filter(s => s.length > 0);
    for (const stmt of stmts) {
      try { await pool.query(stmt); } catch(e) { /* ignore existing */ }
    }
    console.log('Applied:', f);
  }
  pool.end();
})();
"

# Restart PM2 app
pm2 delete synapsy 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

echo "App started on port 3008"
REMOTE_SCRIPT

# 4. Setup Nginx
echo "[4/5] Configuring Nginx..."
ssh -i $SSH_KEY $VPS_USER@$VPS_HOST << 'NGINX_SCRIPT'
# Create nginx config
cat > /etc/nginx/sites-available/synapsy << 'NGINX'
server {
    listen 80;
    server_name synapsy.vibecanyon.com;

    location / {
        proxy_pass http://127.0.0.1:3008;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Static assets caching
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3008;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }
}
NGINX

# Enable site
ln -sf /etc/nginx/sites-available/synapsy /etc/nginx/sites-enabled/synapsy

# Test and reload nginx
nginx -t && systemctl reload nginx

echo "Nginx configured for synapsy.vibecanyon.com"
NGINX_SCRIPT

# 5. Setup SSL
echo "[5/5] Setting up SSL..."
ssh -i $SSH_KEY $VPS_USER@$VPS_HOST "certbot --nginx -d synapsy.vibecanyon.com --non-interactive --agree-tos --redirect -m admin@vibecanyon.com 2>/dev/null || echo 'SSL already configured or certbot not ready yet'"

echo ""
echo "=== Deploy Complete ==="
echo "URL: https://synapsy.vibecanyon.com"
