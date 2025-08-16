<div align="center">
  <img src="https://github.com/emersongarrido/reclama-golpe/assets/your-username/98c2efb1-a924-48dd-babf-ec999d8a32db.png" alt="Reclama Golpe Logo" width="600" />
  
  # 🚨 Reclama Golpe
  
  **Plataforma colaborativa de denúncia e conscientização sobre golpes online**
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
  [![NestJS](https://img.shields.io/badge/NestJS-10-red)](https://nestjs.com/)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
  
  [Demo](https://reclamagolpe.com.br) • [Documentação](./docs) • [Reportar Bug](https://github.com/emersongarrido/reclama-golpe/issues) • [Solicitar Feature](https://github.com/emersongarrido/reclama-golpe/issues)
</div>

## 📋 Sobre o Projeto

**Reclama Golpe** é uma plataforma open-source inspirada no modelo do Reclame Aqui, focada especificamente em combater golpes e fraudes online através do poder da comunidade. Nossa missão é criar um espaço seguro onde vítimas possam compartilhar suas experiências, alertar outros usuários e juntos construirmos uma base de dados pública sobre golpes na internet.

### 🎯 Principais Objetivos

- **Prevenir** que mais pessoas caiam em golpes através do compartilhamento de experiências
- **Documentar** fraudes com evidências e detalhes para auxiliar investigações
- **Educar** a população sobre táticas comuns de golpistas
- **Conectar** vítimas para ações coletivas e suporte mútuo

## ✨ Funcionalidades

### Para Usuários
- 📝 **Denúncias Detalhadas** - Relate golpes com evidências (prints, links, documentos)
- 🔍 **Busca Inteligente** - Pesquise por empresa, tipo de golpe, CPF/CNPJ suspeito
- 💬 **Comunidade Ativa** - Comente, valide e compartilhe denúncias
- 📊 **Dashboard Pessoal** - Acompanhe suas denúncias e interações
- 🔔 **Alertas em Tempo Real** - Notificações sobre novos golpes relevantes
- 🛡️ **Denúncia Anônima** - Opção de reportar sem expor sua identidade

### Para a Comunidade
- 📈 **Estatísticas Públicas** - Dados abertos sobre golpes mais comuns
- 🏆 **Sistema de Reputação** - Reconhecimento para contribuidores ativos
- 📚 **Central de Conhecimento** - Guias de prevenção e identificação de fraudes
- 🤝 **Integração com Órgãos** - Conexão com Procon, Polícia Civil e outros

## 🚀 Começando

### Pré-requisitos

- Node.js 20+
- PostgreSQL 15+
- Redis (opcional, para cache)
- pnpm ou npm

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/emersongarrido/reclama-golpe.git
cd reclama-golpe
```

2. **Instale as dependências**
```bash
pnpm install
# ou
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
# Edite o arquivo .env.local com suas configurações
```

4. **Configure o banco de dados**
```bash
pnpm db:migrate
pnpm db:seed # Opcional: dados de exemplo
```

5. **Inicie o projeto em modo desenvolvimento**
```bash
pnpm dev
# ou para iniciar serviços específicos:
pnpm dev:web   # Frontend Next.js
pnpm dev:api   # Backend NestJS
```

6. **Acesse a aplicação**
- Frontend: http://localhost:3000
- API: http://localhost:3001
- Documentação API: http://localhost:3001/swagger

## 🏗️ Arquitetura

### Stack Tecnológica

#### Frontend
- **Framework:** Next.js 14 com App Router
- **UI:** shadcn/ui + Tailwind CSS
- **Estado:** Zustand + TanStack Query
- **Formulários:** React Hook Form + Zod
- **Real-time:** Socket.io Client

#### Backend
- **Framework:** NestJS com TypeScript
- **ORM:** Prisma
- **Autenticação:** JWT + Passport
- **Real-time:** Socket.io
- **Cache:** Redis
- **Fila:** Bull

#### Infraestrutura
- **Database:** PostgreSQL
- **Storage:** AWS S3 / Cloudflare R2
- **Deploy:** Vercel (Frontend) + Railway/Render (Backend)
- **Monorepo:** Turborepo

### Estrutura do Projeto

```
reclama-golpe/
├── apps/
│   ├── web/                    # Frontend Next.js
│   │   ├── app/                # App Router
│   │   │   ├── (public)/       # Páginas públicas
│   │   │   ├── (auth)/         # Área autenticada
│   │   │   └── admin/          # Painel administrativo
│   │   └── components/         # Componentes React
│   └── api/                    # Backend NestJS
│       └── src/
│           ├── modules/        # Módulos da aplicação
│           └── shared/         # Código compartilhado
├── packages/
│   ├── database/              # Schemas Prisma
│   ├── ui/                    # Componentes compartilhados
│   └── types/                 # TypeScript types
└── docs/                      # Documentação
```

## 🤝 Como Contribuir

Adoramos contribuições da comunidade! Este é um projeto open-source e toda ajuda é bem-vinda.

### Formas de Contribuir

1. **🐛 Reportando Bugs**
   - Use as [Issues](https://github.com/emersongarrido/reclama-golpe/issues) do GitHub
   - Inclua prints, logs e passos para reproduzir

2. **💡 Sugerindo Features**
   - Abra uma [Issue](https://github.com/emersongarrido/reclama-golpe/issues) com tag "enhancement"
   - Descreva o problema que a feature resolve

3. **🔧 Enviando Pull Requests**
   - Fork o projeto
   - Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
   - Commit suas mudanças (`git commit -m 'Add: nova funcionalidade'`)
   - Push para a branch (`git push origin feature/AmazingFeature`)
   - Abra um Pull Request

4. **📝 Melhorando Documentação**
   - Corrija typos, adicione exemplos, melhore explicações

5. **🎨 Design e UX**
   - Proponha melhorias de interface
   - Crie mockups e protótipos

### Guidelines de Contribuição

- Siga o padrão de código existente
- Escreva testes para novas funcionalidades
- Atualize a documentação quando necessário
- Mantenha os commits semânticos e descritivos
- Seja respeitoso e construtivo nas discussões

## 📚 Documentação

- [Guia de Instalação Detalhado](./docs/installation.md)
- [Arquitetura Técnica](./arquitetura.md)
- [API Reference](./docs/api.md)
- [Guia de Contribuição](./CONTRIBUTING.md)
- [Código de Conduta](./CODE_OF_CONDUCT.md)

## 🗺️ Roadmap

### Fase 1 - MVP (Em desenvolvimento)
- [x] Setup inicial do monorepo
- [x] Autenticação e autorização
- [ ] CRUD de denúncias
- [ ] Sistema de comentários
- [ ] Busca básica
- [ ] Upload de evidências

### Fase 2 - Expansão
- [ ] Sistema de categorização avançado
- [ ] Dashboard com estatísticas
- [ ] Moderação com IA
- [ ] App mobile (React Native)
- [ ] API pública

### Fase 3 - Maturidade
- [ ] Integração com órgãos oficiais
- [ ] Sistema de verificação automatizada
- [ ] Machine Learning para detecção de padrões
- [ ] Expansão internacional

## 🛡️ Segurança

A segurança dos nossos usuários é prioridade máxima.

- **Dados pessoais** protegidos conforme LGPD
- **Denúncias anônimas** com criptografia end-to-end
- **Moderação** manual e automatizada contra abusos
- **Backup** regular e criptografado

Encontrou uma vulnerabilidade? Por favor, reporte em privado para: security@reclamagolpe.com.br

## 📜 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- Comunidade open-source por todas as ferramentas incríveis
- Contribuidores que dedicam seu tempo ao projeto
- Vítimas corajosas que compartilham suas experiências
- Órgãos de defesa do consumidor pelo apoio

## 📬 Contato

**Emerson Garrido** - [@emersongarrido](https://github.com/emersongarrido)

Link do Projeto: [https://github.com/emersongarrido/reclama-golpe](https://github.com/emersongarrido/reclama-golpe)

---

<div align="center">
  <p>Feito com ❤️ pela comunidade brasileira contra golpes online</p>
  <p>
    <a href="https://github.com/emersongarrido/reclama-golpe/stargazers">⭐ Dê uma estrela se este projeto te ajudou!</a>
  </p>
</div>