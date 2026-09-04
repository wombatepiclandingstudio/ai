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
version: "1.1"
license: MIT
metadata:
  author: personal
  type: workflow
  tags: [ui, ux, backoffice, admin-panel, operator-console, accessibility, wcag-22, performance, task-workflow, design-system]
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

## UI/UX 101 — The basics

Before applying any advanced pattern, internalize these fundamentals. Every rule below is
non-negotiable for operator-facing software.

### Visibility of system status

The user must always know what is happening. Never leave the user wondering "did that work?"

- Show loading indicators for any async operation > 200ms.
- Show success/error messages after every mutation (create, update, delete).
- Show progress for multi-step operations (upload percentage, batch processing count).
- Disable submit buttons while a request is in flight to prevent double-submission.

**Loading variants — use the right one:**
| Pattern | When to use | Anti-pattern |
|---------|-------------|--------------|
| **Skeleton screen** | Page or section loading with known structure (list, card grid, form) | Spinner on an entire page that could show layout immediately |
| **Spinner** | Inline action, button click, short operation (< 3s) | Spinner for page-level loads — user can't see what's coming |
| **Progress bar** | Determinate duration (upload, batch, export) | Indeterminate bar for unknown duration — user doesn't know if it's stuck |
| **Inline text** | Tiny operations (auto-save, status flip) | Toast for every micro-action — noise |
| **Disabled + spinner** | Submitting a form | Nothing — user clicks again and again |

**Empty states are not blank screens.** Every list, table, and search result needs an empty
state that tells the user:
1. **What happened** — "No results found" or "No records yet"
2. **Why** — "No records match your filters" or "You haven't created any orders"
3. **What to do** — "Try adjusting your search" or "Create your first order"
Never show a blank area where content should be — it looks broken.

### When to disable, hide, or enable inputs

| Situation | Action | Why |
|-----------|--------|-----|
| Field depends on another field's value (e.g., "State" depends on "Country") | **Disable** until parent is selected | Prevents invalid combinations |
| Action requires permission the user lacks | **Hide** the control entirely | Don't show what they can't do |
| Action requires permission the user lacks but should know exists | **Disable** with tooltip explaining why | Awareness without confusion |
| Form is incomplete (required fields empty) | **Disable** submit button | Prevents partial submissions |
| Operation is in progress | **Disable** the triggering button | Prevents duplicate requests |
| Data is read-only by design (audit logs, finalized records) | **Disable** all edit controls | Clear signal: "this can't be changed" |
| Network is offline or API is unreachable | **Disable** all mutation controls | Prevent guaranteed failures |

**Never** disable a field without telling the user WHY. A greyed-out input with no
explanation is a mystery, not a feature.

### Color and contrast

- **Text contrast:** 4.5:1 minimum for body text, 3:1 for large text (≥18pt or ≥14pt bold).
- **UI component contrast:** 3:1 for borders, icons, and focus indicators against their background.
- **Never use color alone** to convey meaning. A red field must also have an icon, text, or
  border change. Colorblind users (~8% of males) won't see it otherwise.
- **Semantic color tokens** (not raw hex). `--color-error`, `--color-success`, `--color-warning`
  instead of `#ff0000`. This enforces consistency and makes theming possible.
- **Gray-on-gray is a readability killer.** If you squint to read it, it fails. Test with a
  contrast checker tool.
- **Dark mode is not just inverting colors.** It needs separate token definitions, reduced
  saturation for backgrounds, and adjusted shadow/elevation strategy.

### Typography fundamentals

- **Base size: 16px.** Body text smaller than 14px is hard to read for anyone over 40.
- **Line height: 1.5× for body text.** Tighter (1.3×) is acceptable in dense data tables
  but test readability.
- **Line length: 50–75 characters per line.** Longer lines fatigue the eye. Use `max-width`
  on text containers (~65ch).
- **One typeface family** for the entire UI. Use weight (400, 500, 600, 700) and size for
  hierarchy, not different fonts.
- **Monospace for code, IDs, and technical values.** Never use monospace for body text.
- **Don't use bold for everything.** Bold is a highlight, not a paragraph style.

### Touch vs. mouse interactions

- **Minimum touch target: 44×44px** (WCAG 2.2). Aim for 48×48px. Below 24×24px is
  inaccessible regardless of input method.
- **8px minimum spacing** between adjacent touch targets to prevent mis-taps.
- **No hover-only affordances.** If a tooltip or dropdown only appears on hover, touch
  users can never see it. Provide an alternative (tap, long-press, or always-visible).
- **Press states matter.** A button needs `:active` feedback (scale, darken, or shift)
  within 50ms. Delayed feedback feels unresponsive.

### Responsive design basics

- **Mobile-first:** Start with the smallest screen, add complexity as space grows.
- **Breakpoints by content, not device:** When the layout breaks or text wraps badly,
  that's a breakpoint — not "because iPad."
