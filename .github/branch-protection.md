# Configuração de Proteção de Branch

## Como configurar proteção na branch `main`

### Via GitHub Web:

1. Acesse: https://github.com/EmersonGarrido/reclama-golpe/settings/branches

2. Clique em "Add rule" ou "Add branch protection rule"

3. Configure as seguintes opções:

#### Branch name pattern:
```
main
```

#### Regras recomendadas (marque estas opções):

✅ **Require a pull request before merging**
- ✅ Require approvals: 1
- ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Require review from CODEOWNERS (opcional)

✅ **Require status checks to pass before merging**
- ✅ Require branches to be up to date before merging
- Adicione checks do CI/CD quando configurados (Vercel, testes, etc)

✅ **Require conversation resolution before merging**
- Garante que todos os comentários foram resolvidos

✅ **Require linear history** (opcional)
- Evita merge commits, mantém histórico limpo

✅ **Include administrators** (opcional)
- Aplica regras também para admins do repo

❌ **Allow force pushes** (mantenha desmarcado)
- Previne reescrita de histórico

❌ **Allow deletions** (mantenha desmarcado)
- Previne deleção acidental da branch

4. Clique em "Create" ou "Save changes"

## Fluxo de trabalho após proteção

### Para desenvolvedores:

```bash
# 1. Criar nova branch
git checkout -b feature/minha-feature

# 2. Fazer mudanças e commit
git add .
git commit -m "feat: descrição da feature"

# 3. Push da branch
git push origin feature/minha-feature

# 4. Criar PR no GitHub
gh pr create --title "feat: minha feature" --body "Descrição detalhada"

# Ou acesse: https://github.com/EmersonGarrido/reclama-golpe/compare
```

### Para revisar e aprovar:

```bash
# Listar PRs abertas
gh pr list

# Ver detalhes de uma PR
gh pr view <numero>

# Aprovar uma PR (se tiver permissão)
gh pr review <numero> --approve

# Fazer merge (após aprovação)
gh pr merge <numero>
```

## Benefícios da proteção de branch

1. **Qualidade do código**: Todas mudanças são revisadas
2. **Histórico limpo**: Commits organizados e rastreáveis
3. **Prevenção de erros**: Impossível fazer push direto acidental
4. **CI/CD confiável**: Deploy apenas de código revisado
5. **Colaboração**: Discussões nas PRs melhoram o código

## Exceções e emergências

Se precisar fazer push direto em emergência:
1. Temporariamente desabilite a proteção
2. Faça o push necessário
3. Reabilite a proteção imediatamente
4. Documente o motivo da exceção

## Integração com Vercel

A Vercel automaticamente:
- Cria preview deployments para cada PR
- Comenta na PR com o link do preview
- Faz deploy de produção apenas quando PR é merged na main

## Comandos úteis

```bash
# Ver status da branch atual
git status

# Ver branches locais e remotas
git branch -a

# Deletar branch local após merge
git branch -d nome-da-branch

# Forçar delete de branch local
git branch -D nome-da-branch

# Atualizar main local após merge de PR
git checkout main
git pull origin main
```