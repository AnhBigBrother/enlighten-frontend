FROM node:20-alpine AS base

# Multi stage build for optimizing image size.

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

RUN mkdir .next

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENTRYPOINT ["node", "server.js"]