# Deployment Configuration (Simplified)

This application now uses a simple Express.js server that works on ANY platform.

## Changes Made

- ❌ Removed Vinxi (too bleeding-edge)
- ❌ Removed TanStack Router Start (deployment issues)
- ✅ Added simple Express.js server (`src/server.js`)
- ✅ Static HTML with vanilla JavaScript
- ✅ Works on Railway, Vercel, Heroku, any Node.js platform

## Quick Deploy

### Railway
```bash
# Add PostgreSQL database
# Set environment variables
# Deploy
railway up
```

### Vercel
```bash
vercel deploy
```

### Any Platform
```bash
npm install
npm run start:railway
```

## Environment Variables

```
DATABASE_URL=postgresql://...
ANTHROPIC_API_KEY=sk-ant-...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
PORT=3000
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/trpc/*` - tRPC API
- `POST /api/webhooks/stripe` - Stripe webhooks
- `GET /*` - Static frontend

## This Will Work Because

1. **Standard Express.js** - Battle-tested, works everywhere
2. **No complex build** - Just runs directly
3. **Static HTML** - No SSR complexity
4. **Simple routing** - Client-side only
5. **Proven stack** - Express + Node.js works on all platforms

The application is now deployable!
