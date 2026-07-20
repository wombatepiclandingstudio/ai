---
name: web-architecture-guardrails
description: >
  Enforces web architecture integrity when adding or modifying pages, components, and routes.
  Prevents structural fragmentation — duplicated shells, broken routing, drifted navigation,
  inconsistent styles, and scattered meta — by requiring a shared-layout-first approach and
  a mandatory pre/post change audit. Use this skill whenever the user asks to add a new page,
  route, section, or view to an existing web project; restructure layouts or navigation;
  refactor shared components; or review a project for architectural consistency. Also triggers
  on requests like "add a page," "create a new route," "update the navbar," "this page looks
  different from the rest," "the footer is missing," "links are broken," or "make it consistent."
  Framework-agnostic: the skill defines patterns and a verification workflow, not framework code.
version: "1.0"
license: MIT
metadata:
  author: personal
  type: workflow
  tags: [architecture, frontend, layout, routing, templating, navigation, consistency, web]
---

# Web Architecture Guardrails

When an LLM adds a page or makes structural changes to a web project, it often copies the
shell (header, footer, sidebar, meta tags) into the new file instead of inheriting it from a
shared layout. Over time this fragments the project: pages diverge visually, navigation links
break or point to stale URLs, styles drift, and meta/SEO tags become inconsistent. This skill
enforces a shared-layout-first architecture and a mandatory verification workflow that catches
these regressions before they ship.

## Use when

- Adding a new page, route, or view to an existing multi-page web project
- Restructuring or refactoring layouts, navigation, or shared components
- Updating the navbar, footer, sidebar, or any shared structural element
- Reviewing a project for architectural consistency or "page drift"
- The user reports that "pages look different," "the footer is missing," "links are broken,"
  or "something changed after I added a page"
- Migrating from a flat page structure to a hierarchical layout system

## Do not use when

- Building a single-page app with no routing or shared shell
- Creating a standalone micro-frontend that intentionally has its own shell
- Working on backend-only code with no UI
- Building a CLI, library, or non-web artifact

---

## Core Architectural Principles

### 1. Single Source of Truth for the Shell

Every multi-page web project must have exactly **one** master layout (or layout hierarchy) that
wraps all page content. The shell — the HTML document skeleton, `<head>`, global meta tags,
favicon, shared navigation, footer, and global styles — is defined **once** in this layout and
inherited by every page.

**The layout owns:**
- `<!doctype html>`, `<html>`, `<head>`, `<body>` tags
- Charset, viewport, and generator meta tags
- Favicon and canonical/OG/Twitter meta tag structure
- Global stylesheets and CSS custom properties / design tokens
- Shared navigation component (navbar, sidebar, bottom nav)
- Shared footer component
- Any persistent UI (toasters, modals, cookie banners)
- The `<slot>`, `<Outlet>`, `{children}`, `{% block %}`, or equivalent content insertion point

**Pages own only:**
- Page-specific title and description (passed as props/metadata to the layout)
- Page-specific content that goes into the layout's content slot
- Page-specific meta overrides (if the layout supports them)
- Page-specific styles that are scoped to that page only

### 2. Hierarchical Routing

Routes must be registered as children of the layout route, not as standalone entries. When the
router renders a page, the layout wraps it automatically — the page never renders the shell
itself.

**Correct:** Route tree where pages are children of the layout:
```
/ (layout)           → renders shell + <Outlet>
  /                  → renders Home content
  /about             → renders About content
  /blog              → renders Blog content
    /[slug]          → renders BlogPost content
```

**Incorrect:** Flat routes where each page manages its own shell:
```
/                    → Home page (includes its own <html>, <head>, <body>, navbar, footer)
/about               → About page (includes its own <html>, <head>, <body>, navbar, footer)
/blog                → Blog page (includes its own <html>, <head>, <body>, navbar, footer)
```

### 3. Navigation as a Derived Artifact

The navigation component should be driven by a **single route/data structure** — not by
hardcoded HTML links scattered across files. When a new page is added, the navigation updates
from that central structure. When the navigation structure is only in one place, it cannot
drift.

