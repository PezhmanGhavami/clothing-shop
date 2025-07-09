# Use the full node:20 image for maximum compatibility (Debian-based)
FROM node:20 AS base

FROM base AS deps
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install
RUN npm install sharp

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 next
USER next

COPY --from=builder --chown=next:nodejs /app/public ./public
COPY --from=builder --chown=next:nodejs /app/.next/standalone ./
COPY --from=builder --chown=next:nodejs /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
