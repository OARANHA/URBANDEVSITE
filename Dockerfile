# Etapa 1: Construção da aplicação
FROM node:18-alpine AS builder

# Definir o diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependência
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar o código da aplicação
COPY . .

# Gerar o Prisma client
RUN npx prisma generate

# Construir a aplicação
RUN npm run build

# Etapa 2: Criação da imagem de produção
FROM node:18-alpine AS runner

# Criar usuário não root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Definir o diretório de trabalho
WORKDIR /app

# Copiar arquivos necessários da etapa de construção
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

# Copiar o arquivo de banco de dados (opcional)
COPY --from=builder /app/db ./db

# Definir permissões
RUN chown -R nextjs:nodejs /app

# Mudar para o usuário não root
USER nextjs

# Expor a porta
EXPOSE 3000

# Definir variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000

# Comando para iniciar a aplicação
CMD ["node", "server.js"]