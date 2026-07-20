# `_astro` Project — File-by-File Architectural Review

## Summary

The `_astro/` project is a small Astro 5 + Tailwind CSS v4 landing site that catalogs "skills" and "agents" (markdown-based tool plugins) and provides install commands for multiple AI coding tools. The codebase is clean, focused, and well-structured for its scope. Below is a file-by-file review with findings, strengths, and actionable recommendations organized by theme.

---

## 1. File-by-File Review

### 1.1 `package.json`
**Purpose:** Project manifest, scripts, dependencies.

| Aspect | Finding |
|--------|---------|
| **Good** | Minimal dependency footprint (astro, marked, yaml). Tailwind v4 via Vite plugin. `predev`/`prebuild` hooks run sync-installers automatically. `private: true` is correct. |
| **Issue** | No `engines` field to pin Node.js version. Astro 5.7 requires Node ≥18. |
| **Issue** | No lint/format scripts (`eslint`, `prettier`, `biome`). No test scripts at all. |
| **Recommendation** | Add `"engines": { "node": ">=18" }`. Add lint + format scripts. Consider adding a smoke-test script that runs `astro build` and asserts exit code 0. |

---

### 1.2 `astro.config.mjs`
**Purpose:** Astro + Tailwind Vite plugin config, site URL resolution.

| Aspect | Finding |
|--------|---------|
| **Good** | Site URL derived from env vars, not hardcoded. Clean 3-tier fallback (env → CI GitHub Pages → localhost). Tailwind integrated as Vite plugin correctly. |
| **Good** | `base: '/'` is correct for custom domain. |
| **Issue** | No `output: 'static'` explicitly set — Astro defaults to static, but being explicit is best practice for documentation. |
| **Issue** | No `trailingSlash` config. Astro defaults to `'ignore'`, which can cause double-slash or trailing-slash inconsistencies in generated URLs. |
| **Recommendation** | Add `output: 'static'` and consider `trailingSlash: 'always'` or `'never'` for consistency. |

---

### 1.3 `tsconfig.json`
**Purpose:** TypeScript configuration.

| Aspect | Finding |
|--------|---------|
| **Good** | Extends `astro/tsconfigs/strict`. Correct `include`/`exclude`. |
| **No issues.** | |

---

### 1.4 `src/styles/global.css`
**Purpose:** Global styles, Tailwind import, base theming.

| Aspect | Finding |
|--------|---------|
| **Good** | Tailwind v4 `@import "tailwindcss"` syntax is correct. `scroll-behavior: smooth`. Antialiased text. |
| **Finding** | Dark-only theme: `color-scheme: dark` + `bg-slate-950 text-slate-100`. No light mode. |
| **Assessment** | For a developer-facing landing page, dark-only is a valid and common choice (GitHub, Vercel, etc. do the same). No light/dark toggle needed unless the audience demands it. This is an **acceptable design decision**, not a deficiency. |

---

### 1.5 `src/layouts/Base.astro`
**Purpose:** HTML shell, `<head>` metadata, Navbar + slot.

| Aspect | Finding |
|--------|---------|
| **Good** | Canonical URL computed dynamically from `Astro.url.pathname + Astro.site`. OG meta tags (title, description, type, url). Responsive viewport meta. Generator meta. |
| **Good** | `description` prop with sensible default. |
| **Issue** | Missing `og:image` — social shares will show no preview image. |
| **Issue** | Missing Twitter/X card meta tags (`twitter:card`, `twitter:title`, etc.). |
| **Issue** | Missing `lang` attribute is NOT an issue — it's set to `"en"` correctly. |
| **Issue** | No structured data (JSON-LD) for SEO (Organization, WebSite). |
| **Recommendation** | Add `og:image` (could use the favicon.svg or a dedicated social image). Add Twitter card meta. Consider JSON-LD for SEO. |

---

### 1.6 `src/pages/index.astro`
**Purpose:** Homepage — Hero, skill cards, agent cards, install section, star CTA, footer.

