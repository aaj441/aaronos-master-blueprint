# AaronOS – Unified Dashboard

AaronOS is the unified codebase that powers the **Lucy** and **eBook Machine** modules. It merges the former XavierOS/Blue Ocean Explorer project under a single name and repository.

The front-end is built with [Vite](https://vitejs.dev/), [React](https://react.dev/), and [TanStack Router](https://tanstack.com/router/latest). Use AaronOS to explore markets, generate strategic insights, and produce polished e-books all from one place.

## Modules

- **Lucy** – an AI research copilot for competitor analysis, market exploration, and strategy formulation.
- **eBook Machine** – an automated e-book generator that turns outlines into polished documents.

## Getting Started

1. Clone this repository and install dependencies using `pnpm`:

   ```bash
   pnpm install
   ```

2. Start the development server:

   ```bash
   pnpm dev
   ```

3. Navigate to the following routes to access each module:

   - `http://localhost:5173/` – overview dashboard
   - `http://localhost:5173/lucy` – Lucy research dashboard
   - `http://localhost:5173/ebook-machine` – eBook Machine interface

## Development Notes

- The project requires Node >= 18 and pnpm >= 8 (see `package.json`).
- Routes live in `src/router.tsx` with modular page components under `src/pages`.
- Global styling is defined in `src/styles/global.css`. Reuse the existing utility classes when adding new surfaces.
- Database migrations are managed via Prisma; update your `DATABASE_URL` in `.env` before running migrations.
- For deployment instructions and environment variables, see `DEPLOY_TO_RAILWAY.md` and `XAVIEROS_README.md` from the old project.
