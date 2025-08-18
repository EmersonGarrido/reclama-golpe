# 🚀 Guia de Deploy - Reclama Golpe Backend

## 📋 Visão Geral

Este documento descreve os processos de deploy e atualização do backend da plataforma Reclama Golpe.

## 🔧 Pré-requisitos

### No Servidor (VPS)
- Ubuntu 20.04+ ou Debian 11+
- Node.js 20+
- PostgreSQL 15+
- PM2 (gerenciador de processos)
- Nginx (proxy reverso)
- Git

### Local (sua máquina)
- SSH client
- Git
- Node.js (para testes locais)

## 🔐 Configuração SSH

### 1. Configuração Inicial

Execute o script de configuração:

```bash
./setup-ssh.sh
```

Este script irá:
- Gerar chave SSH dedicada
- Configurar alias SSH
- Copiar chave para o servidor
- Criar arquivo de configuração local

### 2. Configuração Manual (Opcional)

Se preferir configurar manualmente:

```bash
# Gerar chave SSH
ssh-keygen -t ed25519 -f ~/.ssh/reclama_golpe_deploy -C "deploy@reclamagolpe.com.br"

# Copiar chave para servidor
ssh-copy-id -i ~/.ssh/reclama_golpe_deploy.pub root@143.198.24.172

# Adicionar ao ~/.ssh/config
cat >> ~/.ssh/config <<EOF
Host reclama-golpe-api
    HostName 143.198.24.172
    User root
    IdentityFile ~/.ssh/reclama_golpe_deploy
EOF
```

## 📦 Métodos de Deploy

### Método 1: Deploy Automático (Recomendado)

Use o script de atualização completo:

```bash
./update-backend.sh
```

Opções disponíveis:
- `1` - Atualização completa (backup, código, deps, migrations, build, restart)
- `2` - Apenas atualizar código
- `3` - Apenas instalar dependências
- `4` - Apenas executar migrations
- `5` - Apenas fazer build
- `6` - Apenas reiniciar serviços
- `7` - Ver logs
- `8` - Health check
- `9` - Backup manual

### Método 2: Deploy Rápido

Para atualizações simples sem migrations:

```bash
./deploy-quick.sh
```

### Método 3: Deploy via GitHub Actions

O deploy é automaticamente executado ao fazer push na branch `main` quando há mudanças em:
- `apps/api/**`
- `prisma/**`
- `package.json`

Configure os secrets no GitHub:
- `VPS_HOST`: IP do servidor (143.198.24.172)
- `VPS_USER`: Usuário SSH (root)
- `VPS_SSH_KEY`: Chave SSH privada
- `VPS_PORT`: Porta SSH (22)

### Método 4: Deploy Manual via SSH

```bash
# Conectar ao servidor
ssh reclama-golpe-api

# Navegar para o diretório
cd /var/www/reclama-golpe

# Atualizar código
git pull origin main

# Instalar dependências
cd apps/api
npm install

# Gerar Prisma Client
npx prisma generate

# Executar migrations (se necessário)
npx prisma migrate deploy

# Build
npm run build

# Reiniciar PM2
pm2 restart reclamagolpe-api
```

## 🔄 Processo de Deploy Detalhado

### 1. Backup
```bash
# Backup automático antes de cada deploy
/var/backups/reclama-golpe/YYYYMMDD_HHMMSS/
  ├── code.tar.gz      # Código fonte
  ├── database.sql     # Dump do banco
  └── api.env         # Variáveis de ambiente
```

### 2. Atualização do Código
```bash
git fetch origin
git checkout main
git pull origin main
```

### 3. Dependências
```bash
npm install          # Root
cd apps/api && npm install  # API
```

### 4. Database Migrations
```bash
npx prisma generate   # Gerar client
npx prisma migrate deploy  # Aplicar migrations
```

### 5. Build
```bash
npm run build        # Compilar TypeScript
```

### 6. Restart Services
```bash
pm2 restart reclamagolpe-api
pm2 save
nginx -s reload
```

## 🏥 Health Checks

### Endpoints de Verificação

```bash
# Health check básico
curl https://api.reclamagolpe.com.br/health

# Verificar rotas específicas
curl https://api.reclamagolpe.com.br/categories
curl https://api.reclamagolpe.com.br/scams

# Verificar rota admin (deve retornar 401)
curl https://api.reclamagolpe.com.br/scams/admin
```

## 📊 Monitoramento

### PM2 Commands

```bash
# Status dos processos
pm2 status

# Logs em tempo real
pm2 logs

# Monitoramento interativo
pm2 monit

# Informações detalhadas
pm2 info reclamagolpe-api

# Métricas
pm2 web  # Acesse http://SERVER_IP:9615
```

