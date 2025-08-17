#!/bin/bash

# ================================================================
# Reclama Golpe - Automated Deployment Script
# ================================================================
# This script automates the deployment of the Reclama Golpe platform
# Including: PostgreSQL, Nginx, Node.js, PM2, SSL certificates
# ================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "This script must be run as root (use sudo)"
    fi
}

# Load configuration
load_config() {
    if [ ! -f "deploy.config" ]; then
        log_error "deploy.config not found. Copy deploy.config.example to deploy.config and configure it."
    fi
    source deploy.config
    log_success "Configuration loaded successfully"
}

# Update system
update_system() {
    log_info "Updating system packages..."
    
    # Wait for any running apt-get processes to finish
    while fuser /var/lib/dpkg/lock-frontend >/dev/null 2>&1; do
        log_warning "Waiting for another apt process to finish..."
        sleep 5
    done
    
    # Clean any potential locks
    rm -f /var/lib/apt/lists/lock
    rm -f /var/cache/apt/archives/lock
    rm -f /var/lib/dpkg/lock-frontend
    rm -f /var/lib/dpkg/lock
    
    # Configure any pending packages
    dpkg --configure -a || true
    
    # Update and upgrade
    apt-get update -y
    apt-get upgrade -y
    apt-get install -y curl wget git build-essential software-properties-common
    log_success "System updated"
}

# Install PostgreSQL
install_postgresql() {
    log_info "Installing PostgreSQL..."
    
    # Add PostgreSQL official APT repository
    sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
    wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
    apt-get update -y
    
    # Install PostgreSQL
    apt-get install -y postgresql-15 postgresql-client-15 postgresql-contrib-15
    
    # Start and enable PostgreSQL
    systemctl start postgresql
    systemctl enable postgresql
    
    log_success "PostgreSQL installed"
    
    # Create database and user
    log_info "Setting up database..."
    sudo -u postgres psql <<EOF
CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';
CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};
GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
EOF
    
    log_success "Database configured"
}

# Install Node.js
install_nodejs() {
    log_info "Installing Node.js v${NODE_VERSION}..."
    
    # Install Node.js using NodeSource repository
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
    apt-get install -y nodejs
    
    # Verify Node.js installation
    node_version=$(node -v)
    npm_version=$(npm -v)
    log_info "Node.js installed: ${node_version}"
    log_info "NPM installed: ${npm_version}"
    
    # Get npm global prefix
    NPM_PREFIX=$(npm config get prefix)
    log_info "NPM prefix: ${NPM_PREFIX}"
    
    # Install Yarn Classic (1.x)
    log_info "Installing Yarn..."
    npm install -g yarn@1.22.22 --force
    
    # Add npm global bin to PATH
    export PATH="$PATH:${NPM_PREFIX}/bin"
    echo "export PATH=\"\$PATH:${NPM_PREFIX}/bin\"" >> /root/.bashrc
    
    # Create symlink for yarn if needed
    if [ ! -f /usr/local/bin/yarn ]; then
        if [ -f "${NPM_PREFIX}/lib/node_modules/yarn/bin/yarn.js" ]; then
            ln -sf "${NPM_PREFIX}/lib/node_modules/yarn/bin/yarn.js" /usr/local/bin/yarn
            chmod +x /usr/local/bin/yarn
            log_info "Created yarn symlink"
        elif [ -f "${NPM_PREFIX}/bin/yarn" ]; then
            ln -sf "${NPM_PREFIX}/bin/yarn" /usr/local/bin/yarn
            chmod +x /usr/local/bin/yarn
            log_info "Created yarn symlink from bin"
        fi
    fi
    
    # Alternative: Install yarn using official script as fallback
    if ! command -v yarn &> /dev/null; then
        log_warning "Yarn not found, trying alternative installation..."
        curl -o- -L https://yarnpkg.com/install.sh | bash
        export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"
        echo 'export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"' >> /root/.bashrc
    fi
    
    # Disable Corepack to avoid conflicts
    if command -v corepack &> /dev/null; then
        corepack disable || true
    fi
    
    # Source bashrc to update PATH
    source /root/.bashrc || true
    
    # Final verification
    if command -v yarn &> /dev/null; then
        yarn_version=$(yarn -v)
        log_success "Yarn installed: ${yarn_version}"
    else
        log_warning "Yarn not found in PATH, will use npm as fallback"
    fi
    
    log_success "Node.js and package manager installed"
}

