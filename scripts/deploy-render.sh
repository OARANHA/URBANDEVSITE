#!/bin/bash

# Script de Deploy para Render
# Uso: ./deploy-render.sh [service-name] [webhook-url]

# Configurações
SERVICE_NAME=${1:-"urbanDev"}
WEBHOOK_URL=${2:-""}

echo "🚀 Iniciando deploy para Render..."
echo "📦 Serviço: $SERVICE_NAME"

# Verificar se o webhook foi fornecido
if [ -z "$WEBHOOK_URL" ]; then
    echo "⚠️  Nenhum webhook fornecido. Apenas fazendo push para o GitHub."
    echo "Para deploy automático, configure o webhook no dashboard do Render."
else
    echo "🔗 Webhook: $WEBHOOK_URL"
fi

# Fazer push para o GitHub
echo "📤 Enviando código para o GitHub..."
git push origin main

# Disparar webhook do Render (se fornecido)
if [ ! -z "$WEBHOOK_URL" ]; then
    echo "🔄 Disparando webhook do Render..."
    response=$(curl -X POST "$WEBHOOK_URL" \
        -H "Authorization: Bearer $RENDER_TOKEN" \
        -H "Content-Type: application/json" \
        -w "%{http_code}" \
        -s -o /dev/null)

    if [ "$response" = "200" ] || [ "$response" = "202" ]; then
        echo "✅ Webhook disparado com sucesso!"
    else
        echo "❌ Erro ao disparar webhook. Código de status: $response"
    fi
fi

echo "🎉 Processo de deploy iniciado!"
echo "📊 Acompanhe o progresso no dashboard do Render"
echo "🔗 URL: https://dashboard.render.com/services/$SERVICE_NAME"