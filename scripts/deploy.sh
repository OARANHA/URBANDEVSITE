#!/bin/bash

# Script Principal de Deploy
# Uso: ./deploy.sh [platform] [options]

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
PROJECT_NAME="urbanDev"
REPO_URL="https://github.com/OARANHA/Urbandev.git"

# Função de ajuda
show_help() {
    echo -e "${BLUE}Script de Deploy - urbanDev${NC}"
    echo ""
    echo "Uso: $0 [plataforma] [opções]"
    echo ""
    echo "Plataformas disponíveis:"
    echo "  vps      - Deploy em servidor VPS"
    echo "  render   - Deploy na plataforma Render"
    echo "  vercel   - Deploy na plataforma Vercel"
    echo "  github   - Deploy via GitHub Actions"
    echo ""
    echo "Opções:"
    echo "  --help, -h     - Mostra esta ajuda"
    echo "  --dry-run      - Simula o deploy sem executar"
    echo "  --force        - Força o deploy ignorando verificações"
    echo ""
    echo "Exemplos:"
    echo "  $0 vps --dry-run"
    echo "  $0 render"
    echo "  $0 vercel --force"
    echo ""
}

# Função de log
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar pré-requisitos
check_prerequisites() {
    log "Verificando pré-requisitos..."
    
    # Verificar se está no diretório do projeto
    if [ ! -f "package.json" ]; then
        log_error "Arquivo package.json não encontrado. Execute este script no diretório raiz do projeto."
        exit 1
    fi
    
    # Verificar se o repositório é Git
    if [ ! -d ".git" ]; then
        log_warning "Diretório .git não encontrado. Criando um novo repositório Git..."
        git init
        git add .
        git commit -m "Initial commit"
    fi
    
    # Verificar se há mudanças não commitadas
    if [ ! -z "$(git status --porcelain)" ]; then
        log_warning "Existem mudanças não commitadas. Faça commit antes de fazer deploy."
        if [ "$FORCE" != "true" ]; then
            exit 1
        fi
    fi
    
    log "Pré-requisitos verificados!"
}

# Fazer build e testes
build_and_test() {
    log "Fazendo build do projeto..."
    
    if [ "$DRY_RUN" = "true" ]; then
        log "Simulando build..."
        return 0
    fi
    
    # Instalar dependências
    npm ci
    
    # Gerar Prisma client
    npm run db:generate
    
    # Fazer build
    npm run build
    
    if [ $? -ne 0 ]; then
        log_error "Build falhou!"
        exit 1
    fi
    
    log "Build concluído com sucesso!"
}

# Deploy VPS
deploy_vps() {
    log "Iniciando deploy para VPS..."
    
    if [ "$DRY_RUN" = "true" ]; then
        log "Simulando deploy para VPS..."
        echo "  - Criando backup do servidor remoto"
        echo "  - Enviando arquivos via rsync"
        echo "  - Instalando dependências"
        echo "  - Reiniciando serviço com PM2"
        echo "  - Verificando status do serviço"
        return 0
    fi
    
    # Verificar se o script de deploy VPS existe
    if [ ! -f "scripts/deploy-vps.sh" ]; then
        log_error "Script de deploy VPS não encontrado: scripts/deploy-vps.sh"
        exit 1
    fi
    
    # Executar script de deploy VPS
    chmod +x scripts/deploy-vps.sh
    ./scripts/deploy-vps.sh
}

# Deploy Render
deploy_render() {
    log "Iniciando deploy para Render..."
    
    if [ "$DRY_RUN" = "true" ]; then
        log "Simulando deploy para Render..."
        echo "  - Fazendo push para o GitHub"
        echo "  - Disparando webhook do Render"
        return 0
    fi
    
    # Verificar se o script de deploy Render existe
    if [ ! -f "scripts/deploy-render.sh" ]; then
        log_error "Script de deploy Render não encontrado: scripts/deploy-render.sh"
        exit 1
    fi
    
    # Executar script de deploy Render
    chmod +x scripts/deploy-render.sh
    ./scripts/deploy-render.sh
}

# Deploy Vercel
deploy_vercel() {
    log "Iniciando deploy para Vercel..."
    
    if [ "$DRY_RUN" = "true" ]; then
        log "Simulando deploy para Vercel..."
        echo "  - Verificando CLI Vercel"
        echo "  - Fazendo login (se necessário)"
        echo "  - Enviando para Vercel"
        echo "  - Verificando status do deploy"
        return 0
    fi
    
    # Verificar se o script de deploy Vercel existe
    if [ ! -f "scripts/deploy-vercel.sh" ]; then
        log_error "Script de deploy Vercel não encontrado: scripts/deploy-vercel.sh"
        exit 1
    fi
    
    # Executar script de deploy Vercel
    chmod +x scripts/deploy-vercel.sh
    ./scripts/deploy-vercel.sh
}

# Deploy GitHub Actions
deploy_github() {
    log "Iniciando deploy via GitHub Actions..."
    
    if [ "$DRY_RUN" = "true" ]; then
        log "Simulando deploy via GitHub Actions..."
        echo "  - Verificando arquivo .github/workflows/deploy.yml"
        echo "  - Fazendo push para o GitHub"
        echo "  - Disparando workflow do GitHub Actions"
        return 0
    fi
    
    # Verificar se o workflow do GitHub Actions existe
    if [ ! -d ".github/workflows" ]; then
        log_warning "Diretório .github/workflows não encontrado. Criando workflow básico..."
        mkdir -p .github/workflows
        
        cat > .github/workflows/deploy.yml << EOF
name: Deploy urbanDev

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build project
      run: npm run build
    
    - name: Deploy to production
      if: github.ref == 'refs/heads/main'
      run: |
        echo "Deploy para produção será feito aqui..."
        # Adicione comandos de deploy específicos para sua plataforma
EOF
    fi
    
    # Fazer push para o GitHub
    git add .
    git commit -m "Deploy: Adicionar workflow do GitHub Actions"
    git push origin main
    
    log "GitHub Actions workflow criado e push realizado!"
    log "Acesse: https://github.com/OARANHA/Urbandev/actions"
}

# Função principal
main() {
    # Parse de argumentos
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --force)
                FORCE=true
                shift
                ;;
            vps)
                PLATFORM="vps"
                shift
                ;;
            render)
                PLATFORM="render"
                shift
                ;;
            vercel)
                PLATFORM="vercel"
                shift
                ;;
            github)
                PLATFORM="github"
                shift
                ;;
            *)
                log_error "Opção desconhecida: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # Verificar se a plataforma foi especificada
    if [ -z "$PLATFORM" ]; then
        log_error "Plataforma de deploy não especificada!"
        show_help
        exit 1
    fi
    
    log "Iniciando processo de deploy para: $PLATFORM"
    
    # Executar pré-requisitos
    check_prerequisites
    
    # Fazer build e testes
    build_and_test
    
    # Executar deploy conforme a plataforma
    case $PLATFORM in
        vps)
            deploy_vps
            ;;
        render)
            deploy_render
            ;;
        vercel)
            deploy_vercel
            ;;
        github)
            deploy_github
            ;;
        *)
            log_error "Plataforma desconhecida: $PLATFORM"
            exit 1
            ;;
    esac
    
    log "🎉 Deploy concluído com sucesso!"
    log "📊 Verifique o status da implantação na plataforma escolhida."
}

# Executar função principal
main "$@"