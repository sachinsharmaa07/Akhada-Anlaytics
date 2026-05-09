# ── Backend Dockerfile (multi-stage, optimized) ──
# Stage 1: Install production dependencies only
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Stage 2: Production runtime
FROM node:20-alpine AS runtime

# Security: run as non-root
ENV NODE_ENV=production

WORKDIR /app

# Copy only what's needed
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json ./
COPY --chown=node:node backend/ ./backend/

USER node

EXPOSE 5001

# Health check: hit /api/health every 30s
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5001/api/health || exit 1

CMD ["node", "backend/server.js"]
