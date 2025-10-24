#!/bin/sh
set -e

echo "🚀 Starting AaronOS Platform..."

# Run database migrations
echo "📦 Running database migrations..."
pnpm prisma migrate deploy

# Generate Prisma client
echo "🔧 Generating Prisma client..."
pnpm prisma generate

# Start the application in the background
echo "🌐 Starting web server..."
node .output/server/index.mjs &
SERVER_PID=$!

# Start the job scheduler
echo "⏰ Starting job scheduler..."
pnpm scheduler &
SCHEDULER_PID=$!

# Wait for both processes
wait $SERVER_PID $SCHEDULER_PID
