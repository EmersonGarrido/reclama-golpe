#!/bin/bash

# ================================================================
# Reclama Golpe - Health Check & Monitoring Script
# ================================================================
# Monitors application health and sends alerts
# ================================================================

# Load configuration
source deploy.config

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Health check endpoints
API_HEALTH="http://localhost:${APP_PORT}/health"
WEB_HEALTH="http://localhost:${WEB_PORT}"

# Check service status
check_service() {
    SERVICE_NAME=$1
    ENDPOINT=$2
    
    # Check HTTP response
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $ENDPOINT)
    
    if [ "$HTTP_STATUS" == "200" ] || [ "$HTTP_STATUS" == "204" ]; then
        echo -e "${GREEN}✓${NC} $SERVICE_NAME is healthy (HTTP $HTTP_STATUS)"
        return 0
    else
        echo -e "${RED}✗${NC} $SERVICE_NAME is unhealthy (HTTP $HTTP_STATUS)"
        return 1
    fi
}

# Check database
check_database() {
    if PGPASSWORD=${DB_PASSWORD} psql -U ${DB_USER} -h ${DB_HOST} -d ${DB_NAME} -c "SELECT 1" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Database is accessible"
        return 0
    else
        echo -e "${RED}✗${NC} Database is not accessible"
        return 1
    fi
}

# Check disk space
check_disk_space() {
    DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
    
    if [ $DISK_USAGE -lt 80 ]; then
        echo -e "${GREEN}✓${NC} Disk usage: ${DISK_USAGE}%"
    elif [ $DISK_USAGE -lt 90 ]; then
        echo -e "${YELLOW}⚠${NC} Disk usage warning: ${DISK_USAGE}%"
    else
        echo -e "${RED}✗${NC} Disk usage critical: ${DISK_USAGE}%"
        return 1
    fi
}

# Check memory usage
check_memory() {
    MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
    
    if [ $MEMORY_USAGE -lt 80 ]; then
        echo -e "${GREEN}✓${NC} Memory usage: ${MEMORY_USAGE}%"
    elif [ $MEMORY_USAGE -lt 90 ]; then
        echo -e "${YELLOW}⚠${NC} Memory usage warning: ${MEMORY_USAGE}%"
    else
        echo -e "${RED}✗${NC} Memory usage critical: ${MEMORY_USAGE}%"
        return 1
    fi
}

# Check PM2 processes
check_pm2() {
    PM2_STATUS=$(pm2 jlist)
    
    # Check API process
    API_RUNNING=$(echo $PM2_STATUS | jq -r ".[] | select(.name==\"${PM2_APP_NAME}\") | .pm2_env.status")
    if [ "$API_RUNNING" == "online" ]; then
        echo -e "${GREEN}✓${NC} API process is running"
    else
        echo -e "${RED}✗${NC} API process is not running"
        return 1
    fi
    
    # Check Web process
    WEB_RUNNING=$(echo $PM2_STATUS | jq -r ".[] | select(.name==\"${PM2_WEB_NAME}\") | .pm2_env.status")
    if [ "$WEB_RUNNING" == "online" ]; then
        echo -e "${GREEN}✓${NC} Web process is running"
    else
        echo -e "${RED}✗${NC} Web process is not running"
        return 1
    fi
}

# Check SSL certificate expiry
check_ssl() {
    if [ "$USE_SSL" == "true" ]; then
        CERT_EXPIRY=$(echo | openssl s_client -servername ${DOMAIN} -connect ${DOMAIN}:443 2>/dev/null | openssl x509 -noout -enddate | cut -d= -f2)
        EXPIRY_EPOCH=$(date -d "$CERT_EXPIRY" +%s)
        CURRENT_EPOCH=$(date +%s)
        DAYS_LEFT=$(( ($EXPIRY_EPOCH - $CURRENT_EPOCH) / 86400 ))
        
        if [ $DAYS_LEFT -gt 30 ]; then
            echo -e "${GREEN}✓${NC} SSL certificate expires in $DAYS_LEFT days"
        elif [ $DAYS_LEFT -gt 7 ]; then
            echo -e "${YELLOW}⚠${NC} SSL certificate expires in $DAYS_LEFT days"
        else
            echo -e "${RED}✗${NC} SSL certificate expires in $DAYS_LEFT days"
            return 1
        fi
    fi
}

