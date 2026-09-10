---
name: backoffice-design
description: >
  Design and review enterprise backoffice and operator-console UIs. Covers
  capability-page architecture, list/detail workflows, task inboxes, server-side
  filtering, role-aware navigation, loading/empty/error states, configuration UX,
  and AI-assistant surfaces. Includes UI/UX fundamentals (forms, typography, color,
  accessibility, touch targets, responsive design), WCAG 2.2 AA compliance,
  Core Web Vitals performance (LCP/INP/CLS), and security baselines. Tech-agnostic:
  applies design patterns, not framework code.
---

**Scope:** This skill governs operator-facing internal tool UIs — backoffice consoles, task
inboxes, validation workflows, configuration panels, and AI-assistant surfaces. It does not
apply to landing pages, marketing sites, or backend-only modules with no operator workflow.

# Backoffice Design Skill

## Zero — Core Concepts

A backoffice is operational software. This skill prevents generating a single superficial dashboard
when the requirement describes multiple capabilities, task workflows, search-heavy archives,
validation operations, export actions, AI assistance, or enterprise operator journeys. It combines
operational UX structure (one capability per route, resilient state handling, backend authority)
with cross-cutting design-pattern discipline (accessibility, touch, layout, typography, color,
animation, forms, navigation, charts) expressed framework-neutrally.

**UI/UX 101 — The basics.** Every rule below is non-negotiable for operator-facing software:

- **Visibility of system status:** Show loading indicators for any async operation > 200ms. Show
  success/error messages after every mutation. Show progress for multi-step operations. Disable
  submit buttons while a request is in flight.

| Pattern | When to use | Anti-pattern |
|---------|-------------|--------------|
| **Skeleton screen** | Page or section loading with known structure (list, card grid, form) | Spinner on an entire page that could show layout immediately |
| **Spinner** | Inline action, button click, short operation (< 3s) | Spinner for page-level loads — user can't see what's coming |
| **Progress bar** | Determinate duration (upload, batch, export) | Indeterminate bar for unknown duration — user doesn't know if it's stuck |
| **Inline text** | Tiny operations (auto-save, status flip) | Toast for every micro-action — noise |
| **Disabled + spinner** | Submitting a form | Nothing — user clicks again and again |

- **Empty states are not blank screens.** Every list, table, and search result needs an empty state:
  what happened, why, what to do. Never show a blank area where content should be.

- **Color and contrast:** 4.5:1 minimum for body text, 3:1 for large text. Never use color alone
  to convey meaning. Semantic color tokens (`--color-error`, `--color-success`) not raw hex.
  Gray-on-gray is a readability killer. Dark mode needs separate token definitions.

- **Typography:** Base size 16px, line height 1.5× for body text, 50–75 characters per line.
  One typeface family, use weight/size for hierarchy. Monospace for code/IDs only.

- **Touch vs. mouse:** Minimum touch target 44×44px (aim 48×48px), 8px spacing between targets.
  No hover-only affordances. Press states within 50ms.

- **Responsive:** Mobile-first, breakpoints by content not device, 320px minimum, allow zoom,
  stack over sprawl on narrow screens.

- **Modals:** Confirmation only (destructive actions). Escape always works. Focus trap.
  No modal-on-modal. Short content — if scrolling needed, use a full page.

- **Toast:** Brief, non-blocking, auto-dismiss 3–5 seconds. Max 3 visible. Error toasts persist
  until dismissed. Never use for complex information.

- **Data tables:** Sticky header, row height 48–56px for touch, right-align numbers, sortable
  headers, row hover state, selection indicator, empty table state required.

- **Search and filtering:** Search input visible by default, clear scope, debounce 300ms, clear
  button, filter chips/tags, filter reset, results count.

- **The "grandma test":** If someone unfamiliar can complete the core task without instructions,
  the UI is clear enough.

**Loading variants:**

| Pattern | When to use | Anti-pattern |
|---------|-------------|--------------|
| **Skeleton screen** | Page or section loading with known structure | Spinner on an entire page |
| **Spinner** | Inline action, button click, short operation (< 3s) | Spinner for page-level loads |
| **Progress bar** | Determinate duration (upload, batch, export) | Indeterminate bar for unknown duration |
| **Inline text** | Tiny operations (auto-save, status flip) | Toast for every micro-action |
| **Disabled + spinner** | Submitting a form | Nothing — user clicks again |

**When to disable, hide, or enable inputs:**

