# WCAG Machine Workflow Playbook

This document captures the end-to-end, five-step wizard that powers the automated WCAG accessibility audit "machine" inside the Project Xavier stack.

## 1. Project/Wizard Kickoff – User Entry
- **User** starts a new audit session by providing one or more target domain URLs and selecting the applicable industry or WCAG 2.x/3.0 benchmarks.
- **Interface** presents a form input (e.g., `example.com, competitor.com`) for domain entry plus benchmark selectors.

## 2. Domain Discovery and Selection
- **System** crawls or searches the provided domains to enumerate subpages and surface candidate links for inclusion.
- **User** reviews the discovered structure and chooses which domains/pages will be scanned, with multi-select support for tailoring the audit scope.

## 3. Automated Scanning (Machine Phase)
- **System/Agent** initiates automated scanning and accessibility analysis across the selected pages.
- **Checks** cover color contrast, aria-label coverage, alt text, semantic HTML, keyboard navigation, focus management, landmark regions, and additional WCAG requirements defined by the scan parameters.
- **Outcomes** are tracked per guideline and per page, capturing violations, warnings, best-practice confirmations, and raw evidence.
- **Interface** communicates progress in real time with a "Scanning in progress…" status and dynamic indicators.

## 4. Machine-Generated Overview (AI Summary)
- **System** aggregates violation and success statistics, calculates the overall audit score, and groups issues by severity and guideline lineage.
- **Example Metrics** might include a 75% score with 4 high-risk and 12 medium-risk findings.
- **Interface** renders an overview dashboard highlighting current audit health, severity breakdowns, and heatmaps or cluster visualizations.

## 5. Drilldown and Export
- **User** inspects detailed issue listings organized by guideline (e.g., 1.1.1, 2.4.3, 4.1.2), filters results by risk, and selects export targets.
- **System** assembles comprehensive reports—typically PDF—with optional CSV/JSON outputs that embed summaries, violation specifics, affected elements/screenshots, and remediation guidance.

## 6. Feedback and Iteration
- **User** initiates rescans after remediation, compares historical reports, or distributes findings to stakeholders.
- **System** can schedule follow-up scans, deliver notifications, and fire webhook callbacks to sustain ongoing accessibility monitoring.

## Automation and Agent Interaction
- **Agents** can auto-start scans, prioritize high-risk items for human review, generate suggested fixes, and trigger status-change automations, notifications, and audit logs for end-to-end traceability.

This playbook complements the broader Project Xavier blueprint by detailing how the WCAG machine orchestrates user flows, automated agents, and reporting throughout the accessibility audit lifecycle.
