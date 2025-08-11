#!/bin/bash

# Script de Instalação Simplificada - urbanDev + Flowise (Versão Não-Enterprise)
# ==============================================================================
# Este script instala apenas a versão básica do Flowise sem recursos Enterprise
# Ideal para desenvolvimento local e testes rápidos

set -e

echo "🚀 Iniciando instalação SIMPLIFICADA do urbanDev + Flowise"
echo "=========================================================="
echo "⚠️  Versão: Não-Enterprise (sem SSO, RBAC, Workspaces)"
echo "⏱️  Tempo estimado: 10-15 minutos"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para exibir mensagens
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar pré-requisitos
log_info "Verificando pré-requisitos..."

if ! command -v node &> /dev/null; then
    log_error "Node.js não encontrado. Por favor, instale o Node.js 18+"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    log_error "npm não encontrado. Por favor, instale o npm"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    log_error "Node.js versão 18+ requerida. Versão atual: $(node --version)"
    exit 1
fi

log_success "Pré-requisitos verificados: Node.js $(node --version), npm $(npm --version)"

# Verificar se o diretório do projeto existe
if [ ! -f "package.json" ]; then
    log_error "package.json não encontrado. Execute este script no diretório raiz do urbanDev"
    exit 1
fi

# Instalar dependências do urbanDev
log_info "Instalando dependências do urbanDev..."
npm install
log_success "Dependências do urbanDev instaladas"

# Configurar ambiente simplificado
log_info "Configurando ambiente simplificado..."

# Criar .env.local simplificado
cat > .env.local << 'EOF'
# Configuração Simplificada - urbanDev
# ===================================

# URLs do Flowise (versão simplificada)
NEXT_PUBLIC_FLOWISE_URL=http://localhost:3001
FLOWISE_API_URL=http://localhost:3001/api

# Configuração básica (sem Supabase/SSO)
NEXT_PUBLIC_APP_NAME="urbanDev Demo"
NEXT_PUBLIC_APP_DESCRIPTION="Agentes de IA para Negócios"

# Desabilitar recursos Enterprise
NEXT_PUBLIC_SSO_ENABLED=false
NEXT_PUBLIC_WORKSPACE_ENABLED=false
NEXT_PUBLIC_ORGANIZATION_ENABLED=false
NEXT_PUBLIC_PLATFORM_TYPE=open_source
EOF

log_success "Arquivo .env.local criado com configuração simplificada"

# Verificar se o Flowise já existe
if [ ! -d "Urbandev/flowise" ]; then
    log_warning "Diretório do Flowise não encontrado. Baixando..."
    
    # Criar estrutura de diretórios
    mkdir -p Urbandev
    
    # Clonar Flowise (versão main, não enterprise)
    cd Urbandev
    git clone https://github.com/FlowiseAI/Flowise.git flowise
    cd flowise
    
    # Instalar dependências do Flowise
    log_info "Instalando dependências do Flowise..."
    npm install
    npm run build
    
    log_success "Flowise baixado e instalado"
    
    # Voltar para o diretório raiz
    cd ../..
else
    log_info "Flowise já existe. Pulando download..."
    
    # Entrar no diretório do Flowise e atualizar
    cd Urbandev/flowise
    
    # Verificar se precisa instalar dependências
    if [ ! -d "node_modules" ]; then
        log_info "Instalando dependências do Flowise..."
        npm install
        npm run build
        log_success "Dependências do Flowise instaladas"
    fi
    
    # Voltar para o diretório raiz
    cd ../..
fi

# Configurar ambiente simplificado do Flowise
log_info "Configurando ambiente simplificado do Flowise..."

# Criar .env simplificado para o Flowise
cat > Urbandev/flowise/.env << 'EOF'
# Configuração Simplificada - Flowise
# ===================================

# Configurações básicas
PORT=3001
NODE_ENV=development

# Database (SQLite para desenvolvimento)
DATABASE_URL=file:././flowise.db

