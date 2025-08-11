#!/bin/bash

# Script de Deploy para VPS
# Uso: ./deploy-vps.sh [server-ip] [user] [app-dir]

# Configurações padrão
SERVER=${1:-"seu-vps-ip"}
USER=${2:-"deploy"}
APP_DIR=${3:-"/var/www/urbanDev"}
BACKUP_DIR="/var/backups/urbanDev"

echo "🚀 Iniciando deploy para VPS..."
echo "📍 Servidor: $SERVER"
echo "👤 Usuário: $USER"
echo "📁 Diretório: $APP_DIR"

# Verificar se o script está sendo executado localmente ou remotamente
if [ "$SERVER" = "seu-vps-ip" ]; then
    echo "❌ Erro: Configure o IP do servidor no script ou passe como parâmetro"
    echo "Uso: ./deploy-vps.sh [server-ip] [user] [app-dir]"
    exit 1
fi

# Criar backup
echo "🔄 Criando backup..."
ssh $USER@$SERVER "mkdir -p $BACKUP_DIR && cp -r $APP_DIR $BACKUP_DIR/backup-\$(date +%Y%m%d-%H%M%S)"

# Fazer deploy
echo "📤 Enviando arquivos para o servidor..."
rsync -avz --delete --exclude=node_modules --exclude=.next --exclude=.git --exclude=.env* --exclude=backup ./ $USER@$SERVER:$APP_DIR/

# Instalar dependências e buildar
echo "⚙️ Configurando ambiente no servidor..."
ssh $USER@$SERVER "cd $APP_DIR && npm ci --only=production && npm run build"

# Reiniciar serviço
echo "🔄 Reiniciando serviço..."
ssh $USER@$SERVER "cd $APP_DIR && pm2 restart urbanDev"

# Verificar status
echo "✅ Verificando status do serviço..."
ssh $USER@$SERVER "pm2 status urbanDev"

echo "🎉 Deploy concluído com sucesso!"
echo "📊 Acesse: http://$SERVER"