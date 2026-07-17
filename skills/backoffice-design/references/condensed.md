# Backoffice Design — Condensed

Use this skill when building or reviewing backoffice / operator-console UIs: admin consoles, task
inboxes, validation / approval / archive / export workflows, settings / configuration pages, AI
assistant surfaces, or any internal tool with an operator workflow. Not for landing/marketing
pages or backend-only modules with no operator workflow.

## Structure rules

- One route / page per major capability (e.g. `/ingest`, `/validation`, `/archive`, `/export`,
  `/qa`, `/settings`, `/extraction-profiles`) using idiomatic routing for the stack. Do not
  hardcode exact paths unless the plan supports them.
- Shared shell / navigation across capabilities; clear page title and purpose.
- List / detail or master / detail for operational data.
- Server-side filters + pagination for large datasets; no unbounded client-side loads. Include
  stable sorting, scoped search, and filter reset. Document backend / source-of-truth assumptions.
- Configuration gets a dedicated page: distinguish keys from labels, support add/edit/remove, show
  examples and validation hints, persist via backend if required, else document UI-local limit.
- AI assistant pages: state what AI can/cannot do, no silent state mutation, show citations and
  no-source behavior, give guided prompts, show provider/runtime, avoid anthropomorphism.
- Backend is source of truth: frontend must NOT duplicate lifecycle, authorization, archive
  eligibility, AI eligibility, export permission, or validation preconditions. Hide/disable for UX
  only; backend denial stays authoritative.

## Required states

Every critical workflow needs loading, empty, error, permission-denied, and success states.
Destructive / irreversible actions require confirmation. Audit / provenance visible where relevant.
Use an API client boundary, not hidden fetches inside components.

## Design patterns (priority order; full detail in design-patterns.md)

1. Accessibility (CRITICAL): contrast 4.5:1, alt text, keyboard nav, aria, keep focus rings.
2. Touch & interaction (CRITICAL): 44×44px targets, 8px+ spacing, loading feedback, no hover-only.
3. Performance (HIGH): lazy-load, reserve space (CLS<0.1), virtualize long lists, debounce input.
4. Style consistency (HIGH): match product type, consistent system, vector icons (no emoji).
5. Layout & responsive (HIGH): mobile-first, no horizontal scroll, no fixed-px, allow zoom.
6. Typography & color (MEDIUM): 16px base / 1.5 line-height, semantic color tokens, no <12px body.
7. Animation (MEDIUM): 150–300ms, conveys meaning, spatial continuity, honor reduced-motion.
8. Forms & feedback (MEDIUM): visible labels, inline errors near field, progressive disclosure.
9. Navigation (HIGH): predictable back, bottom nav ≤5, deep links, route-scoped test selectors.
10. Charts & data (LOW): legends, tooltips, never color-alone to convey meaning.

## Evidence required

Route/page files; shared shell when multiple pages; API client boundary or typed contract; at
least one list/filter/task/action flow; state-handling evidence; build/type/lint/test checks when
available; manual smoke path when automation is unavailable.

## Regression tests

When adding a capability page, route, nav item, action, filter, or config workflow, reconcile
existing operator-console regression tests. Do not leave old tests expecting the prior nav/section.
Avoid brittle positional selectors; prefer route-scoped rendering and unique accessible labels.

## Gate (BLOCK)

- Multi-capability request shipped as a single decorative dashboard.
- Missing required capability pages / routes.
- Missing loading/error/empty/permission states on critical workflows.
- Unbounded client-only lists without justification.
- Backend-source-of-truth rules duplicated or contradicted.
- Design-pattern table ignored → accessibility/touch regressions (no focus, hover-only, sub-44px,
  color-only meaning).

Gate may WARN when: advanced filtering deferred + documented; a11y automation unavailable but
semantic controls present; config UI UI-local only with persistence out of scope.
