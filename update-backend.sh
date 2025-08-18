#!/bin/bash

# ================================================================
# Reclama Golpe - Backend Update Script via SSH
# ================================================================
# Script para atualizar o backend em produção via SSH
# ================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
SSH_USER="root"
SSH_HOST="143.198.24.172"
REMOTE_PATH="/var/www/reclama-golpe"
BRANCH="main"
BACKUP_DIR="/var/backups/reclama-golpe"

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

# Verificar conexão SSH
check_ssh() {
    log_info "Verificando conexão SSH..."
    if ssh -o ConnectTimeout=5 ${SSH_USER}@${SSH_HOST} "echo 'SSH OK'" > /dev/null 2>&1; then
        log_success "Conexão SSH estabelecida"
    else
        log_error "Não foi possível conectar via SSH. Verifique as credenciais."
    fi
}

# Função para executar comandos remotos
remote_exec() {
    ssh ${SSH_USER}@${SSH_HOST} "$1"
}

# Fazer backup antes da atualização
backup_current() {
    log_info "Criando backup do estado atual..."
    
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_PATH="${BACKUP_DIR}/${TIMESTAMP}"
    
    remote_exec "
        mkdir -p ${BACKUP_PATH}
        
        # Backup do código
        if [ -d ${REMOTE_PATH} ]; then
            tar -czf ${BACKUP_PATH}/code.tar.gz -C ${REMOTE_PATH} .
        fi
        
        # Backup do banco (se disponível)
        if command -v pg_dump &> /dev/null; then
            pg_dump -U postgres reclama_golpe > ${BACKUP_PATH}/database.sql 2>/dev/null || true
        fi
        
        # Backup dos envs
        cp ${REMOTE_PATH}/apps/api/.env ${BACKUP_PATH}/api.env 2>/dev/null || true
        
        echo 'Backup criado em: ${BACKUP_PATH}'
    "
    
    log_success "Backup criado com sucesso"
}

# Atualizar código
update_code() {
    log_info "Atualizando código do repositório..."
    
    remote_exec "
        cd ${REMOTE_PATH}
        
        # Stash mudanças locais se houver
        git stash
        
        # Pull das últimas mudanças
        git fetch origin
        git checkout ${BRANCH}
        git pull origin ${BRANCH}
        
        # Aplicar stash se necessário
        git stash pop || true
    "
    
    log_success "Código atualizado"
}

# Instalar dependências
install_dependencies() {
    log_info "Instalando dependências..."
    
    remote_exec "
        cd ${REMOTE_PATH}
        
        # Instalar dependências do root
        npm install
        
        # Instalar dependências da API
        cd apps/api
        npm install
        
        # Gerar Prisma Client
        npx prisma generate
    "
    
    log_success "Dependências instaladas"
}

# Executar migrations
run_migrations() {
    log_info "Executando migrations do banco de dados..."
    
    remote_exec "
        cd ${REMOTE_PATH}/apps/api
        
        # Executar migrations
        npx prisma migrate deploy
    "
    
    log_success "Migrations executadas"
}

# Build da aplicação
build_app() {
    log_info "Compilando aplicação..."
    
    remote_exec "
        cd ${REMOTE_PATH}/apps/api
        
        # Build da API
        npm run build
    "
    
    log_success "Build concluído"
}

# Reiniciar serviços
restart_services() {
    log_info "Reiniciando serviços..."
    
    remote_exec "
        # Reiniciar PM2
        pm2 restart reclamagolpe-api || pm2 restart all
        
        # Salvar estado do PM2
        pm2 save
        
        # Recarregar Nginx
        nginx -s reload
    "
    
    log_success "Serviços reiniciados"
}

# Verificar saúde da aplicação
health_check() {
    log_info "Verificando saúde da aplicação..."
    
    # Aguardar alguns segundos para a aplicação iniciar
    sleep 5
    
    # Verificar endpoint de health
    if curl -s -o /dev/null -w "%{http_code}" https://api.reclamagolpe.com.br/health | grep -q "200"; then
        log_success "Aplicação está rodando corretamente"
    else
        log_warning "Health check falhou. Verifique os logs: pm2 logs"
    fi
    
    # Verificar rota problemática /scams/admin
    log_info "Verificando rota /scams/admin..."
    if curl -s -o /dev/null -w "%{http_code}" https://api.reclamagolpe.com.br/scams/admin | grep -q "401"; then
        log_success "Rota /scams/admin está respondendo (requer autenticação)"
    else
        log_warning "Rota /scams/admin pode estar com problemas"
    fi
}

# Mostrar logs
show_logs() {
    log_info "Últimas linhas dos logs:"
    remote_exec "pm2 logs --lines 20 --nostream"
}

# Função de rollback
rollback() {
    log_error "Erro detectado. Iniciando rollback..."
    
    read -p "Deseja fazer rollback para o backup anterior? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log_info "Executando rollback..."
        
        # Aqui você pode implementar a lógica de rollback
        # Por exemplo, restaurar do último backup
        
        log_warning "Rollback manual necessário. Use o backup em ${BACKUP_DIR}"
    fi
}

# Menu interativo
show_menu() {
    echo -e "\n${GREEN}=== Reclama Golpe - Update Backend ===${NC}\n"
    echo "1) Atualização completa (recomendado)"
    echo "2) Apenas atualizar código"
    echo "3) Apenas instalar dependências"
    echo "4) Apenas executar migrations"
    echo "5) Apenas fazer build"
    echo "6) Apenas reiniciar serviços"
    echo "7) Ver logs"
    echo "8) Health check"
    echo "9) Backup manual"
    echo "0) Sair"
    echo
    read -p "Escolha uma opção: " choice
}

# Atualização completa
full_update() {
    log_info "Iniciando atualização completa do backend..."
    
    check_ssh
    backup_current
    update_code
    install_dependencies
    run_migrations
    build_app
    restart_services
    health_check
    
    log_success "========================================"
    log_success "Atualização concluída com sucesso!"
    log_success "========================================"
    log_success ""
    log_success "API: https://api.reclamagolpe.com.br"
    log_success "Health: https://api.reclamagolpe.com.br/health"
    log_success ""
    log_success "Comandos úteis:"
    log_success "  - Ver logs: ssh ${SSH_USER}@${SSH_HOST} 'pm2 logs'"
    log_success "  - Status: ssh ${SSH_USER}@${SSH_HOST} 'pm2 status'"
    log_success "  - Monitorar: ssh ${SSH_USER}@${SSH_HOST} 'pm2 monit'"
}

# Main
main() {
    if [ "$1" == "--auto" ]; then
        # Modo automático para CI/CD
        full_update
    else
        # Modo interativo
        while true; do
            show_menu
            case $choice in
                1) full_update; break;;
                2) check_ssh; update_code;;
                3) check_ssh; install_dependencies;;
                4) check_ssh; run_migrations;;
                5) check_ssh; build_app;;
                6) check_ssh; restart_services;;
                7) check_ssh; show_logs;;
                8) check_ssh; health_check;;
                9) check_ssh; backup_current;;
                0) exit 0;;
                *) log_error "Opção inválida";;
            esac
        done
    fi
}

# Tratamento de erros
trap rollback ERR

# Executar
main "$@"