#!/bin/bash

# ================================================================
# Reclama Golpe - Rollback Script
# ================================================================
# Emergency rollback script for quick recovery
# ================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Load configuration
source deploy.config

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# List available backups
list_backups() {
    log_info "Available backups:"
    ls -la ${BACKUP_PATH} | grep ^d | awk '{print $9}' | tail -n +3
}

# Perform rollback
rollback() {
    BACKUP_DIR=$1
    
    if [ ! -d "${BACKUP_PATH}/${BACKUP_DIR}" ]; then
        log_error "Backup directory not found: ${BACKUP_PATH}/${BACKUP_DIR}"
        exit 1
    fi
    
    log_warning "This will rollback to backup: ${BACKUP_DIR}"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Rollback cancelled"
        exit 0
    fi
    
    # Stop services
    log_info "Stopping services..."
    pm2 stop all
    
    # Restore database
    log_info "Restoring database..."
    sudo -u postgres psql -c "DROP DATABASE IF EXISTS ${DB_NAME};"
    sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};"
    sudo -u postgres psql ${DB_NAME} < ${BACKUP_PATH}/${BACKUP_DIR}/database.sql
    
    # Restore uploads
    log_info "Restoring uploads..."
    rm -rf ${INSTALL_PATH}/apps/api/uploads
    tar -xzf ${BACKUP_PATH}/${BACKUP_DIR}/uploads.tar.gz -C ${INSTALL_PATH}/apps/api/
    
    # Restore environment files
    log_info "Restoring environment files..."
    cp ${BACKUP_PATH}/${BACKUP_DIR}/api.env ${INSTALL_PATH}/apps/api/.env
    cp ${BACKUP_PATH}/${BACKUP_DIR}/web.env ${INSTALL_PATH}/apps/web/.env.local
    
    # Rebuild and restart
    log_info "Rebuilding application..."
    cd ${INSTALL_PATH}
    yarn install
    yarn build
    
    # Restart services
    log_info "Restarting services..."
    pm2 restart all
    
    log_success "Rollback completed successfully!"
}

# Main menu
main() {
    echo "=================================="
    echo "Reclama Golpe - Rollback Utility"
    echo "=================================="
    echo ""
    echo "1. List available backups"
    echo "2. Rollback to specific backup"
    echo "3. Exit"
    echo ""
    read -p "Select option: " option
    
    case $option in
        1)
            list_backups
            ;;
        2)
            list_backups
            echo ""
            read -p "Enter backup directory name: " backup_dir
            rollback $backup_dir
            ;;
        3)
            exit 0
            ;;
        *)
            log_error "Invalid option"
            exit 1
            ;;
    esac
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
    log_error "This script must be run as root"
    exit 1
fi

main