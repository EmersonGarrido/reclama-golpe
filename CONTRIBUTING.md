# Guia de Contribuição - Reclama Golpe

## Bem-vindo, Contribuidor!

Ficamos muito felizes que você está interessado em contribuir com o projeto Reclama Golpe! Este é um projeto open-source sem fins lucrativos, e toda ajuda é bem-vinda.

## 🚨 Prioridade: Segurança

Atualmente, nossa **prioridade máxima** é corrigir as vulnerabilidades de segurança identificadas. Veja o [Relatório de Auditoria de Segurança](docs/SECURITY_AUDIT.md) para detalhes.

### Issues de Segurança Abertas

Estamos rastreando as correções de segurança necessárias. Procure por issues com as labels:
- `security` - Problemas de segurança
- `priority:critical` - Correções urgentes
- `priority:high` - Correções importantes
- `good first issue` - Boas para iniciantes

## 🛠️ Como Configurar o Ambiente

1. **Fork o repositório**
   ```bash
   # Clique no botão "Fork" no GitHub
   ```

2. **Clone seu fork**
   ```bash
   git clone https://github.com/SEU_USUARIO/reclama-golpe.git
   cd reclama-golpe
   ```

3. **Instale as dependências**
   ```bash
   npm install
   ```

4. **Configure o ambiente**
   ```bash
   # Copie os arquivos de exemplo
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env.local
   
   # Configure suas variáveis locais
   ```

5. **Configure o banco de dados**
   ```bash
   cd apps/api
   npx prisma migrate dev
   npx prisma db seed
   ```

6. **Inicie o desenvolvimento**
   ```bash
   npm run dev
   ```

## 📝 Diretrizes de Código

### Estilo de Código
- Use TypeScript sempre que possível
- Siga as convenções do ESLint configurado
- Use nomes descritivos para variáveis e funções
- Comente código complexo

### Commits
- Use mensagens claras e descritivas
- Prefixos recomendados:
  - `fix:` - Correção de bugs
  - `feat:` - Nova funcionalidade
  - `security:` - Correção de segurança
  - `docs:` - Documentação
  - `test:` - Testes
  - `refactor:` - Refatoração

### Pull Requests
- Descreva claramente o que foi alterado
- Referencie issues relacionadas
- Adicione screenshots se houver mudanças visuais
- Certifique-se que todos os testes passam

## 🔒 Contribuindo com Segurança

### Checklist de Segurança para PRs

Antes de submeter um PR, verifique:

- [ ] Não há credenciais hardcoded
- [ ] Não há console.logs com dados sensíveis
- [ ] Inputs estão validados
- [ ] Não há vulnerabilidades de XSS
- [ ] Não há SQL Injection possível
- [ ] Autenticação está implementada corretamente
- [ ] Autorização verifica permissões adequadamente

### Reportando Vulnerabilidades

**IMPORTANTE:** Não crie issues públicas para vulnerabilidades!

1. Envie email para: emerson@garrido.dev
2. Inclua:
   - Descrição da vulnerabilidade
   - Passos para reproduzir
   - Impacto potencial
   - Sugestão de correção (se tiver)

## 🎯 Áreas que Precisam de Ajuda

### Alta Prioridade
- 🔒 Correções de segurança (veja [SECURITY_AUDIT.md](docs/SECURITY_AUDIT.md))
- 🧪 Implementação de testes
- 📱 Melhorias na experiência mobile

### Média Prioridade
- 🌍 Internacionalização (i18n)
- ♿ Acessibilidade (a11y)
- 📊 Dashboard de estatísticas
- 🎨 Melhorias de UI/UX

### Funcionalidades Futuras
- 📱 App mobile (React Native)
- 🤖 Detecção automática de golpes (ML)
- 📧 Sistema de notificações
- 🔍 API pública

## 💬 Comunidade

### Onde Conseguir Ajuda
- **Issues:** Para bugs e sugestões
- **Discussions:** Para dúvidas e ideias
- **Email:** emerson@garrido.dev

### Código de Conduta
- Seja respeitoso
- Seja construtivo
- Ajude outros contribuidores
- Mantenha discussões profissionais

## 🏆 Reconhecimento

Todos os contribuidores serão listados no README do projeto. Contribuições significativas de segurança serão especialmente reconhecidas.

## 📜 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença MIT do projeto.

---

**Obrigado por ajudar a tornar a internet um lugar mais seguro!** 🙏