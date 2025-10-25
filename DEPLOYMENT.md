# Deployment Guide

This guide covers deploying AaronOS to various platforms.

## Prerequisites

- Node.js >= 18
- npm or pnpm

## Build Locally

```bash
npm install --legacy-peer-deps
npm run build
```

This creates a `dist/` folder with the production build.

## Railway Deployment

Railway will automatically detect and use the `railway.json` configuration.

1. Connect your repository to Railway
2. Railway will automatically:
   - Install dependencies with `npm install --legacy-peer-deps`
   - Build with `npm run build`
   - Serve the static files using `serve` on port 8080

### Manual Railway Setup

If auto-detection doesn't work:
- Build Command: `npm install --legacy-peer-deps && npm run build`
- Start Command: `npx serve dist -l 8080`

## Vercel Deployment

Vercel will automatically detect Vite and use the `vercel.json` configuration.

1. Connect your repository to Vercel
2. Vercel will automatically:
   - Install dependencies with `npm install --legacy-peer-deps`
   - Build with `npm run build`
   - Deploy the `dist/` directory

### Manual Vercel Setup

If needed, configure:
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install --legacy-peer-deps`
- Framework Preset: Vite

## Fly.io Deployment

The app includes a `Dockerfile` and `fly.toml` for Fly.io deployment.

```bash
fly deploy
```

The Dockerfile:
1. Builds the app in a Node.js container
2. Copies the built files to a lightweight static server (gostatic)
3. Serves on port 8080

## Docker Deployment

Build and run locally with Docker:

```bash
docker build -t aaronos .
docker run -p 8080:8080 aaronos
```

## Environment Variables

Currently, the app doesn't require any environment variables for production deployment. If you add backend integrations or API keys later, document them here.

## Troubleshooting

### Build fails with esbuild errors
Run: `rm -rf node_modules package-lock.json && npm install --legacy-peer-deps`

### Routes don't work (404 on refresh)
Make sure your platform is configured for SPA routing:
- Vercel: Uses `vercel.json` rewrites (already configured)
- Railway: The `serve` package handles this automatically with the `-s` flag
- Other platforms: Configure to serve `index.html` for all routes

### Port issues
The app uses port 8080 in production (configurable via Railway/Vercel environment).
