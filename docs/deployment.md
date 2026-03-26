# MyA Deployment Guide

This guide covers deploying MyA to a VPS using Docker and Docker Compose.

## Prerequisites

- VPS with Ubuntu 20.04+ (recommended)
- Docker installed: https://docs.docker.com/engine/install/ubuntu/
- Docker Compose installed: https://docs.docker.com/compose/install/
- Domain name (optional, for production with HTTPS)
- SSH access to VPS

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        VPS                                   │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │   Nginx     │  │  Backend     │  │   PostgreSQL    │   │
│  │  (Reverse   │──│  (Express)   │──│   (Database)    │   │
│  │   Proxy)    │  │   :3001      │  │    :5432        │   │
│  │    :80      │  └──────────────┘  └─────────────────┘   │
│  │   :443      │                                             │
│  └─────────────┘                                             │
└─────────────────────────────────────────────────────────────┘
```

## Step 1: Prepare VPS

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

## Step 2: Deploy Application

### Clone repository
```bash
git clone https://github.com/your-repo/mya.git
cd mya
```

### Configure environment variables

Create `.env` file in project root:
```bash
# Backend
DATABASE_URL="postgresql://mya_user:mya_pass123@postgres:5432/mya_db"
JWT_SECRET="your-secure-random-secret-here"
PORT=3001

# Frontend (Vite)
VITE_API_URL=http://localhost:3001
```

### Start services
```bash
# Start all containers
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

## Step 3: Database Migration

After first start, run Prisma migrations:
```bash
# Run migrations inside backend container
docker-compose exec backend npx prisma migrate deploy

# Or for development
docker-compose exec backend npx prisma migrate dev
```

## Step 4: Nginx Configuration

The `docker-compose.yml` includes an nginx service. For production, use this nginx config:

```nginx
# /etc/nginx/sites-available/mya
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:3001/api/health;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/mya /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 5: Automated Backups

### Setup backup script
```bash
# Make script executable
chmod +x scripts/backup.sh

# Test backup
./scripts/backup.sh
```

### Schedule daily backups with cron
```bash
# Edit crontab
crontab -e

# Add line (runs daily at 2 AM)
0 2 * * * /path/to/mya/scripts/backup.sh >> /var/log/mya-backup.log 2>&1
```

### Backup environment variables
Create `/etc/default/mya-backup`:
```bash
export DB_NAME=mya_db
export DB_USER=mya_user
export DB_PASSWORD=mya_pass123
export DB_HOST=localhost
export BACKUP_DIR=/path/to/backups
```

## Step 6: SSL/HTTPS (Production)

Using Let's Encrypt:
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal test
sudo certbot renew --dry-run
```

## Step 7: Monitoring

### Health check
```bash
curl http://localhost:3001/api/health
```

### View logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs -f backend
docker-compose logs -f nginx
```

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | Secret for JWT token signing | Required |
| `PORT` | Backend server port | 3001 |
| `NODE_ENV` | Environment (production/development) | development |

## Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs

# Restart specific service
docker-compose restart backend
```

### Database connection failed
```bash
# Check PostgreSQL
docker-compose logs postgres

# Verify connection
docker-compose exec backend nc -zv postgres 5432
```

### Reset database
```bash
# WARNING: This deletes all data
docker-compose down -v
docker-compose up -d
docker-compose exec backend npx prisma migrate deploy
```

## Security Checklist

- [ ] Change default database passwords
- [ ] Use strong JWT_SECRET
- [ ] Enable firewall (UFW)
- [ ] Setup automated backups
- [ ] Enable SSL/HTTPS
- [ ] Regular security updates

## Backup & Restore

### Manual backup
```bash
./scripts/backup.sh
```

### Restore from backup
```bash
# Copy backup to container
docker cp backups/mya_backup_20240324_120000.sql.gz backend:/tmp/

# Restore
docker-compose exec -T backend gunzip < /tmp/mya_backup_*.sql.gz | psql -U mya_user -d mya_db
```

## Quick Commands

```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# Rebuild
docker-compose build --no-cache

# View status
docker-compose ps

# Logs
docker-compose logs -f
```