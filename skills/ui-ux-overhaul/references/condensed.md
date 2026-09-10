# ui-ux-overhaul (condensed)

Condensed version of `SKILL.md` for tools that do not natively read the Agent Skills
`SKILL.md` format. Canonical source: `SKILL.md`.

## Trigger Phrases

- "UI overhaul", "UX rewrite", "rebuild the frontend", "rewrite the UI"
- "replace custom components", "Radix UI", "shadcn", "Tailwind"
- "wp-admin styling", "WordPress admin", "@wordpress/components"
- "hallmark quality", "OpenDesign", "impeccable UI"
- "the best code is the one that was not written"
- "accessibility rewrite", "remove custom CSS"

## When to use

- User wants to rewrite existing frontend with better quality
- User wants to adopt open-source component libraries
- User wants better accessibility
- User wants to remove custom implementations that should use libraries

## Do not use when

- User wants to add a feature, not rewrite
- User is satisfied with current UI
- Request is about backend, not frontend
- Request is about visual design, not code

## Core Principles

1. **Library-first.** Check catalog before writing ANY component.
2. **Headless by default.** Radix for behavior, Tailwind for styles.
3. **Delete, don't modify.** Old code is GONE, not deprecated.

## Hard Prohibitions (violations = rewrite failed)

1. Default is REWRITE. Refactor requires justification for EVERY component kept.
2. Custom component where library exists → DELETE IT.
3. Old tests for deleted components → DELETE THEM. Rewrite new ones.
4. Inline `style={{` → DELETE EVERY ONE. Use Tailwind.
5. Hardcoded colors → DELETE. Use design tokens.
6. `!important` → DELETE. Fix specificity.
7. `<div onClick>` → DELETE. Use `<button>`.
8. `<input>` without label → DELETE. Rewrite with label.
9. Component > 200 lines → SPLIT.
10. No loading/error/empty states → ADD THEM.
11. No dark mode → ADD IT.
12. CSS custom file → DELETE FILE. Use Tailwind.
13. Wireframes are MANDATORY before code.

## Seven-Stage Pipeline

```
Code Analysis → Vibe-Code Assault → UI/UX Understanding → Rewrite Decision
  → Architecture Design → Wireframe & Prototype → Component Rewrite → Verification
```

### Stage 1.5 — Vibe-Code Assault

1. **Damage Report:** Count every violation (inline styles, custom comps, missing a11y, etc.)
2. **Kill List:** Every violation → delete/replace target (with test handling)
3. **Completeness Check:** 100% of violations must be in Kill List

### Stage 5 — Wireframe (MANDATORY)

No wireframe = no code. Every screen gets: layout, components, states, interactions.

### Stage 6 — Component Rewrite

1. Check library catalog → DELETE custom + USE library
2. If no library → write from scratch with tokens
3. DELETE old tests, REWRITE new tests (behavior, not implementation)
4. Verify: < 200 lines, < 7 props, all states

## Library-First Rule

Before writing ANY component, check `references/library-catalog.md`.

| Need | Track A (Tailwind) | Track B (WordPress) |
|------|-------------------|---------------------|
| Dialog | shadcn dialog | @wordpress/components Modal |
| Select | shadcn select | @wordpress/components SelectControl |
| Tabs | shadcn tabs | @wordpress/components TabPanel |
| Tooltip | shadcn tooltip | @wordpress/components Tooltip |
| Form | react-hook-form + zod | @wordpress/components form controls |
| Table | @tanstack/react-table | WP_List_Table |
| Toast | sonner | @wordpress/components Snackbar |

## Error Handling

| Scenario | Action |
|----------|--------|
| Library not found | Check npm/GitHub, use if maintained, else write from scratch |
| No tests exist | Write behavior tests AFTER rewriting |
| Tests test implementation | DELETE old, WRITE new behavior tests |
| User resists deletion | Apply HP-1, show "Justify Keeping" checklist |
| Wireframe reveals design issue | Fix wireframe, do NOT code |
| Bundle size increases | Acceptable if a11y/quality improved, log trade-off |

## Gate (BLOCK)

- Any mandatory rewrite trigger true but refactor chosen without risk acceptance
- Old code not deleted (dual maintenance)
- New code modified from old (not written from scratch)
- ANY inline styles, hardcoded colors, or !important remain
- ANY component > 200 lines
- ANY axe-core violation
- ANY async operation without loading/error state
- Wireframe missing for any screen
- Old tests not deleted for deleted components

## Gate (WARN)

- Components 150-200 lines (at limit)
- Bundle size increased slightly
- Some tokens approximate
