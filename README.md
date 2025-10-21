# AaronOS v5 Unified Dashboard

This repository contains a single-page prototype for the AaronOS v5 accessibility scanner dashboard. The experience demonstrates a five-step wizard that guides teams from keyword selection through exporting WCAG compliance reports.

## Features

- Glassmorphism-inspired interface that uses the Perplexity theme tokens defined in `theme-perplexity.css`.
- Five-step wizard with accessible step indicators, keyboard-focus management, and ARIA attributes for assistive technologies.
- Simulated scanning progress complete with timers, queue counts, and dynamic updates.
- Drilldown step with sample WCAG issues and export controls that preview a success message.

## Getting Started

Open `index.html` in your browser. The page is fully self-contained with inline JavaScript for the wizard logic and references `theme-perplexity.css` for the shared design tokens.

## Development Notes

- Buttons and form fields provide focus outlines that satisfy WCAG 2.1 AA contrast guidance.
- Motion effects respect `prefers-reduced-motion` to reduce animation speed for sensitive users.
- The layout is responsive down to small-screen breakpoints, stacking controls where space is limited.

## Project Xavier Advanced Implementation Dashboard

The following schema captures the live implementation status for Project Xavier modules. It is ready to embed directly into
Markdown-based documentation, and each module row has placeholders for REST endpoints, automation hooks, agents, and
fee/status feeds. Integrate it with your preferred dashboard platform—Notion, GitHub Projects, Bika, or a custom view—for
real-time operational awareness.

| Module                  | Table / Schema | Automations | Agents | Dashboard/Views | API Feed(s)        | Status      | Dynamic Fee/API Data |
|-------------------------|----------------|-------------|--------|-----------------|--------------------|-------------|----------------------|
| Workflow Navigator      | ✅ (partial)    | ⬜           | ⬜      | ✅ Widget       | `/api/workflow`    | In Progress | $150/month           |
| Portfolio Sync Studio   | ⬜              | ⬜           | ⬜      | ⬜               | `/api/portfolio`   | Pending     | Pending              |
| Innovation Flow         | ⬜              | ⬜           | ⬜      | ⬜               | `/api/innovation`  | Pending     | Pending              |
| Backend Insight Studio  | ⬜              | ⬜           | ⬜      | ⬜               | `/api/insight`     | Pending     | Pending              |
| Dream Interpreter       | ⬜              | ⬜           | ⬜      | ⬜               | `/api/dreams`      | Pending     | Pending              |
| Scrobble Sync Studio    | ⬜              | ⬜           | ⬜      | ⬜               | `/api/scrobble`    | Pending     | Pending              |
| Xavier Manager/Lore     | ⬜              | ⬜           | ⬜      | ⬜               | `/api/lore`        | Pending     | Pending              |
| Health Data Sync Engine | ⬜              | ⬜           | ⬜      | ⬜               | `/api/health`      | Pending     | Pending              |
| Money Moves Studio      | ⬜              | ⬜           | ⬜      | ⬜               | `/api/money`       | Pending     | Pending              |
| Backend/Registry        | ⬜              | ⬜           | ⬜      | ⬜               | `/api/admin`       | Pending     | Pending              |

**Legend:**

- ✅ = Present
- ⬜ = Not yet created or configured
- **API Feed(s):** REST endpoints that return module status, audit results, or other operational data.
- **Dynamic Fee/API Data:** Placeholder for live pricing, audit scores, or other metrics sourced from an API.

### API Integration Examples

**POST/PATCH Example**

```http
POST /api/innovation
{
  "module": "Innovation Flow",
  "status": "In Progress",
  "fee": 95,
  "progress": 72,
  "dashboard_msg": "AI audit in progress. 6 issues detected, 2 resolved."
}
```

**Live Fee/Status Widget (Pseudo-JS)**

```js
fetch('/api/money')
  .then(resp => resp.json())
  .then(data => {
    document.getElementById('money-fee-display').innerText =
      `$${data.fee}/month: ${(data.status === "Active") ? "✔️" : "⏳"}`;
  });
```

### Usage Tips

- Trigger webhooks when tasks complete, audits finish, or pricing changes to keep dashboard data in sync.
- Feed returned JSON objects directly into widgets or automation pipelines within your tool of choice.
- Embed this Markdown block in any documentation platform, or adapt the schema for your preferred database or registry layer.