| Aspect | Finding |
|--------|---------|
| **Good** | Clean section-based layout. Data fetched at build time via `getSkills()`/`getAgents()`. Empty-state handling for both lists. |
| **Good** | Two `InstallModal` instances (skill + agent) at page level. |
| **Issue** | No `loading="lazy"` on any images (though there are no images, so N/A). |
| **Issue** | The page does not set a `<main>` landmark with an `id` on itself — the Hero section does not have an `id="top"` or similar for the navbar "home" link. The navbar link goes to `BASE_URL` which is correct. |
| **Issue** | Install section links to installer scripts use `import.meta.env.BASE_URL` which is correct. |
| **No significant issues.** | |

---

### 1.7 `src/pages/agents/[name].astro` & `src/pages/skills/[name].astro`
**Purpose:** Detail pages for individual agents/skills.

| Aspect | Finding |
|--------|---------|
| **Good** | `getStaticPaths()` correctly generates routes from filesystem. Body content rendered via client-side markdown. |
| **Good** | Back-link to `#agents`/`#skills` anchor. Tags, author, license displayed. |
| **Issue** | These two pages are ~95% identical — massive code duplication. The header, tag display, markdown toggle, and article structure are copy-pasted. |
| **Recommendation** | **Extract a shared `DetailLayout.astro` or `ContentDetail.astro` component** that accepts props for back-href, kind, item, etc. This eliminates ~70 lines of duplication. |
| **Issue** | `data-md-source={body}` embeds the full markdown body as an HTML attribute. For large documents this bloats the HTML and can exceed attribute size limits in some parsers. |
| **Recommendation** | Consider using a `<script type="application/json">` block or `data-md-source` on a `<template>` element instead. Or render server-side and skip the client-side toggle. |

---

### 1.8 `src/components/Navbar.astro`
**Purpose:** Sticky top navigation bar.

