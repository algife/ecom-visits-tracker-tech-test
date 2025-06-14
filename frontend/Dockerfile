# FRONTEND DOCKERFILE
# ----------

# Build
FROM node:24 AS builder
WORKDIR /app


COPY package*.json ./

# RUN npm ci
RUN npm install -g typescript
RUN npm ci

COPY . .
RUN npm run build

# ----------

# Production
FROM node:24-slim AS production
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./

# ENV NODE_ENV=production
# ENV HOSTNAME="0.0.0.0"
# ENV PORT 3001
EXPOSE 3001

CMD ["npx", "next", "start", "-p", "3001", "-H", "0.0.0.0"]