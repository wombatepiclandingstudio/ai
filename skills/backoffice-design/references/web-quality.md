# Web Quality Reference (accessibility, performance, security)

Curated, framework-neutral extraction from the `web-quality-skills` collection
(accessibility, performance, core-web-vitals, best-practices skills by Addy Osmani, MIT).
This is the depth behind the **Accessibility**, **Performance**, and **Security & robustness**
disciplines in `SKILL.md`. Apply as principles — minimal illustrative markup only, no stack scripts.

> Deliberately excluded from this skill: SEO (irrelevant to internal tools) and the upstream
> `web-quality-audit` CLI script (it shells out to Lighthouse/axe — outside our "patterns only,
> no script" scope). The audit *checklist items* are folded into the skill's gate/evidence instead.

---

## 1. Accessibility — WCAG 2.2 (POUR)

Target **AA** for internal tools (legal baseline in many jurisdictions); AAA where cheap.

| Principle | Meaning |
|-----------|---------|
| **P**erceivable | Content perceivable through different senses |
| **O**perable | Interface operable by all users (keyboard, no traps) |
| **U**nderstandable | Content and UI are understandable |
| **R**obust | Works with assistive technologies |

### Text alternatives & names
- Images need `alt`; decorative images use `alt=""` + `role="presentation"`.
- Icon-only controls need an accessible name: `aria-label`, or visually-hidden text, or `<title>` in SVG. Never ship an unlabeled icon button.
- Complex images get a longer description (`aria-describedby` → `<figcaption>`).

### Color & contrast
- **Text:** 4.5:1 normal, 3:1 large (≥18px / ≥14px bold). AAA: 7:1 / 4.5:1.
- **UI components & graphics (non-text):** 3:1 against adjacent colors (WCAG 1.4.11).
- **Focus indicator:** ≥3:1 against adjacent colors (WCAG 2.4.11). Use `:focus-visible` with a
  visible outline; never remove focus outlines globally.
- **Never convey meaning by color alone** — pair error/success/required with icon + text.

### Keyboard & focus
- All functionality keyboard-operable. Prefer native `<button>`, `<a href>`, and form controls
  (they handle Enter/Space, focus, and AT semantics for free).
- **No keyboard traps.** Tab in and out of every component; use the native `<dialog>` or a proper
  focus-trap for modals.
- **Target size:** minimum 24×24 CSS px (AA, 2.5.8); aim for the comfortable 44×44. Exceptions:
  inline text links, browser-sized controls, and targets whose 24px circle doesn't overlap another.
- **Focus not obscured (2.4.11):** a focused element must not be fully hidden by sticky
  headers/footers. Add `scroll-margin-top/bottom` to focused elements.

### Motion & zoom
- Honor `prefers-reduced-motion`: neutralize animation/transition durations; never animate only via
  `width`/`height` (use `transform`/`opacity`).
- Support 200% text zoom and 320px-width reflow with no horizontal scroll (1.4.4, 1.4.10).

### Forms & errors
- Every input has a programmatically associated `<label>`; never placeholder-only labels.
- On error: set `aria-invalid="true"`, point `aria-describedby` at the message, set the message
  `role="alert"` (or an `aria-live` region), and move focus to the first invalid field.
- **Don't force redundant entry (3.3.7):** auto-fill previously provided values in the same session.
- Consistent identification (3.2.4): the same action uses the same label across pages.

### Status & live regions
- Announce async results (save succeeded, row deleted, export ready) via `role="status"` (polite)
  or `role="alert"` (assertive) — without moving focus.

### Critical a11y defects (fix before ship)
Missing form labels · missing alt text · insufficient contrast · keyboard traps · no focus indicators.

---

## 2. Performance & Core Web Vitals

### Budgets (backoffice apps are JS-heavy — be explicit)
| Resource | Budget | Why |
|----------|--------|-----|
| Total page weight | < 1.5 MB | 3G loads in ~4s |
| JavaScript (compressed) | < 300 KB | parse + exec cost |
| CSS (compressed) | < 100 KB | render-blocking |
| Images above-fold | < 500 KB | LCP impact |
| Fonts | < 100 KB | FOIT/FOUT |
| Third-party | < 200 KB | uncontrolled latency |

### Core Web Vitals (good / poor, measured at p75)
| Metric | Good | Poor | What it is |
|--------|------|------|------------|
| **LCP** | ≤ 2.5s | > 4s | Largest Contentful Paint |
| **INP** | ≤ 200ms | > 500ms | Interaction to Next Paint |
| **CLS** | ≤ 0.1 | > 0.25 | Cumulative Layout Shift |

### LCP (loading)
- TTFB < 800ms: CDN, caching, efficient backend.
- Inline critical CSS (< 14KB); defer the rest. No render-blocking JS in `<head>`.
- LCP image: `fetchpriority="high"`, `loading="eager"`, `decoding="sync"`, correct dimensions.
- Reserve space for async-loaded content (no layout shift). Prefer SSR/streaming over client-only fetch of above-fold text.

### INP (interactivity)
- Break long tasks; yield to the main thread. Modern approach: `await scheduler.yield()` between
  chunks; fallback to `setTimeout(0)` where unavailable.
- Heavy handlers: give immediate visual feedback (e.g. `button.classList.add('loading')`), then
  `await scheduler.yield()` before the expensive work.
- Debounce/throttle search & filter input. Memoize expensive components; use transitions for
  non-urgent work. Move CPU-heavy work to a Web Worker.
- Lazy-load third-party widgets on interaction/visibility, not eagerly.

### CLS (stability)
- Every image/video/iframe has `width`/`height` or `aspect-ratio`.
- Reserve space for ads/embeds with `min-height` containers.
- Insert dynamic content **below** the viewport, or animate in with `transform` (never shift others).
- Fonts: `font-display: swap` (or `optional`) and match fallback metrics (`size-adjust`,
  `ascent-override`) to avoid FOUT shift.
- Animate `transform`/`opacity` only — never `width`/`height`/`top`/`left`.

### Runtime hygiene
- Batch DOM reads then writes (avoid layout thrashing).
- Virtualize lists > 100 rows (`content-visibility: auto` or a windowing lib).
- Use `requestAnimationFrame` for animation; passive listeners for `touchstart`/`wheel`.
- Event delegation over per-element listeners; clean up listeners (AbortController) on unmount.

---

## 3. Security & robustness (Best Practices)

Internal tools still handle sensitive data and privileged actions — apply the same baseline.

### Transport & headers
- HTTPS only; no mixed content; no protocol-relative `//` URLs.
- HSTS: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`.
- `X-Content-Type-Options: nosniff`; `Referrer-Policy: strict-origin-when-cross-origin`.
- Prefer CSP `frame-ancestors 'self'` over legacy `X-Frame-Options`. Do **not** send `X-XSS-Protection`.

### Content Security Policy
- `default-src 'self'`; restrict `script-src`, `style-src` (nonces over `'unsafe-inline'`),
  `connect-src` to known APIs; set `base-uri 'self'` and `form-action 'self'`.

### DOM-XSS defense
- **Trusted Types** (`require-trusted-types-for 'script'`): make `innerHTML`/sinks accept only
  typed, sanitized HTML (e.g. DOMPurify) instead of raw strings. Roll out in Report-Only first.
- Never assign untrusted input to `innerHTML`/`document.write`; use `textContent` or sanitize.

### Third-party integrity
- Pin CDN `<script>`/`<link rel="stylesheet">` with Subresource Integrity (`integrity="sha384-…"`,
  `crossorigin`). Never load polyfills from an untrusted CDN (polyfill.io 2024 supply-chain attack).
- Keep dependencies patched (`npm audit`); avoid prototype-pollution patterns (`_.merge` of
  untrusted input). Use `structuredClone` / null-prototype objects for untrusted bags.

### Semantic & valid HTML
- HTML5 doctype; `<meta charset="UTF-8">` first in `<head>`; viewport meta present.
- Prefer semantic elements (`<header> <nav> <main> <article> <table>` with `<th scope>`) over
  `<div>` soup. No duplicate IDs; valid nesting.
- Secure cookies: `Secure; HttpOnly; SameSite=Strict; Path=/`.

### Error handling
- Catch and report errors (global `error` + `unhandledrejection` handlers); show user-friendly
  messages; never leak internals to the UI. Strip `sourcesContent` from production source maps.

### Deprecated / forbidden
- No `document.write`, no synchronous XHR, no Application Cache. Use dynamic script injection,
  `fetch`, and Service Workers instead.

---

## Pre-Delivery Web-Quality Checklist

- [ ] AA contrast met (text 4.5:1, UI 3:1, focus 3:1) in light **and** dark modes.
- [ ] Every control keyboard-operable; no traps; visible `:focus-visible` indicator.
- [ ] No icon-only action without an accessible name or tooltip.
- [ ] Touch targets ≥ 24×24px (aim 44×44); no hover-only interactions.
- [ ] Forms: associated labels, inline errors via `aria-invalid` + `role="alert"`, focus moved to first error.
- [ ] Async results announced via live region; `prefers-reduced-motion` honored.
- [ ] Images/embeds reserve space; no CLS from late content (target CLS ≤ 0.1).
- [ ] JS/CSS within budget; long lists virtualized; inputs debounced; heavy work yielded/off-thread.
- [ ] HTTPS-only + security headers (HSTS, nosniff, Referrer-Policy, CSP); Trusted Types for HTML sinks.
- [ ] Third-party scripts pinned with SRI; no untrusted CDN polyfills; `npm audit` clean.
- [ ] Semantic, valid HTML; secure cookies; global error handling with user-safe messages.