**Preferred patterns (in order):**
1. Navigation items derived from the route configuration itself (framework auto-generates nav)
2. A single `nav-items.ts` / `navigation.json` / `routes.yaml` data file consumed by the nav component
3. A single navigation component file where all links are defined (acceptable for small projects)

**Forbidden:** Navigation links hardcoded in individual page files, or duplicated across
multiple layout variants.

### 4. Style Architecture: Global → Scoped

Styles must follow a clear hierarchy that prevents drift:

| Level | What | Where | Example |
|-------|------|-------|---------|
| **Design tokens** | Colors, spacing, typography, shadows | CSS custom properties or Tailwind config | `--color-primary: #6366f1` |
| **Global styles** | Reset, base typography, body/html rules | Single global stylesheet imported by the layout | `body { @apply bg-slate-950 text-slate-100 }` |
| **Layout styles** | Shell structure (navbar height, footer, grid) | Layout component (scoped or module CSS) | Grid template, sticky positioning |
| **Component styles** | Card, button, input, badge | Component files (scoped, CSS modules, utility classes) | `.card { border-radius: 0.75rem }` |
| **Page styles** | Page-specific overrides (rare) | Page file, scoped | Unique hero gradient |

**Rule:** No page should define styles for `body`, `html`, `<main>` container width, or any
structural shell element. Those belong to the layout.

### 5. Meta and SEO Consistency

The layout defines the meta tag **structure** (where tags appear, which ones exist). Pages
provide **values** (title, description, OG data) through props, frontmatter, or a head-management
API. The layout ensures every page has:

- `<title>` (page-specific)
- `<meta name="description">` (page-specific)
- `<link rel="canonical">` (derived from current URL + site config)
- `<meta property="og:title">`, `og:description`, `og:type`, `og:url` (page-specific or derived)
- `<meta name="twitter:card">`, `twitter:title`, `twitter:description` (page-specific or derived)
- `<meta property="og:image">` (global default, page can override)

**Rule:** If a new page does not provide title/description, the layout must supply sensible
defaults. No page should ship with missing or empty `<title>`.

### 6. URL and Link Integrity

All internal links must be generated from a consistent base URL configuration, not hardcoded
as absolute URLs. This prevents links from breaking when the site's base path, domain, or
trailing-slash convention changes.

