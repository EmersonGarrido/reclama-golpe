#!/bin/bash

# ================================================================
# Setup SSH Configuration for Reclama Golpe Backend
# ================================================================

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}=== Configuração SSH para Deploy do Backend ===${NC}\n"

# Solicitar informações
read -p "Digite o IP do servidor: " SERVER_IP
read -p "Digite o usuário SSH (padrão: root): " SSH_USER
SSH_USER=${SSH_USER:-root}
read -p "Digite a porta SSH (padrão: 22): " SSH_PORT
SSH_PORT=${SSH_PORT:-22}

# Nome do alias SSH
SSH_ALIAS="reclama-golpe-api"

# Criar chave SSH se não existir
SSH_KEY="$HOME/.ssh/reclama_golpe_deploy"
if [ ! -f "$SSH_KEY" ]; then
    echo -e "\n${YELLOW}Gerando nova chave SSH...${NC}"
    ssh-keygen -t ed25519 -f "$SSH_KEY" -C "deploy@reclamagolpe.com.br" -N ""
    echo -e "${GREEN}Chave SSH criada em: $SSH_KEY${NC}"
else
    echo -e "${YELLOW}Chave SSH já existe em: $SSH_KEY${NC}"
fi

# Adicionar configuração ao ~/.ssh/config
SSH_CONFIG="$HOME/.ssh/config"
if ! grep -q "Host $SSH_ALIAS" "$SSH_CONFIG" 2>/dev/null; then
    echo -e "\n${YELLOW}Adicionando configuração SSH...${NC}"
    cat >> "$SSH_CONFIG" <<EOF

# Reclama Golpe API Server
Host $SSH_ALIAS
    HostName $SERVER_IP
    User $SSH_USER
    Port $SSH_PORT
    IdentityFile $SSH_KEY
    StrictHostKeyChecking no
    ServerAliveInterval 60
    ServerAliveCountMax 3
EOF
    echo -e "${GREEN}Configuração adicionada ao SSH config${NC}"
else
    echo -e "${YELLOW}Configuração SSH já existe${NC}"
fi

# Copiar chave pública para o servidor
echo -e "\n${YELLOW}Copiando chave pública para o servidor...${NC}"
echo -e "${RED}Você será solicitado a digitar a senha do servidor:${NC}"
ssh-copy-id -i "$SSH_KEY.pub" -p $SSH_PORT $SSH_USER@$SERVER_IP

# Testar conexão
echo -e "\n${YELLOW}Testando conexão SSH...${NC}"
if ssh $SSH_ALIAS "echo 'Conexão SSH estabelecida com sucesso!'" 2>/dev/null; then
    echo -e "${GREEN}✓ Conexão SSH configurada com sucesso!${NC}"
else
    echo -e "${RED}✗ Erro ao conectar via SSH${NC}"
    exit 1
fi

# Criar arquivo de configuração local
echo -e "\n${YELLOW}Criando arquivo de configuração local...${NC}"
cat > .deploy.env <<EOF
# Deploy Configuration
SSH_ALIAS=$SSH_ALIAS
SSH_USER=$SSH_USER
SSH_HOST=$SERVER_IP
SSH_PORT=$SSH_PORT
SSH_KEY=$SSH_KEY
REMOTE_PATH=/var/www/reclama-golpe
BRANCH=main
EOF

echo -e "${GREEN}Arquivo .deploy.env criado${NC}"

# Criar script de deploy rápido
cat > deploy-quick.sh <<'EOF'
#!/bin/bash

# Carrega configurações
source .deploy.env

echo "🚀 Deploy rápido do backend..."

# Conecta e atualiza
ssh $SSH_ALIAS << 'ENDSSH'
    cd /var/www/reclama-golpe
    echo "📥 Atualizando código..."
    git pull origin main
    
    echo "📦 Instalando dependências..."
    cd apps/api
    npm install
    
    echo "🔨 Build da aplicação..."
    npm run build
    
    echo "♻️ Reiniciando serviços..."
    pm2 restart reclamagolpe-api
    
    echo "✅ Deploy concluído!"
ENDSSH
EOF

chmod +x deploy-quick.sh

# Instruções finais
echo -e "\n${GREEN}======================================${NC}"
echo -e "${GREEN}Configuração concluída com sucesso!${NC}"
echo -e "${GREEN}======================================${NC}\n"

echo -e "Você agora pode:"
echo -e "  1. Conectar via: ${YELLOW}ssh $SSH_ALIAS${NC}"
echo -e "  2. Deploy rápido: ${YELLOW}./deploy-quick.sh${NC}"
echo -e "  3. Deploy completo: ${YELLOW}./update-backend.sh${NC}"
echo -e "\nChave SSH pública:"
echo -e "${YELLOW}$(cat $SSH_KEY.pub)${NC}"
echo -e "\nAdicione esta chave ao GitHub Secrets como VPS_SSH_KEY para CI/CD"

# Adicionar ao .gitignore
if ! grep -q ".deploy.env" .gitignore 2>/dev/null; then
    echo -e "\n# Deploy configuration\n.deploy.env\ndeploy-quick.sh" >> .gitignore
    echo -e "\n${GREEN}Arquivos sensíveis adicionados ao .gitignore${NC}"
fi