---
name: backoffice-design
description: >
  Design and review enterprise backoffice / operator-console UIs: capability-page architecture,
  list/detail and task workflows, server-side filtering/pagination, role-aware navigation,
  loading/empty/error/permission states, configuration UX, and AI-assistant surfaces — augmented
  with cross-cutting UI/UX design patterns (accessibility, touch, layout, typography, color,
  animation, forms, navigation, charts) plus web-quality discipline: WCAG 2.2 accessibility,
  Core Web Vitals performance (LCP/INP/CLS), and a security/robustness baseline. Use when building
  or reviewing admin consoles, operator dashboards, task inboxes, validation / approval / archive /
  export workflows, settings or configuration pages, or any internal tool with an operator workflow.
  Tech-agnostic: the skill applies design patterns and structural rules, not a specific framework.
version: "1.1"
license: MIT
metadata:
  author: personal
  type: workflow
  tags: [ui, ux, backoffice, design-system, accessibility, performance, security, operator-console]
---

# Backoffice Design Skill

A backoffice is operational software. This skill prevents generating a single superficial dashboard
when the requirement describes multiple capabilities, task workflows, search-heavy archives,
validation operations, export actions, AI assistance, or enterprise operator journeys. It combines
operational UX structure (one capability per route, resilient state handling, backend authority)
with cross-cutting design-pattern discipline (accessibility, touch, layout, typography, color,
animation, forms, navigation, charts) expressed framework-neutrally.

## Use when

Use this skill when a request touches:

- backoffice, admin console, operator console, control plane;
- task inbox, work queue, approvals, validation, review flows;
- archive / search / record browsers;
- export, document management, ingestion;
- configuration, settings, rules, policies, prompts, routing;
- AI assistant page or copilot surface inside an internal tool;
- enterprise dashboard, internal tool, or operator-facing UI.

## Do not use when

Do not use this skill for landing pages, pure marketing pages, simple static forms, or
backend-only modules with no operator/user workflow.

## Required UX shape

When this skill is selected, generated frontend should prefer:

- one route / page per major capability;
- a shared shell / navigation across capabilities;
- a clear page title and stated purpose;
- list / detail or master / detail patterns for operational data;
- server-side filters and pagination for large datasets;
- loading, empty, error, permission-denied, and success states;
- role-aware navigation and actions (hide / disable by role, backend still authoritative);
- confirmation for destructive or irreversible actions;
- audit / provenance visibility where relevant;
- an API client boundary instead of hidden fetches inside presentation components.

## Capability page expectations

For a backoffice MVP, prefer explicit pages such as:

- `/ingest`;
- `/validation`;
- `/archive`;
- `/export`;
- `/qa`;
- `/settings`;
- `/extraction-profiles`;
- equivalent routes for the selected framework.

Do not hardcode these exact paths unless the plan supports them. Use idiomatic routing for the
detected stack.

## Large-data behavior

For archive, records, tasks, users, logs, or document lists:

- do not load all records client-side;
- use server-side filtering when a backend exists;
- include pagination or cursor semantics;
- include stable sorting;
- include a search input with clear scope;
- include a filter reset;
- avoid expensive client-only filtering as the primary strategy;
- document backend / source-of-truth assumptions.

## Configuration UX

When users need to configure extraction, classification, rules, workflows, prompts, policies, or
routing:

- create a dedicated configuration page or route;
- distinguish technical keys from user-facing labels;
- support add / edit / remove flows;
- show examples and validation hints;
- avoid hiding important business configuration in source constants only;
- persist configuration through the backend if the requirement requires it;
- otherwise document the UI-local limitation.

## AI assistant UX

For AI-enabled backoffice pages:

- explain what the AI can and cannot do;
- state that the AI does not modify business state unless explicitly required;
- show citation or source policy;
- show no-source behavior;
- provide guided prompt examples;
- make provider / runtime profile visible where relevant;
- avoid anthropomorphic claims or unsupported autonomy.

## Backend source-of-truth rule

The frontend must not duplicate backend business rules.

Forbidden frontend-only duplication includes:

- lifecycle transition rules;
- authorization rules;
- archive eligibility;
- AI document eligibility;
- export permission rules;
- validation preconditions.

The frontend may hide / disable actions for UX, but backend denial remains authoritative.

## Cross-cutting UI/UX design patterns

Beyond structure, apply the following design-pattern disciplines. They are priority-ordered;
resolve higher-priority items first. The full per-category rule list (key checks and anti-patterns)
lives in `references/design-patterns.md` — read it before delivering UI rather than guessing.

