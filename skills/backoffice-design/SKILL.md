---
name: backoffice-design
description: >
  Design and review enterprise backoffice / operator-console UIs: capability-page architecture,
  list/detail and task workflows, server-side filtering/pagination, role-aware navigation,
  loading/empty/error/permission states, configuration UX, and AI-assistant surfaces — augmented
  with cross-cutting UI/UX design patterns (accessibility, touch, layout, typography, color,
  animation, forms, navigation, charts). Use when building or reviewing admin consoles, operator
  dashboards, task inboxes, validation / approval / archive / export workflows, settings or
  configuration pages, or any internal tool with an operator workflow. Tech-agnostic: the skill
  applies design patterns and structural rules, not a specific framework.
version: "1.0"
license: MIT
metadata:
  author: personal
  type: workflow
  tags: [ui, ux, backoffice, design-system, accessibility, operator-console]
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
| 1 | Accessibility | CRITICAL | Contrast 4.5:1, alt text, keyboard nav, aria-labels | Removing focus rings, icon-only buttons without labels |
| 2 | Touch & interaction | CRITICAL | Min target 44×44px, 8px+ spacing, loading feedback | Hover-only reliance, instant 0ms state changes |
| 3 | Performance | HIGH | Lazy loading, reserve space (CLS < 0.1) | Layout thrashing, unbounded layout shift |
| 4 | Style consistency | HIGH | Match product type, consistent system, vector icons (no emoji) | Randomly mixing flat & skeuomorphic, emoji as icons |
| 5 | Layout & responsive | HIGH | Mobile-first breakpoints, no horizontal scroll | Fixed-px container widths, disabling zoom |
| 6 | Typography & color | MEDIUM | Base 16px, line-height 1.5, semantic color tokens | Body < 12px, gray-on-gray, raw hex in components |
| 7 | Animation | MEDIUM | Duration 150–300ms, motion conveys meaning, spatial continuity | Decorative-only animation, animating width/height, no reduced-motion |
| 8 | Forms & feedback | MEDIUM | Visible labels, errors near field, progressive disclosure | Placeholder-only labels, errors only at top |
| 9 | Navigation | HIGH | Predictable back, bottom nav ≤ 5, deep links | Overloaded nav, broken back behavior |
| 10 | Charts & data | LOW | Legends, tooltips, accessible colors | Conveying meaning by color alone |

Apply these as principles, not framework recipes. When a specific surface needs depth (e.g. a
data-dense dashboard, a form-heavy settings page, or a chart panel), read the matching section in
`references/design-patterns.md` and reconcile it with the structural rules above.

## Evidence required

A request using this skill should provide:

- route / page source files;
- a shared shell or navigation when multiple pages exist;
- an API client boundary or typed contract;
- at least one list / filter / task / action flow;
- state-handling evidence (loading / empty / error / permission);
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
  states, hover-only interactions, sub-44px targets, color-only meaning).

Gate may WARN when:

- a route exists but advanced filtering is deferred and documented;
- accessibility automation is unavailable but semantic controls are present;
- configuration UI is UI-local only and persistence is explicitly out of scope.

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