# Desabilitar recursos Enterprise
PLATFORM_TYPE=OPEN_SOURCE
SSO_ENABLED=false
WORKSPACE_ENABLED=false
ORGANIZATION_ENABLED=false
RBAC_ENABLED=false
AUDIT_LOGS_ENABLED=false

# API Key básica (para desenvolvimento)
APIKEY_ENABLED=true
APIKEY_HEADER_NAME=x-api-key
APIKEY_EXPIRY_DAYS=365

# Segurança básica
RATE_LIMIT_ENABLED=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
SESSION_SECRET=your_very_long_random_secret_here_change_in_production

# Configuração de aplicação
APP_URL=http://localhost:3001
EOF

log_success "Arquivo .env do Flowise criado com configuração simplificada"

# Criar script de inicialização simplificada
log_info "Criando scripts de inicialização..."

cat > start-simple.sh << 'EOF'
#!/bin/bash

# Script de Inicialização Simplificada
# ===================================

echo "🚀 Iniciando urbanDev + Flowise (Versão Simplificada)"
echo "===================================================="

# Iniciar Flowise em background
echo "🔧 Iniciando Flowise (http://localhost:3001)..."
cd Urbandev/flowise
npm start &
FLOWISE_PID=$!

# Esperar Flowise iniciar
sleep 10

# Iniciar urbanDev
echo "🌐 Iniciando urbanDev (http://localhost:3000)..."
cd ../..
npm run dev &
URBANDEV_PID=$!

echo ""
echo "✅ Aplicações iniciadas com sucesso!"
echo ""
echo "📍 Acesse:"
echo "   • urbanDev: http://localhost:3000"
echo "   • Flowise:  http://localhost:3001"
echo ""
echo "🔑 Flowise Login (primeiro acesso):"
echo "   • Username: admin"
echo "   • Password: (defina no primeiro acesso)"
echo ""
echo "⚠️  Para parar as aplicações: CTRL+C ou ./stop-simple.sh"
echo ""

# Esperar os processos
wait $FLOWISE_PID $URBANDEV_PID
EOF

chmod +x start-simple.sh

cat > stop-simple.sh << 'EOF'
#!/bin/bash

# Script de Parada Simplificada
# ============================

echo "🛑 Parando urbanDev + Flowise..."

# Matar processos na porta 3000 e 3001
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

echo "✅ Aplicações paradas com sucesso!"
EOF

chmod +x stop-simple.sh

log_success "Scripts de inicialização criados"

# Exibir resumo
echo ""
echo "🎉 Instalação SIMPLIFICADA concluída com sucesso!"
echo "================================================"
echo ""
echo "📋 O que foi instalado:"
echo "   • urbanDev (frontend) - Versão demo"
echo "   • Flowise (backend) - Versão open source (sem Enterprise)"
echo ""
echo "🚀 Para iniciar as aplicações:"
echo "   ./start-simple.sh"
echo ""
echo "🛑 Para parar as aplicações:"
echo "   ./stop-simple.sh"
echo ""
echo "📍 URLs de acesso:"
echo "   • urbanDev: http://localhost:3000"
echo "   • Flowise:  http://localhost:3001"
echo ""
echo "🔐 Credenciais Flowise:"
echo "   • Primeiro acesso: crie seu usuário/senha"
echo "   • Sem SSO - login local apenas"
echo ""
echo "⚠️  Limitações da versão simplificada:"
echo "   • Sem SSO (login com Google/GitHub)"
echo "   • Sem RBAC (controle de acesso granular)"
echo "   • Sem Workspaces/Organizações"
echo "   • Sem Audit Logs"
echo "   • Apenas para desenvolvimento e testes"
echo ""
echo "📚 Para versão completa com Enterprise:"
echo "   • Execute: ./install-local.sh"
echo "   • Ou leia: GUIA_INSTALACAO_LOCAL.md"
echo ""
log_success "Instalação simplificada concluída!"