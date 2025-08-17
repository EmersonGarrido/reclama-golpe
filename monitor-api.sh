#!/bin/bash

# ================================================================
# Reclama Golpe API - Health Check & Monitoring Script
# ================================================================

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
API_URL="https://api.reclamagolpe.com.br"
LOG_FILE="/var/log/reclamagolpe/monitoring.log"
ALERT_EMAIL="admin@reclamagolpe.com.br"

# Function to log
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# Function to send alert
send_alert() {
    # You can implement email alerts here
    echo -e "${RED}ALERT: $1${NC}"
    log_message "ALERT: $1"
}

# Check API health
check_api() {
    response=$(curl -s -o /dev/null -w "%{http_code}" "${API_URL}/health")
    if [ "$response" == "200" ]; then
        echo -e "${GREEN}✓${NC} API is healthy (HTTP $response)"
        return 0
    else
        echo -e "${RED}✗${NC} API is unhealthy (HTTP $response)"
        send_alert "API health check failed with HTTP $response"
        return 1
    fi
}

# Check database connection
check_database() {
    sudo -u postgres psql -c "SELECT 1" > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} Database is accessible"
        return 0
    else
        echo -e "${RED}✗${NC} Database is not accessible"
        send_alert "Database connection failed"
        return 1
    fi
}

# Check disk space
check_disk() {
    disk_usage=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ "$disk_usage" -lt 80 ]; then
        echo -e "${GREEN}✓${NC} Disk usage: ${disk_usage}%"
        return 0
    elif [ "$disk_usage" -lt 90 ]; then
        echo -e "${YELLOW}⚠${NC} Disk usage: ${disk_usage}% (Warning)"
        return 0
    else
        echo -e "${RED}✗${NC} Disk usage: ${disk_usage}% (Critical)"
        send_alert "Disk usage critical: ${disk_usage}%"
        return 1
    fi
}

# Check memory
check_memory() {
    memory_usage=$(free | grep Mem | awk '{print int($3/$2 * 100)}')
    if [ "$memory_usage" -lt 80 ]; then
        echo -e "${GREEN}✓${NC} Memory usage: ${memory_usage}%"
        return 0
    elif [ "$memory_usage" -lt 90 ]; then
        echo -e "${YELLOW}⚠${NC} Memory usage: ${memory_usage}% (Warning)"
        return 0
    else
        echo -e "${RED}✗${NC} Memory usage: ${memory_usage}% (Critical)"
        send_alert "Memory usage critical: ${memory_usage}%"
        return 1
    fi
}

# Check PM2 processes
check_pm2() {
    if command -v pm2 &> /dev/null; then
        pm2_status=$(pm2 jlist 2>/dev/null)
        if [ -n "$pm2_status" ]; then
            api_running=$(echo "$pm2_status" | jq -r '.[] | select(.name=="reclamagolpe-api") | .pm2_env.status' 2>/dev/null)
            if [ "$api_running" == "online" ]; then
                echo -e "${GREEN}✓${NC} API process is running"
                return 0
            else
                echo -e "${RED}✗${NC} API process is not running"
                send_alert "API process is not running in PM2"
                return 1
            fi
        else
            echo -e "${YELLOW}⚠${NC} PM2 is installed but no processes found"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠${NC} PM2 is not installed"
        return 1
    fi
}

# Check SSL certificate
check_ssl() {
    domain="api.reclamagolpe.com.br"
    cert_expiry=$(echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | openssl x509 -noout -dates 2>/dev/null | grep notAfter | cut -d= -f2)
    
    if [ -n "$cert_expiry" ]; then
        expiry_epoch=$(date -d "$cert_expiry" +%s)
        current_epoch=$(date +%s)
        days_remaining=$(( ($expiry_epoch - $current_epoch) / 86400 ))
        
        if [ "$days_remaining" -gt 30 ]; then
            echo -e "${GREEN}✓${NC} SSL certificate expires in $days_remaining days"
            return 0
        elif [ "$days_remaining" -gt 7 ]; then
            echo -e "${YELLOW}⚠${NC} SSL certificate expires in $days_remaining days"
            return 0
        else
            echo -e "${RED}✗${NC} SSL certificate expires in $days_remaining days"
            send_alert "SSL certificate expires in $days_remaining days"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠${NC} Could not check SSL certificate"
        return 1
    fi
}

# Main monitoring function
main() {
    echo "=================================="
    echo "Reclama Golpe API - Health Check"
    echo "Time: $(date)"
    echo "=================================="
    echo ""
    
    errors=0
    
    check_api || ((errors++))
    check_database || ((errors++))
    check_disk || ((errors++))
    check_memory || ((errors++))
    check_pm2 || ((errors++))
    check_ssl || ((errors++))
    
    echo ""
    echo "=================================="
    
    if [ "$errors" -eq 0 ]; then
        echo -e "${GREEN}All checks passed successfully${NC}"
        log_message "All health checks passed"
    else
        echo -e "${RED}$errors issues detected${NC}"
        log_message "$errors health check issues detected"
    fi
    
    echo "=================================="
    
    exit "$errors"
}

# Run main function
main