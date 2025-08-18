# Política de Segurança

## Versões Suportadas

| Versão | Suportada          |
| ------ | ------------------ |
| 1.0.x  | :white_check_mark: |

## Reportando Vulnerabilidades

A segurança dos nossos usuários é nossa prioridade máxima. Se você descobrir uma vulnerabilidade de segurança, agradecemos sua ajuda em divulgá-la de forma responsável.

### Como Reportar

**⚠️ NÃO crie uma issue pública para vulnerabilidades de segurança!**

Em vez disso:

1. **Envie um email para:** emerson@garrido.dev
2. **Assunto:** [SEGURANÇA] Vulnerabilidade em Reclama Golpe
3. **Inclua no email:**
   - Descrição detalhada da vulnerabilidade
   - Passos para reproduzir o problema
   - Versões afetadas
   - Possível impacto/exploração
   - Sugestões de correção (se houver)

### O que Esperar

- **Confirmação:** Responderemos em até 48 horas confirmando o recebimento
- **Avaliação:** Avaliaremos a vulnerabilidade em até 7 dias
- **Correção:** Trabalharemos em uma correção o mais rápido possível
- **Crédito:** Você será creditado pela descoberta (se desejar)

### Vulnerabilidades Conhecidas

Veja nosso [Relatório de Auditoria de Segurança](../docs/SECURITY_AUDIT.md) para vulnerabilidades conhecidas que estamos trabalhando para corrigir.

### Bug Bounty

Atualmente não temos um programa de bug bounty, mas reconhecemos publicamente todos os pesquisadores de segurança que nos ajudam.

## Boas Práticas de Segurança para Contribuidores

Ao contribuir com código, siga estas diretrizes:

### Nunca Faça:
- ❌ Commitar credenciais ou tokens
- ❌ Usar `console.log` com dados sensíveis
- ❌ Desabilitar validações de segurança
- ❌ Armazenar senhas em texto plano
- ❌ Confiar em dados do cliente sem validação

### Sempre Faça:
- ✅ Validar todos os inputs
- ✅ Usar prepared statements para queries
- ✅ Implementar rate limiting em endpoints
- ✅ Criptografar dados sensíveis
- ✅ Usar HTTPS em produção
- ✅ Implementar autenticação e autorização adequadas
- ✅ Manter dependências atualizadas

## Recursos de Segurança Implementados

- 🔐 Autenticação JWT
- 🔒 Senhas hasheadas com bcrypt
- 🛡️ Validação de DTOs com class-validator
- 🚫 Proteção contra SQL Injection (Prisma ORM)
- 📝 Logs de auditoria (em implementação)
- 🔄 Rate limiting (em implementação)

## Contato de Segurança

**Email:** emerson@garrido.dev  
**PGP Key:** [Em breve]

---

Obrigado por ajudar a manter o Reclama Golpe seguro! 🔒