**Patterns:**
- Use a `base` or `prefix` utility derived from site config for all internal hrefs
- Use relative paths (`./about`) or framework-provided link components (`<Link>`, `<a>`)
- Maintain consistent trailing-slash convention (always or never — don't mix)
- Anchor links (`#section`) must reference IDs that actually exist on the target page

---

## Framework-Specific Patterns

The principles above are universal. This section maps them to common frameworks so the agent
can apply them concretely. **Read only the section for the detected stack.**

### Astro

- **Layout:** `src/layouts/Base.astro` (or nested layouts). Pages import and wrap content in the layout.
- **Routing:** File-based (`src/pages/`). Every `.astro` file in `pages/` is a route. Layouts are NOT in `pages/`.
- **Navigation:** Single `Navbar.astro` component imported by the layout.
- **Styles:** Global CSS imported once in the layout (`import '../styles/global.css'`). Page-scoped styles via `<style>` blocks.
- **Meta:** Layout accepts `title` and `description` props. Pages pass them: `<Base title="About">`.
- **Static paths:** `getStaticPaths()` for dynamic routes. Ensure the function is in the page file, not the layout.
- **Common LLM error:** Creating a new `.astro` page that includes its own `<html>`, `<head>`, `<body>`, navbar, and footer instead of importing the layout.

### Next.js (App Router)

- **Layout:** `app/layout.tsx` (root layout) and optional segment layouts (`app/dashboard/layout.tsx`).
- **Routing:** File-based. `app/page.tsx` = `/`, `app/about/page.tsx` = `/about`.
- **Navigation:** Shared `<Nav>` component imported in root layout. Or derive from route config.
- **Styles:** Global CSS in `app/globals.css`, imported in root layout. CSS Modules or Tailwind for components.
- **Meta:** `export const metadata` or `generateMetadata()` in page/layout files. Root layout defines defaults.
- **Common LLM error:** Adding `layout.tsx` to every route segment unnecessarily, or duplicating the shell in `page.tsx` files instead of relying on the parent layout.

### Next.js (Pages Router)

- **Layout:** `pages/_app.tsx` wraps all pages. `pages/_document.tsx` controls `<html>` shell.
- **Navigation:** Shared component in `_app.tsx`.
- **Styles:** Global CSS imported in `_app.tsx`.
- **Meta:** Per-page via `<Head>` from `next/head`, or use `next-seo`.
- **Common LLM error:** Adding `<html>`, `<head>`, `<body>` tags in individual pages (those belong in `_document.tsx`).

### Vue / Nuxt

- **Layout:** `layouts/default.vue` (Nuxt) or a root `App.vue` wrapper component.
- **Routing:** File-based in Nuxt (`pages/`). Route config in Vue Router (`router/index.ts`).
- **Navigation:** `<NuxtLayout>` + `<NuxtPage>` in `app.vue`. Nav component in layout.
- **Styles:** Global CSS in `assets/` imported by layout or `nuxt.config`. Scoped `<style>` in components.
- **Meta:** `useHead()` or `useSeoMeta()` composables. Define defaults in layout, override in pages.
- **Common LLM error:** Adding `<NuxtLayout>` inside individual pages instead of once in `app.vue`, causing nested layouts to break.

### SvelteKit

- **Layout:** `src/routes/+layout.svelte` (root) and nested `+layout.svelte` files.
- **Routing:** File-based (`src/routes/`). `+page.svelte` is the page content.
- **Navigation:** Nav component in root `+layout.svelte`.
- **Styles:** Global CSS in `+layout.svelte` `<style>` block or imported. `app.html` for `<html>` shell.
- **Meta:** `<svelte:head>` in pages or layouts. Or `@sveltejs/head` for structured meta.
- **Common LLM error:** Creating a `+page.svelte` that includes its own `<svelte:head>`, `<nav>`, and `<footer>` instead of relying on the layout.

### Angular

- **Layout:** Root `AppComponent` template with `<router-outlet>`. Shared modules for nav/footer.
- **Routing:** `app-routing.module.ts` with child routes under the root component.
- **Navigation:** `NavComponent` selector in `AppComponent` template.
- **Styles:** Global `styles.css` in `angular.json`. Component-scoped styles via `styleUrls`.
- **Meta:** `Meta` service from `@angular/platform-browser` or `Title` service.
- **Common LLM error:** Including `<app-nav>` and `<app-footer>` in every component template instead of only in `AppComponent`.

### React (SPA, no framework router)

- **Layout:** A `<Layout>` component that renders `<Outlet>` from `react-router-dom` or similar.
- **Routing:** Route config object with nested routes under the layout route.
- **Navigation:** `<Nav>` component inside `<Layout>`.
- **Styles:** Global CSS imported once in the entry point or layout. CSS Modules / Tailwind for components.
- **Meta:** `react-helmet-async` or equivalent. Layout provides defaults, pages override.
- **Common LLM error:** Wrapping every page component in its own `<Layout>` instead of using nested routes.

### Traditional Server-Rendered (Rails, Django, Laravel, PHP)

- **Layout:** A master template (`base.html`, `layout.blade.php`, `application.html.erb`) with `{% block content %}` / `@yield('content')` / `<%= yield %>`.
- **Routing:** Route file (e.g., `routes.rb`, `urls.py`, `web.php`). Pages are controllers/views that extend the layout.
- **Navigation:** Partial template (`_nav.html`, `navbar.blade.php`) included by the layout.
- **Styles:** Global CSS linked in the layout template.
- **Meta:** Template blocks for title/description, filled by each page view.
- **Common LLM error:** Creating a new view file that duplicates the full HTML shell instead of extending the master template.

---

## Mandatory Workflow: Adding or Modifying Pages

When a request involves adding a new page, route, or view — or modifying the structure of an
existing one — follow this workflow **in order**. Do not skip steps.

### Phase 1: Audit (before making changes)

1. **Identify the layout root.** Find the master layout file. If none exists, flag this as a
   prerequisite — the project needs a layout before adding pages.

2. **Identify the route registry.** Find where routes are defined (file-based routing directory,
   route config file, or router setup). Understand how new routes get discovered.

3. **Identify the navigation source.** Find where navigation links are defined. Is it a single
   component? A data file? Hardcoded in the layout? Determine how a new page's link gets added.

4. **Identify the style architecture.** Find the global stylesheet, design tokens, and the
   pattern for page-scoped styles. Note any inconsistencies in existing pages.

5. **Identify the meta pattern.** Find how pages provide title/description to the layout. Note
   the convention (props, frontmatter, head manager, template blocks).

6. **Identify the base URL pattern.** Find how internal links are constructed. Note the
   trailing-slash convention and any base path configuration.

### Phase 2: Implement (the change)

7. **Create only the page content.** The new file must contain ONLY the content unique to this
   page. No `<html>`, no `<head>`, no `<body>`, no navbar, no footer, no global styles. If the
   framework requires a page component, it wraps content in the layout — it does not replicate
   the layout.

8. **Register the route correctly.** Add the route as a child of the layout route. For
   file-based routing, place the file in the correct directory. For config-based routing, add it
   to the children array of the layout route.

9. **Update navigation.** Add the new page's link to the single navigation source identified in
   step 3. Do NOT add navigation links inside the page file itself.

10. **Provide meta values.** Pass title, description, and any OG/Twitter overrides to the layout
    using the project's established pattern.

11. **Use the project's style conventions.** Apply the same CSS approach (Tailwind, CSS Modules,
    scoped styles, utility classes) used by existing pages. Do not introduce a new styling method.

