# Plan: Add `backoffice-design` skill (backoffice UX + design-pattern intelligence)

## Goal
Add a new cross-tool skill `skills/backoffice-design/` that combines:
- **Base**: `backoffice-workflow-ux` (clike) — structural/operational UX for backoffice software.
- **Complementary**: `ui-ux-pro-max` (nextlevelbuilder) — **pattern-level** UI/UX design
  intelligence (accessibility, touch, layout, typography, color, animation, forms, navigation, charts).

Per user decision, incorporate the complementary **as curated patterns only** — do NOT port the
Python `search.py` script or the stack-specific CSV data. Keep the skill tech-agnostic: it tells the
agent *which patterns/anti-patterns to apply*, not how to run a search tool or target a specific stack.

## Source material (already fetched)
- Base SKILL.md (171 lines): Intent, Use/Do-not-use, Required UX shape, Capability page expectations,
  Large-data behavior, Configuration UX, AI assistant UX, Backend source-of-truth rule, Evidence
  required, Regression test reconciliation, Gate implications.
- Complementary SKILL.md + `references/quick-reference.md` (21.6 KB) + `references/pro-rules.md` (9.6 KB).
  Priority matrix (10 categories) and per-category Key Checks / Anti-Patterns are the core to lift.

## Deliverable files (mirror `legacy-capability-extractor` conventions)
```
skills/backoffice-design/
├── SKILL.md                 # canonical source of truth (frontmatter + body)
├── README.md                # usage + install (mirror existing skill README style)
├── evals/
│   └── evals.json           # 2–3 eval scenarios (mirror legacy skill schema)
└── references/
    ├── design-patterns.md   # curated patterns from ui-ux-pro-max (tech-agnostic)
    └── condensed.md         # fallback for tools that don't read SKILL.md
```

## SKILL.md structure
Frontmatter (match repo standard):
```yaml
---
name: backoffice-design
description: >
  Design and review enterprise backoffice / operator-console UIs: capability-page architecture,
  list/detail and task workflows, server-side filtering/pagination, role-aware navigation,
  loading/empty/error/permission states, configuration UX, and AI-assistant surfaces — augmented
  with cross-cutting UI/UX design patterns (accessibility, touch, layout, typography, color,
  animation, forms, navigation, charts). Use when building or reviewing admin consoles, operator
  dashboards, task inboxes, validation/approval/archive/export workflows, settings/config pages,
  or any internal tool with an operator workflow. Tech-agnostic: applies patterns, not frameworks.
version: "1.0"
license: MIT
metadata:
  author: personal
  type: workflow
  tags: [ui, ux, backoffice, design-system, accessibility, operator-console]
---
```
Body sections (order):
1. **Intent** — backoffice is operational software; avoid a single decorative dashboard.
2. **Use when / Do not use when** — from base.
3. **Required UX shape** — one route per capability, shared shell, list/detail, server-side
   filters/pagination, state handling, role-aware actions, destructive-action confirmation,
   audit/provenance.
4. **Capability page expectations** — example routes (`/ingest`, `/validation`, `/archive`,
   `/export`, `/qa`, `/settings`, `/extraction-profiles`); idiomatic per stack, not hardcoded.
5. **Large-data behavior** — no unbounded client loads; server-side filter/sort/paginate; reset.
6. **Configuration UX** — dedicated config page, keys vs labels, add/edit/remove, validation hints.
7. **AI assistant UX** — explain scope, no silent state mutation, citations, no-source behavior,
   guided prompts, avoid anthropomorphism.
