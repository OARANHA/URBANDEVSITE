# Guia de Deploy - urbanDev

Este guia descreve como fazer o deploy do projeto urbanDev em diferentes plataformas: VPS, Render e Vercel.

## Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Git
- Conta nas plataformas de deploy desejadas

## Estrutura do Projeto

```
urbanDev/
├── src/
│   ├── app/              # Rotas do Next.js 13+ App Router
│   ├── components/       # Componentes React
│   ├── lib/             # Configurações e utilitários
│   └── ...
├── prisma/              # Configuração do banco de dados
├── public/              # Arquivos estáticos
└── ...
```

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```bash
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-secret-key-aqui"

# Supabase (se usar)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Z.ai (se usar)
ZAI_API_KEY=your_zai_api_key
ZAI_BASE_URL=https://api.z.ai/api/paas/v4/

# Flowise (se usar)
FLOWISE_USERNAME=admin
FLOWISE_PASSWORD=1234
```

## Build e Testes Locais

```bash
# Instalar dependências
npm install

# Configurar banco de dados
npm run db:generate
npm run db:push

# Rodar em modo de desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm start
```

---

## 1. Deploy em VPS (Ubuntu/Debian)

### Pré-requisitos
- VPS com Ubuntu 20.04+ ou Debian 10+
- Domain apontado para o IP da VPS
- Certificado SSL (opcional, mas recomendado)

### Passos

#### 1.1. Configuração Inicial da VPS

```bash
# Conectar à VPS via SSH
ssh root@seu-ip-vps

# Atualizar sistema
apt update && apt upgrade -y

# Instalar Node.js, npm e PM2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs npm

# Instalar PM2 (gerenciador de processos)
npm install -g pm2

# Instalar Nginx
apt install nginx -y

# Configurar firewall
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable
```

#### 1.2. Deploy da Aplicação

```bash
# Criar diretório para a aplicação
mkdir -p /var/www/urbanDev
cd /var/www/urbanDev

# Clonar repositório
git clone https://github.com/seu-usuario/urbanDev.git .

# Instalar dependências
npm ci --only=production

# Buildar aplicação
npm run build

# Configurar PM2
pm2 start npm --name "urbanDev" -- start

# Salvar configuração do PM2
pm2 save
pm2 startup
```

#### 1.3. Configuração do Nginx

Crie o arquivo de configuração do Nginx:

```bash
nano /etc/nginx/sites-available/urbanDev
```

Adicione o seguinte conteúdo:

```nginx
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;
    root /var/www/urbanDev/.next;
    index index.html;

    location / {
        try_files $uri $uri/ @nextjs;
    }

    location @nextjs {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Configuração de arquivos estáticos
    location /_next/static/ {
        alias /var/www/urbanDev/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Configuração de outras otimizações
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
```

Habilite o site:

```bash
ln -s /etc/nginx/sites-available/urbanDev /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

#### 1.4. Configuração SSL (Let's Encrypt)

```bash
# Instalar Certbot
apt install certbot python3-certbot-nginx -y

# Obter certificado SSL
certbot --nginx -d seu-dominio.com -d www.seu-dominio.com

# Configuração automática de renovação
certbot renew --dry-run
```

#### 1.5. Script de Deploy Automatizado

Crie o arquivo `deploy.sh`:

```bash
#!/bin/bash

# Configurações
REPO_URL="https://github.com/seu-usuario/urbanDev.git"
APP_DIR="/var/www/urbanDev"
BACKUP_DIR="/var/backups/urbanDev"

# Criar backup
mkdir -p $BACKUP_DIR
cp -r $APP_DIR $BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S)

# Atualizar código
cd $APP_DIR
git pull origin main

# Instalar dependências
npm ci --only=production

# Buildar aplicação
npm run build

# Reiniciar serviço
pm2 restart urbanDev

echo "Deploy concluído com sucesso!"
```

Dê permissão de execução:

```bash
chmod +x deploy.sh
```

---

## 2. Deploy no Render

### Pré-requisitos
- Conta no Render (render.com)
- Repositório no GitHub
- Webhook configurado

### Passos

#### 2.1. Configuração do Repositório

1. Faça push do seu código para o GitHub
2. No GitHub, crie um arquivo `.env.production` com as variáveis de produção
3. Adicione o arquivo ao `.gitignore` para não subir secrets

#### 2.2. Criar Serviço Web no Render

1. Acesse render.com e faça login
2. Clique em "New +" e selecione "Web Service"
3. Conecte com seu repositório GitHub
4. Configure as opções:
   - Name: `urbanDev`
   - Region: `Oregon` (ou o mais próximo)
   - Branch: `main`
   - Runtime: `Docker`
   - Instance Type: `Free` (para testes) ou `Standard` (para produção)

#### 2.3. Configuração de Build

```yaml
buildCommand: "npm ci && npm run build"
startCommand: "npm start"
envVars:
  - key: "NODE_ENV"
    value: "production"
  - key: "DATABASE_URL"
    value: "postgresql://user:password@host:port/database"
