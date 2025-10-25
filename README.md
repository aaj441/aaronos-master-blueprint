# AaronOS - Unified Dashboard

AaronOS is the unified codebase that powers the **Lucy**, **eBook Machine**, and **WCAG Scanner** modules with full agentic capabilities and automated operations.

This monorepo contains a full-stack application built with React (via Vinxi/TanStack Router), tRPC API, and autonomous AI agents powered by Claude. Use AaronOS to explore markets, generate strategic insights, produce polished e-books, and scan websites for accessibility compliance - all from one place.

## 🚀 Fully Implemented Modules

- **Lucy AI Research Copilot** - Autonomous research agent for competitor analysis, market exploration, and strategic insights with LLM-powered analysis
- **eBook Machine** - Automated e-book generator that creates complete books from outlines with PDF/DOCX/EPUB export
- **WCAG Scanner** - Accessibility compliance scanner with automated multi-page crawling and detailed issue reporting
- **Subscription System** - Complete Stripe integration with payment processing, webhooks, and automatic renewal
- **Authentication** - Secure user management with session handling, password reset, and security monitoring
- **Health Monitoring** - System-wide health checks with real-time status and uptime tracking
- **Job Scheduler** - Automated tasks including database backups, cleanup jobs, and subscription syncing

## 📖 Documentation

**👉 See [README_IMPLEMENTATION.md](./README_IMPLEMENTATION.md) for complete implementation details, API documentation, and usage examples.**

## Quick Start

1. Clone this repository and install dependencies using `pnpm`:

```bash
pnpm install
```

2. Set up your environment variables (copy `.env.example` to `.env`):

```bash
cp .env.example .env
# Edit .env with your API keys and database URL
```

3. Set up the database:

```bash
pnpm db:push
```

4. Start the development server:

```bash
pnpm dev
```

5. In a separate terminal, start the job scheduler:

```bash
pnpm scheduler
```

6. Navigate to the following routes to access each module:

- `http://localhost:5173` - Main dashboard
- `http://localhost:5173/lucy` - Lucy research copilot
- `http://localhost:5173/ebook-machine` - eBook Machine
- `http://localhost:5173/wcag-scanner` - WCAG Scanner

## Technology Stack

- **Frontend**: React, TanStack Router, Vinxi
- **Backend**: tRPC, Prisma ORM, PostgreSQL
- **AI/LLM**: Anthropic Claude API
- **Payments**: Stripe
- **Automation**: Node-cron, Puppeteer, Axe-core
- **Export**: PDF-lib, DOCX

## Development Notes

- The project requires Node >= 18 and pnpm >= 8 (see `package.json`).
- Database migrations are managed via Prisma; update your `DATABASE_URL` in `.env` before running migrations.
- All agents include self-monitoring and health check capabilities.
- Scheduled jobs run automatically when `ENABLE_SCHEDULER=true`.

## Key Features

✅ **Autonomous Agents** - All modules run independently with progress tracking
✅ **Self-Monitoring** - Built-in health checks and status reporting
✅ **Production Ready** - Complete error handling, logging, and retry logic
✅ **Type Safe** - Full TypeScript with Zod validation
✅ **Scalable** - Async job processing with database-backed state
✅ **Secure** - Authentication, session management, and security monitoring

For detailed implementation documentation, architecture diagrams, API examples, and troubleshooting, see [README_IMPLEMENTATION.md](./README_IMPLEMENTATION.md).