# Install PM2
install_pm2() {
    log_info "Installing PM2..."
    npm install -g pm2
    pm2 startup systemd -u root --hp /root
    log_success "PM2 installed"
}

# Install Nginx
install_nginx() {
    log_info "Installing Nginx..."
    apt-get install -y nginx
    systemctl start nginx
    systemctl enable nginx
    log_success "Nginx installed"
}

# Install Certbot for SSL
install_certbot() {
    if [ "$USE_SSL" == "true" ]; then
        log_info "Installing Certbot for SSL certificates..."
        apt-get install -y certbot python3-certbot-nginx
        log_success "Certbot installed"
    fi
}

# Clone and setup project
setup_project() {
    log_info "Setting up project..."
    
    # Create directory
    mkdir -p ${INSTALL_PATH}
    cd ${INSTALL_PATH}
    
    # Clone repository
    if [ -d ".git" ]; then
        log_info "Repository exists, pulling latest changes..."
        git pull origin ${GITHUB_BRANCH}
    else
        log_info "Cloning repository..."
        git clone -b ${GITHUB_BRANCH} ${GITHUB_REPO} .
    fi
    
    # Fix Yarn/Corepack issues
    log_info "Fixing Yarn configuration..."
    # Remove packageManager from package.json to avoid Corepack conflicts
    if grep -q '"packageManager"' package.json; then
        sed -i '/"packageManager":/d' package.json
        log_info "Removed packageManager field from package.json"
    fi
    
    # Try to enable Corepack if available, but don't fail if not
    if command -v corepack &> /dev/null; then
        corepack enable || log_warning "Could not enable Corepack, using classic Yarn"
    fi
    
    # Install dependencies
    log_info "Installing dependencies..."
    # Try yarn first if available, otherwise use npm
    if command -v yarn &> /dev/null; then
        log_info "Using Yarn to install dependencies..."
        yarn install --ignore-engines || {
            log_warning "Yarn install failed, trying npm..."
            npm install
        }
    else
        log_info "Using NPM to install dependencies..."
        npm install
    fi
    
    # Create environment files
    create_env_files
    
    # Run database migrations
    log_info "Running database migrations..."
    cd apps/api
    npx prisma generate
    npx prisma migrate deploy
    cd ../..
    
    # Build projects
    log_info "Building projects..."
    # Try yarn first, fallback to npm
    if command -v yarn &> /dev/null; then
        yarn build || npm run build
    else
        npm run build
    fi
    
    log_success "Project setup completed"
}

# Create environment files
create_env_files() {
    log_info "Creating environment files..."
    
    # API .env
    cat > apps/api/.env <<EOF
# Database
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public"

# JWT
JWT_SECRET="${JWT_SECRET}"

# App
PORT=${APP_PORT}
NODE_ENV=${NODE_ENV}

# CORS
CORS_ORIGIN="https://${DOMAIN},https://${WWW_DOMAIN},http://localhost:3000"

# Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR="./uploads"
EOF

    # Web .env.local
    cat > apps/web/.env.local <<EOF
NEXT_PUBLIC_API_URL=https://${DOMAIN}/api
NEXT_PUBLIC_APP_URL=https://${DOMAIN}
EOF

    log_success "Environment files created"
}