| Aspect | Finding |
|--------|---------|
| **Good** | Sticky positioning with backdrop blur. Responsive — nav links hidden on mobile (`hidden sm:block`). BASE_URL normalization. Section-href helper for same-page vs cross-page navigation. |
| **Issue** | No mobile hamburger menu — nav links (Skills, Agents, Install) are invisible on mobile. Only the logo and Star button are visible. |
| **Issue** | No `aria-label` on the `<nav>` element (it's a `<nav>` which is good, but a label helps screen readers). |
| **Recommendation** | Add a mobile hamburger/drawer for navigation. Add `aria-label="Main navigation"` to `<nav>`. |

---

### 1.9 `src/components/Footer.astro`
**Purpose:** Site footer with copyright and links.

| Aspect | Finding |
|--------|---------|
| **Good** | Dynamic year. Clean responsive layout. GitHub + Home links. |
| **No issues.** | Minimal and correct. |

---

### 1.10 `src/components/Hero.astro`
**Purpose:** Hero section with headline, description, CTA buttons.

| Aspect | Finding |
|--------|---------|
| **Good** | Beautiful radial gradient background. Clear headline with accent color. Two CTAs (GitHub star + browse). |
| **Issue** | No heading hierarchy concern — `<h1>` on homepage is correct. |
| **No significant issues.** | |

---

### 1.11 `src/components/AgentCard.astro` & `src/components/SkillCard.astro`
**Purpose:** Card components for agent/skill listings.

| Aspect | Finding |
|--------|---------|
| **Good** | Consistent card styling. `group` hover pattern. Tags truncated to 4. Install CTA integrated. |
| **Issue** | These two components are ~95% identical — another major duplication. The only differences: `version` vs `model` badge, and the link text ("View agent" vs "View skill"). |
| **Recommendation** | **Extract a single `ContentCard.astro`** component parameterized by `kind`, or at minimum extract the common card shell into a shared fragment. |

---

### 1.12 `src/components/InstallCTA.astro`
**Purpose:** Install button that opens the install modal.

| Aspect | Finding |
|--------|---------|
| **Good** | Clean prop interface (kind, id, label, variant, full). Solid/outline variants. SVG download icon inline. |
| **Issue** | Button has no `aria-label`. The icon is decorative, so `aria-hidden="true"` on the SVG would be appropriate. |
| **Recommendation** | Add `aria-hidden="true"` to the SVG icon. |

---

### 1.13 `src/components/InstallModal.astro`
**Purpose:** Modal for building install commands with tool/scope/platform selection.

| Aspect | Finding |
|--------|---------|
| **Good** | Well-structured modal with proper `role="dialog"`, `aria-modal="true"`, `aria-label`. Close on backdrop click, close button, and Escape key. Custom checkbox/radio styling with `has-[:checked]`. Command builder with copy-to-clipboard. Fallback from Clipboard API to `execCommand`. |
| **Issue** | Body overflow lock (`document.body.style.overflow = 'hidden'`) is not restored if the page is scrolled while modal is open — minor UX issue. |
| **Issue** | No focus trap in the modal — keyboard users can tab out of the modal into the background. |
| **Recommendation** | Add a focus trap (trap Tab key within the modal when open). Restore body overflow on modal close (already done). Consider `inert` attribute on background content. |

---

### 1.14 `src/components/StarCTA.astro`
**Purpose:** GitHub star call-to-action section.

| Aspect | Finding |
|--------|---------|
| **Good** | Clean, minimal CTA. Consistent styling with rest of site. |
| **No issues.** | |

---

### 1.15 `src/lib/scan-content.ts`
**Purpose:** Build-time filesystem scanner that reads skills/agents directories and parses YAML frontmatter.

| Aspect | Finding |
|--------|---------|
| **Good** | Clean separation of concerns. `readDirSafe` handles missing dirs gracefully. `parseFrontmatter` handles missing frontmatter. `summarize` truncates descriptions. |
| **Issue** | `REPO_ROOT = join(process.cwd(), '..')` — fragile if the working directory changes. Works because Astro always runs from `_astro/`, but this is an implicit contract. |
| **Issue** | No sorting of skills/agents — order depends on filesystem readdir order (typically alphabetical but not guaranteed across OSes). |
| **Issue** | `existsSync` is called before `readFile` — minor TOCTOU race condition, but acceptable for build-time code. |
| **Recommendation** | Add explicit sorting (by name) to ensure deterministic output order. Document the `REPO_ROOT` assumption with a comment (already has one, which is good). |

---

### 1.16 `src/lib/md-toggle.ts`
**Purpose:** Client-side markdown rendering toggle (rendered vs source view).

| Aspect | Finding |
|--------|---------|
| **Good** | HTML escaping in the custom renderer prevents XSS from markdown content. `marked` configured with `async: false`. Clean toggle logic scoped to `<main>`. |
| **Issue** | `marked.parse()` is synchronous here but `marked` v15 returns `string | Promise<string>` by default. The `as string` cast works because `async: false` is set, but the TypeScript type may be `string | Promise<string>`. |
| **Recommendation** | Use `marked.parse(src, { async: false })` and handle the return type properly, or pin to a version where the sync return is guaranteed. |

---

### 1.17 `src/lib/build-install-cmd.ts`
**Purpose:** Builds install shell commands from user-selected parameters.

| Aspect | Finding |
|--------|---------|
| **Good** | Proper shell quoting (Unix single-quote escaping, Windows double-quote escaping). Clean type definitions. `publicBaseUrl()` handles SSR vs client. |
| **Issue** | `publicBaseUrl()` returns `'https://ai.wombatepiclanding.studio'` during SSR — this is a hardcoded fallback that could drift if the domain changes. The canonical URL should come from env vars. |
| **Issue** | The curl command downloads to `/tmp/` which is world-readable. On shared systems this could be a minor security concern (symlink attacks in `/tmp/`). Not critical for this use case. |
| **Recommendation** | Replace the hardcoded SSR fallback with `process.env.PUBLIC_SITE_URL || 'http://localhost:4321'` to stay consistent with `astro.config.mjs`. |

---

### 1.18 `scripts/sync-installers.mjs`
**Purpose:** Build-time script that copies installer scripts from repo root to `public/` and validates tool-list consistency.

| Aspect | Finding |
|--------|---------|
| **Good** | Clever drift detection — parses both bash installer `TOOL_PATHS` keys and TypeScript `SKILL_TOOLS`/`AGENT_TOOLS` arrays and diffs them. Fails the build on mismatch. This is an excellent pattern for keeping multiple source-of-truth files in sync. |
| **Issue** | The `tsArray` regex parser is fragile — it relies on a specific formatting of the TS arrays. If someone reformats the arrays (e.g., one-per-line), it breaks. |
| **Recommendation** | Consider parsing the TS file as AST or using a simpler regex that's more formatting-tolerant. |

---

### 1.19 `public/` (installers, favicon)
**Purpose:** Static assets served as-is.

| Aspect | Finding |
|--------|---------|
| **Good** | Installers are comprehensive, well-documented, with `-Copy` fallback for Windows symlink restrictions. Self-contained: they clone the repo if run standalone. |
| **Good** | `favicon.svg` is simple and effective. |
| **Issue** | Installers in `public/` are copies from repo root (synced by `sync-installers.mjs`). The repo-root originals are the source of truth. This is fine but could confuse contributors who edit `public/` directly. |
| **Recommendation** | Add a comment at the top of `public/install-*.sh` / `public/install-*.ps1` saying "DO NOT EDIT — synced from repo root by sync-installers.mjs". |

---

### 1.20 `.github/workflows/deploy.yml`
**Purpose:** GitHub Actions CI/CD pipeline.

| Aspect | Finding |
|--------|---------|
| **Good** | Clean two-job pipeline (build → deploy). Uses official `withastro/action@v6`. `PUBLIC_SITE_URL` from repo variables. Correct permissions (`pages: write`, `id-token: write`). |
| **Issue** | No caching of `node_modules` — the `withastro/action` may handle this internally, but explicit caching would speed up builds. |
| **Issue** | No build verification step (e.g., `astro check` for type checking). |
| **Recommendation** | Add a `check` step before build, or add it to the prebuild. Consider caching. |

---

## 2. Cross-Cutting Architectural Review

### 2.1 Theming & Design System
| Aspect | Assessment |
|--------|------------|
| **Color palette** | Consistent indigo/slate theme throughout. No rogue colors. |
| **Typography** | System font stack (Tailwind default). No custom fonts loaded. |
| **Spacing** | Consistent Tailwind spacing scale. `max-w-5xl` for content, `max-w-3xl` for detail pages. |
| **Dark mode** | Dark-only, which is a valid choice for a dev-focused site. No light/dark toggle. |
| **Rating** | **Strong.** The visual design is cohesive and consistent. |

### 2.2 i18n / Internationalization
| Aspect | Assessment |
|--------|------------|
| **Current state** | English-only. Hardcoded strings in components and templates. |
| **Assessment** | For a developer tool landing page serving a global technical audience, English-only is standard practice. i18n is **not needed** for this project scope. |
| **Rating** | **Acceptable as-is.** Would only matter if the project targets non-English developer communities. |

### 2.3 Accessibility
| Aspect | Assessment |
|--------|------------|
| **Semantic HTML** | Good — `<nav>`, `<main>`, `<header>`, `<footer>` used correctly. `<h1>`–`<h3>` hierarchy maintained. |
| **Modal** | Has `role="dialog"`, `aria-modal`, `aria-label`. Missing focus trap. |
| **Keyboard** | Modal close works via Escape. Install buttons are `<button>` elements. |
| **Contrast** | `text-slate-100` on `bg-slate-950` is excellent contrast. `text-slate-500` on `bg-slate-900` may be low contrast for some users. |
| **Missing** | No skip-to-content link. No `aria-label` on icon-only elements. Mobile nav links invisible. |
| **Rating** | **Good foundation, needs polish.** Focus trap, skip link, and contrast audit would bring it to excellent. |

### 2.4 Performance
| Aspect | Assessment |
|--------|------------|
| **SSG** | Fully static site — excellent baseline performance. |
| **Assets** | Inline SVG icons (no external requests). System fonts (no web font downloads). Tailwind purges unused CSS. |
| **Client JS** | Minimal — only `md-toggle.ts` and `InstallModal.astro` inline scripts. No framework runtime (no React/Vue). |
| **Images** | None used. No `<img>` tags, no images to optimize. |
| **Rating** | **Excellent.** This is about as lean as a web page can be. |

### 2.5 Security
| Aspect | Assessment |
|--------|------------|
| **XSS** | Markdown renderer escapes HTML. Content from filesystem (not user-uploaded). |
| **CSP** | No Content-Security-Policy header set (would need hosting config). |
| **Scripts** | `document.execCommand('copy')` fallback is deprecated but functional. No other security concerns. |
| **Installer scripts** | Proper shell quoting. `curl -fsSL` used. Git clone is `--depth 1`. |
| **Rating** | **Good.** No attack surface for this type of static site. |

### 2.6 Code Quality & Maintainability
| Aspect | Assessment |
|--------|------------|
| **TypeScript** | Strict mode enabled. Good type definitions for `ContentItem`, `Frontmatter`, `BuildOptions`. |
| **Duplication** | **Major issue.** `AgentCard`/`SkillCard` and `agents/[name]`/`skills/[name]` are near-identical. ~100+ lines of duplicated code. |
| **Naming** | Consistent. `scan-content.ts`, `build-install-cmd.ts`, `md-toggle.ts` are descriptive. |
| **Error handling** | Graceful fallbacks (missing dirs return empty arrays, missing files return empty strings). |
| **Rating** | **Good, but the duplication is the #1 improvement opportunity.** |

### 2.7 SEO
| Aspect | Assessment |
|--------|------------|
| **Meta tags** | Title, description, canonical, OG title/description/url/type — all present and dynamic. |
| **Missing** | `og:image`, Twitter card tags, JSON-LD structured data. |
| **Sitemap** | Not generated. Astro has `@astrojs/sitemap` integration available. |
| **Rating** | **Good baseline, missing og:image and sitemap.** |

---

## 3. Prioritized Recommendations

### P0 — High Impact, Should Fix

1. **Extract shared `ContentCard.astro` component** — Eliminates `AgentCard`/`SkillCard` duplication (~60 lines saved).
2. **Extract shared detail page template** — Eliminates `agents/[name]`/`skills/[name]` duplication (~70 lines saved).
3. **Add focus trap to `InstallModal`** — Accessibility requirement for `role="dialog"`.
4. **Add `og:image` meta tag** — Critical for social sharing previews.
5. **Add mobile navigation** — On small screens, users cannot navigate to Skills, Agents, or Install sections.

### P1 — Medium Impact, Should Fix

6. **Add `output: 'static'` to astro config** — Explicit > implicit for framework config.
7. **Sort skills/agents by name in `scan-content.ts`** — Deterministic build output.
8. **Add `@astrojs/sitemap` integration** — SEO best practice.
9. **Add Twitter card meta tags** — Complements existing OG tags.
10. **Replace hardcoded SSR fallback in `build-install-cmd.ts:90`** with env var — Consistency with `astro.config.mjs`.

### P2 — Low Impact, Nice to Have

11. **Add `engines` field to `package.json`** — Documents Node requirement.
12. **Add lint/format scripts** — Code quality tooling.
13. **Add skip-to-content link** — Accessibility enhancement.
14. **Add `aria-hidden="true"` to decorative SVGs** — Accessibility hygiene.
15. **Add `aria-label="Main navigation"` to `<nav>`** — Screen reader clarity.
16. **Add "DO NOT EDIT" comments to `public/install-*`** — Contributor clarity.
17. **Add JSON-LD structured data** — Rich search results.
18. **Add `trailingSlash` config** — URL consistency.
19. **Consider rendering markdown server-side** in detail pages — Eliminates client-side JS, avoids HTML attribute size issue.
20. **Add `astro check` to CI** — Type safety in deployment.

---

## 4. What This Project Does NOT Need (and Should Not Add)

- **Light/dark toggle** — Dark-only is a valid, intentional design choice for a dev-focused site.
- **i18n framework** — English-only is standard for developer tooling sites.
- **State management** — No client-side state beyond modal UI state.
- **Component framework (React/Vue)** — Astro components are the right choice here.
- **CMS or database** — Filesystem-sourced content is the right architecture for this repo-based project.

---

## 5. Overall Assessment

| Dimension | Score |
|-----------|-------|
| Architecture | 8/10 — Clean, focused, appropriate tooling choices |
| Code Quality | 7/10 — Good types and patterns, but duplication drags it down |
| Accessibility | 6/10 — Good foundation, missing focus trap and mobile nav |
| SEO | 7/10 — Good meta tags, missing image and sitemap |
| Performance | 9/10 — Near-perfect for a static site |
| Security | 8/10 — No meaningful attack surface |
| Maintainability | 7/10 — Duplication is the main concern |
| **Overall** | **7.5/10** — A solid, well-scoped project with clear improvement paths |
