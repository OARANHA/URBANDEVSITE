# urbanDev - Automação Inteligente com IA

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0-brightgreen)](https://nodejs.org/)
[![Next.js Version](https://img.shields.io/badge/next.js-15.3.5-blue)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.0-blue)](https://www.typescriptlang.org/)

Solução completa de automação inteligente com IA para otimizar processos de negócio.

## 🚀 Funcionalidades

- 🤖 Automação de processos com IA
- 📊 Análise de dados em tempo real
- 🔒 Segurança enterprise-grade
- 📱 Interface responsiva e moderna
- 🚀 Desempenho otimizado
- 🌐 Multiplataforma (VPS, Render, Vercel)

## 📦 Instalação

### Pré-requisitos

- Node.js 18 ou superior
- npm ou yarn
- Git

### Passo a passo

1. Clone o repositório:
```bash
git clone https://github.com/OARANHA/Urbandev.git
cd Urbandev
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

4. Configure o banco de dados:
```bash
npm run db:generate
npm run db:push
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Acesse em [http://localhost:3000](http://localhost:3000)

## 🛠️ Tecnologias

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Banco de Dados**: SQLite (desenvolvimento), PostgreSQL (produção)
- **Autenticação**: NextAuth.js
- **UI Components**: Radix UI, Shadcn UI
- **Estilização**: Tailwind CSS
- **IA**: Z.ai, Flowise (opcional)
- **Deploy**: Docker, GitHub Actions, Vercel, Render

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Rotas do Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Páginas de autenticação
│   ├── dashboard/         # Dashboard principal
│   ├── automacao/         # Página de automação
│   ├── demonstracao/      # Página de demonstração
│   └── ...
├── components/            # Componentes React
│   ├── ui/               # Componentes UI base
│   ├── charts/           # Componentes de gráficos
│   └── ...
├── lib/                  # Configurações e utilitários
│   ├── config.ts         # Configurações globais
│   ├── db.ts             # Configuração do banco de dados
│   └── ...
├── prisma/               # Configuração do banco de dados
└── ...
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# Banco de Dados
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta"

# Z.ai (opcional)
ZAI_API_KEY=your_zai_api_key
ZAI_BASE_URL=https://api.z.ai/api/paas/v4/

# Flowise (opcional)
FLOWISE_USERNAME=admin
FLOWISE_PASSWORD=1234
```

### Banco de Dados

O projeto usa Prisma como ORM. Para configurar o banco de dados:

```bash
# Gerar o cliente do Prisma
npm run db:generate

# Enviar o schema para o banco
npm run db:push

# Criar migrações
npm run db:migrate
```

## 🚀 Deploy

O projeto suporta deploy em múltiplas plataformas. Consulte o guia completo de deploy em [DEPLOY.md](DEPLOY.md).

### VPS (Ubuntu/Debian)

```bash
# Usando o script de deploy
./scripts/deploy-vps.sh [server-ip] [user] [app-dir]

# Ou manualmente
npm run build
pm2 start npm --name "urbanDev" -- start
```

### Render

```bash
# Usando o script de deploy
./scripts/deploy-render.sh [service-name] [webhook-url]

# Ou via dashboard
# 1. Conecte o repositório GitHub
# 2. Configure as variáveis de ambiente
# 3. Faça deploy
```

### Vercel

```bash
# Usando o script de deploy
./scripts/deploy-vercel.sh [project-name]

# Ou via CLI
vercel --prod
```

### Docker

```bash
# Construir a imagem
docker build -t urbanDev .

# Usar docker-compose
docker-compose up -d
```

### GitHub Actions

O projeto inclui um workflow completo para CI/CD:

```yaml
# .github/workflows/deploy.yml
name: Deploy urbanDev
on:
  push:
    branches: [ main ]
  workflow_dispatch:
```

## 📊 Monitoramento

### Logs

- **Desenvolvimento**: `npm run dev` (logs no console)
- **Produção VPS**: `pm2 logs urbanDev`
- **Render/ Vercel**: Logs no dashboard da plataforma

### Métricas

- Uso de CPU e memória
- Tempo de resposta da API
- Taxa de erro
- Volume de tráfego

## 🔒 Segurança

- Autenticação e autorização com NextAuth.js
- Validação de entrada com Zod
- Proteção contra CSRF e XSS
- HTTPS em produção
- Segredos gerenciados via variáveis de ambiente

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -am 'Adiciona nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

- Issues: [GitHub Issues](https://github.com/OARANHA/Urbandev/issues)
- Email: aranha@ulbra.edu.br
- WhatsApp: (51) 99999-9999

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/) - Framework React
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Prisma](https://prisma.io/) - ORM
- [Lucide React](https://lucide.dev/) - Icones
- [Radix UI](https://www.radix-ui.com/) - Componentes UI

---

**Desenvolvido com ❤️ por OARANHA**