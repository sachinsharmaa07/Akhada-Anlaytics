# ── Client Dockerfile (multi-stage, optimized) ──

# Stage 1: Build the React app
FROM node:20-alpine AS build

WORKDIR /app

# Install deps first (layer caching — only re-runs when package files change)
COPY package.json package-lock.json ./
RUN npm ci && npm cache clean --force

# Copy source
COPY public/ ./public/
COPY src/ ./src/

# Build-time env vars (override via docker-compose args or CI)
ARG REACT_APP_API_URL=http://localhost:5001/api
ARG REACT_APP_GOOGLE_CLIENT_ID=""
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_GOOGLE_CLIENT_ID=$REACT_APP_GOOGLE_CLIENT_ID

RUN npm run build

# Stage 2: Serve with nginx (tiny image ~40MB)
FROM nginx:stable-alpine

# Copy built assets
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx config (extracted from inline for maintainability)
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Fix permissions for non-root nginx
RUN mkdir -p /var/cache/nginx /var/run \
    && chown -R nginx:nginx /usr/share/nginx/html /etc/nginx/conf.d /var/cache/nginx /var/run

USER nginx

EXPOSE 3000

# Health check: verify nginx is serving content
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
