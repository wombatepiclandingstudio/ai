# Backoffice Design Patterns (reference)

Curated, framework-neutral design-pattern rules for backoffice / operator-console UIs. This is the
detail behind the Cross-cutting UI/UX Design Patterns table in `SKILL.md`. Apply these as
principles — adapt the wording to whatever stack you are generating, but do not relax the
underlying intent.

> Note: This reference intentionally omits stack-specific guidance and any search-database tooling.
> It is meant to be read and applied directly by the agent, not queried by a script.
>
> For **deep** accessibility (WCAG 2.2 POUR, full criteria checklist, live regions), **performance
> & Core Web Vitals** (LCP/INP/CLS checklists, budgets, runtime hygiene), and **security /
> robustness** (CSP, Trusted Types, SRI, semantic HTML, error handling), see
> [`web-quality.md`](web-quality.md). That file holds the exhaustive detail; this one keeps the
> structural pattern summaries.

---

## 1. Accessibility (CRITICAL)

- Target **WCAG 2.2 AA**. Text contrast ≥ 4.5:1 (3:1 large); UI components & focus indicators ≥ 3:1.
- Provide alt text for meaningful images; mark decorative images `alt=""` + `role="presentation"`.
- All interactive elements reachable and operable by keyboard; **no keyboard traps** (use native
  `<dialog>` or a proper focus trap for modals).
- Controls without visible text need an accessible name (`aria-label`, visually-hidden text, or SVG
  `<title>`). Never ship an unlabeled icon button.
- **Never** remove focus indicators; use `:focus-visible` with a visible outline.
- Do not rely on color alone to convey state (error, success, required) — pair with icon/text.
- Forms: associated `<label>`, `aria-invalid` + `role="alert"` (or `aria-live`) on errors, focus
  moved to first invalid field. Avoid forcing redundant entry in the same session.
- Respect `prefers-reduced-motion`; support 200% zoom and 320px reflow with no horizontal scroll.
- Target size ≥ 24×24px (AA, 2.5.8); aim for the comfortable 44×44.

**Anti-patterns:** removing focus rings, icon-only buttons without labels, gray-on-gray text,
color-only status, trapping focus in modals, hover-only interactions.

## 2. Touch & Interaction (CRITICAL)

- Minimum interactive target size of 44×44px.
- At least 8px spacing between adjacent interactive targets.
- Provide immediate loading / in-progress feedback for actions that take time.
- State changes should be perceptible; avoid instant 0ms flashes for important transitions.
- Support both pointer and keyboard activation paths.
- Confirm destructive or irreversible actions (see SKILL.md confirmation rule).

**Anti-patterns:** hover-only affordances, instant state changes with no feedback, sub-44px taps,
touch targets overlapping without spacing.

## 3. Performance (HIGH)

- Set an explicit budget (JS < 300KB, CSS < 100KB compressed) and enforce it — backoffice UIs are
  JS-heavy and data-dense.
- Target Core Web Vitals at p75: **LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1**. (Full LCP/INP/CLS
  checklists, critical-CSS, font, and runtime guidance are in [`web-quality.md`](web-quality.md).)
- Serve modern image formats (WebP / AVIF) and lazy-load below-the-fold media.
- Reserve space for asynchronously loaded content to avoid layout shift (target CLS ≤ 0.1).
- Virtualize long lists (> 100 rows) instead of rendering thousands at once.
- Debounce / throttle search and filter input; break long tasks with `scheduler.yield()`; avoid
  main-thread-blocking work; move CPU-heavy work off-thread.

**Anti-patterns:** layout thrashing, unbounded client-side lists, synchronous heavy work on input,
render-blocking JS in `<head>`, images without reserved dimensions causing shift.

## 4. Style Consistency (HIGH)

- Match the visual style to the product type (operational tool → calm, dense, utilitarian; not
  playful marketing aesthetics unless requested).
- Keep one consistent design language: do not randomly mix flat and skeuomorphic treatments.
- Prefer vector icons over emoji; emoji are not a reliable icon system (rendering/accessibility).
- Establish a small set of reusable components (buttons, inputs, tables) and reuse them.

