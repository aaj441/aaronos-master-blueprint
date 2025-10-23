# Build stage - install dependencies
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Production stage - serve with nginx
FROM nginx:alpine

# Copy static files
COPY index.html /usr/share/nginx/html/
COPY theme-perplexity.css /usr/share/nginx/html/
COPY voice-resonance-coach.md /usr/share/nginx/html/
COPY ebook-machine /usr/share/nginx/html/ebook-machine
COPY lucy /usr/share/nginx/html/lucy

# Create nginx config for SPA routing
RUN echo 'server { \
    listen 8080; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    # Enable gzip compression \
    gzip on; \
    gzip_types text/css application/javascript application/json; \
}' > /etc/nginx/conf.d/default.conf

# Remove default nginx config
RUN rm -f /etc/nginx/conf.d/default.conf.default

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