# Send alert
send_alert() {
    MESSAGE=$1
    
    if [ ! -z "$MONITORING_WEBHOOK_URL" ]; then
        # Send to webhook (Discord/Slack format)
        curl -X POST $MONITORING_WEBHOOK_URL \
            -H "Content-Type: application/json" \
            -d "{\"content\":\"🚨 **Reclama Golpe Alert**\n$MESSAGE\nServer: ${DOMAIN}\nTime: $(date)\"}"
    fi
    
    # Log to file
    echo "[$(date)] ALERT: $MESSAGE" >> ${LOG_PATH}/monitoring.log
}

# Auto-recovery attempt
attempt_recovery() {
    SERVICE=$1
    
    case $SERVICE in
        "api")
            echo "Attempting to restart API service..."
            pm2 restart ${PM2_APP_NAME}
            sleep 5
            ;;
        "web")
            echo "Attempting to restart Web service..."
            pm2 restart ${PM2_WEB_NAME}
            sleep 5
            ;;
        "database")
            echo "Attempting to restart PostgreSQL..."
            systemctl restart postgresql
            sleep 5
            ;;
        *)
            echo "Unknown service: $SERVICE"
            ;;
    esac
}

# Main monitoring function
monitor() {
    echo "=================================="
    echo "Reclama Golpe - Health Check"
    echo "Time: $(date)"
    echo "=================================="
    echo ""
    
    ERRORS=0
    ERROR_MESSAGES=""
    
    # Check API
    if ! check_service "API" "$API_HEALTH"; then
        ERRORS=$((ERRORS + 1))
        ERROR_MESSAGES="$ERROR_MESSAGES\n- API service is down"
        
        if [ "$1" == "--auto-recover" ]; then
            attempt_recovery "api"
            if check_service "API" "$API_HEALTH"; then
                echo -e "${GREEN}✓${NC} API recovered successfully"
                ERRORS=$((ERRORS - 1))
            fi
        fi
    fi
    
    # Check Web
    if ! check_service "Web" "$WEB_HEALTH"; then
        ERRORS=$((ERRORS + 1))
        ERROR_MESSAGES="$ERROR_MESSAGES\n- Web service is down"
        
        if [ "$1" == "--auto-recover" ]; then
            attempt_recovery "web"
            if check_service "Web" "$WEB_HEALTH"; then
                echo -e "${GREEN}✓${NC} Web recovered successfully"
                ERRORS=$((ERRORS - 1))
            fi
        fi
    fi
    
    # Check Database
    if ! check_database; then
        ERRORS=$((ERRORS + 1))
        ERROR_MESSAGES="$ERROR_MESSAGES\n- Database is not accessible"
        
        if [ "$1" == "--auto-recover" ]; then
            attempt_recovery "database"
            if check_database; then
                echo -e "${GREEN}✓${NC} Database recovered successfully"
                ERRORS=$((ERRORS - 1))
            fi
        fi
    fi
    
    # Check system resources
    check_disk_space || ERRORS=$((ERRORS + 1))
    check_memory || ERRORS=$((ERRORS + 1))
    
    # Check PM2 processes
    check_pm2 || ERRORS=$((ERRORS + 1))
    
    # Check SSL
    check_ssl
    
    echo ""
    echo "=================================="
    
    if [ $ERRORS -eq 0 ]; then
        echo -e "${GREEN}All systems operational${NC}"
    else
        echo -e "${RED}$ERRORS issues detected${NC}"
        
        if [ "$ENABLE_MONITORING" == "true" ] && [ ! -z "$ERROR_MESSAGES" ]; then
            send_alert "Health check failed with $ERRORS errors:$ERROR_MESSAGES"
        fi
    fi
    
    echo "=================================="
    
    return $ERRORS
}

# Continuous monitoring mode
continuous_monitor() {
    INTERVAL=${1:-60}  # Default 60 seconds
    
    echo "Starting continuous monitoring (interval: ${INTERVAL}s)"
    echo "Press Ctrl+C to stop"
    echo ""
    
    while true; do
        clear
        monitor --auto-recover
        sleep $INTERVAL
    done
}

# Main execution
case "$1" in
    "--continuous")
        continuous_monitor $2
        ;;
    "--auto-recover")
        monitor --auto-recover
        ;;
    *)
        monitor
        ;;
esac