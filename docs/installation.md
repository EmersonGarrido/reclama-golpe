# Guia de Instalação - Reclama Golpe

## Requisitos do Sistema

### Mínimos
- **Node.js**: v18.0.0 ou superior
- **NPM**: v8.0.0 ou superior
- **Memória RAM**: 4GB
- **Espaço em Disco**: 2GB
- **Sistema Operacional**: Windows 10+, macOS 10.15+, Ubuntu 20.04+

### Recomendados
- **Node.js**: v20.0.0 (LTS)
- **NPM**: v10.0.0
- **Memória RAM**: 8GB
- **Espaço em Disco**: 5GB
- **Conexão Internet**: Banda larga estável

## Instalação Rápida

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/reclama-golpe.git
cd reclama-golpe
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure as Variáveis de Ambiente

Copie o arquivo de exemplo e configure suas variáveis:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Configurações do Servidor
NODE_ENV=development
PORT=3000
HOST=localhost

# Banco de Dados
DATABASE_URL=postgresql://usuario:senha@localhost:5432/reclama_golpe
DATABASE_POOL_SIZE=10

# Redis (Cache)
REDIS_URL=redis://localhost:6379
REDIS_TTL=3600

# JWT
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=7d

# Email (SendGrid)
SENDGRID_API_KEY=sua_api_key_aqui
EMAIL_FROM=noreply@reclamagolpe.com.br

# Storage (AWS S3)
AWS_ACCESS_KEY_ID=sua_access_key
AWS_SECRET_ACCESS_KEY=sua_secret_key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=reclama-golpe-uploads

# APIs Externas
GOOGLE_MAPS_API_KEY=sua_api_key
RECAPTCHA_SITE_KEY=sua_site_key
RECAPTCHA_SECRET_KEY=sua_secret_key

# Monitoramento
SENTRY_DSN=sua_dsn_aqui
LOG_LEVEL=info
```

### 4. Configure o Banco de Dados

#### PostgreSQL

Instale o PostgreSQL se ainda não tiver:

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Baixe e instale do [site oficial](https://www.postgresql.org/download/windows/)

#### Crie o Banco de Dados

```bash
psql -U postgres
CREATE DATABASE reclama_golpe;
CREATE USER reclama_user WITH PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE reclama_golpe TO reclama_user;
\q
```

#### Execute as Migrações

```bash
npm run db:migrate
```

#### Popule com Dados Iniciais (Opcional)

```bash
npm run db:seed
```

### 5. Configure o Redis (Opcional mas Recomendado)

**macOS:**
```bash
brew install redis
brew services start redis
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis
```

**Windows:**
Use o [Redis para Windows](https://github.com/microsoftarchive/redis/releases)

### 6. Inicie o Servidor de Desenvolvimento

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

## Instalação com Docker

### Pré-requisitos
- Docker v20.10+
- Docker Compose v2.0+

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/reclama-golpe.git
cd reclama-golpe
```

### 2. Configure as Variáveis de Ambiente

```bash
cp .env.example .env
```

### 3. Construa e Inicie os Containers

```bash
docker-compose up -d
```

### 4. Execute as Migrações

```bash
docker-compose exec api npm run db:migrate
```

### 5. Acesse a Aplicação

- **Aplicação**: http://localhost:3000
- **API**: http://localhost:3000/api
- **Documentação**: http://localhost:3000/docs

## Verificação da Instalação

### Teste a API

```bash
curl http://localhost:3000/api/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "services": {
    "database": "connected",
    "redis": "connected",
    "email": "configured"
  }
}
```

### Execute os Testes

```bash
# Testes unitários
npm run test

# Testes de integração
npm run test:integration

# Testes e2e
npm run test:e2e

# Todos os testes com cobertura
npm run test:coverage
```

## Solução de Problemas

### Erro: Cannot find module

```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro de Conexão com Banco de Dados

1. Verifique se o PostgreSQL está rodando:
```bash
pg_isready
```

2. Verifique as credenciais no `.env`

3. Teste a conexão:
```bash
psql -U reclama_user -d reclama_golpe -h localhost
```

### Porta 3000 em Uso

Altere a porta no arquivo `.env`:
```env
PORT=3001
```

### Problemas com Redis

1. Verifique se o Redis está rodando:
```bash
redis-cli ping
```

2. Se não for necessário, desabilite no `.env`:
```env
REDIS_ENABLED=false
```

## Configurações Avançadas

### SSL/TLS

Para ambiente de produção, configure HTTPS:

```env
HTTPS_ENABLED=true
SSL_CERT_PATH=/path/to/cert.pem
SSL_KEY_PATH=/path/to/key.pem
```

### Proxy Reverso (Nginx)

```nginx
server {
    listen 80;
    server_name reclamagolpe.com.br;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Clustering

Para melhor performance, habilite clustering:

```env
CLUSTER_ENABLED=true
CLUSTER_WORKERS=4
```

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor com hot-reload
npm run build        # Compila para produção
npm run start        # Inicia servidor de produção

# Banco de Dados
npm run db:migrate   # Executa migrações
npm run db:rollback  # Reverte última migração
npm run db:seed      # Popula banco com dados teste
npm run db:reset     # Reseta banco de dados

# Testes
npm run test         # Executa testes unitários
npm run test:watch   # Testes em modo watch
npm run test:coverage # Testes com cobertura

# Qualidade
npm run lint         # Verifica código
npm run lint:fix     # Corrige problemas automaticamente
npm run format       # Formata código com Prettier

# Documentação
npm run docs:generate # Gera documentação da API
npm run docs:serve   # Serve documentação localmente
```

## Próximos Passos

1. 📖 Leia a [Arquitetura Técnica](../arquitetura.md)
2. 🔌 Explore a [API Reference](./api.md)
3. 🚀 Configure o [Deploy em Produção](./deployment.md)
4. 🛡️ Implemente [Segurança Adicional](./security.md)
5. 📊 Configure [Monitoramento](./monitoring.md)

## Suporte

- 📧 Email: suporte@reclamagolpe.com.br
- 💬 Discord: [Comunidade Reclama Golpe](https://discord.gg/reclamagolpe)
- 🐛 Issues: [GitHub Issues](https://github.com/seu-usuario/reclama-golpe/issues)
- 📚 Wiki: [GitHub Wiki](https://github.com/seu-usuario/reclama-golpe/wiki)