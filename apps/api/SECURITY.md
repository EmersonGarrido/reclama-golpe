# Configuração de Segurança - API Reclama Golpe

## Variáveis de Ambiente

### 1. JWT_SECRET
**CRÍTICO**: O JWT_SECRET deve ser uma string aleatória forte com alta entropia.

#### Como gerar um JWT_SECRET seguro:
```bash
# Gerar um secret de 64 bytes (recomendado)
openssl rand -base64 64
```

#### Requisitos mínimos:
- Mínimo de 32 caracteres
- Deve conter caracteres aleatórios
- NUNCA use senhas fracas ou previsíveis
- NUNCA commite o JWT_SECRET real no repositório

### 2. Configuração inicial

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Edite o arquivo `.env` e configure:
   - `DATABASE_URL`: String de conexão do PostgreSQL
   - `JWT_SECRET`: Secret forte gerado com openssl
   - `FRONTEND_URL`: URL do frontend (para CORS)

### 3. Proteções implementadas

#### Autenticação
- JWT obrigatório para rotas protegidas
- Guards específicos para rotas admin
- Validação de token em todas as requisições

#### WebSocket
- Autenticação obrigatória para conexões
- Verificação de token JWT
- Desconexão automática para tokens inválidos

#### Rotas Admin
- AdminGuard verifica se usuário é admin
- Proteção dupla: JWT + Admin validation
- Logging de tentativas de acesso não autorizado

### 4. Boas práticas

1. **Rotação de secrets**
   - Troque o JWT_SECRET periodicamente
   - Use diferentes secrets para desenvolvimento/produção

2. **Monitoramento**
   - Monitore logs de autenticação falha
   - Implemente rate limiting
   - Use HTTPS em produção

3. **Princípio do menor privilégio**
   - Apenas admins acessam rotas administrativas
   - Usuários só podem editar próprios recursos

### 5. Checklist de segurança

- [ ] JWT_SECRET forte gerado com openssl
- [ ] Arquivo .env não commitado
- [ ] HTTPS configurado em produção
- [ ] Rate limiting implementado
- [ ] Logs de segurança configurados
- [ ] CORS configurado corretamente
- [ ] Validação de entrada em todas as rotas
- [ ] SQL injection prevenido (Prisma ORM)
- [ ] XSS prevenido (sanitização de inputs)

### 6. Em caso de comprometimento

Se o JWT_SECRET for comprometido:
1. Gere um novo secret imediatamente
2. Atualize em todos os ambientes
3. Force re-login de todos os usuários
4. Revise logs para atividades suspeitas
5. Notifique a equipe de segurança