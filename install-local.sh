#!/bin/bash

# Script de Instalação Automática - urbanDev + Flowise
# Execute este script com: bash install-local.sh

echo "🚀 Iniciando instalação do urbanDev + Flowise..."
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para verificar erros
check_error() {
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Erro: $1${NC}"
        exit 1
    fi
}

# Verificar Node.js
echo -e "${YELLOW}📋 Verificando pré-requisitos...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado. Por favor, instale Node.js 18+${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'.' -f1 | cut -d'v' -f2)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js versão $NODE_VERSION encontrado. Versão 18+ requerida.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) encontrado${NC}"

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm não encontrado${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm $(npm -v) encontrado${NC}"

# Verificar Git
if ! command -v git &> /dev/null; then
    echo -e "${YELLOW}⚠️  Git não encontrado. Você precisará baixar o projeto manualmente.${NC}"
fi

echo ""

# Perguntar sobre as credenciais Supabase
echo -e "${YELLOW}🔑 Configuração do Supabase${NC}"
echo "Por favor, crie um projeto em https://supabase.com e obtenha as credenciais:"
echo ""

read -p "URL do projeto Supabase: " SUPABASE_URL
read -p "Chave anônima (anon key): " SUPABASE_ANON_KEY
read -p "Chave de serviço (service_role key): " SUPABASE_SERVICE_ROLE_KEY

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo -e "${RED}❌ Todas as credenciais do Supabase são obrigatórias${NC}"
    exit 1
fi

echo ""

# Gerar chave secreta
SESSION_SECRET=$(openssl rand -base64 32)
NEXTAUTH_SECRET=$(openssl rand -base64 32)

echo -e "${GREEN}✅ Chaves secretas geradas${NC}"

# Criar arquivo .env.local para o urbanDev
echo -e "${YELLOW}📝 Criando arquivo .env.local para o urbanDev...${NC}"
cat > .env.local << EOF
# URLs do Flowise (rodando na porta 3001)
NEXT_PUBLIC_FLOWISE_URL=http://localhost:3001
FLOWISE_API_URL=http://localhost:3001/api

# Configuração Supabase
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

# Configuração do banco de dados (SQLite para desenvolvimento)
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$NEXTAUTH_SECRET

# Z.ai SDK (opcional)
# ZAI_API_KEY=sua_chave_zai_aqui

# Configuração Enterprise
NEXT_PUBLIC_SSO_ENABLED=true
NEXT_PUBLIC_SSO_PROVIDERS=supabase
NEXT_PUBLIC_SSO_REDIRECT_URL=http://localhost:3000/api/auth/callback

NEXT_PUBLIC_PLATFORM_TYPE=enterprise
NEXT_PUBLIC_WORKSPACE_ENABLED=true
NEXT_PUBLIC_ORGANIZATION_ENABLED=true
EOF

check_error "Falha ao criar .env.local"
echo -e "${GREEN}✅ Arquivo .env.local criado${NC}"

# Criar arquivo .env para o Flowise
echo -e "${YELLOW}📝 Criando arquivo .env para o Flowise...${NC}"
cat > Urbandev/flowise/.env << EOF
# Configurações Básicas
PORT=3001
NODE_ENV=development

# Configuração Supabase
SSO_SUPABASE_URL=$SUPABASE_URL
SSO_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
SSO_SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY

# Configuração Enterprise
PLATFORM_TYPE=ENTERPRISE
SSO_ENABLED=true
SSO_PROVIDERS=supabase
WORKSPACE_ENABLED=true
WORKSPACE_AUTO_CREATE=true
ORGANIZATION_ENABLED=true
RBAC_ENABLED=true
RBAC_DEFAULT_ROLE=user
APIKEY_ENABLED=true
APIKEY_HEADER_NAME=x-api-key
APIKEY_EXPIRY_DAYS=365
AUDIT_LOGS_ENABLED=true
SESSION_SECRET=$SESSION_SECRET
RATE_LIMIT_ENABLED=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Database
DATABASE_URL=file:././flowise.db
EOF

check_error "Falha ao criar .env do Flowise"
echo -e "${GREEN}✅ Arquivo .env do Flowise criado${NC}"

# Instalar dependências
echo -e "${YELLOW}📦 Instalando dependências do urbanDev...${NC}"
npm install
check_error "Falha ao instalar dependências do urbanDev"
echo -e "${GREEN}✅ Dependências do urbanDev instaladas${NC}"

echo -e "${YELLOW}📦 Instalando dependências do Flowise...${NC}"
cd Urbandev/flowise
npm install
check_error "Falha ao instalar dependências do Flowise"
echo -e "${GREEN}✅ Dependências do Flowise instaladas${NC}"

# Voltar para o diretório raiz
cd ../..

# Configurar banco de dados
echo -e "${YELLOW}🗄️ Configurando banco de dados...${NC}"
npm run db:push
check_error "Falha ao configurar banco de dados"
echo -e "${GREEN}✅ Banco de dados configurado${NC}"

echo ""
echo -e "${GREEN}🎉 Instalação concluída com sucesso!${NC}"
echo ""
echo -e "${YELLOW}🚀 Como iniciar as aplicações:${NC}"
echo ""
echo "Terminal 1 (urbanDev):"
echo "  npm run dev"
echo "  Acesso: http://localhost:3000"
echo ""
echo "Terminal 2 (Flowise):"
echo "  cd Urbandev/flowise"
echo "  npm start"
echo "  Acesso: http://localhost:3001"
echo ""
echo -e "${YELLOW}📝 Próximos passos:${NC}"
echo "1. Inicie as aplicações em terminais separados"
echo "2. Configure os provedores SSO no painel Supabase"
echo "3. Teste o login e a integração entre as plataformas"
echo "4. Personalize a marca e o conteúdo"
echo ""
echo -e "${GREEN}🎯 Parabéns! Você agora tem um sistema completo de agentes de IA rodando localmente!${NC}"