| Situation | Action | Why |
|-----------|--------|-----|
| Field depends on another field's value | **Disable** until parent is selected | Prevents invalid combinations |
| Action requires permission the user lacks | **Hide** the control entirely | Don't show what they can't do |
| Action requires permission user lacks but should know exists | **Disable** with tooltip explaining why | Awareness without confusion |
| Form is incomplete (required fields empty) | **Disable** submit button | Prevents partial submissions |
| Operation is in progress | **Disable** the triggering button | Prevents duplicate requests |
| Data is read-only by design | **Disable** all edit controls | Clear signal: "this can't be changed" |
| Network is offline or API is unreachable | **Disable** all mutation controls | Prevent guaranteed failures |

**Never** disable a field without telling the user WHY.

## One — When to Use

Use this skill when a request touches:

- backoffice, admin console, operator console, control plane;
- task inbox, work queue, approvals, validation, review flows;
- archive / search / record browsers;
- export, document management, ingestion;
- configuration, settings, rules, policies, prompts, routing;
- AI assistant page or copilot surface inside an internal tool;
- enterprise dashboard, internal tool, or operator-facing UI.

**Do not use** for landing pages, pure marketing pages, simple static forms, or backend-only
modules with no operator/user workflow.

## Two — Hard Rules

> **HR-1.** One route/page per major capability. Never a single decorative dashboard for a
> multi-capability request.

> **HR-2.** Shared shell/navigation across capabilities. Every page must inherit the shared
> layout — navbar, footer, global styles, meta tags.

> **HR-3.** Backend is source of truth. Frontend must NOT duplicate lifecycle transition rules,
> authorization rules, archive eligibility, AI document eligibility, export permission rules, or
> validation preconditions. Hide/disable for UX only; backend denial stays authoritative.

> **HR-4.** Every critical workflow needs loading, empty, error, permission-denied, and success
> states. Destructive/irreversible actions require confirmation.

> **HR-5.** Server-side filters and pagination for large datasets. No unbounded client-side loads.
> Include stable sorting, search input with clear scope, filter reset, and results count.

> **HR-6.** Never use color alone to convey meaning. A red field must also have an icon, text,
> or border change.

> **HR-7.** Minimum touch target 44×44px. Below 24×24px is inaccessible regardless of input method.

> **HR-8.** Text contrast 4.5:1 minimum for body text, 3:1 for large text. UI component contrast
> 3:1 for borders, icons, focus indicators.

> **HR-9.** Never set `user-scalable=no` or `maximum-scale=1`. Users with low vision need to zoom.

> **HR-10.** CSS/JS budgets: JS < 300KB compressed, CSS < 100KB. Core Web Vitals targets: LCP ≤
> 2.5s, INP ≤ 200ms, CLS ≤ 0.1.

> **HR-11.** HTTPS only. No mixed content. HSTS, CSP, Trusted Types for HTML sinks, SRI for
> third-party scripts. No `innerHTML`/`document.write` fed untrusted input.

> **HR-12.** An API client boundary instead of hidden fetches inside presentation components.

> **HR-13.** Configuration gets a dedicated page or route. Distinguish technical keys from
> user-facing labels. Support add/edit/remove. Show examples and validation hints.

> **HR-14.** AI assistant pages must state what the AI can and cannot do, show citation/source
> policy, provide guided prompt examples, avoid anthropomorphic claims.

> **HR-15.** Never leave older tests expecting the previous navigation or section list unchanged
> when new behavior is intentionally additive.

## Three — Decision Trees

```
Is the request for a backoffice / operator console / admin panel?
├── Yes → Is it a multi-capability request?
│   ├── Yes → One route per capability, shared shell, list/detail patterns
│   │   └── Apply HR-1, HR-2, HR-4, HR-5
│   └── No → Is it a single capability page?
│       └── Yes → Shared layout, loading/empty/error states, server-side filtering
│           └── Apply HR-2, HR-4, HR-5
├── No → Does it touch task inbox / work queue / approvals?
│   ├── Yes → Apply this skill with stepper/wizard patterns
│   └── No → Does it touch configuration / settings / rules?
│       ├── Yes → Dedicated config page, key-label distinction, add/edit/remove
│       └── No → Is it a landing page / marketing / static form?
│           └── Yes → Do NOT use this skill
└── No → Is it backend-only with no operator workflow?
    └── Yes → Do NOT use this skill
```

```
Data volume check:
├── < 100 records → Client-side filtering acceptable
├── 100–1000 records → Consider server-side, paginate
└── > 1000 records → Server-side filtering mandatory, virtualize if needed
```

## Four — Required UX Shape

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

**Capability page expectations** (for a backoffice MVP): `/ingest`, `/validation`, `/archive`,
`/export`, `/qa`, `/settings`, `/extraction-profiles`, or equivalent routes for the detected
framework. Do not hardcode exact paths unless the plan supports them. Use idiomatic routing.

