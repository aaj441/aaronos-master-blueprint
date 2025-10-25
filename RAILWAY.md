# Railway Deployment Guide for AaronOS

## Quick Setup

### 1. Create Railway Project
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link
```

### 2. Add PostgreSQL Database
In Railway dashboard:
- Click "New" → "Database" → "PostgreSQL"
- Railway automatically sets DATABASE_URL

### 3. Set Environment Variables
In Railway dashboard under "Variables":
```bash
ANTHROPIC_API_KEY=sk-ant-api03-...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_BASIC_PLAN_PRICE_ID=price_...
STRIPE_PRO_PLAN_PRICE_ID=price_...
JWT_SECRET=generate-random-secret-here
SESSION_EXPIRY_HOURS=24
NODE_ENV=production
ENABLE_SCHEDULER=true
HEALTH_CHECK_INTERVAL_MS=60000
```

### 4. Deploy
```bash
# Push to deploy
git push origin main

# Or deploy directly
railway up
```

## Common Issues & Solutions

### Issue: Build Fails
**Solution**: Ensure you have these in package.json:
```json
"engines": {
  "node": ">=18.0.0",
  "pnpm": ">=8.0.0"
}
```

### Issue: Database Connection Error
**Solution**: Railway sets DATABASE_URL automatically. Check it's present:
```bash
railway variables
```

### Issue: Port Binding Error
**Solution**: Railway sets PORT automatically. Vinxi handles this automatically.

### Issue: Prisma Errors
**Solution**: Make sure migrations run:
```bash
railway run pnpm db:migrate
```

### Issue: Puppeteer/Chromium Not Found
**Solution**: Railway's nixpacks includes Chromium automatically. If issues persist, add to railway.toml:
```toml
[build.nixpacksPlan.phases.setup]
nixPkgs = ["...", "chromium"]
```

## Verify Deployment

Once deployed, check:
1. **Health Endpoint**: https://your-app.railway.app/api/health
2. **Home Page**: https://your-app.railway.app
3. **Railway Logs**: `railway logs`

## Manual Migration (if needed)
```bash
railway run pnpm db:migrate
```

## Webhook Configuration

For Stripe webhooks, add to Stripe dashboard:
```
URL: https://your-app.railway.app/api/webhooks/stripe
Events: customer.subscription.*, invoice.*
```

## Scaling

Railway auto-scales based on usage. For dedicated resources:
- Go to Settings → Resources
- Adjust CPU/RAM as needed

## Monitoring

Check deployment health:
```bash
# View logs
railway logs

# Check service status
railway status

# Open in browser
railway open
```

## Environment-Specific Settings

Railway automatically sets:
- `PORT` - App listens on this
- `RAILWAY_ENVIRONMENT` - production/staging
- `DATABASE_URL` - PostgreSQL connection

## Troubleshooting

If deployment fails:

1. **Check build logs**:
   ```bash
   railway logs --deployment
   ```

2. **Verify environment variables**:
   ```bash
   railway variables
   ```

3. **Test build locally**:
   ```bash
   pnpm build
   pnpm start:railway
   ```

4. **Check database connection**:
   ```bash
   railway run pnpm prisma studio
   ```

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Project Issues: Create issue in GitHub repo