- **No horizontal scroll.** Ever. Content reflows. Tables become cards on small screens.
- **320px minimum.** The UI must work at 320px viewport width without zooming.
- **Allow zoom.** Never set `user-scalable=no` or `maximum-scale=1`. Users with low
  vision need to zoom.
- **Stack over sprawl.** On narrow screens, side-by-side elements stack vertically.
  Two-column forms become one-column. Sidebar moves above content.

### Modals and dialogs

Use modals sparingly — they interrupt the user's workflow.

- **Confirmation only.** Use modals for destructive actions that need explicit confirmation.
  Not for informational messages (use inline text or toast).
- **Escape always works.** `Esc` closes the modal. Clicking the backdrop closes it.
  A visible close button is mandatory.
- **Focus trap.** When a modal opens, focus moves into it. Tab cycles within the modal.
  When it closes, focus returns to the trigger element.
- **No modal-on-modal.** Never stack modals. If a modal needs a confirmation, replace the
  first modal's content instead.
- **Short content.** If the modal body needs scrolling, it's too long. Use a full page instead.

### Toast and notification patterns

- **Toast = brief, non-blocking, auto-dismiss.** Use for success confirmations, minor errors,
  or status updates. 3–5 seconds display time.
- **Stack from top-right or bottom-right.** Never obscure critical UI elements (navigation,
  form fields, primary action buttons).
- **Max 3 visible toasts.** Older toasts dismiss when new ones arrive. Don't flood the screen.
- **Actionable toasts** when possible: "Record saved. Undo?" is better than just "Saved."
- **Error toasts should persist** until dismissed. Don't auto-dismiss error messages — the
  user needs time to read and act on them.
- **Never use toasts for complex information.** If it needs a title, body, and action button,
  use a banner or inline notification instead.

### Data tables basics

Tables are the backbone of operator UIs. Get them right:

- **Sticky header.** When scrolling long tables, the header must stay visible.
- **Sticky first column** (optional but valuable). When horizontal scroll is needed, keep
  the identifier column visible.
- **Row height: 48–56px** for touch, 40px for mouse-only. Don't cram rows — readability
  trumps density.
- **Right-align numbers.** Decimal points should line up. Left-align text.
- **Sortable column headers.** Show the current sort direction with an arrow icon.
- **Row hover state.** Subtle background change on hover to help the eye track across rows.
- **Selection indicator.** When rows are selectable, show a checkbox or highlight on the
  entire row, not just a tiny checkbox.
- **Empty table state.** Never show an empty table with just headers. Show "No records found"
  with an explanation and action.

### Search and filtering

- **Search input visible by default.** Don't hide it behind an icon or toggle. Operators
  search constantly.
- **Search scope is clear.** "Search orders" or "Search by customer name" — not just a
  magnifying glass icon.
- **Debounce search input** (300ms). Don't fire a request on every keystroke.
- **Clear button.** An × inside the search input to clear the query in one click.
- **Filter chips/tags.** Show active filters as removable chips below the search bar.
  "Status: Active × Country: US ×" — the user sees what's applied.
- **Filter reset.** A single "Clear all filters" button when multiple filters are active.
- **Results count.** Always show "Showing 1–25 of 342 orders" so the user knows the scope.

### The "grandma test"

If someone unfamiliar with the system can complete the core task without instructions, the
UI is clear enough. If they need a manual, the design failed. This doesn't mean the UI is
"simple" — it means it's intuitive. Complexity in the domain is fine; complexity in the
interface is not.

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

## Operational UX patterns

### Stepper / Wizard workflows

For multi-step processes (onboarding, approval chains, data entry):

- Show a visible progress indicator (step numbers or labels);
- allow navigation to completed steps (but not forward past the current step);
- persist form state across steps (no data loss on back navigation);
- validate per step, not only at the end;
- show a summary before final submission;
- support save-and-resume for long processes.

### Bulk operations

For actions on multiple records (approve, reject, export, delete):

- provide select-all / deselect-all checkboxes;
- show a floating action bar or contextual toolbar when items are selected;
- display a count of selected items;
- require confirmation for destructive bulk actions (delete, archive);
- report success/failure counts after bulk execution;
- support cancellation of in-progress bulk operations.

### Real-time status updates

For workflows with asynchronous backend processing (extraction, validation, export):

- use Server-Sent Events (SSE) or WebSocket for live status;
- show per-item status badges (pending, processing, complete, failed);
- display elapsed time or estimated completion when available;
- provide a manual refresh fallback for environments where real-time is unavailable;
- handle reconnection gracefully (show "reconnecting…" instead of breaking);
- never poll more frequently than every 5 seconds.

### Keyboard shortcuts for power users

For high-volume operator workflows:

- provide discoverable keyboard shortcuts (show a `?` help overlay);
- support common patterns: `Ctrl+Enter` (submit), `Esc` (cancel/close), `Tab` (next field);
- avoid overriding browser defaults (`Ctrl+S`, `Ctrl+F`);
- provide visual feedback when a shortcut is triggered;
- make shortcuts configurable when feasible.

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

---

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

