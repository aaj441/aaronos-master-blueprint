# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM pierrezemb/gostatic

# Copy built files from builder stage
COPY --from=builder /app/dist /srv/http/

CMD ["-port","8080","-https-promote", "-enable-logging"]
