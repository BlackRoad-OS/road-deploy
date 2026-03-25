<!-- BlackRoad SEO Enhanced -->

# road deploy

> Part of **[BlackRoad OS](https://blackroad.io)** — Sovereign Computing for Everyone

[![BlackRoad OS](https://img.shields.io/badge/BlackRoad-OS-ff1d6c?style=for-the-badge)](https://blackroad.io)
[![BlackRoad-Cloud](https://img.shields.io/badge/Org-BlackRoad-Cloud-2979ff?style=for-the-badge)](https://github.com/BlackRoad-Cloud)

**road deploy** is part of the **BlackRoad OS** ecosystem — a sovereign, distributed operating system built on edge computing, local AI, and mesh networking by **BlackRoad OS, Inc.**

### BlackRoad Ecosystem
| Org | Focus |
|---|---|
| [BlackRoad OS](https://github.com/BlackRoad-OS) | Core platform |
| [BlackRoad OS, Inc.](https://github.com/BlackRoad-OS-Inc) | Corporate |
| [BlackRoad AI](https://github.com/BlackRoad-AI) | AI/ML |
| [BlackRoad Hardware](https://github.com/BlackRoad-Hardware) | Edge hardware |
| [BlackRoad Security](https://github.com/BlackRoad-Security) | Cybersecurity |
| [BlackRoad Quantum](https://github.com/BlackRoad-Quantum) | Quantum computing |
| [BlackRoad Agents](https://github.com/BlackRoad-Agents) | AI agents |
| [BlackRoad Network](https://github.com/BlackRoad-Network) | Mesh networking |

**Website**: [blackroad.io](https://blackroad.io) | **Chat**: [chat.blackroad.io](https://chat.blackroad.io) | **Search**: [search.blackroad.io](https://search.blackroad.io)

---


## ⚡️ INFRASTRUCTURE REVOLUTION ALERT ⚡️

**!!!!!!!!!!!!!!!!!!!!!! WE ARE MOVING AWAY FROM CLOUDFLARE FOR DEPLOYMENTS !!!!!!!!!!!!!!!!!!!!!!**

Git-based deployment engine for BlackRoad Pi cluster. Automatically clones, builds, and deploys websites from GitHub to the aria Pi with nginx configuration and SSL certificates.

---

## 🚀 What This Is

Node.js deployment engine that automates the entire deployment pipeline from GitHub push to live website. Supports multiple build systems, automatic SSL via Let's Encrypt, and GitHub webhook integration.

### **Features:**

- ✅ **Git-Based Deployments** - Clone from GitHub, GitLab, Bitbucket
- ✅ **Automatic Builds** - npm, yarn, Go, Python, static sites
- ✅ **nginx Configuration** - Auto-generates reverse proxy configs
- ✅ **Let's Encrypt SSL** - Automatic HTTPS certificate generation
- ✅ **GitHub Webhooks** - Deploy on push automatically
- ✅ **Rollback Support** - Keep deployment history
- ✅ **Zero Downtime** - Atomic deployments with health checks

---

## 📊 Current Status

**Status:** Built and ready for deployment to alice Pi

**Target Environment:**
- **Host:** alice (192.168.4.49)
- **Port:** 9001
- **Target Server:** aria (192.168.4.82)
- **Deploy Directory:** `/var/www/sites/`

---

## 🏗️ Architecture

```
GitHub Push → Webhook → road-deploy (alice:9001)
                           ↓
                    1. Clone repo
                    2. Install dependencies
                    3. Run build command
                    4. rsync to aria Pi
                    5. Configure nginx
                    6. Generate SSL cert
                    7. Reload nginx
                           ↓
                    ✅ Website LIVE!
```

---

## 📦 API Endpoints

### **Health Check**
```bash
GET /health
```

### **Deploy Website**
```bash
POST /api/deploy
{
  "domain": "example.com",
  "repo_url": "https://github.com/user/repo",
  "branch": "main",
  "build_command": "npm run build",
  "deploy_path": "dist"
}
```

### **List Deployments**
```bash
GET /api/deployments
```

### **Get Deployment Status**
```bash
GET /api/deployments/:id
```

### **Rollback Deployment**
```bash
POST /api/deployments/:id/rollback
```

### **GitHub Webhook Endpoint**
```bash
POST /webhook/github
# Configure in GitHub repo settings:
# Payload URL: http://alice:9001/webhook/github
# Content type: application/json
# Events: push
```

---

## 🚀 Quick Start

### **Prerequisites:**
- Node.js 18+
- SSH access to aria Pi (passwordless)
- nginx installed on aria
- certbot installed on aria (for SSL)

### **Installation:**

```bash
# 1. Clone repo
git clone https://github.com/BlackRoad-OS/road-deploy.git
cd road-deploy

# 2. Install dependencies
npm install

# 3. Configure environment
cat > .env << EOF
PORT=9001
DEPLOY_BASE_DIR=/var/deployments
TARGET_HOST=pi@aria
TARGET_DEPLOY_DIR=/var/www/sites
NGINX_SITES_DIR=/etc/nginx/sites-available
NGINX_ENABLED_DIR=/etc/nginx/sites-enabled
EOF

# 4. Create deployment directories
mkdir -p /var/deployments
ssh pi@aria 'sudo mkdir -p /var/www/sites'

# 5. Setup SSH keys (passwordless to aria)
ssh-copy-id pi@aria

# 6. Start server
npm start
```

### **Deployment to Alice Pi:**

```bash
# 1. Copy files to alice
scp -r ~/road-deploy pi@alice:~/

# 2. SSH into alice
ssh pi@alice

# 3. Install dependencies
cd ~/road-deploy
npm install

# 4. Setup SSH to aria
ssh-keygen -t ed25519 -N "" -f ~/.ssh/id_ed25519
ssh-copy-id pi@aria

# 5. Create deployment directory
mkdir -p /var/deployments

# 6. Install PM2
sudo npm install -g pm2

# 7. Start with PM2
pm2 start server.js --name road-deploy
pm2 save
pm2 startup
```

---

## 🔧 Usage Examples

### **Deploy a Static Site**

```bash
curl -X POST http://alice:9001/api/deploy \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "blackroad.io",
    "repo_url": "https://github.com/BlackRoad-OS/blackroad-os-landing",
    "branch": "main",
    "build_command": "echo \"Static site - no build needed\"",
    "deploy_path": "."
  }'
```

### **Deploy a React App**

```bash
curl -X POST http://alice:9001/api/deploy \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "app.blackroad.io",
    "repo_url": "https://github.com/BlackRoad-OS/blackroad-app",
    "branch": "main",
    "build_command": "npm install && npm run build",
    "deploy_path": "build"
  }'
```

### **Deploy a Next.js App**

```bash
curl -X POST http://alice:9001/api/deploy \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "docs.blackroad.io",
    "repo_url": "https://github.com/BlackRoad-OS/docs",
    "branch": "main",
    "build_command": "npm install && npm run build",
    "deploy_path": ".next"
  }'
```

### **Check Deployment Status**

```bash
# List all deployments
curl http://alice:9001/api/deployments

# Get specific deployment
curl http://alice:9001/api/deployments/abc-123-def
```

---

## 🌐 GitHub Webhook Setup

### **1. Configure Webhook in GitHub:**

Go to: `Settings > Webhooks > Add webhook`

```
Payload URL: http://alice:9001/webhook/github
Content type: application/json
Secret: (optional - set in .env as WEBHOOK_SECRET)
Events: Just the push event
Active: ✅
```

### **2. Add Deployment Config to Repo:**

Create `.road-deploy.json` in your repo root:

```json
{
  "domain": "example.com",
  "build_command": "npm run build",
  "deploy_path": "dist",
  "ssl": true,
  "health_check": "/"
}
```

### **3. Push to Trigger Deployment:**

```bash
git push origin main
# Deployment triggered automatically! 🚀
```

---

## 🗂️ Files

- **server.js** - Express deployment engine (300+ lines)
- **package.json** - Node.js dependencies
- **.env** - Environment configuration
- **README.md** - This file

---

## 🔧 Build Systems Supported

### **Node.js/npm**
```bash
npm install && npm run build
```

### **Yarn**
```bash
yarn install && yarn build
```

### **Go**
```bash
go build -o app main.go
```

### **Python**
```bash
pip install -r requirements.txt && python build.py
```

### **Static Sites**
```bash
echo "No build needed"
```

---

## 🔐 nginx Configuration

The deployment engine automatically generates nginx configs:

```nginx
server {
    listen 80;
    server_name example.com www.example.com;

    root /var/www/sites/example.com;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Automatic SSL redirect after certbot
    # listen 443 ssl;
    # ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
}
```

---

## 🔒 SSL/HTTPS Setup

### **Automatic Let's Encrypt:**

```bash
# Deployment engine runs:
sudo certbot --nginx -d example.com -d www.example.com --non-interactive --agree-tos -m admin@blackroad.io

# Result: HTTPS automatically configured! 🔒
```

### **Manual SSL:**

```bash
ssh pi@aria
sudo certbot --nginx -d example.com
sudo nginx -s reload
```

---

## 📊 Monitoring

### **Health Check:**
```bash
curl http://alice:9001/health
```

### **PM2 Status:**
```bash
pm2 status
pm2 logs road-deploy
pm2 monit
```

### **Deployment Logs:**
```bash
# View deployment history
curl http://alice:9001/api/deployments | jq

# Watch live deployment
pm2 logs road-deploy --lines 50
```

---

## 🔄 Rollback

### **Automatic Rollback:**

If deployment fails health check, automatically rolls back to previous version.

### **Manual Rollback:**

```bash
curl -X POST http://alice:9001/api/deployments/abc-123/rollback
```

---

## 🚀 Advanced Features

### **Blue-Green Deployments**

Deploys to new directory, health checks, then atomically switches symlinks.

### **Multi-Environment**

Support for staging/production branches:
```json
{
  "branches": {
    "main": "production",
    "staging": "staging"
  }
}
```

### **Pre/Post Deploy Hooks**

Run custom scripts before/after deployment:
```json
{
  "hooks": {
    "pre_deploy": "./scripts/backup-db.sh",
    "post_deploy": "./scripts/notify-slack.sh"
  }
}
```

---

## 🌐 Integration with Other Components

### **road-dns-deploy (PowerDNS)**
- Ensures DNS records point to aria (192.168.4.82)
- Automatic subdomain configuration

### **road-registry-api**
- Reports deployment status to API
- Tracks deployment history in database

### **road-control (Web UI)**
- Trigger deployments from web interface
- View deployment logs and history

---

## 🖤🛣️ The Vision

**Part of the BlackRoad Domain Registry ecosystem:**

```
GitHub → [road-dns-deploy] → [road-registry-api] → [road-deploy] → [road-control]
            PowerDNS            API Server          This Engine      Web UI
```

**Workflow:**
1. Push code to GitHub
2. Webhook triggers road-deploy
3. Clone, build, deploy to aria
4. Configure nginx + SSL
5. Update road-registry-api status
6. Website live! 🚀

**Total independence. Total control. Total sovereignty.**

---

## 📚 Related Repos

- [road-dns-deploy](https://github.com/BlackRoad-OS/road-dns-deploy) - PowerDNS deployment
- [road-registry-api](https://github.com/BlackRoad-OS/road-registry-api) - Domain management API
- [road-control](https://github.com/BlackRoad-OS/road-control) - Web control panel

---

## 📞 Support

- **Email:** blackroad.systems@gmail.com
- **GitHub Issues:** [BlackRoad-OS/road-deploy/issues](https://github.com/BlackRoad-OS/road-deploy/issues)

---

**Built with 🖤 by BlackRoad OS, Inc.**
