# Multi-stage Dockerfile for building and serving the Vite React app

# --- Build stage ---
FROM node:18-alpine AS builder


# ARG local=false

# # If building with --build-arg local=true set a faster registry, and echo the configured registry.
# RUN if [ "$local" = "true" ]; then \
#       npm config set registry https://registry.npmmirror.com/ && \
#       echo "npm registry set to: $(npm config get registry)"; \
#     else \
#       echo "using default npm registry: $(npm config get registry)"; \
#     fi

# Enable Corepack to use pnpm (pnpm lockfile is present)
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy project files (copy everything so Docker build doesn't fail when a lockfile is missing)
COPY . .

# Install dependencies.
# If a pnpm lockfile exists use --frozen-lockfile for reproducible installs,
# otherwise fall back to a normal install.
RUN if [ -f pnpm-lock.yaml ]; then \
      pnpm install --frozen-lockfile; \
    else \
      pnpm install; \
    fi

# Build the project
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
