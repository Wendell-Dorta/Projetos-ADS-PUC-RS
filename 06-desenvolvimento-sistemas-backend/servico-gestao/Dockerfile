# Stage 1: Build & Dependências
FROM node:20-alpine AS builder

WORKDIR /app

# Copia manifestos de dependências e configurações do Prisma
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

# Instala todas as dependências (incluindo devDependencies)
RUN npm ci --legacy-peer-deps

# Gera os tipos do Prisma Client
RUN npx prisma generate

# Copia o código-fonte e realiza o build TypeScript
COPY src ./src
RUN npm run build

# Stage 2: Runtime Produtivo Otimizado
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Copia manifestos e código compilado do builder
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3001

# Executa migrações, seeding e inicia a aplicação NestJS
CMD ["sh", "-c", "npx prisma migrate deploy && npm run seed && node dist/main.js"]
