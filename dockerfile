FROM node:20-alpine AS base

# BUILDER -------------------------------
FROM base AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build


# RUNNER --------------------------------
FROM base AS runner
WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENTRYPOINT ["node", "server.js"]