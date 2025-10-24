# AI Development Rules for AaronOS

This document defines the technical stack and library usage guidelines for maintaining a consistent, reliable, and scalable codebase across the unified dashboard.

## Tech Stack (5–10 key points)

- React 18 with Vinxi and TanStack React Start for modern app scaffolding, SSR/streaming, and routing integration.
- TypeScript everywhere for strong typing, safer refactors, and better DX.
- TanStack Router for declarative, file/route-based navigation and data loading.
- tRPC (client/server) for end-to-end type-safe RPC between frontend and backend services where applicable.
- Zod for runtime validation and schema definition of inputs/outputs and external data.
- Zustand for lightweight global client state; prefer React local state for component-specific data.
- FastAPI for backend services (ML/audio processing, analytics, orchestration).
- Vite (via Vinxi) for fast dev server and optimized builds.
- Prisma for database migrations and client generation (see scripts in package.json).
- Custom CSS (theme-perplexity.css) and CSS variables for styling consistency without large CSS frameworks.

## Library Usage Rules

- Routing
  - Use TanStack Router exclusively for navigation, nested routes, loaders/actions, and redirects.
  - Keep route definitions cohesive and colocate UI with route files as appropriate; avoid mixing routing concerns into unrelated modules.
  - Do not introduce React Router; follow TanStack Router patterns for data loading.

- Client–Server Communication
  - Prefer tRPC for type-safe endpoints within the TypeScript runtime. Define procedures with clear input/output Zod schemas.
  - For FastAPI endpoints, use native fetch with thin wrapper functions and Zod-based parsing/validation on the client.
  - Do not add Axios or other HTTP clients unless there's a documented need (e.g., advanced interceptors not served by native fetch).

- Validation & Types
  - Use Zod for all runtime validation of external data (API responses, user inputs, env/config).
  - Define shared schemas/types for request/response payloads; avoid `any`.
  - Keep TypeScript strict; prefer explicit types for props, parameters, and returns.

- State Management
  - Use React local state (useState/useReducer) for component-scoped state.
  - Use Zustand for cross-component/global UI or domain state (e.g., auth session, UI preferences).
  - Avoid overusing global stores; keep state minimal and focused.

- Styling
  - Use theme-perplexity.css and CSS variables for color, spacing, and components; prefer utility classes defined in the theme.
  - Do not add Tailwind or other CSS frameworks unless justified and accepted via review.
  - Keep styles responsive and accessible; follow semantic HTML.

- Data Layer & Caching
  - Co-locate data fetching logic with route components or feature modules; centralize shared clients in a dedicated folder when needed.
  - If client-side caching is required, implement simple, focused caches using Zustand or request-level memoization rather than introducing new libraries.

- Build, Scripts & Project Hygiene
  - Use Vinxi/Vite scripts from package.json for dev, build, and start; do not introduce alternative CLIs.
  - Keep dependencies lean; before adding a new package, check if existing stack covers the need and document the justification.
  - Maintain consistent formatting, linting, and type safety via the existing project configuration.

- Backend Integration
  - Use FastAPI for heavy processing (audio ML, analytics) and keep the React app lean.
  - Define clear boundaries between frontend tRPC procedures and FastAPI endpoints; document integration points and payload contracts with Zod schemas.

- Testing & Observability (when applicable)
  - Write lightweight, scenario-focused tests; prefer testing critical logic and shared utilities.
  - Instrument key flows with simple logging; avoid heavy observability stacks unless needed.