#!/bin/bash

# Script de Deploy para Vercel
# Uso: ./deploy-vercel.sh [project-name] [environment]

# Configurações
PROJECT_NAME=${1:-"urbanDev"}
ENVIRONMENT=${2:-"production"}

echo "🚀 Iniciando deploy para Vercel..."
echo "📦 Projeto: $PROJECT_NAME"
echo "🌍 Ambiente: $ENVIRONMENT"

# Verificar se a CLI Vercel está instalada
if ! command -v vercel &> /dev/null; then
    echo "❌ CLI Vercel não encontrada. Instalando..."
    npm install -g vercel
fi

# Fazer login na Vercel (se necessário)
if ! vercel whoami &> /dev/null; then
    echo "🔐 Faça login na Vercel:"
    vercel login
fi

# Fazer deploy
echo "📤 Enviando para Vercel..."
if [ "$ENVIRONMENT" = "production" ]; then
    vercel --prod --name $PROJECT_NAME
else
    vercel --name $PROJECT_NAME-$ENVIRONMENT
fi

# Verificar status
echo "✅ Verificando status do deploy..."
vercel ls $PROJECT_NAME

echo "🎉 Deploy concluído com sucesso!"
echo "📊 Acesse o dashboard: https://vercel.com/dashboard"
echo "🔗 URL do projeto: https://$PROJECT_NAME.vercel.app"