# Configure Nginx
configure_nginx() {
    log_info "Configuring Nginx..."
    
    # Create Nginx configuration
    cat > ${NGINX_SITES_PATH}/${DOMAIN} <<EOF
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} ${WWW_DOMAIN};
    
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}

# Main server block
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${DOMAIN} ${WWW_DOMAIN};

    # SSL Configuration (will be managed by Certbot)
    # ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: ws: wss: data: blob: 'unsafe-inline'; frame-ancestors 'self';" always;
    
    # Logging
    access_log /var/log/nginx/${DOMAIN}.access.log;
    error_log /var/log/nginx/${DOMAIN}.error.log;
    
    # File upload size
    client_max_body_size 10M;
    
    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # API proxy
    location /api {
        proxy_pass http://localhost:${APP_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # Remove /api prefix
        rewrite ^/api(.*)\$ \$1 break;
    }
    
    # Static uploads
    location /uploads {
        alias ${INSTALL_PATH}/apps/api/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # Next.js app
    location / {
        proxy_pass http://localhost:${WEB_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

    # Enable site
    ln -sf ${NGINX_SITES_PATH}/${DOMAIN} ${NGINX_ENABLED_PATH}/
    
    # Test Nginx configuration
    nginx -t
    
    # Reload Nginx
    systemctl reload nginx
    
    log_success "Nginx configured"
}

# Setup SSL
setup_ssl() {
    if [ "$USE_SSL" == "true" ]; then
        log_info "Setting up SSL certificates..."
        certbot --nginx -d ${DOMAIN} -d ${WWW_DOMAIN} --non-interactive --agree-tos -m ${CERTBOT_EMAIL}
        
        # Setup auto-renewal
        echo "0 0,12 * * * root certbot renew --quiet" >> /etc/crontab
        
        log_success "SSL certificates configured"
    fi
}

# Setup PM2 processes
setup_pm2() {
    log_info "Setting up PM2 processes..."
    
    cd ${INSTALL_PATH}
    
    # Create PM2 ecosystem file
    cat > ecosystem.config.js <<EOF
module.exports = {
  apps: [
    {
      name: '${PM2_APP_NAME}',
      script: 'dist/main.js',
      cwd: './apps/api',
      instances: ${PM2_INSTANCES},
      exec_mode: 'cluster',
      env: {
        NODE_ENV: '${NODE_ENV}',
        PORT: ${APP_PORT}
      },
      max_memory_restart: '${NODE_MAX_MEMORY}M',
      error_file: '${LOG_PATH}/api-error.log',
      out_file: '${LOG_PATH}/api-out.log',
      log_file: '${LOG_PATH}/api-combined.log',
      time: true
    },
    {
      name: '${PM2_WEB_NAME}',
      script: 'yarn',
      args: 'start',
      cwd: './apps/web',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: '${NODE_ENV}',
        PORT: ${WEB_PORT}
      },
      max_memory_restart: '${NODE_MAX_MEMORY}M',
      error_file: '${LOG_PATH}/web-error.log',
      out_file: '${LOG_PATH}/web-out.log',
      log_file: '${LOG_PATH}/web-combined.log',
      time: true
    }
  ]
};
EOF

    # Create log directory
    mkdir -p ${LOG_PATH}
    
    # Start applications
    pm2 start ecosystem.config.js
    pm2 save
    
    log_success "PM2 processes configured and started"
}

# Setup firewall
setup_firewall() {
    log_info "Setting up firewall..."
    
    # Install UFW
    apt-get install -y ufw
    
    # Configure UFW
    ufw default deny incoming
    ufw default allow outgoing
    ufw allow ssh
    ufw allow 80/tcp
    ufw allow 443/tcp
    
    # Enable UFW
    ufw --force enable
    
    log_success "Firewall configured"
}

