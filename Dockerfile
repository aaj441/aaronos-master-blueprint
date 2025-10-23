# Build stage
FROM node:18-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client
RUN pnpm prisma generate

# Build the application
RUN pnpm build

# Production stage
FROM node:18-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

WORKDIR /app

# Copy package files and install production dependencies
COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma/

RUN pnpm install --prod --frozen-lockfile

# Copy built application from builder
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Set environment
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

# Run database migrations and start the app
CMD pnpm prisma migrate deploy && pnpm start
