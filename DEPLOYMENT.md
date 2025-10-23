# AaronOS Deployment Guide

## Railway Deployment

This project is configured for Railway deployment with multiple deployment methods.

### Deployment Method 1: Dockerfile (Recommended)

Railway will automatically detect the `Dockerfile` and use it for deployment.

**Configuration:**
- `railway.toml` - Railway-specific configuration
- `Dockerfile` - Multi-stage build with nginx serving on port 8080
- `.dockerignore` - Optimizes build by excluding unnecessary files

**Environment Variables:**
None required for basic deployment.

### Deployment Method 2: Nixpacks (Fallback)

If Dockerfile deployment fails, Railway will use Nixpacks with the configuration in `nixpacks.toml`.

**Start command:** `npm start`
**Build command:** `npm run build`

### Port Configuration

The application listens on port 8080 by default. Railway will automatically map this to the public URL.

### Deployment Steps

1. Push your code to the branch: `claude/debug-railway-deployment-011CUQpax8a2avnM81SU9vvQ`
2. Connect your Railway project to this GitHub repository
3. Select the branch for deployment
4. Railway will automatically build and deploy using the Dockerfile
5. Access your app via the generated Railway URL

### Troubleshooting

**Build fails:**
- Check Railway build logs for specific errors
- Verify all files are committed (index.html, theme-perplexity.css, etc.)
- Ensure Dockerfile syntax is correct

**App doesn't start:**
- Check that port 8080 is exposed in Dockerfile
- Verify nginx configuration in Dockerfile
- Check Railway deployment logs

**404 errors:**
- Verify all static files are copied in Dockerfile
- Check nginx routing configuration

### Project Structure

```
/
├── index.html              # Main dashboard
├── theme-perplexity.css    # Styling
├── ebook-machine/          # eBook Machine module (placeholder)
├── lucy/                   # Lucy module (placeholder)
├── Dockerfile              # Production deployment
├── railway.toml            # Railway configuration
├── nixpacks.toml           # Alternative build config
└── package.json            # Node.js configuration
```

### Local Development

Run locally with:
```bash
npm install
npm run dev
```

Access at: http://localhost:3000

### Production Build Test

To test the production build locally (requires Docker):
```bash
docker build -t aaronos .
docker run -p 8080:8080 aaronos
```

Access at: http://localhost:8080

## Next Steps

After successful deployment:

1. Verify the dashboard loads correctly
2. Test all navigation and functionality
3. Set up custom domain (optional)
4. Configure environment variables as needed for future features
5. Implement Lucy and eBook Machine modules