```

#### 2.4. Configuração de Banco de Dados

1. Crie um novo "Web Service" do tipo "PostgreSQL"
2. Anote as credenciais de conexão
3. Adicione as variáveis ao serviço principal

#### 2.5. Variáveis de Ambiente

Configure as seguintes variáveis no serviço web:

```bash
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:port/database
NEXTAUTH_URL=https://urbanDev.onrender.com
NEXTAUTH_SECRET=sua-secret-key
ZAI_API_KEY=your_zai_api_key
```

#### 2.6. Configuração de Domínio Personalizado

1. No dashboard do Render, vá para o serviço
2. Na seção "Custom Domains", adicione seu domínio
3. Configure os DNS do seu domínio para apontar para o Render

---

## 3. Deploy na Vercel

### Prérequisitos
- Conta na Vercel (vercel.com)
- Repositório no GitHub
- CLI Vercel instalada (opcional)

### Passos

#### 3.1. Instalação da CLI Vercel (opcional)

```bash
npm i -g vercel
```

#### 3.2. Deploy via CLI

```bash
# Fazer login
vercel login

# Adicionar projeto
vercel --prod

# Ou deploy específico
vercel --prod --name urbanDev-prod
```

#### 3.3. Deploy via Dashboard

1. Acesa vercel.com e faça login
2. Clique em "Add New..." e selecione "Project"
3. Conecte com seu repositório GitHub
4. Selecione o repositório e branch
5. Configure as variáveis de ambiente
6. Clique em "Deploy"

#### 3.4. Configuração de Variáveis de Ambiente

No dashboard do Vercel:
1. Vá para o projeto
2. Aba "Settings" > "Environment Variables"
3. Adicione as variáveis necessárias

```bash
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:port/database
NEXTAUTH_URL=https://urbanDev.vercel.app
NEXTAUTH_SECRET=sua-secret-key
ZAI_API_KEY=your_zai_api_key
```

#### 3.5. Configuração de Domínio Personalizado

1. Na aba "Settings" > "Domains"
2. Adicione seu domínio customizado
3. Siga as instruções de configuração DNS

#### 3.6. Configuração de Build

Adicione um arquivo `vercel.json` na raiz do projeto:

```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/api/:path*"
    }
  ]
}
```

---

## 4. Scripts de Deploy Automatizado

### 4.1. Script para VPS

Crie `scripts/deploy-vps.sh`:

```bash
#!/bin/bash

# Configurações
USER="deploy"
SERVER="seu-vps-ip"
APP_DIR="/var/www/urbanDev"
BACKUP_DIR="/var/backups/urbanDev"

# Criar backup
ssh $USER@$SERVER "mkdir -p $BACKUP_DIR && cp -r $APP_DIR $BACKUP_DIR/backup-\$(date +%Y%m%d-%H%M%S)"

# Fazer deploy
rsync -avz --delete --exclude=node_modules --exclude=.next --exclude=.git ./ $USER@$SERVER:$APP_DIR/

# Executar comandos no servidor
ssh $USER@$SERVER "cd $APP_DIR && npm ci --only=production && npm run build && pm2 restart urbanDev"

echo "Deploy concluído com sucesso!"
```

### 4.2. Script para Render

Crie `scripts/deploy-render.sh`:

```bash
#!/bin/bash

# Configurações
RENDER_SERVICE="urbanDev"
RENDER_WEBHOOK="https://api.render.com/deploy/serviço-id"

# Fazer push para o GitHub
git push origin main

# Disparar webhook do Render
curl -X POST $RENDER_WEBHOOK -H "Authorization: Bearer seu-token"

echo "Deploy no Render iniciado!"
```

### 4.3. Script para Vercel

Crie `scripts/deploy-vercel.sh`:

```bash
#!/bin/bash

# Configurações
PROJECT_NAME="urbanDev"

# Fazer deploy
vercel --prod --name $PROJECT_NAME

echo "Deploy na Vercel concluído!"
```

---

## 5. Monitoramento e Logs

### 5.1. Monitoramento PM2 (VPS)

```bash
# Verificar status dos processos
pm2 status

# Verificar logs
pm2 logs urbanDev

# Monitoramento em tempo real
pm2 monit
```

### 5.2. Logs Render

```bash
# Via dashboard
# Acessar o serviço no dashboard e ir para a aba "Logs"

# Via CLI
vercel logs urbanDev
```

### 5.3. Logs Vercel

```bash
# Via dashboard
# Acessar o projeto e ir para a aba "Functions" > "Logs"

# Via CLI
vercel logs urbanDev
```

---

## 6. Melhores Práticas

### 6.1. Segurança

- Nunca commitar variáveis de ambiente
- Usar secrets management nas plataformas de deploy
- Manter dependências atualizadas
- Usar HTTPS em produção

### 6.2. Performance

- Habilitar compressão Gzip
- Configurar cache adequado
- Usar CDN para arquivos estáticos
- Monitorar métricas de desempenho

### 6.3. Backup

- Fazer backup regular do banco de dados
- Manter versões do código
- Testar procedimentos de restauração

---

## 7. Solução de Problemas

### 7.1. Problemas Comuns

**Build falha:**
- Verificar variáveis de ambiente
- Checar versões do Node.js
- Verificar erros no log de build

**Aplicação não inicia:**
- Verificar portas
- Checar logs de erro
- Validar configurações do banco

**Performance lenta:**
- Habilitar cache
- Otimizar imagens
- Usar CDN

### 7.2. Comandos Úteis

```bash
# Verificar logs do sistema
journalctl -u nginx

# Reiniciar serviços
systemctl restart nginx
pm2 restart urbanDev

# Limpar builds
rm -rf .next
npm run build
```

---

## 8. Suporte

Para dúvidas específicas sobre cada plataforma:

- **VPS:** Documentação oficial do Ubuntu/Debian e Nginx
- **Render:** https://render.com/docs
- **Vercel:** https://vercel.com/docs

Para dúvidas sobre o projeto, verificar issues no GitHub ou entrar em contato com o time de desenvolvimento.