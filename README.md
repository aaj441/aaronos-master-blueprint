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