**Large-data behavior** (archive, records, tasks, users, logs, document lists): no client-side
all-loads, server-side filtering, pagination or cursor semantics, stable sorting, search input
with clear scope, filter reset, document backend/source-of-truth assumptions.

**Configuration UX:** dedicated page, distinguish keys from labels, support add/edit/remove,
show examples and validation hints, persist via backend if required, document UI-local limitation.

**AI assistant UX:** explain what AI can/cannot do, no silent state mutation, show citation/no-source
behavior, guided prompts, show provider/runtime, avoid anthropomorphism.

### Operational UX patterns

**Stepper / Wizard workflows** (multi-step processes): visible progress indicator, allow back
navigation to completed steps, persist form state across steps, validate per step, show summary
before final submission, support save-and-resume.

**Bulk operations** (approve, reject, export, delete on multiple records): select-all/deselect-all,
floating action bar, selected count, confirmation for destructive bulk, success/failure counts,
cancellation support.

**Real-time status updates** (async backend processing): SSE or WebSocket, per-item status badges,
elapsed/estimated time, manual refresh fallback, graceful reconnection, never poll > 5s.

**Keyboard shortcuts** (high-volume operator workflows): discoverable shortcuts (`?` help overlay),
support `Ctrl+Enter`/`Esc`/`Tab`, avoid overriding browser defaults, visual feedback, configurable.

## Five — Cross-Cutting Design Patterns

Apply these as principles, not framework recipes. Priority-ordered — resolve higher-priority
items first. Full per-category rule list lives in `references/design-patterns.md`.

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

### Web quality & performance

Internal tools are still user-facing software. Full checklists in `references/web-quality.md`.

- **Accessibility target:** WCAG 2.2 AA. Labels, alt text, contrast (text 4.5:1, UI 3:1, focus 3:1),
  keyboard operability, visible focus, error announcement via `role="alert"`/`aria-live`,
  `prefers-reduced-motion` support.
- **Core Web Vitals (p75):** LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1. JS < 300KB, CSS < 100KB.
- **Loading:** inline critical CSS, no render-blocking JS, preload LCP element, prefer SSR/streaming.
- **Interactivity:** break long tasks, `await scheduler.yield()`, debounce search/filter, visual
  feedback before heavy work, move CPU-heavy work off main thread.
- **Stability:** reserve space for every image/embed, `font-display: swap` with matched fallback metrics.
- **Scale:** virtualize lists > 100 rows, event delegation, clean up listeners on unmount.

### Security & robustness

Operator consoles perform privileged actions on sensitive data. Full detail in `references/web-quality.md`.

- **Transport:** HTTPS only, no mixed content, HSTS (`max-age=31536000; includeSubDomains; preload`).
- **Headers:** `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
  CSP with `default-src 'self'`, `base-uri 'self'`, `form-action 'self'`, nonces over
  `'unsafe-inline'`. Prefer CSP `frame-ancestors 'self'` over `X-Frame-Options`. No `X-XSS-Protection`.
- **DOM-XSS:** never assign untrusted input to `innerHTML`/`document.write`; use `textContent` or
  sanitize. Enforce **Trusted Types** (`require-trusted-types-for 'script'`).
- **Third-party:** pin CDN scripts/stylesheets with Subresource Integrity; no untrusted CDN polyfills.
  Keep dependencies patched. Avoid prototype-pollution merges.
- **Markup:** valid HTML5, semantic elements (`<nav>`, `<main>`, `<table>` with `<th scope>`), no
  duplicate IDs. Secure cookies: `Secure; HttpOnly; SameSite=Strict; Path=/`.
- **Errors:** global `error` + `unhandledrejection` handlers, user-safe messages, strip
  `sourcesContent` from production source maps.

## Six — Error Handling

| Error | Detection | Resolution |
|-------|-----------|------------|
| Multi-capability request as single dashboard | Single route/page for multiple capabilities | Split into one route per capability; shared shell |
| Missing capability page | Required route not implemented | Add the missing route with shared layout |
| Missing loading/empty/error states | Critical workflow lacks state handling | Add loading, empty, error, permission-denied states |
| Unbounded client-side list | All records loaded client-side without justification | Implement server-side filtering + pagination |
| Backend rule duplication | Frontend replicates lifecycle/authorization rules | Remove frontend duplication; backend stays authoritative |
| Color-only meaning | Status conveyed only by color | Add icon, text, or border change alongside color |
| Sub-44px touch targets | Interactive element < 44×44px | Increase target size to 44×44px minimum |
| Hover-only interaction | Feature only accessible on hover | Provide tap/long-press/always-visible alternative |
| Missing focus states | No `:focus-visible` styling | Add visible focus indicators (≥3:1 contrast) |
| Layout shell duplication | Page contains own `<html>`, `<head>`, `<body>` | Remove shell; import shared layout |
| No meta tags | Missing `<title>` or `<meta description>` | Layout provides defaults; pages supply values |
| Hardcoded absolute URLs | Internal links use `http://localhost:...` | Use relative paths or base URL utility |
| Mixed content | HTTP resources on HTTPS page | Upgrade all resources to HTTPS |
| No CSP | Missing Content-Security-Policy header | Add CSP with `default-src 'self'` and nonces |
| `innerHTML` with user input | Untrusted input assigned to `innerHTML` | Use `textContent` or sanitize; enforce Trusted Types |
| Missing SRI | Third-party scripts without integrity hashes | Add `integrity` and `crossorigin` attributes |
| JS budget exceeded | JS > 300KB compressed | Analyze bundle, code-split, tree-shake |
| CSS budget exceeded | CSS > 100KB compressed | Remove unused CSS, consolidate utilities |
| LCP > 2.5s | Largest Contentful Paint exceeds target | Preload LCP element, inline critical CSS, SSR |
| INP > 200ms | Interaction to Next Paint exceeds target | Break long tasks, yield main thread, debounce |
| CLS > 0.1 | Cumulative Layout Shift exceeds target | Reserve space for images/embeds, use `aspect-ratio` |