**Anti-patterns:** mixing flat & skeuomorphic arbitrarily, emoji as icons, ad-hoc one-off components
that diverge from the shell.

## 5. Layout & Responsive (HIGH)

- Design mobile-first; add breakpoints to expand, never to cram.
- Avoid horizontal scrolling on the primary axis.
- Avoid fixed-pixel container widths that break on small viewports.
- Never disable pinch-zoom / user scaling where platform policy allows.
- Use a responsive grid / flex system with sensible max-widths and gutters.

**Anti-patterns:** horizontal scroll, fixed-px containers, disabling zoom, layouts that only work
at one viewport.

## 6. Typography & Color (MEDIUM)

- Base body size 16px; line-height ~1.5 for readability.
- Avoid body text below 12px.
- Use semantic color tokens (e.g. `color: var(--danger)`) rather than raw hex inside components.
- Avoid gray-on-gray combinations that fail contrast.
- Keep a limited, purposeful color role system (primary, success, warning, danger, neutral).
- Support light and dark modes with verified contrast in both.

**Anti-patterns:** raw hex literals in components, sub-12px body, gray-on-gray, untested dark-mode
contrast.

## 7. Animation (MEDIUM)

- Keep motion durations in the 150–300ms range for UI transitions.
- Motion should convey meaning (spatial continuity, state change), not decorate.
- Preserve spatial continuity between source and target states.
- Honor `prefers-reduced-motion`: provide static equivalents.
- Exit transitions may be faster than enter transitions.

**Anti-patterns:** decorative-only animation, animating width/height (prefer transform),
no reduced-motion fallback, excessive or janky choreography.

## 8. Forms & Feedback (MEDIUM)

- Every input has a visible, associated label.
- Validate inline; show errors adjacent to the relevant field.
- Provide helper text and format examples for non-obvious fields.
- Use progressive disclosure: do not overwhelm with all options upfront.
- Move focus to the first invalid field on submit failure; manage focus sensibly.
- Disable submit only with an explanatory reason, or keep enabled and show errors.

**Anti-patterns:** placeholder-only labels, errors shown only at form top, overwhelming upfront
disclosure, lost focus after validation.

## 9. Navigation (HIGH)

- Back behavior must be predictable (no broken or surprising returns).
- Bottom navigation should hold at most 5 items.
- Support deep links to capability pages and specific records.
- Prefer route-scoped rendering and unique accessible labels for test selectors.
- Reflect the user's location in the shared shell (active state, breadcrumbs).

**Anti-patterns:** overloaded navigation, broken back behavior, no deep links, brittle positional
selectors in tests.

## 10. Charts & Data (LOW)

- Always include legends and tooltips for data visualizations.
- Use accessible, distinguishable colors; never convey meaning by color alone.
- Label axes and units; avoid misleading scales.
- For real-time data, indicate loading / stale states.

**Anti-patterns:** color-only encoding, missing legends, unlabeled axes, truncated tooltips.

---

## Pre-Delivery Checklist (operator / internal UI)

Run this before declaring a backoffice UI complete:

- [ ] Contrast meets 4.5:1 (text) / 3:1 (large + UI) in light **and** dark modes.
- [ ] Every interactive control has a visible focus indicator and a keyboard path.
- [ ] No icon-only action lacks an accessible label or tooltip.
- [ ] Touch targets ≥ 44×44px with ≥ 8px spacing.
- [ ] Loading, empty, error, permission-denied, and success states exist for critical flows.
- [ ] Long lists are paginated / virtualized; filters and search are server-backed where a
      backend exists.
- [ ] Destructive actions require confirmation; irreversible ones are explicit.
- [ ] Forms have visible labels, inline errors, and sensible focus management.
- [ ] Navigation is predictable, deep-linkable, and reflects current location.
- [ ] Charts include legends / tooltips and do not encode meaning by color alone.
- [ ] Animation honors `prefers-reduced-motion` and stays in the 150–300ms range.
- [ ] No backend business rule (auth, lifecycle, eligibility) is duplicated client-side as
      authoritative.
