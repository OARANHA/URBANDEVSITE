# 🚀 Guia Completo de Instalação Local - urbanDev + Flowise

## 📋 Resumo do Projeto

Este projeto consiste em duas aplicações integradas:

1. **urbanDev** - Frontend (Next.js) - Landing page e sistema de autenticação
   - **Porta**: 3000
   - **Acesso**: http://localhost:3000

2. **Flowise** - Plataforma de agentes de IA 
   - **Porta**: 3001
   - **Acesso**: http://localhost:3001

## 🔧 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Git
- Conta Supabase (gratuita em https://supabase.com)
- Docker (opcional, para instalação do Flowise)

## 📥 Passo 1: Baixar o Projeto

### Opção A: Clonar o Repositório (se tiver acesso Git)
```bash
git clone <URL_DO_REPOSITORIO>
cd urbandev
```

### Opção B: Download Manual (se não tiver Git)
1. Faça o download do projeto como arquivo ZIP
2. Extraia o arquivo em uma pasta chamada `urbandev`
3. Abra o terminal na pasta extraída

## 🛠️ Passo 2: Configurar Variáveis de Ambiente

### 2.1 Configurar o Supabase

1. **Criar projeto Supabase**:
   - Acesse https://supabase.com
   - Clique em "New Project"
   - Preencha os dados:
     - **Project Name**: urban-dev
     - **Database Password**: crie uma senha forte
     - **Region**: escolha a mais próxima de você
   - Aguarde a criação do projeto (2-3 minutos)

2. **Obter credenciais Supabase**:
   - No painel do seu projeto, vá em **Settings** → **API**
   - Copie os seguintes valores:
     - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
     - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

3. **Configurar autenticação**:
   - Vá em **Authentication** → **Providers**
   - Ative os provedores que desejar:
     - **Email**: já vem ativado
     - **Google**: habilite e configure OAuth
     - **GitHub**: habilite e configure OAuth

### 2.2 Criar Arquivo .env.local

No diretório raiz do projeto (`urbandev`), crie o arquivo `.env.local`:

```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` com suas configurações:

```env
# URLs do Flowise (rodando na porta 3001)
NEXT_PUBLIC_FLOWISE_URL=http://localhost:3001
FLOWISE_API_URL=http://localhost:3001/api

# Configuração Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui

# Configuração do banco de dados (SQLite para desenvolvimento)
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=uma-chave-secreta-muito-longa-aqui

# Z.ai SDK (opcional, para funcionalidades avançadas)
ZAI_API_KEY=sua_chave_zai_aqui

# 🔐 Configuração Enterprise (Flowise JÁ IMPLEMENTADO!)
NEXT_PUBLIC_SSO_ENABLED=true
NEXT_PUBLIC_SSO_PROVIDERS=supabase,google,github
NEXT_PUBLIC_SSO_REDIRECT_URL=http://localhost:3000/api/auth/callback

# 🏢 Configuração Enterprise
NEXT_PUBLIC_PLATFORM_TYPE=enterprise
NEXT_PUBLIC_WORKSPACE_ENABLED=true
NEXT_PUBLIC_ORGANIZATION_ENABLED=true
```

### 2.3 Configurar o Flowise

Dentro do projeto, você encontrará a pasta `Urbandev/flowise`. Vá até ela:

```bash
cd Urbandev/flowise
```

Crie o arquivo `.env` para o Flowise:

```bash
cp .env.example .env
```

Edite o arquivo `.env` do Flowise:

```env
# Configurações Básicas
PORT=3001
NODE_ENV=development

# 🔐 Configuração Enterprise (JÁ IMPLEMENTADA)
PLATFORM_TYPE=ENTERPRISE

# 🌐 SSO Integration com Supabase (JÁ IMPLEMENTADO)
SSO_ENABLED=true
SSO_PROVIDERS=supabase,google,github,azure,auth0
SSO_SUPABASE_URL=sua_url_supabase_aqui
SSO_SUPABASE_ANON_KEY=sua_chave_anon_aqui
SSO_SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui

# 🔑 API Key Management (JÁ IMPLEMENTADO)
APIKEY_ENABLED=true
APIKEY_HEADER_NAME=x-api-key
APIKEY_EXPIRY_DAYS=365

# 🏢 Workspace & Organization (JÁ IMPLEMENTADO)
WORKSPACE_ENABLED=true
WORKSPACE_AUTO_CREATE=true
ORGANIZATION_ENABLED=true

# 👥 Role-Based Access Control (JÁ IMPLEMENTADO)
RBAC_ENABLED=true
RBAC_DEFAULT_ROLE=user

# 🛡️ Segurança Adicional (JÁ IMPLEMENTADO)
RATE_LIMIT_ENABLED=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUDIT_LOGS_ENABLED=true
SESSION_SECRET=uma-chave-secreta-muito-longa-aqui

# 📊 Database (SQLite para desenvolvimento)
DATABASE_URL=file:././flowise.db

# 🔧 Configurações de Email (opcional)
EMAIL_SERVICE_PROVIDER=sendgrid
EMAIL_FROM=noreply@urbandev.com
SENDGRID_API_KEY=sua_chave_sendgrid_aqui
```

## 📦 Passo 3: Instalar Dependências

### 3.1 Instalar dependências do urbanDev

Volte para o diretório raiz:

```bash
cd ..
npm install
```

### 3.2 Instalar dependências do Flowise

Vá para o diretório do Flowise:

```bash
cd Urbandev/flowise
npm install
```

## 🗄️ Passo 4: Configurar Banco de Dados

### 4.1 Configurar banco do urbanDev

Volte para o diretório raiz:

```bash
cd ..
npm run db:push
```

### 4.2 Configurar banco do Flowise

O Flowise criará o banco automaticamente na primeira execução.

## 🚀 Passo 5: Iniciar as Aplicações

### 5.1 Iniciar o urbanDev (Terminal 1)

No diretório raiz:

```bash
npm run dev
```

Acesse: http://localhost:3000

### 5.2 Iniciar o Flowise (Terminal 2)

No diretório do Flowise:

```bash
cd Urbandev/flowise
npm start
```

Acesse: http://localhost:3001

## 🔍 Passo 6: Testar a Integração

### 6.1 Testar o urbanDev

1. Acesse http://localhost:3000
2. Você verá a landing page do urbanDev
3. Clique em "Sou Cliente" ou "Cadastre-se"
4. Você será redirecionado para o login do Supabase

### 6.2 Testar o Flowise

1. Acesse http://localhost:3001
2. Você verá a interface do Flowise com login SSO
3. Faça login usando o Supabase
4. Após login, você terá acesso ao dashboard do Flowise

### 6.3 Testar SSO entre as plataformas

1. Faça login no urbanDev
2. Clique em "Sou Cliente"
3. Você será automaticamente logado no Flowise (SSO funcionando)

## 🐛 Solução de Problemas Comuns

### Porta já em uso:
```bash
# Verificar processos na porta 3000
lsof -ti:3000 | xargs kill -9

# Verificar processos na porta 3001
lsof -ti:3001 | xargs kill -9
```

### Problemas com o Flowise:
```bash
# Limpar cache do npm
cd Urbandev/flowise
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Problemas com o urbanDev:
```bash
# Limpar cache do Next.js
rm -rf .next
npm run dev
```

### Erros de Supabase:
1. Verifique se as variáveis de ambiente estão corretas
2. Verifique se os provedores SSO estão ativados
3. Verifique as URLs de redirecionamento:
   - Site URL: http://localhost:3000
   - Redirect URLs: http://localhost:3001/api/v1/auth/supabase/callback

## 🎨 Sobre a Lógica de Login

### urbanDev (atual):
- **Tecnologia**: Supabase Auth
- **Funcionamento**: Login real com banco de dados
- **Vantagens**: Seguro, com SSO, multi-fatores, recuperação de senha
- **Arquivo**: `src/app/login/page.tsx`

### Versão simplificada (lpage.tsx):
- **Tecnologia**: Cookies básicos
- **Funcionamento**: Simulação de login (aceita qualquer email/senha)
- **Vantagens**: Rápido para demonstração
- **Uso**: Apenas para testes rápidos

**Recomendação**: Use a versão com Supabase para produção e a versão simplificada apenas para demonstrações rápidas.

## 📊 Estrutura do Projeto

```
urbandev/
├── src/                    # Código fonte do urbanDev
│   ├── app/               # Next.js App Router
│   │   ├── page.tsx       # Landing page
│   │   ├── login/         # Sistema de autenticação
│   │   └── dashboard/     # Área do cliente
│   ├── components/        # Componentes React
│   └── lib/              # Utilitários
├── Urbandev/
│   └── flowise/          # Código fonte do Flowise
│       ├── packages/
│       │   ├── server/    # Backend do Flowise
│       │   └── ui/        # Frontend do Flowise
│       └── src/           # Configurações e enterprise
├── prisma/                # Schema do banco de dados
├── public/                # Arquivos estáticos
└── package.json           # Dependências do urbanDev
```

## 🎯 Funcionalidades Disponíveis

### urbanDev:
- ✅ Landing page profissional
- ✅ Sistema de autenticação com Supabase
- ✅ Dashboard para clientes
- ✅ Integração com Flowise via SSO
- ✅ Design responsivo
- ✅ Tema claro/escuro

### Flowise Enterprise:
- ✅ SSO com múltiplos provedores
- ✅ RBAC (Role-Based Access Control)
- ✅ Workspace management
- ✅ Organization management
- ✅ Audit logs
- ✅ API key management
- ✅ 500+ nós de IA integrados
- ✅ Agentes conversacionais
- ✅ Automação de processos

## 🚀 Próximos Passos

1. **Personalize a marca**: Altere logos, cores e textos
2. **Configure domínios**: Aponte seus domínios para as aplicações
3. **Configure email**: Configure SendGrid para notificações
4. **Adicione provedores SSO**: Habilite Google, GitHub, etc.
5. **Teste com usuários reais**: Convide pessoas para testar
6. **Prepare para produção**: Configure Nginx, PM2, etc.

## 📞 Suporte

Se encontrar problemas durante a instalação:

1. Verifique os logs no terminal
2. Consulte o arquivo `README.md` principal
3. Verifique as variáveis de ambiente
4. Teste cada aplicação separadamente

---

**Parabéns!** Você agora tem um sistema completo de agentes de IA para pequenos e médios negócios rodando localmente. 🎉