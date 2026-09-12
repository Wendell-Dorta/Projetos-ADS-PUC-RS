# Stage 1: Build & Dependências
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci --legacy-peer-deps

COPY src ./src
RUN npm run build

# Stage 2: Runtime Produtivo Otimizado
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3003

COPY package*.json ./
COPY tsconfig.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3003

CMD ["node", "dist/main.js"]