12. **Use the project's link conventions.** Construct internal hrefs using the same base URL
    utility or pattern used by existing pages. Maintain the trailing-slash convention.

### Phase 3: Verify (after making changes)

13. **Shell inheritance check.** The new page must render inside the shared layout. Visually
    confirm: navbar present, footer present, global styles applied, favicon/meta tags present.

14. **Navigation check.** The new page appears in the navigation. Existing navigation links
    still work. The new page's back-links (if any) point to correct destinations.

15. **Style consistency check.** The new page looks like it belongs to the same site. Same
    fonts, same color palette, same spacing, same component styles.

16. **Meta check.** View source or inspect the `<head>`: title, description, canonical, OG tags
    are present and correct. No empty or missing meta.

17. **Link integrity check.** All internal links on the new page resolve correctly. All links
    to the new page (from nav, from other pages) resolve correctly. No broken anchors.

18. **Responsive check.** The new page reflows correctly at common breakpoints (mobile, tablet,
    desktop). No horizontal scroll. No layout breakage.

---

## Anti-Patterns (What NOT to Do)

### Shell Duplication
**Symptom:** New page file contains `<html>`, `<head>`, `<body>`, `<nav>`, `<footer>`, or any
combination of these.
**Fix:** Delete the duplicated shell. Import and use the project's layout component/template.

### Flat Route Registration
**Symptom:** New route is registered as a top-level route, outside the layout hierarchy.
**Fix:** Register it as a child of the layout route so it inherits the shell.

### Navigation Copy-Paste
**Symptom:** New page contains its own `<nav>` with hardcoded links instead of using the shared
navigation component.
**Fix:** Delete the page's nav. Use the shared nav from the layout. Add the new link to the
shared nav source.

### Footer Drift
**Symptom:** Some pages have a footer, others don't. Or the footer content differs across pages.
**Fix:** The footer belongs in the layout, once. Remove any per-page footers.

### Meta Tag Inconsistency
**Symptom:** Some pages have `<meta name="description">`, others don't. OG tags appear on some
pages but not all. Titles follow different patterns.
**Fix:** The layout must provide a meta tag structure with defaults. Pages override values, not
structure.

