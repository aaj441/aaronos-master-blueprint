#!/bin/bash
set -e

echo "🚀 Starting AaronOS on Railway..."

# Set default port if not provided by Railway
export PORT=${PORT:-3000}
echo "📡 Using PORT: $PORT"

# Run database migrations
echo "📦 Running database migrations..."
pnpm prisma migrate deploy

# Generate Prisma client (in case it's not already generated)
echo "🔧 Ensuring Prisma client is generated..."
pnpm prisma generate

# Start the application
echo "🌐 Starting server on port $PORT..."
exec node .output/server/index.mjs
