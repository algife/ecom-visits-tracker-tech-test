# BACKEND DOCKERFILE
# ----------

# Build
FROM node:24 AS builder
WORKDIR /app

COPY package*.json ./
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

COPY --from=builder /app/dist ./dist

# ENV NODE_ENV=production
# ENV PORT=3030
EXPOSE 3030

CMD ["node", "dist/index.js"]