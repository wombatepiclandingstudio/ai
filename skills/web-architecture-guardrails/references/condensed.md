# Web Architecture Guardrails (condensed)

This is a condensed version of `SKILL.md` for tools that do not natively read the Agent
Skills `SKILL.md` format. Point your tool's memory/instructions file (e.g. `AGENTS.md`,
`CLAUDE.md`, `GEMINI.md`, `.windsurfrules`) at this content, or paste it into the relevant
rules file. The canonical source remains `SKILL.md`.

## Trigger Phrases
- "add a page", "create a new route", "add a section", "create a new view"
- "update the navbar", "fix the navigation", "add to the menu"
- "the footer is missing", "links are broken", "this page looks different"
- "make it consistent", "fix the layout", "pages don't match"
- "restructure layouts", "refactor shared components", "review architecture"

## Core Rules

### 1. Single Shell (Layout)
Every page must inherit from ONE shared layout that owns: `<html>`, `<head>`, `<body>`, favicon,
global styles, navbar, footer, and the content insertion point (`<slot>`, `<Outlet>`, `{children}`,
`{% block %}`). Pages own ONLY their unique content and page-specific meta values.

**Forbidden:** A page file containing `<html>`, `<head>`, `<body>`, `<nav>`, or `<footer>`.

### 2. Hierarchical Routing
Routes must be children of the layout route. For file-based routing (Next.js, Astro, SvelteKit,
Nuxt), the layout file lives outside `pages/` or at the route root. For config-based routing, the
page route is nested under the layout route.

**Forbidden:** Registering a new page as a standalone top-level route outside the layout tree.

### 3. Navigation as a Single Source
Navigation links come from ONE place: a shared component, a data file, or the route config. When
adding a page, update that one source. Do NOT put navigation links inside page files.

**Forbidden:** Copying the `<nav>` into a new page. Duplicating nav links across files.

### 4. Style Hierarchy
| Level | Where | Example |
|-------|-------|---------|
| Design tokens | CSS custom properties / Tailwind config | `--color-primary` |
| Global styles | Single stylesheet in the layout | `body { ... }` |
| Layout styles | Layout component (scoped) | Navbar positioning |
| Component styles | Component files | Card, button |
| Page styles | Page file (scoped, rare) | Unique hero gradient |

**Forbidden:** Defining `body`/`html`/`:root` styles in a page file.

### 5. Meta Consistency
Layout defines the meta structure. Pages provide values via props/frontmatter/head-manager.
Every page needs: `<title>`, `<meta description>`, canonical URL, OG tags. Layout supplies
defaults if a page omits them.

### 6. Link Integrity
Internal links use relative paths or a base URL utility from site config. Maintain a consistent
trailing-slash convention (always or never). No hardcoded absolute URLs.

## Workflow: Adding a Page

### Phase 1 — Audit (before)
1. Find the layout root
2. Find the route registry
3. Find the navigation source
4. Find the style architecture
5. Find the meta pattern
6. Find the base URL pattern

### Phase 2 — Implement (the change)
7. Create ONLY page content (no shell)
8. Register as child of layout route
9. Update the shared navigation source
10. Provide meta values using the project's pattern
11. Use the project's style conventions
12. Use the project's link conventions

### Phase 3 — Verify (after)
13. Shell inheritance: navbar, footer, global styles present
14. Navigation: new page in nav, existing links work
15. Style consistency: same fonts, colors, spacing
16. Meta: title, description, canonical, OG tags present
17. Link integrity: all internal links resolve correctly
18. Responsive: reflows at mobile/tablet/desktop

## Anti-Patterns

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

## Gate (BLOCK)
- New page duplicates the shell instead of using the shared layout
- Route registered outside the layout hierarchy
- Navigation hardcoded in the page file
- Global styles redefined in the page
- Internal links use hardcoded absolute URLs
- Meta tags missing or inconsistent
- Different style method introduced without justification

Gate may WARN: slightly different component variants, meta description length variation, new CSS
custom property that could reuse existing token, minor trailing-slash inconsistency.
