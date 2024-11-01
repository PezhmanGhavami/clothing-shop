FROM node:20-alpine AS base

# Stage 1: Install dependencies
FROM base AS deps
RUN apk update && apk add --no-cache python3 py3-pip make g++ libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# Stage 2: Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Production server
FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 next
USER next
COPY --from=builder --chown=next:nodejs /app/public ./public
COPY --from=builder --chown=next:nodejs /app/.next/standalone ./
COPY --from=builder --chown=next:nodejs /app/.next/static ./.next/static

EXPOSE 3000

CMD ["npm", "run", "start"]
