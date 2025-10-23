# AaronOS Deployment Guide

## Railway Deployment

### Prerequisites
1. Railway account
2. PostgreSQL database provisioned in Railway
3. GitHub repository connected to Railway

### Environment Variables

Set these in your Railway project:

```bash
DATABASE_URL=postgresql://user:password@host:port/database
SESSION_SECRET=your-random-secret-key-here
NODE_ENV=production
PORT=8080
```

### Deployment Steps

1. **Connect GitHub Repository**
   - Link your GitHub repository to Railway
   - Railway will auto-detect the Dockerfile

2. **Add PostgreSQL Service**
   - Add a PostgreSQL database service
   - Railway will automatically set `DATABASE_URL`

3. **Set Environment Variables**
   - Add `SESSION_SECRET` (use a strong random string)
   - `PORT` and `NODE_ENV` are already set in Dockerfile

4. **Deploy**
   - Push to your branch
   - Railway will automatically build and deploy
   - Database migrations run on startup

### Build Process

The Dockerfile handles:
- Installing dependencies with pnpm
- Generating Prisma client
- Building the Vinxi/TanStack app
- Running migrations on deployment
- Starting the production server

### Post-Deployment

1. Monitor logs in Railway dashboard
2. Test authentication flows
3. Verify database connections
4. Test subscription features

## Local Development

### Setup

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
# Edit .env with your local DATABASE_URL

# Run migrations
pnpm prisma migrate dev

# Start dev server
pnpm dev
```

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm db:generate` - Create new migration
- `pnpm db:migrate` - Run migrations
- `pnpm db:studio` - Open Prisma Studio

## Troubleshooting

### Build Failures

1. **Prisma generation fails**: Ensure `DATABASE_URL` is set
2. **pnpm not found**: Dockerfile uses corepack to install pnpm
3. **Build timeout**: Increase Railway build timeout in settings

### Runtime Issues

1. **Database connection errors**: Check `DATABASE_URL` format
2. **Session issues**: Verify `SESSION_SECRET` is set
3. **Port conflicts**: Railway sets `PORT` automatically

## Architecture

- **Frontend**: React + TanStack Router
- **Backend**: Vinxi (Node.js)
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: Session-based with secure cookies
- **Deployment**: Docker container on Railway
