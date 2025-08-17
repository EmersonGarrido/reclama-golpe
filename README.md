<div align="center">
  <h1>🚨 Reclama Golpe</h1>
  
  **Plataforma colaborativa de denúncia e conscientização sobre golpes online**
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
  [![NestJS](https://img.shields.io/badge/NestJS-10-red)](https://nestjs.com/)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
  
  [Demo](https://reclamagolpe.com.br) • [Instagram](https://www.instagram.com/oemersongarrido) • [Reportar Bug](https://github.com/EmersonGarrido/reclama-golpe/issues)
</div>

## 📋 Sobre o Projeto

**Reclama Golpe** é uma plataforma open-source e sem fins lucrativos, desenvolvida por **[Emerson Garrido](https://www.instagram.com/oemersongarrido)**, focada em combater golpes e fraudes online através do poder da comunidade. Nossa missão é criar um espaço seguro onde vítimas possam compartilhar suas experiências, alertar outros usuários e juntos construirmos uma base de dados pública sobre golpes na internet.

### 🎯 Principais Objetivos

- **Prevenir** que mais pessoas caiam em golpes através do compartilhamento de experiências
- **Documentar** fraudes com evidências e detalhes para auxiliar investigações
- **Educar** a população sobre táticas comuns de golpistas
- **Conectar** vítimas para ações coletivas e suporte mútuo

## ✨ Funcionalidades Implementadas

### 👤 Sistema de Usuários
- ✅ **Cadastro e Login** - Autenticação JWT segura
- ✅ **Perfil Personalizado** - Avatar, bio e informações do usuário
- ✅ **Dashboard Pessoal** - Estatísticas de denúncias, comentários e curtidas
- ✅ **Gerenciamento de Conta** - Edição de perfil, mudança de senha, exclusão de conta
- ✅ **Autenticação Social** - Login com Google (em breve)

### 📝 Sistema de Denúncias
- ✅ **Criação de Denúncias** - Formulário completo com validação
- ✅ **Categorização** - 10+ categorias de golpes (Phishing, E-commerce Falso, Pirâmide, etc.)
- ✅ **Upload de Evidências** - Suporte para imagens e documentos
- ✅ **Informações do Golpista** - Nome, site, telefone, email
- ✅ **Valor do Prejuízo** - Documentação de perdas financeiras
- ✅ **Status de Resolução** - Marcar golpes como resolvidos com detalhes

### 💬 Interação Social
- ✅ **Sistema de Comentários** - Discussão em cada denúncia
- ✅ **Curtidas** - Validação comunitária de denúncias
- ✅ **Sistema de Reports** - Denunciar conteúdo inadequado
- ✅ **Compartilhamento** - Botões para redes sociais

### 🔍 Busca e Filtros
- ✅ **Busca Global** - Por título, descrição, golpista
- ✅ **Filtros por Categoria** - Navegação por tipo de golpe
- ✅ **Ordenação** - Por data, popularidade, comentários
- ✅ **Trending** - Golpes mais denunciados e em alta

### 👨‍💼 Painel Administrativo
- ✅ **Dashboard Admin** - Estatísticas gerais do sistema
- ✅ **Moderação de Conteúdo** - Aprovar/rejeitar denúncias pendentes
- ✅ **Gerenciamento de Denúncias** - Editar status, excluir, destacar
- ✅ **Sistema de Reports** - Revisar denúncias de usuários
- ✅ **Gerenciamento de Usuários** - Banir, promover, editar
- ✅ **Logs de Atividade** - Auditoria de ações administrativas

### 📊 Páginas e Recursos
- ✅ **Home Page** - Feed de denúncias recentes e em destaque
- ✅ **Página de Golpes** - Lista completa com filtros
- ✅ **Detalhes do Golpe** - Visualização completa com evidências
- ✅ **Trending Page** - Golpes mais populares
- ✅ **Página Sobre** - Informações do projeto e desenvolvedor
- ✅ **Dicas de Segurança** - Guias educativos
- ✅ **Termos de Uso** - Políticas da plataforma
- ✅ **Política de Privacidade** - LGPD compliance

### 🛡️ Segurança e Moderação
- ✅ **Moderação Prévia** - Denúncias pendentes de aprovação
- ✅ **Proteção de Dados** - Criptografia de senhas com bcrypt
- ✅ **Rate Limiting** - Proteção contra spam
- ✅ **Validação de Dados** - DTOs com class-validator
- ✅ **CORS Configurado** - Segurança de API

### 🎨 Interface e UX
- ✅ **Design Responsivo** - Mobile-first com Tailwind CSS
- ✅ **Tema Claro** - Interface limpa e moderna
- ✅ **Animações** - Framer Motion para transições suaves
- ✅ **Loading States** - Skeletons e spinners
- ✅ **Toasts** - Notificações de sucesso/erro
- ✅ **Modais Interativos** - Para ações importantes

### 🔧 Recursos Técnicos
- ✅ **Monorepo com Turborepo** - Gerenciamento eficiente
- ✅ **TypeScript** - Type safety em todo o projeto
- ✅ **Prisma ORM** - Queries type-safe
- ✅ **Next.js 15** - App Router e Server Components
- ✅ **NestJS** - API RESTful robusta
- ✅ **PostgreSQL** - Banco de dados relacional
- ✅ **Docker Support** - Containerização
- ✅ **Seeds de Dados** - Dados de exemplo para desenvolvimento

## 🚀 Começando

### Pré-requisitos

- Node.js 20+
- PostgreSQL 15+
- pnpm, npm ou yarn

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/EmersonGarrido/reclama-golpe.git
cd reclama-golpe
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Frontend (.env.local):
```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

Backend (.env):
```env
DATABASE_URL="postgresql://user:password@localhost:5432/reclama_golpe"
JWT_SECRET="seu_secret_aqui"
PORT=3333
```

4. **Configure o banco de dados**
```bash
cd apps/api
npx prisma migrate dev
npx prisma db seed
```

5. **Inicie o projeto**
```bash
# Na raiz do projeto
npm run dev

# Ou individualmente:
npm run dev:web   # Frontend em http://localhost:3000
npm run dev:api   # Backend em http://localhost:3333
```

## 🏗️ Arquitetura

### Stack Tecnológica

#### Frontend
- **Framework:** Next.js 15 com App Router
- **Estilização:** Tailwind CSS
- **Animações:** Framer Motion
- **Formulários:** React Hook Form
- **Validação:** Yup
- **HTTP Client:** Fetch API

#### Backend
- **Framework:** NestJS 10
- **ORM:** Prisma
- **Autenticação:** JWT + Passport
- **Validação:** class-validator
- **Documentação:** Swagger

#### Banco de Dados
- **PostgreSQL** - Dados principais
- **Prisma** - Migrations e queries

### Estrutura do Projeto

```
reclama-golpe/
├── apps/
│   ├── web/                    # Frontend Next.js
│   │   ├── src/
│   │   │   ├── app/            # App Router pages
│   │   │   ├── components/     # Componentes React
│   │   │   ├── lib/           # Utilities
│   │   │   └── types/         # TypeScript types
│   │   └── public/            # Assets estáticos
│   └── api/                   # Backend NestJS
│       ├── src/
│       │   ├── auth/          # Autenticação
│       │   ├── users/         # Módulo de usuários
│       │   ├── scams/         # Módulo de denúncias
│       │   ├── comments/      # Módulo de comentários
│       │   ├── admin/         # Módulo administrativo
│       │   └── prisma/        # Database service
│       └── prisma/
│           ├── schema.prisma  # Schema do banco
│           └── seed.ts        # Seeds de desenvolvimento
├── turbo.json                 # Configuração Turborepo
└── package.json              # Dependências raiz
```

## 👨‍💻 Desenvolvedor

<div align="center">
  <img src="https://github.com/EmersonGarrido.png" width="100" height="100" style="border-radius: 50%;" alt="Emerson Garrido"/>
  
  **Emerson Garrido**
  
  [![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/oemersongarrido)
  [![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/EmersonGarrido)
  
  Este é um projeto **open source** e **sem fins lucrativos**, desenvolvido para ajudar a comunidade brasileira a se proteger contra golpes online.
</div>

## 🤝 Como Contribuir

Adoramos contribuições da comunidade! Este projeto é open-source e toda ajuda é bem-vinda.

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. **Commit** suas mudanças (`git commit -m 'Add: nova funcionalidade'`)
4. **Push** para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um **Pull Request**

## 📜 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- Comunidade open-source pelas ferramentas incríveis
- Todos que contribuírem com o projeto
- Vítimas corajosas que compartilham suas experiências
- Você, por ajudar a tornar a internet um lugar mais seguro

---

<div align="center">
  <p>Desenvolvido com ❤️ por <a href="https://www.instagram.com/oemersongarrido">Emerson Garrido</a></p>
  <p>
    <strong>Projeto sem fins lucrativos para proteger os brasileiros de golpes online</strong>
  </p>
  <p>
    <a href="https://github.com/EmersonGarrido/reclama-golpe">⭐ Dê uma estrela se este projeto te ajudou!</a>
  </p>
</div>