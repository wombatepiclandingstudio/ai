---
name: web-architecture-guardrails
description: >
  Prevent web project fragmentation when adding pages, routes, or components.
  Enforces shared-layout-first architecture, consistent navigation, proper meta tags,
  and link integrity through a mandatory audit-implement-verify workflow. Catches
  duplicated shells, broken routing, style drift, and inconsistent SEO before they ship.
  Includes framework-specific patterns for Astro, Next.js, Vue/Nuxt, SvelteKit, Angular,
  React SPA, and server-rendered apps. Covers micro-frontend, monorepo, i18n, and
  performance architecture.
---

**Scope:** This skill enforces architectural consistency in multi-page web projects. It applies
when adding pages, routes, or structural components. It does not apply to single-page apps with
no routing, standalone micro-frontends with intentional shell ownership, backend-only code,
CLI tools, or libraries.

# Web Architecture Guardrails

## Zero — Core Concepts

When an LLM adds a page or makes structural changes to a web project, it often copies the
shell (header, footer, sidebar, meta tags) into the new file instead of inheriting it from a
shared layout. Over time this fragments the project: pages diverge visually, navigation links
break or point to stale URLs, styles drift, and meta/SEO tags become inconsistent. This skill
enforces a shared-layout-first architecture and a mandatory verification workflow that catches
these regressions before they ship.

### Six Architectural Principles

**1. Single Source of Truth for the Shell.** Every multi-page web project must have exactly one
master layout that wraps all page content. The shell owns: `<!doctype html>`, `<html>`, `<head>`,
`<body>` tags, charset/viewport/generator meta, favicon and canonical/OG/Twitter meta structure,
global stylesheets and CSS custom properties, shared navigation, shared footer, any persistent UI
(toasters, modals, cookie banners), and the content insertion point (`<slot>`, `<Outlet>`,
`{children}`, `{% block %}`). Pages own only: page-specific title and description (passed as
props/metadata), page-specific content for the layout's content slot, page-specific meta overrides,
and page-specific scoped styles.

**2. Hierarchical Routing.** Routes must be registered as children of the layout route, not as
standalone entries. When the router renders a page, the layout wraps it automatically.

Correct:
```
/ (layout)           → renders shell + <Outlet>
  /                  → renders Home content
  /about             → renders About content
  /blog              → renders Blog content
    /[slug]          → renders BlogPost content
```

Incorrect:
```
/                    → Home page (includes its own <html>, <head>, <body>, navbar, footer)
/about               → About page (includes its own <html>, <head>, <body>, navbar, footer)
```

**3. Navigation as a Derived Artifact.** Navigation should be driven by a single route/data
structure. Preferred patterns: (1) nav items derived from route config, (2) single data file
(`nav-items.ts` / `navigation.json` / `routes.yaml`), (3) single navigation component.
Forbidden: navigation links hardcoded in individual page files or duplicated across layout variants.

**4. Style Architecture: Global → Scoped.**

| Level | What | Where | Example |
|-------|------|-------|---------|
| **Design tokens** | Colors, spacing, typography, shadows | CSS custom properties or Tailwind config | `--color-primary: #6366f1` |
| **Global styles** | Reset, base typography, body/html rules | Single global stylesheet imported by layout | `body { @apply bg-slate-950 text-slate-100 }` |
| **Layout styles** | Shell structure (navbar height, footer, grid) | Layout component (scoped or module CSS) | Grid template, sticky positioning |
| **Component styles** | Card, button, input, badge | Component files (scoped, CSS modules, utility classes) | `.card { border-radius: 0.75rem }` |
| **Page styles** | Page-specific overrides (rare) | Page file, scoped | Unique hero gradient |

No page should define styles for `body`, `html`, `<main>` container width, or any structural shell
element. Those belong to the layout.

