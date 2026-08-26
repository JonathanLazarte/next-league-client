# 1. Base stage: dependencias
FROM node:26-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 2. Builder stage: compilar la app
FROM node:26-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Asegúrate de que next.config.js tenga output: 'standalone'
RUN apk add --no-cache git
RUN npm run build

# 3. Runner stage: entorno de producción final
FROM node:26-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

# Crear un usuario no root por seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar lo mínimo necesario para ejecutar la app
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