## Seven — Evidence & Checklist

**Evidence required:**

- Route / page source files;
- A shared shell or navigation when multiple pages exist;
- An API client boundary or typed contract;
- At least one list / filter / task / action flow;
- State-handling evidence (loading / empty / error / permission);
- Accessibility evidence: semantic controls, labels, focus styles, contrast, keyboard path;
- Performance evidence: bundle/CSS within budget, virtualized long lists, debounced input, no CLS;
- Security evidence: HTTPS-only, security headers/CSP, sanitized HTML sinks, SRI-pinned third-party,
  no leaked source maps;
- Build / type / lint / test checks when available;
- A manual smoke path when automation is unavailable.

**Gate implications — BLOCK when:**

- Multi-capability backoffice request implemented as single decorative dashboard;
- Required capability pages / routes missing;
- Loading / error / empty / permission states absent for critical workflows;
- Large-data lists implemented as unbounded client-only lists without justification;
- Backend-source-of-truth rules duplicated or contradicted;
- Design-pattern table ignored → accessibility / touch regressions ship;
- Core Web Vitals regression ships without justification or bundles blow budget;
- Security baseline missing (mixed content, no CSP/Trusted Types, no SRI, `innerHTML` with user input).

**Gate may WARN when:**

- Route exists but advanced filtering is deferred and documented;
- Accessibility automation is unavailable but semantic controls are present;
- Configuration UI is UI-local only and persistence is explicitly out of scope;
- Performance budgets exceeded but mitigation plan and measurement attached.

**Regression test reconciliation:**

When adding a capability page, navigation item, route, visible section, action, filter, or
configuration workflow, reconcile existing regression tests. Do not leave older tests expecting
the previous navigation or section list unchanged. Avoid brittle positional selectors; prefer
route-scoped rendering, `within(...)`, unique accessible labels, or test-specific component roots.

**Reference guides:**

| Reference | Description |
|-----------|-------------|
| `references/design-patterns.md` | Full per-category design pattern rules, key checks, anti-patterns |
| `references/web-quality.md` | WCAG 2.2 AA, Core Web Vitals, security baseline detail |
| `references/condensed.md` | Condensed version for tools that don't read SKILL.md format |

## Test Cases

### Test Case 1: Capability page design
**Input:** "Design an operator console for document ingestion with ingest, validate, archive, export, QA, and settings pages."
**Expected output:** A design with one route per capability, shared navigation, list/detail patterns for validation and archive, server-side filtering, loading/empty/error states for each page, and role-aware action visibility.
**Assertion:** Output includes at least 5 distinct capability pages. Each page specifies loading, empty, and error states. No single-page dashboard.

### Test Case 2: Form UX review
**Input:** A settings page form with 15 fields, no labels (placeholder-only), errors displayed at the top of the page, and a submit button that stays enabled during submission.
**Expected output:** A review identifying: placeholder-only labels (violation), error placement (violation), missing submit disable (violation), and specific fixes for each.
**Assertion:** Review identifies at least 3 violations from the UI/UX 101 section. Each violation includes a specific fix.

### Test Case 3: Accessibility audit
**Input:** A backoffice page with color-only status indicators (red = error, green = success), no alt text on icons, and keyboard-trapped modal.
**Expected output:** A review identifying: color-only meaning (WCAG 1.4.1 violation), missing alt text (WCAG 1.1.1 violation), keyboard trap (WCAG 2.1.2 violation), with severity ratings and fixes.
**Assertion:** All three violations are identified with WCAG success criteria references.