### Logs do Sistema

```bash
# Logs do PM2
/root/.pm2/logs/

# Logs do Nginx
/var/log/nginx/api.reclamagolpe.com.br.access.log
/var/log/nginx/api.reclamagolpe.com.br.error.log

# Logs da aplicação
/var/www/reclama-golpe/logs/
```

## 🔄 Rollback

### Rollback Automático

Em caso de falha no deploy:

```bash
# O script update-backend.sh pergunta se deseja fazer rollback
# Responda 'y' para restaurar o backup anterior
```

### Rollback Manual

```bash
# Listar backups disponíveis
ls -la /var/backups/reclama-golpe/

# Restaurar backup específico
BACKUP_DIR="/var/backups/reclama-golpe/20250118_143022"

# Restaurar código
cd /var/www/reclama-golpe
tar -xzf $BACKUP_DIR/code.tar.gz

# Restaurar banco (CUIDADO!)
psql -U postgres reclama_golpe < $BACKUP_DIR/database.sql

# Restaurar environment
cp $BACKUP_DIR/api.env apps/api/.env

# Reiniciar serviços
pm2 restart reclamagolpe-api
```

## 🐛 Troubleshooting

### Problema: Rota /scams/admin retorna 404

**Causa**: Ordem das rotas no NestJS
**Solução**: Verificar que rotas específicas vêm antes de rotas com parâmetros

```typescript
// ✅ Correto
@Get('admin')  // Deve vir ANTES
@Get(':id')    // Rotas com parâmetros por último

// ❌ Incorreto
@Get(':id')    // Captura 'admin' como ID
@Get('admin')  // Nunca será alcançada
```

### Problema: Deploy falha com "permission denied"

```bash
# Verificar permissões
ls -la /var/www/reclama-golpe

# Corrigir permissões
chown -R root:root /var/www/reclama-golpe
chmod -R 755 /var/www/reclama-golpe
```

### Problema: PM2 não reinicia após reboot

```bash
# Configurar startup
pm2 startup systemd
pm2 save
```

### Problema: Migrations falham

```bash
# Verificar conexão com banco
psql -U postgres -d reclama_golpe -c "SELECT version();"

# Reset migrations (CUIDADO - apaga dados!)
npx prisma migrate reset

# Aplicar migrations novamente
npx prisma migrate deploy
```

## 🔒 Segurança

### Checklist de Segurança para Deploy

- [ ] Backup realizado antes do deploy
- [ ] Variáveis de ambiente verificadas
- [ ] Sem credenciais no código
- [ ] HTTPS configurado
- [ ] Firewall configurado
- [ ] Logs não expõem dados sensíveis
- [ ] Rate limiting ativo
- [ ] CORS configurado corretamente

## 📝 Variáveis de Ambiente

### Produção (apps/api/.env)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/reclama_golpe"

# JWT
JWT_SECRET="[HASH SEGURO GERADO]"
JWT_EXPIRES_IN="7d"

# App
PORT=3333
NODE_ENV=production

# CORS
CORS_ORIGIN="https://reclamagolpe.com.br,https://www.reclamagolpe.com.br"

# Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR="./uploads"
```

## 🚨 Contatos de Emergência

- **Desenvolvedor**: Emerson Garrido
- **Email**: emerson@garrido.dev
- **GitHub Issues**: https://github.com/EmersonGarrido/reclama-golpe/issues

## 📅 Manutenção Regular

### Diária
- [ ] Verificar logs de erro
- [ ] Monitorar uso de recursos

### Semanal
- [ ] Atualizar dependências de segurança
- [ ] Revisar backups
- [ ] Analisar métricas de performance

### Mensal
- [ ] Atualizar sistema operacional
- [ ] Revisar configurações de segurança
- [ ] Limpar logs antigos
- [ ] Testar processo de restore

## 🎯 Scripts Úteis

### Limpar logs antigos
```bash
# Limpar logs com mais de 30 dias
find /var/www/reclama-golpe/logs -type f -mtime +30 -delete
find /root/.pm2/logs -type f -mtime +30 -delete
```

### Backup manual do banco
```bash
pg_dump -U postgres reclama_golpe > backup_$(date +%Y%m%d).sql
```

### Verificar uso de disco
```bash
df -h
du -sh /var/www/reclama-golpe
```

### Reiniciar todos os serviços
```bash
pm2 restart all
systemctl restart nginx
systemctl restart postgresql
```

---

📌 **Nota**: Sempre teste mudanças críticas em ambiente de desenvolvimento antes de aplicar em produção!