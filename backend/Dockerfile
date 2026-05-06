# ── Backend Dockerfile ──
FROM node:20-alpine

WORKDIR /app

# Copy root package files and install backend deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy backend source
COPY backend/ ./backend/

# Expose backend port
EXPOSE 5001

CMD ["node", "backend/server.js"]
