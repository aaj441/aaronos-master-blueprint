Granular Build Plan (MVP)
P0 – Skeleton & Auth
1.  Scaffold Next.js 14 App Router + TypeScript + Tailwind
2.  Install & init Supabase CLI; create auth.users & public.scans tables with RLS
3.  Add @supabase/ssr wrapper; expose typed client in lib/supabase/
4.  Build (auth)/login page with magic-link + Google OAuth
5.  Build (public)/ layout & hero section (dark-mode toggle)
6.  Add NEXT_PUBLIC_SUPABASE_* to .env.local.example
P1 – Core Scan API
7.  Install puppeteer, axe-core, chrome-aws-lambda
8.  Create /api/scan POST route (rate-limited via Redis)
9.  Puppeteer launcher helper in lib/scan/launch.ts (single browser instance)
10.  Inject axe → return violations array + meta (timestamp, url)
11.  Insert row into public.scans (include auth.uid() foreign key)
12.  Return { scanId, status: 'done', violationsCount } JSON
P2 – Front-end Scan Flow
13.  Build ScanFrame component (glass card, identical to preview)
14.  Build ProgressBar (animated 0→100 % while polling)
15.  Hook useScan() that POSTs url & polls /api/scan/[id]/status every 500 ms
16.  Display violation cards (collapsible) inside ViolationList
17.  Dark-mode theme matches preview palette (slate + indigo accents)
P3 – Storage & PDF
18.  Create Supabase Storage bucket reports (public, 30 d expiry)
19.  Edge function generate-pdf (imports @react-pdf/renderer) → streams file to browser
20.  Add “Download PDF” button in dashboard; link expires after 30 min
P4 – Integrations
21.  HubSpot: create lib/integrations/hubspot.ts → upsert contact (email, violationsCount)
22.  Call HubSpot helper inside /api/scan (non-blocking)
23.  Gmail: create lib/integrations/gmail.ts → send HTML report via googleapis
24.  Queue Gmail send (background) using GitHub Actions workflow_dispatch trigger
25.  Add env vars to .env.local.example & Railway dashboard
P5 – UX Polish
26.  Keyboard shortcut Ctrl+Enter starts scan
27.  One-click undo (clears last scan locally & DB row if <5 min old)
28.  Success/error toasts (sonner)
29.  Add Carpenter/Elfman Spotify player widget (optional dopamine)
P6 – Deploy & CI
30.  Dockerfile (Node 20 alpine) + railway.yaml health-check
31.  GitHub Action: run Vitest + Playwright smoke on PR
32.  Add Railway deploy step on main push
33.  README with “Deploy on Railway” button & env template
P7 – Post-MVP (future)
34.  Webhook endpoints for HubSpot & Gmail push notifications
35.  Background cron job to re-scan bookmarks weekly
36.  Stripe billing metered on #scans
37.  ADHD-friendly focus mode (UI minimal, sound on complete)
