FROM node:20-alpine AS base
ARG DATABASE_URL
ARG SECRET_COOKIE_PASSWORD

# Stage 1: Install dependencies
FROM base AS deps
RUN apk update && apk add --no-cache python3 py3-pip make g++ libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
RUN npm install sharp

# Stage 2: Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Production server
FROM base AS runner
WORKDIR /app

ENV NODE_ENV="production"
ENV PORT="3000"
ENV HOSTNAME="0.0.0.0"
ENV DATABASE_URL=${DATABASE_URL}
ENV SECRET_COOKIE_PASSWORD=${SECRET_COOKIE_PASSWORD}

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 next
USER next

COPY --from=builder --chown=next:nodejs /app/public ./public
COPY --from=builder --chown=next:nodejs /app/.next/standalone ./
COPY --from=builder --chown=next:nodejs /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
