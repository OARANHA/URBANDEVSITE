# Arquivos de Deploy Criados

Este documento lista todos os arquivos criados para facilitar o deploy do projeto urbanDev em diferentes plataformas.

## 📁 Arquivos Principais

### 1. Documentação
- **`DEPLOY.md`** - Guia completo de deploy para VPS, Render e Vercel
- **`README.md`** - Documentação principal do projeto com informações de instalação e deploy
- **`DEPLOY_FILES.md`** - Este arquivo, lista de todos os arquivos de deploy

### 2. Scripts de Deploy
- **`scripts/deploy.sh`** - Script principal de deploy que gerencia todas as plataformas
- **`scripts/deploy-vps.sh`** - Script específico para deploy em VPS
- **`scripts/deploy-render.sh`** - Script específico para deploy na plataforma Render
- **`scripts/deploy-vercel.sh`** - Script específico para deploy na plataforma Vercel

### 3. Configurações CI/CD
- **`.github/workflows/deploy.yml`** - Workflow do GitHub Actions para CI/CD

### 4. Configuração Docker
- **`Dockerfile`** - Configuração do Docker para containerização
- **`docker-compose.yml`** - Orquestração de serviços com Docker
- **`nginx.conf`** - Configuração do Nginx como proxy reverso

### 5. Variáveis de Ambiente
- **`.env.example`** - Arquivo exemplo com todas as variáveis de ambiente necessárias

## 🚀 Como Usar

### Script Principal de Deploy

```bash
# Ver ajuda
./scripts/deploy.sh --help

# Deploy para VPS
./scripts/deploy.sh vps

# Deploy para Render
./scripts/deploy.sh render

# Deploy para Vercel
./scripts/deploy.sh vercel

# Deploy via GitHub Actions
./scripts/deploy.sh github

# Simular deploy (dry-run)
./scripts/deploy.sh vps --dry-run

# Forçar deploy (ignora verificações)
./scripts/deploy.sh vercel --force
```

### Scripts Individuais

```bash
# Deploy VPS
./scripts/deploy-vps.sh [server-ip] [user] [app-dir]

# Deploy Render
./scripts/deploy-render.sh [service-name] [webhook-url]

# Deploy Vercel
./scripts/deploy-vercel.sh [project-name] [environment]
```

### Docker

```bash
# Construir imagem
docker build -t urbanDev .

# Usar docker-compose
docker-compose up -d

# Ver logs
docker-compose logs -f
```

## 🔧 Configuração Necessária

### Antes de fazer deploy

1. **Configure as variáveis de ambiente**:
   ```bash
   cp .env.example .env.local
   # Edite .env.local com seus valores
   ```

2. **Configure as secrets no GitHub** (para GitHub Actions):
   - `VPS_SSH_PRIVATE_KEY`
   - `VPS_IP`
   - `RENDER_TOKEN`
   - `VERCEL_TOKEN`

3. **Configure as plataformas**:
   - **VPS**: IP do servidor, usuário, diretório
   - **Render**: Serviço, webhook
   - **Vercel**: Projeto, token

## 📊 Estrutura de Pastas

```
urbanDev/
├── scripts/                    # Scripts de deploy
│   ├── deploy.sh              # Script principal
│   ├── deploy-vps.sh          # Script VPS
│   ├── deploy-render.sh       # Script Render
│   └── deploy-vercel.sh       # Script Vercel
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Actions
├── .env.example               # Variáveis de ambiente
├── Dockerfile                 # Configuração Docker
├── docker-compose.yml         # Orquestração Docker
├── nginx.conf                 # Configuração Nginx
├── DEPLOY.md                  # Guia de deploy
└── README.md                  # Documentação
```

## 🎉 Pronto para Deploy!

Com todos esses arquivos, você pode fazer deploy do projeto urbanDev em:

1. **VPS** (servidor dedicado)
2. **Render** (plataforma PaaS)
3. **Vercel** (plataforma PaaS)
4. **GitHub Actions** (CI/CD automatizado)
5. **Docker** (containerização)

Consulte o arquivo `DEPLOY.md` para instruções detalhadas de cada plataforma.