| Priority | Discipline | Why | Must have | Avoid |
|----------|------------|-----|-----------|-------|
| 1 | Accessibility (WCAG 2.2 AA) | CRITICAL | Contrast text 4.5:1 / UI 3:1; alt text; keyboard nav; visible `:focus-visible` (≥3:1); targets ≥24×24px (aim 44×44); labels + `aria-invalid`/`role=alert` on errors; live regions for status | Removing focus rings; icon-only buttons without names; color-only meaning; keyboard traps |
| 2 | Touch & interaction | CRITICAL | Min target 44×44px, 8px+ spacing, loading feedback, no hover-only affordances | Hover-only reliance, instant 0ms state changes |
| 3 | Performance / Core Web Vitals | HIGH | Budgets (JS <300KB, CSS <100KB); LCP ≤2.5s, INP ≤200ms, CLS ≤0.1; virtualize long lists; debounce input; yield main thread | Layout thrashing, unbounded lists, render-blocking JS, unreserved async content |
| 4 | Style consistency | HIGH | Match product type, consistent system, vector icons (no emoji) | Randomly mixing flat & skeuomorphic, emoji as icons |
| 5 | Layout & responsive | HIGH | Mobile-first breakpoints, 320px reflow no horizontal scroll, no fixed-px containers, allow zoom | Fixed-px container widths, disabling zoom |
| 6 | Typography & color | MEDIUM | Base 16px, line-height 1.5, semantic color tokens, 200% zoom support | Body < 12px, gray-on-gray, raw hex in components |
| 7 | Animation | MEDIUM | Duration 150–300ms, motion conveys meaning, `transform`/`opacity` only, honor `prefers-reduced-motion` | Decorative-only animation, animating width/height, no reduced-motion |
| 8 | Forms & feedback | MEDIUM | Visible labels, inline errors near field, progressive disclosure, no redundant entry | Placeholder-only labels, errors only at top |
| 9 | Navigation | HIGH | Predictable back, bottom nav ≤5, deep links, consistent identification | Overloaded nav, broken back behavior |
| 10 | Charts & data | LOW | Legends, tooltips, accessible colors, reserved space | Conveying meaning by color alone |
| 11 | Security & robustness | HIGH | HTTPS-only + HSTS/CSP/nosniff; sanitize HTML sinks (Trusted Types); SRI for third-party; semantic valid HTML; global error handling; secure cookies | `innerHTML`=userInput, mixed content, untrusted-CDN polyfills, `document.write`, leaking source maps |

Apply these as principles, not framework recipes. When a specific surface needs depth (e.g. a
data-dense dashboard, a form-heavy settings page, or a chart panel), read the matching section in
`references/design-patterns.md` (structural patterns) and `references/web-quality.md` (accessibility
WCAG 2.2, performance/Core Web Vitals, and security best-practics) and reconcile them with the
structural rules above.

## Web quality & performance

Internal tools are still user-facing software; treat web-quality as a first-class requirement, not
an afterthought. The full checklists live in `references/web-quality.md`.

- **Accessibility target:** WCAG 2.2 **AA** (POUR principles). Critical: labels, alt text,
  contrast (text 4.5:1, UI 3:1, focus 3:1), keyboard operability with no traps, visible focus,
  error announcement via `role="alert"`/`aria-live`, and `prefers-reduced-motion` support.
- **Core Web Vitals targets (p75):** LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1. Backoffice UIs are often
  JS-heavy and data-dense, so set an explicit budget (JS < 300KB compressed, CSS < 100KB) and
  enforce it.
- **Loading:** inline critical CSS, no render-blocking JS in `<head>`, preload the LCP element with
  `fetchpriority="high"`, prefer SSR/streaming over client-only fetches of above-fold content.
- **Interactivity:** break long tasks and `await scheduler.yield()`; debounce search/filter; give
  immediate visual feedback before heavy work; move CPU-heavy work off the main thread.
- **Stability:** reserve space for every image/embed (dimensions or `aspect-ratio`); insert dynamic
  content below the viewport or animate with `transform`; fonts use `font-display: swap` with matched
  fallback metrics to avoid FOUT shift.
- **Scale:** virtualize lists > 100 rows; use event delegation and clean up listeners on unmount.

## Security & robustness

Operator consoles perform privileged actions on sensitive data — apply a baseline even though the
audience is internal. Full detail in `references/web-quality.md`.