8. **Backend source-of-truth rule** — frontend must not duplicate lifecycle/auth/eligibility rules.
9. **Cross-cutting UI/UX design patterns** (NEW, from complementary, tech-agnostic) — a priority
   table + short guidance pulling the 10 categories, but expressed as principles:
   - Accessibility (CRITICAL): contrast 4.5:1, alt text, keyboard nav, aria, keep focus rings.
   - Touch & interaction (CRITICAL): 44×44px targets, 8px+ spacing, loading feedback, no hover-only.
   - Performance: lazy-load, reserve space (CLS<0.1), avoid layout thrash.
   - Layout & responsive: mobile-first, no horizontal scroll, no fixed-px container, allow zoom.
   - Typography & color: 16px base / 1.5 line-height, semantic color tokens (no raw hex in comps),
     no gray-on-gray, no <12px body.
   - Animation: 150–300ms, conveys meaning, spatial continuity, respect reduced-motion.
   - Forms & feedback: visible labels, inline errors near field, progressive disclosure.
   - Navigation: predictable back, bottom-nav ≤5, deep links, route-scoped selectors in tests.
   - Charts & data: legends, tooltips, never color-alone to convey meaning.
   - Instruct: read `references/design-patterns.md` for the full rule list before delivering UI.
10. **Evidence required** — route/shell files, API client boundary, ≥1 list/filter/task/action flow,
    state-handling evidence, build/lint/test checks, manual smoke path.
11. **Regression test reconciliation** — brittle-selector warning from base.
12. **Gate implications** — BLOCK when: single decorative dashboard for multi-capability REQ; missing
    capability pages; missing state handling; unbounded client lists; backend-rule duplication;
    ignoring design-pattern table (accessibility/touch regressions). WARN when: advanced filter
    deferred+documented; a11y automation unavailable but semantic controls present.
13. **Cross-Tool Compatibility** — short pointer to `install.sh` / README.md (same trimmed style as
    the other skill), plus note that `references/condensed.md` is the fallback.

## references/design-patterns.md
Curated, tech-agnostic extraction of `ui-ux-pro-max` `quick-reference.md` + `pro-rules.md`:
- The 10-category priority matrix with Key Checks / Anti-Patterns (full, not just summary).
- Pro pre-delivery checklist (icon discipline, interaction feedback, light/dark contrast, safe areas,
  accessibility) — written framework-neutral (no SwiftUI/Compose specifics).
- Explicitly OMIT: stack-specific guidance (React/Next/Vue/Flutter…), the `search.py` invocation,
  and any CSV/DB lookup semantics.

## references/condensed.md
Trigger phrases + the structural backbone (sections 1–8, 10, 12) + a pointer to
`design-patterns.md`, without verbose rationale. Mirrors the other skill's condensed.md purpose.

## evals/evals.json
Mirror legacy skill schema (`skill_name`, `evals[]` with `id`, `prompt`, `expected_output`,
`files`, `expectations`). 2 scenarios:
1. "Build an operator console for document ingestion: ingest, validation, archive, export, settings."
   Expectations: multiple capability pages (not one dashboard), list/detail, server-side
   filter/pagination, loading/empty/error states, config page, AI-assistant page with no-silent-mutation.
2. "Review this admin dashboard for UX problems." Expectations: flags missing a11y (contrast/focus),
   hover-only interactions, unbounded list, no empty/error states, color-only charts.

## README.md
Mirror `legacy-capability-extractor/README.md` structure: what it does, repo layout, install
(`bash install.sh --tool ... --target ...`), supported tools table, fallback for non-SKILL.md tools
(point at `references/condensed.md`), credits noting both source skills + the tech-agnostic adaptation.

## Out of scope
- Porting `ui-ux-pro-max` `scripts/search.py` or `data/` CSVs.
- Stack-specific implementation guidance (React/Tailwind/Flutter examples) beyond idiomatic routing.
- Changes to `install.sh` (it already globs `skills/*/` — new folder is auto-discovered).

## Validation
- `python3 -c "import yaml,sys; yaml.safe_load(open('skills/backoffice-design/SKILL.md').read().split('---')[1])"`
  (frontmatter parses) — or confirm via the same check used for the other skill.
- `python3 -c "import json; json.load(open('skills/backoffice-design/evals/evals.json'))"` (valid JSON).
- Confirm `install.sh --list-tools` still works and the new skill would be picked up (no script change
  expected; verify by dry-run if supported).
- Manual: open the SKILL.md and confirm no hardcoded stack names, no script invocations, and that
  `design-patterns.md` is referenced for detailed rules.
- Commit on the existing `session/...` branch (already used for the squash), then force-push if needed
  following the same squash/commit-message discipline agreed earlier.
