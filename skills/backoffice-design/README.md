# Backoffice Design

A portable, cross-tool AI coding agent **skill** (open [Agent Skills](https://github.com/agentskills/agentskills)
standard) for designing and reviewing enterprise **backoffice / operator-console** UIs. The
`SKILL.md` in this folder is the single source of truth — the same file is exposed to any compatible
tool via discovery paths, with no text rewriting required.

It combines two complementary sources, adapted to be **tech-agnostic**:

- **Structural backbone** — from the `backoffice-workflow-ux` skill: capability-page architecture,
  list/detail and task workflows, server-side filtering/pagination, role-aware navigation, resilient
  state handling, configuration UX, AI-assistant UX, and the backend-source-of-truth rule.
- **Design-pattern intelligence** — curated from the `ui-ux-pro-max` skill: a priority-ordered set
  of cross-cutting UI/UX disciplines (accessibility, touch, performance, layout, typography, color,
  animation, forms, navigation, charts). Ported as **patterns and checklists only** — the original
  search script and stack-specific data are intentionally omitted so the skill stays framework-neutral.

## What It Does

Given a request to build or review an internal / operator-facing UI, the skill instructs the agent to:

- Decompose the requirement into **one page per capability** behind a shared shell.
- Implement **list/detail** patterns with **server-side** filtering, sorting, and pagination for
  large datasets (no unbounded client-only lists).
- Provide **loading / empty / error / permission-denied / success** states for every critical flow.
- Build **configuration** and **AI-assistant** surfaces with the right boundaries (backend stays
  authoritative; AI does not silently mutate business state).
- Apply the **design-pattern table** and the detailed rules in `references/design-patterns.md`, plus
  the web-quality discipline (WCAG 2.2 accessibility, Core Web Vitals, security baseline) in
  `references/web-quality.md`, then run the pre-delivery checklists before declaring the UI done.

## What It Covers

- **Structure** — one capability page per route, shared shell, list/detail workflows, server-side
  filtering/pagination, role-aware navigation, resilient state handling, configuration UX,
  AI-assistant UX, and the backend-source-of-truth rule.
- **Design patterns** — 11 priority-ordered disciplines (accessibility, touch, performance, style,
  layout, typography/color, animation, forms, navigation, charts, security) summarized in `SKILL.md`
  and detailed in `references/design-patterns.md`.
- **Web quality** — accessibility to WCAG 2.2 AA, Core Web Vitals (LCP/INP/CLS) with budgets, and a
  security/robustness baseline (CSP, Trusted Types, SRI, semantic HTML, error handling), detailed in
  `references/web-quality.md`.

## Use It

Open any supported AI coding tool in a project where the skill is installed and ask:

> "Build an operator console for document ingestion: ingest, validate, archive, export, QA, settings."

or

> "Review this admin dashboard for UX and accessibility problems before we ship it."

The agent recognizes the intent from the skill's `description` and applies the capability-page
structure plus the design-pattern and web-quality disciplines.