- **Transport:** HTTPS only, no mixed content, HSTS (`max-age=31536000; includeSubDomains; preload`).
- **Headers:** `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
  CSP with `default-src 'self'`, `base-uri 'self'`, `form-action 'self'`, nonces over
  `'unsafe-inline'`. Prefer CSP `frame-ancestors 'self'` over `X-Frame-Options`. Do not send
  `X-XSS-Protection`.
- **DOM-XSS:** never assign untrusted input to `innerHTML`/`document.write`; use `textContent` or
  sanitize. Enforce **Trusted Types** (`require-trusted-types-for 'script'`) so HTML sinks accept
  only sanitized, typed values — roll out in Report-Only first.
- **Third-party:** pin CDN scripts/stylesheets with Subresource Integrity; never load polyfills from
  an untrusted CDN. Keep dependencies patched (`npm audit`); avoid prototype-pollution merges of
  untrusted input.
- **Markup:** valid HTML5, semantic elements (`<nav> <main> <table>` with `<th scope>`), no duplicate
  IDs. Secure cookies: `Secure; HttpOnly; SameSite=Strict; Path=/`.
- **Errors:** global `error` + `unhandledrejection` handlers, user-safe messages, and strip
  `sourcesContent` from production source maps (no leaked source).

## Evidence required

A request using this skill should provide:

- route / page source files;
- a shared shell or navigation when multiple pages exist;
- an API client boundary or typed contract;
- at least one list / filter / task / action flow;
- state-handling evidence (loading / empty / error / permission);
- accessibility evidence: semantic controls, labels, focus styles, contrast, keyboard path;
- performance evidence: bundle/CSS within budget, virtualized long lists, debounced input, no CLS
  from late content;
- security evidence: HTTPS-only, security headers/CSP, sanitized HTML sinks, SRI-pinned third-party,
  no leaked source maps;
- build / type / lint / test checks when available;
- a manual smoke path when automation is unavailable.

## Regression test reconciliation

When a backoffice request adds a new capability page, navigation item, route, visible section,
action, filter, or configuration workflow, reconcile existing operator-console regression tests.

Do not leave older tests expecting the previous navigation or section list unchanged when the new
behavior is intentionally additive.

Do not use brittle positional selectors for repeated labels or buttons. Prefer route-scoped
rendering, `within(...)`, unique accessible labels, or test-specific component roots.

## Gate implications

Gate must BLOCK promotion when:

- a multi-capability backoffice request is implemented as a single decorative dashboard only;
- required capability pages / routes are missing;
- loading / error / empty / permission states are absent for critical workflows;
- large-data lists are implemented as unbounded client-only lists without justification;
- backend-source-of-truth rules are duplicated or contradicted;
- the design-pattern table is ignored and accessibility / touch regressions ship (e.g. no focus
  states, hover-only interactions, sub-44px targets, color-only meaning);
- a Core Web Vitals regression ships without justification (LCP > 2.5s, INP > 200ms, CLS > 0.1) or
  bundles blow the budget (JS > 300KB, CSS > 100KB) with no documented reason;
- a security baseline is missing (mixed content, no CSP/Trusted Types for HTML sinks, third-party
  scripts without SRI, or `innerHTML`/`document.write` fed untrusted input).

Gate may WARN when:

- a route exists but advanced filtering is deferred and documented;
- accessibility automation is unavailable but semantic controls are present;
- configuration UI is UI-local only and persistence is explicitly out of scope;
- performance budgets are exceeded but a mitigation plan and measurement are attached.

## Cross-Tool Compatibility

This skill follows the open **Agent Skills** standard — a `SKILL.md` folder that any compatible
tool discovers at a well-known path (e.g. `.claude/skills/`, `.codex/skills/`, `.opencode/skills/`,
`.cursor/skills/`, `.github/skills/`, `.kiro/skills/`, `.gemini/skills/`, `.kilocode/skills/`). The
`SKILL.md` above is the single source of truth; it is installed unmodified into each tool.

To expose this skill to a target project, run the repo's `install.sh` (it symlinks this folder
into the chosen tool's path):

```bash
bash install.sh --tool claude,codex,cursor,kilocode,opencode --target /path/to/project
bash install.sh --list-tools          # show all supported tools and their paths
```

For tools that do not read `SKILL.md` natively (they only consume a project memory file such as
`AGENTS.md` / `CLAUDE.md` / `.windsurfrules`), point them at `references/condensed.md` — a flattened
copy of the structure above. Full install details and the progressive-disclosure model are in this
folder's `README.md`.
