# Multi-stage Dockerfile for building and serving the Vite React app

# --- Build stage ---
FROM node:18-alpine AS builder

# Enable Corepack to use pnpm (pnpm lockfile is present)
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package manifests first to leverage Docker cache
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm (frozen lockfile)
RUN pnpm install --frozen-lockfile

# Copy the rest of the source and build
COPY . .
RUN pnpm build

# --- Production stage ---
FROM nginx:stable-alpine AS runner

# Remove default nginx index (optional) and copy our built site
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config (spa fallback + caching)
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Simple healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- --spider http://localhost/ || exit 1

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
