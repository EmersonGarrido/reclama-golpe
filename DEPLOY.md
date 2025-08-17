# 🚀 Guia de Deploy - Reclama Golpe

Este guia documenta o processo completo de deploy da plataforma Reclama Golpe em um servidor Ubuntu.

## 📋 Pré-requisitos

- Servidor Ubuntu 20.04 LTS ou superior
- Mínimo 2GB RAM (recomendado 4GB)
- Mínimo 20GB de espaço em disco
- Acesso root ao servidor
- Domínio configurado apontando para o IP do servidor

## 🛠️ Scripts Disponíveis

### 1. `deploy.sh` - Script Principal de Deploy
Automatiza todo o processo de instalação e configuração.

**Funcionalidades:**
- ✅ Instala PostgreSQL 15
- ✅ Instala Node.js 20 e Yarn
- ✅ Instala e configura Nginx
- ✅ Instala e configura PM2
- ✅ Configura SSL com Let's Encrypt
- ✅ Configura firewall (UFW)
- ✅ Configura backups automáticos
- ✅ Configura monitoramento
- ✅ Cria serviço systemd

### 2. `rollback.sh` - Script de Rollback
Permite reverter para um backup anterior em caso de problemas.

### 3. `monitor.sh` - Script de Monitoramento
Verifica a saúde da aplicação e pode tentar recuperação automática.

## 📝 Configuração

### Passo 1: Preparar Configuração

```bash
# Copiar arquivo de configuração exemplo
cp deploy.config.example deploy.config

# Editar configuração
nano deploy.config
```

### Passo 2: Configurações Importantes

```bash
# Domínio
DOMAIN="seu-dominio.com.br"
WWW_DOMAIN="www.seu-dominio.com.br"

# Banco de Dados
DB_NAME="reclamagolpe"
DB_USER="reclamagolpe_user"
DB_PASSWORD="senha-segura-aqui"  # Mínimo 16 caracteres

# JWT Secret
JWT_SECRET="sua-chave-jwt-aqui"  # Mínimo 32 caracteres

# GitHub
GITHUB_REPO="https://github.com/EmersonGarrido/reclama-golpe.git"

# SSL
USE_SSL="true"
CERTBOT_EMAIL="seu-email@dominio.com"
```

## 🚀 Deploy

### Deploy Completo

```bash
# Tornar script executável
chmod +x deploy.sh

# Executar deploy
sudo ./deploy.sh
```

### Deploy Manual (Passo a Passo)

Se preferir executar manualmente:

```bash
# 1. Atualizar sistema
sudo apt update && sudo apt upgrade -y

# 2. Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# 3. Criar banco de dados
sudo -u postgres psql
CREATE USER reclamagolpe_user WITH PASSWORD 'sua_senha';
CREATE DATABASE reclamagolpe OWNER reclamagolpe_user;
\q

# 4. Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y

# 5. Instalar Yarn e PM2
npm install -g yarn pm2

# 6. Clonar repositório
cd /var/www
git clone https://github.com/EmersonGarrido/reclama-golpe.git reclamagolpe
cd reclamagolpe

# 7. Instalar dependências
yarn install

# 8. Configurar variáveis de ambiente
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
# Editar os arquivos com suas configurações

# 9. Build
yarn build

# 10. Iniciar com PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 🔧 Manutenção

### Comandos Úteis

```bash
# Ver status dos serviços
pm2 status

# Ver logs
pm2 logs

# Reiniciar aplicação
pm2 restart all

# Atualizar aplicação
cd /var/www/reclamagolpe
git pull
yarn install
yarn build
pm2 restart all

# Verificar saúde
./monitor.sh

# Monitoramento contínuo
./monitor.sh --continuous 30  # Verifica a cada 30 segundos
```

### Backup Manual

```bash
# Executar backup
/usr/local/bin/backup-reclamagolpe.sh

# Listar backups
ls -la /var/backups/reclamagolpe
```

### Rollback

```bash
# Executar script de rollback
sudo ./rollback.sh

# Ou manualmente
cd /var/backups/reclamagolpe
# Escolher backup e restaurar
```

## 📊 Monitoramento

### Health Check Endpoints

- **API Health:** `http://localhost:3333/health`
- **Web Health:** `http://localhost:3000`

### Logs

Todos os logs são salvos em `/var/log/reclamagolpe/`:
- `api-error.log` - Erros da API
- `api-out.log` - Output da API
- `web-error.log` - Erros do frontend
- `web-out.log` - Output do frontend
- `monitoring.log` - Logs de monitoramento

### Alertas

Configure `MONITORING_WEBHOOK_URL` no `deploy.config` para receber alertas via Discord/Slack.

## 🔒 Segurança

### Firewall (UFW)

```bash
# Ver status
sudo ufw status

# Permitir porta específica
sudo ufw allow 8080/tcp

# Bloquear IP
sudo ufw deny from 192.168.1.1
```

### SSL/HTTPS

O certificado SSL é renovado automaticamente via cron. Para renovar manualmente:

```bash
sudo certbot renew
```

### Permissões

```bash
# Ajustar permissões de upload
chmod 755 /var/www/reclamagolpe/apps/api/uploads
chown -R www-data:www-data /var/www/reclamagolpe/apps/api/uploads
```

## 🐛 Troubleshooting

### Problema: Aplicação não inicia

```bash
# Verificar logs
pm2 logs

# Verificar portas em uso
sudo netstat -tulpn | grep LISTEN

# Reiniciar PM2
pm2 kill
pm2 start ecosystem.config.js
```

### Problema: Banco de dados não conecta

```bash
# Verificar PostgreSQL
sudo systemctl status postgresql

# Verificar conexão
PGPASSWORD=senha psql -U usuario -h localhost -d banco -c "SELECT 1"

# Ver logs do PostgreSQL
sudo tail -f /var/log/postgresql/postgresql-*.log
```

### Problema: Nginx não funciona

```bash
# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx

# Ver logs
sudo tail -f /var/log/nginx/error.log
```

### Problema: Falta de memória

```bash
# Ver uso de memória
free -h

# Limpar cache
sudo sh -c "sync; echo 3 > /proc/sys/vm/drop_caches"

# Ajustar limite de memória no PM2
pm2 set pm2:max_memory_restart 1G
```

## 📚 Estrutura de Arquivos

```
/var/www/reclamagolpe/
├── apps/
│   ├── api/              # Backend NestJS
│   │   ├── .env          # Variáveis de ambiente
│   │   ├── dist/         # Build de produção
│   │   └── uploads/      # Arquivos enviados
│   └── web/              # Frontend Next.js
│       ├── .env.local    # Variáveis de ambiente
│       └── .next/        # Build de produção
├── deploy.config         # Configuração do deploy
├── deploy.sh            # Script de deploy
├── rollback.sh          # Script de rollback
├── monitor.sh           # Script de monitoramento
└── ecosystem.config.js  # Configuração PM2

/var/log/reclamagolpe/   # Logs da aplicação
/var/backups/reclamagolpe/  # Backups automáticos
```

## 🆘 Suporte

Para problemas ou dúvidas:
- GitHub Issues: https://github.com/EmersonGarrido/reclama-golpe/issues
- Email: admin@reclamagolpe.com.br

## 📄 Licença

Este projeto é open source e está disponível sob a licença MIT.