### Style Method Drift
**Symptom:** Some pages use Tailwind, others use CSS Modules, others use inline styles for the
same type of component.
**Fix:** Pick one approach per category (utility classes for layout, scoped CSS for components)
and apply it consistently. Refactor outliers.

### Broken Internal Links
**Symptom:** Links use hardcoded absolute URLs (`http://localhost:3000/about`) instead of
relative paths or base-aware utilities. Links break when the base path or domain changes.
**Fix:** Use relative paths or a base URL utility derived from site config.

### Inconsistent Trailing Slashes
**Symptom:** Some links end with `/` and others don't (`/about` vs `/about/`). This causes
redirects, duplicate content, or broken relative link resolution.
**Fix:** Pick a convention (always or never) and enforce it in the router config and all
internal links.

### Scattered Global Styles
**Symptom:** `body`, `html`, or `:root` styles are defined in multiple files (page-level
stylesheets, component-level resets).
**Fix:** Consolidate into a single global stylesheet imported by the layout.

### Missing Favicon / OG Image
**Symptom:** Some pages have a favicon, others don't. OG image is missing or inconsistent.
**Fix:** The layout's `<head>` must include favicon and a default OG image. Pages can override
the OG image but must not omit it.

---

## Pre-Delivery Checklist

Before declaring a page addition or structural change complete, verify:

- [ ] **Layout:** New page renders inside the shared layout (navbar, footer, global styles present)
- [ ] **Routing:** Route is registered as a child of the layout route (not standalone)
- [ ] **Navigation:** New page appears in the shared nav; existing nav links unchanged
- [ ] **Meta:** `<title>`, `<meta description>`, canonical, OG tags present and correct
- [ ] **Styles:** Same fonts, colors, spacing as existing pages; no new style method introduced
- [ ] **Links:** All internal links use relative paths or base-aware utilities; trailing-slash convention maintained
- [ ] **No shell duplication:** Page file does not contain `<html>`, `<head>`, `<body>`, `<nav>`, or `<footer>`
- [ ] **No style leakage:** Page does not define `body`/`html`/`:root` styles
- [ ] **Responsive:** Page reflows at mobile/tablet/desktop; no horizontal scroll
- [ ] **Favicon/OG:** Present and consistent with other pages
- [ ] **Consistency:** Page looks like it belongs to the same site as existing pages

---

## Gate Implications

Gate must BLOCK when:

- New page duplicates the shell (`<html>`, `<head>`, `<body>`, `<nav>`, `<footer>`) instead of
  using the shared layout
- Route is registered outside the layout hierarchy
- Navigation links are hardcoded in the page file instead of the shared nav source
- Global styles (`body`, `html`, `:root`) are redefined in the page
- Internal links use hardcoded absolute URLs instead of relative paths or base-aware utilities
- Meta tags are missing or inconsistent with the project's established pattern
- The new page introduces a different style method (e.g., inline styles when the project uses
  Tailwind) without justification

Gate may WARN when:

- The page uses a slightly different component composition pattern (e.g., different card variant)
  but still inherits the shell correctly
- The page's meta description is shorter or longer than typical but still present
- The page introduces a new CSS custom property that could have reused an existing token
- Trailing-slash convention is inconsistent on the new page but matches the majority of existing
  pages

---

## Evidence Required

A request using this skill should provide:

- The layout file(s) that wrap the new page (show the shared shell is used)
- The route registration (show the route is a child of the layout)
- The navigation source (show where the new link was added)
- The new page file (show it contains only page content, no shell)
- The `<head>` output (show meta tags are present and correct)
- A visual or structural comparison with at least one existing page (show consistency)
- Build/type/lint checks passing when available

---

## Regression Test Reconciliation

When a structural change adds or modifies a page, navigation item, or route:

- Do not leave older tests expecting the previous navigation or route structure unchanged
- Update any snapshot tests that capture the nav or page shell
- If link assertions exist (e.g., "navbar contains link to /about"), ensure they still pass
  after the change
- Prefer testing navigation through the shared nav component, not through per-page nav markup

---

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