# Setup backup script
setup_backup() {
    log_info "Setting up backup script..."
    
    mkdir -p ${BACKUP_PATH}
    
    cat > /usr/local/bin/backup-reclamagolpe.sh <<EOF
#!/bin/bash
# Backup script for Reclama Golpe

BACKUP_DIR="${BACKUP_PATH}/\$(date +%Y%m%d_%H%M%S)"
mkdir -p \${BACKUP_DIR}

# Backup database
pg_dump -U ${DB_USER} -h ${DB_HOST} ${DB_NAME} > \${BACKUP_DIR}/database.sql

# Backup uploads
tar -czf \${BACKUP_DIR}/uploads.tar.gz -C ${INSTALL_PATH}/apps/api uploads/

# Backup environment files
cp ${INSTALL_PATH}/apps/api/.env \${BACKUP_DIR}/api.env
cp ${INSTALL_PATH}/apps/web/.env.local \${BACKUP_DIR}/web.env

# Remove old backups
find ${BACKUP_PATH} -type d -mtime +${BACKUP_RETENTION_DAYS} -exec rm -rf {} +

echo "Backup completed: \${BACKUP_DIR}"
EOF

    chmod +x /usr/local/bin/backup-reclamagolpe.sh
    
    # Add to crontab (daily at 2 AM)
    echo "0 2 * * * root /usr/local/bin/backup-reclamagolpe.sh" >> /etc/crontab
    
    log_success "Backup script configured"
}

# Setup monitoring
setup_monitoring() {
    if [ "$ENABLE_MONITORING" == "true" ]; then
        log_info "Setting up monitoring..."
        
        # Install monitoring dependencies
        npm install -g pm2-logrotate
        pm2 install pm2-logrotate
        pm2 set pm2-logrotate:max_size 50M
        pm2 set pm2-logrotate:retain 7
        
        log_success "Monitoring configured"
    fi
}

# Create systemd service
create_systemd_service() {
    log_info "Creating systemd service..."
    
    cat > /etc/systemd/system/reclamagolpe.service <<EOF
[Unit]
Description=Reclama Golpe Platform
After=network.target

[Service]
Type=forking
User=root
LimitNOFILE=infinity
LimitNPROC=infinity
LimitCORE=infinity
Environment=PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
Environment=NODE_ENV=${NODE_ENV}
PIDFile=/root/.pm2/pm2.pid
Restart=on-failure

ExecStart=/usr/bin/pm2 start ${INSTALL_PATH}/ecosystem.config.js
ExecReload=/usr/bin/pm2 reload all
ExecStop=/usr/bin/pm2 kill

[Install]
WantedBy=multi-user.target
EOF

    systemctl daemon-reload
    systemctl enable reclamagolpe.service
    
    log_success "Systemd service created"
}

# Main execution
main() {
    log_info "Starting Reclama Golpe deployment..."
    
    check_root
    load_config
    update_system
    install_postgresql
    install_nodejs
    install_pm2
    install_nginx
    install_certbot
    setup_project
    configure_nginx
    setup_ssl
    setup_pm2
    setup_firewall
    setup_backup
    setup_monitoring
    create_systemd_service
    
    log_success "=====================================  ====="
    log_success "Deployment completed successfully!"
    log_success "============================================"
    log_success ""
    log_success "Application is running at:"
    log_success "  - Web: https://${DOMAIN}"
    log_success "  - API: https://${DOMAIN}/api"
    log_success ""
    log_success "PM2 Commands:"
    log_success "  - View status: pm2 status"
    log_success "  - View logs: pm2 logs"
    log_success "  - Restart all: pm2 restart all"
    log_success ""
    log_success "Backup location: ${BACKUP_PATH}"
    log_success "Logs location: ${LOG_PATH}"
    log_success ""
    log_warning "Don't forget to:"
    log_warning "  1. Update DNS records to point to this server"
    log_warning "  2. Configure firewall rules in your cloud provider"
    log_warning "  3. Set up monitoring alerts"
    log_warning "  4. Test the backup script: /usr/local/bin/backup-reclamagolpe.sh"
}

# Run main function
main "$@"