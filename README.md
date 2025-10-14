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

## Project Xavier Blueprint

The repository includes [`project-xavier-blueprint.md`](project-xavier-blueprint.md), a comprehensive database, automation, agent, and dashboard template suite for recreating the Taskade-based Project Xavier platform inside a modular Bika.ai workspace. Use this document as a copy-and-paste reference when configuring tables, automations, and dashboards in your preferred no-code or low-code environment.

## WCAG Machine Workflow

Consult [`wcag-machine-workflow.md`](wcag-machine-workflow.md) for a step-by-step playbook covering how users and automations collaborate during the accessibility audit lifecycle—from initial domain intake and page discovery through automated scanning, AI summaries, report exports, and iterative monitoring.