**5. Meta and SEO Consistency.** The layout defines the meta tag structure. Pages provide values
through props, frontmatter, or head-management API. Every page needs: `<title>` (page-specific),
`<meta name="description">` (page-specific), `<link rel="canonical">` (derived from URL + site
config), OG tags (title, description, type, url, image), Twitter card tags. Layout supplies
sensible defaults if a page omits them. No page ships with missing or empty `<title>`.

**6. URL and Link Integrity.** All internal links generated from consistent base URL configuration,
not hardcoded absolute URLs. Use relative paths or framework link components. Maintain consistent
trailing-slash convention (always or never — don't mix). Anchor links reference IDs that exist.

## One — When to Use

- Adding a new page, route, or view to an existing multi-page web project
- Restructuring or refactoring layouts, navigation, or shared components
- Updating the navbar, footer, sidebar, or any shared structural element
- Reviewing a project for architectural consistency or "page drift"
- The user reports that "pages look different," "the footer is missing," "links are broken,"
  or "something changed after I added a page"
- Migrating from a flat page structure to a hierarchical layout system

**Trigger phrases:** "add a page", "create a new route", "add a section", "update the navbar",
"fix the navigation", "the footer is missing", "links are broken", "this page looks different",
"make it consistent", "fix the layout", "restructure layouts", "review architecture"

**Do not use** when: building a single-page app with no routing or shared shell, creating a
standalone micro-frontend with intentional shell ownership, working on backend-only code,
building a CLI, library, or non-web artifact.

## Two — Hard Rules

> **HR-1.** Every page must render inside the shared layout. A page file must NOT contain
> `<html>`, `<head>`, `<body>`, `<nav>`, or `<footer>` tags.

> **HR-2.** Routes must be registered as children of the layout route, not as standalone entries.

> **HR-3.** Navigation links come from ONE place: a shared component, data file, or route config.
> Do NOT put navigation links inside page files.

> **HR-4.** No page should define styles for `body`, `html`, `<main>` container width, or any
> structural shell element. Those belong to the layout.

> **HR-5.** If a new page does not provide title/description, the layout must supply sensible
> defaults. No page ships with missing or empty `<title>`.

> **HR-6.** All internal links must use relative paths or a base URL utility, not hardcoded
> absolute URLs.

> **HR-7.** Maintain a consistent trailing-slash convention (always or never — don't mix).

> **HR-8.** The layout's `<head>` must include favicon and a default OG image. Pages can override
> the OG image but must not omit it.

> **HR-9.** Apply the same CSS approach (Tailwind, CSS Modules, scoped styles, utility classes)
> used by existing pages. Do not introduce a new styling method without justification.

> **HR-10.** When a structural change adds/modifies a page, navigation item, or route, reconcile
> existing regression tests. Do not leave older tests expecting the previous structure unchanged.

## Three — Decision Trees

```
Is the request about adding/modifying a page, route, or structural component?
├── Yes → Is it a multi-page web project with routing?
│   ├── Yes → Apply this skill (Audit → Implement → Verify workflow)
│   └── No → Is it a single-page app with no routing?
│       └── Yes → Do NOT use this skill
├── No → Is it about backend-only code?
│   └── Yes → Do NOT use this skill
└── No → Is it about a CLI, library, or non-web artifact?
    └── Yes → Do NOT use this skill
```

```
Framework detection:
├── Astro → src/layouts/Base.astro; pages in src/pages/; import layout in each page
├── Next.js (App Router) → app/layout.tsx root; pages as app/page.tsx children
├── Next.js (Pages Router) → pages/_app.tsx wraps all; _document.tsx for <html> shell
├── Vue / Nuxt → layouts/default.vue (Nuxt) or App.vue wrapper; pages in pages/
├── SvelteKit → src/routes/+layout.svelte root; +page.svelte for content
├── Angular → AppComponent with <router-outlet>; shared modules for nav/footer
├── React SPA → <Layout> component with <Outlet>; nested route config
└── Server-rendered (Rails/Django/Laravel) → master template with {% block %} / @yield / <%= yield %>
```

```
Adding a new page — workflow decision:
├── Phase 1: Audit (before changes)
│   ├── 1. Find the layout root
│   ├── 2. Find the route registry
│   ├── 3. Find the navigation source
│   ├── 4. Find the style architecture
│   ├── 5. Find the meta pattern
│   └── 6. Find the base URL pattern
├── Phase 2: Implement (the change)
│   ├── 7. Create ONLY page content (no shell)
│   ├── 8. Register as child of layout route
│   ├── 9. Update the shared navigation source
│   ├── 10. Provide meta values using project pattern
│   ├── 11. Use project's style conventions
│   └── 12. Use project's link conventions
└── Phase 3: Verify (after changes)
    ├── 13. Shell inheritance: navbar, footer, global styles present
    ├── 14. Navigation: new page in nav, existing links work
    ├── 15. Style consistency: same fonts, colors, spacing
    ├── 16. Meta: title, description, canonical, OG tags present
    ├── 17. Link integrity: all internal links resolve correctly
    └── 18. Responsive: reflows at mobile/tablet/desktop
```

## Four — Mandatory Workflow: Adding or Modifying Pages

### Phase 1: Audit (before making changes)

1. **Identify the layout root.** Find the master layout file. If none exists, flag as prerequisite.
2. **Identify the route registry.** Find where routes are defined (file-based routing directory,
   route config file, or router setup).
3. **Identify the navigation source.** Find where navigation links are defined.
4. **Identify the style architecture.** Find global stylesheet, design tokens, page-scoped patterns.
5. **Identify the meta pattern.** Find how pages provide title/description to the layout.
6. **Identify the base URL pattern.** Find how internal links are constructed.

### Phase 2: Implement (the change)

7. **Create only the page content.** No `<html>`, `<head>`, `<body>`, navbar, footer, global styles.
8. **Register the route correctly.** Child of the layout route. File-based: place in correct
   directory. Config-based: add to children array.
9. **Update navigation.** Add link to the single navigation source. Do NOT add nav links in page file.
10. **Provide meta values.** Pass title, description, OG/Twitter overrides using project pattern.
11. **Use project's style conventions.** Same CSS approach as existing pages.
12. **Use project's link conventions.** Same base URL utility or pattern. Maintain trailing-slash.

### Phase 3: Verify (after making changes)

13. **Shell inheritance check.** Navbar present, footer present, global styles applied, favicon/meta tags.
14. **Navigation check.** New page in nav. Existing links work. Back-links correct.
15. **Style consistency check.** Same fonts, color palette, spacing, component styles.
16. **Meta check.** View source: title, description, canonical, OG tags present and correct.
17. **Link integrity check.** All internal links resolve. No broken anchors.
18. **Responsive check.** Reflows at mobile/tablet/desktop. No horizontal scroll.

## Five — Framework-Specific Patterns

**Read only the section for the detected stack.**

### Astro
Layout: `src/layouts/Base.astro`. Routing: file-based (`src/pages/`). Layouts NOT in `pages/`.
Navigation: single `Navbar.astro` imported by layout. Styles: global CSS imported once in layout.
Meta: layout accepts `title` and `description` props. Common error: creating a page that includes
its own `<html>`, `<head>`, `<body>`, navbar, and footer instead of importing the layout.

### Next.js (App Router)
Layout: `app/layout.tsx` (root) and optional segment layouts. Routing: file-based.
Navigation: shared `<Nav>` in root layout. Styles: `app/globals.css` in root layout.
Meta: `export const metadata` or `generateMetadata()`. Common error: adding `layout.tsx` to every
route segment unnecessarily, or duplicating shell in `page.tsx` files.

### Next.js (Pages Router)
Layout: `pages/_app.tsx` wraps all pages. `pages/_document.tsx` controls `<html>` shell.
Navigation: shared component in `_app.tsx`. Styles: global CSS in `_app.tsx`.
Meta: per-page via `<Head>` from `next/head`. Common error: adding `<html>`, `<head>`, `<body>`
tags in individual pages.

### Vue / Nuxt
Layout: `layouts/default.vue` (Nuxt) or root `App.vue` wrapper. Routing: file-based in Nuxt.
Navigation: `<NuxtLayout>` + `<NuxtPage>` in `app.vue`. Styles: global CSS imported by layout.
Meta: `useHead()` or `useSeoMeta()`. Common error: adding `<NuxtLayout>` inside individual pages.

### SvelteKit
Layout: `src/routes/+layout.svelte` (root) and nested. Routing: file-based.
Navigation: nav component in root `+layout.svelte`. Styles: global CSS in `+layout.svelte` or
`app.html`. Meta: `<svelte:head>`. Common error: creating a `+page.svelte` with its own
`<svelte:head>`, `<nav>`, and `<footer>` instead of relying on layout.

### Angular
Layout: root `AppComponent` with `<router-outlet>`. Routing: `app-routing.module.ts`.
Navigation: `NavComponent` in `AppComponent` template. Styles: global `styles.css`.
Meta: `Meta` service from `@angular/platform-browser`. Common error: including `<app-nav>` and
`<app-footer>` in every component template instead of only in `AppComponent`.

### React (SPA, no framework router)
Layout: `<Layout>` component with `<Outlet>`. Routing: nested route config.
Navigation: `<Nav>` inside `<Layout>`. Styles: global CSS imported once.
Meta: `react-helmet-async`. Common error: wrapping every page in its own `<Layout>` instead
of using nested routes.

### Traditional Server-Rendered (Rails, Django, Laravel, PHP)
Layout: master template (`base.html`, `layout.blade.php`, `application.html.erb`) with
`{% block content %}` / `@yield('content')` / `<%= yield %>`. Navigation: partial template
included by layout. Meta: template blocks filled by each page view. Common error: creating a new
view that duplicates the full HTML shell instead of extending the master template.

## Six — Anti-Patterns

| Anti-Pattern | Symptom | Fix |
|-------------|---------|-----|
| Shell duplication | Page has its own `<html>`/`<head>`/`<body>`/`<nav>`/`<footer>` | Delete shell; use layout |
| Flat route registration | Route outside layout hierarchy | Nest under layout route |
| Navigation copy-paste | Page has its own `<nav>` | Use shared nav; add link to shared source |
| Footer drift | Footer missing or different on some pages | Footer in layout, once |
| Meta inconsistency | Some pages missing `<title>` or description | Layout provides defaults |
| Style method drift | Page uses different CSS approach | Match existing convention |
| Broken internal links | Hardcoded absolute URLs | Use relative paths or base utility |
| Inconsistent trailing slashes | Mix of `/about` and `/about/` | Pick convention; enforce in router config |
| Scattered global styles | `body`/`html` styles in multiple files | Consolidate into layout's global stylesheet |
| Missing favicon/OG | Some pages lack favicon or OG image | Layout `<head>` includes them |

## Seven — Evidence & Checklist

**Pre-delivery checklist:**

- [ ] **Layout:** New page renders inside the shared layout (navbar, footer, global styles present)
- [ ] **Routing:** Route is registered as a child of the layout route (not standalone)
- [ ] **Navigation:** New page appears in the shared nav; existing nav links unchanged
- [ ] **Meta:** `<title>`, `<meta description>`, canonical, OG tags present and correct
- [ ] **Styles:** Same fonts, colors, spacing as existing pages; no new style method introduced
- [ ] **Links:** All internal links use relative paths or base-aware utilities; trailing-slash maintained
- [ ] **No shell duplication:** Page file does not contain `<html>`, `<head>`, `<body>`, `<nav>`, or `<footer>`
- [ ] **No style leakage:** Page does not define `body`/`html`/`:root` styles
- [ ] **Responsive:** Page reflows at mobile/tablet/desktop; no horizontal scroll
- [ ] **Favicon/OG:** Present and consistent with other pages
- [ ] **Consistency:** Page looks like it belongs to the same site as existing pages

**Evidence required:**

- The layout file(s) that wrap the new page (show the shared shell is used);
- The route registration (show the route is a child of the layout);
- The navigation source (show where the new link was added);
- The new page file (show it contains only page content, no shell);
- The `<head>` output (show meta tags are present and correct);
- A visual or structural comparison with at least one existing page (show consistency);
- Build/type/lint checks passing when available.

**Gate implications — BLOCK when:**

- New page duplicates the shell (`<html>`, `<head>`, `<body>`, `<nav>`, `<footer>`) instead of
  using the shared layout;
- Route is registered outside the layout hierarchy;
- Navigation links are hardcoded in the page file instead of the shared nav source;
- Global styles (`body`, `html`, `:root`) are redefined in the page;
- Internal links use hardcoded absolute URLs instead of relative paths or base-aware utilities;
- Meta tags are missing or inconsistent with the project's established pattern;
- The new page introduces a different style method without justification.

**Gate may WARN when:**

- The page uses a slightly different component composition pattern but inherits the shell correctly;
- The page's meta description is shorter/longer than typical but still present;
- The page introduces a new CSS custom property that could have reused an existing token;
- Trailing-slash convention is inconsistent on the new page but matches majority of existing pages.

**Regression test reconciliation:**

When a structural change adds or modifies a page, navigation item, or route:
- Do not leave older tests expecting the previous navigation or route structure unchanged;
- Update any snapshot tests that capture the nav or page shell;
- If link assertions exist, ensure they still pass after the change;
- Prefer testing navigation through the shared nav component, not per-page nav markup.

**Advanced architecture patterns:**

- **Micro-frontend:** each micro-frontend owns routes within its bounded context; shell layout
  remains single source of truth; shared dependencies hoisted to shell; styles scoped.
- **Monorepo:** shared packages in `packages/` or `libs/`; layout shared via package; lint rules
  enforce import boundaries; CI builds only affected packages.
- **i18n routing:** locale prefix in URL; layout reads locale; translation files in `locales/`;
  `hreflang` alternate links; default locale redirects handled by router.
- **Performance:** code-split by route; lazy-load below fold; preload LCP element; reserve space
  for async content; `loading="lazy"` for below-fold images.

**Reference guides:**

| Reference | Description |
|-----------|-------------|
| `references/condensed.md` | Condensed version for tools that don't read SKILL.md format |

## Test Cases

### Test Case 1: Shell duplication detection
**Input:** A new page `/about` that includes its own `<html>`, `<head>`, `<body>`, `<nav>`, and `<footer>` instead of importing the shared layout.
**Expected output:** Audit identifying: shell duplication (violation), route registered outside layout hierarchy (violation), navigation not updated (violation). Corrected page that imports the shared layout and contains only page content.
**Assertion:** Audit identifies all 3 violations. Corrected page has no `<html>`, `<head>`, `<body>`, `<nav>`, or `<footer>` tags.

### Test Case 2: Navigation consistency check
**Input:** A project where the nav has 5 items on the home page but 4 items on the about page (missing "About" link).
**Expected output:** Identification of navigation inconsistency: the about page's nav is missing the "About" link. Recommendation to use the shared nav component and update the single nav source.
**Assertion:** Output identifies the specific missing link. Recommends using the shared navigation component.

### Test Case 3: Meta tag audit
**Input:** A page with no `<title>`, no `<meta name="description">`, and no Open Graph tags.
**Expected output:** Identification of missing meta tags: title (required), description (required), OG tags (recommended). Recommended values based on page content.
**Assertion:** Output identifies all missing meta tags. Provides recommended title and description values.
